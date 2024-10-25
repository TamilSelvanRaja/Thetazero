const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3001;
const moment = require('moment');
const { sendWhatsappStaus } = require('./services/whatsappservices');
const { sendEmail } = require('./services/emailservices');

app.use(cors({
  origin: ['http://creat.ink', 'http://localhost:5173', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const db = mysql.createConnection({
  host: '216.10.245.157',
  user: 'harsha',
  password: 'harsha#586',
  database: 'eventapp',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1); // Exit the process if unable to connect to the database
  } else {
    console.log('Connected to MySQL database');
  }
});

// Middleware to handle multipart/form-data (file uploads)
const upload = multer();
app.use(upload.array());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//pro

//AdminLogin
app.post('/Server/adminlogin', (req, res) => {
  const { email, password, select } = req.body;

  // Define the query and table name based on the selected option
  let checkUserQuery;
  let tableName;
  if (select === '1') {
    checkUserQuery = 'SELECT * FROM organization WHERE admin_email = ?';
    tableName = 'organization';
  } else if (select === '2') {
    checkUserQuery = `
      SELECT users.u_password, exhibitors.e_id
      FROM users
      JOIN exhibitors ON users.exhibitors_id = exhibitors.e_id
      WHERE users.u_email = ?
    `;
    tableName = 'exhibitors';
  } else {
    return res.status(400).send('Invalid selection');
  }

  db.query(checkUserQuery, [email], (checkUserErr, checkUserResults) => {
    if (checkUserErr) {
      console.log(checkUserErr);
      return res.status(500).send('Error accessing database');
    }

    if (checkUserResults.length === 0) {
      // No user found with provided email
      return res.status(401).send('Invalid email or password');
    }

    // User found, verify the password
    let storedPassword;
    if (select === '1') {
      storedPassword = checkUserResults[0].admin_password;
    } else if (select === '2') {
      storedPassword = checkUserResults[0].u_password;
    }

    if (password === storedPassword) {
      // Passwords match, send success response
      var adminId;
      if (select === '1') {
        adminId = checkUserResults[0].org_id;
      } else if (select === '2') {
        adminId = checkUserResults[0].e_id;
      }
      return res.status(200).json({ message: 'Login successful', tableName: tableName, adminId: adminId, select: select });
    } else {
      // Passwords do not match
      return res.status(401).send('Invalid email or password');
    }
  });
});


// MemberLogin
app.post('/Server/memberlogin', (req, res) => {
  const { phone } = req.body;
  console.log("Received login request with phone number:", phone); // Add this log statement

  // Check if the phone number matches a registered user
  const checkUserQuery = 'SELECT * FROM visitors WHERE v_phone = ?';

  db.query(checkUserQuery, [phone], (checkUserErr, checkUserResults) => {
    if (checkUserErr) {
      console.log(checkUserErr);
      res.status(500).send('Error');
    } else if (checkUserResults.length === 0) {
      // No user found with provided phone number
      res.status(401).send('Invalid phone number');
    } else {
      const userName = checkUserResults[0].v_name;
      const userId = checkUserResults[0].v_id; // Assuming the user ID column is named 'v_id'
      const userPhone = checkUserResults[0].v_phone;
      res.status(200).json({ message: 'Login successful', userName: userName, userId: userId, userPhone: userPhone });
    }
  });
});

// Backend endpoint to fetch exhibitors based on selected category
app.get('/Server/exhibitors', (req, res) => {
  let selectedCategories = req.query.selectedCategory;
  if (!Array.isArray(selectedCategories)) {
    selectedCategories = [selectedCategories];
  }

  // Query to fetch exhibitors based on selected category(s)
  const getExhibitorsQuery = `
    SELECT DISTINCT e.e_company
    FROM exhibitors e
    INNER JOIN category c ON e.e_category = c.id
    WHERE c.description IN (?)
  `;

  db.query(getExhibitorsQuery, [selectedCategories], (err, result) => {
    if (err) {
      console.error('Error fetching exhibitors from database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const exhibitors = result.map(row => row.e_company);
    res.status(200).json({ exhibitors: exhibitors });
  });
});

// Endpoint to fetch visitor ID based on phone number
app.get('/Server/getVisitorId', (req, res) => {
  const { phone } = req.query;

  const getVisitorIdQuery = 'SELECT v_id FROM visitors WHERE v_phone = ?';

  db.query(getVisitorIdQuery, [phone], (err, result) => {
    if (err) {
      console.error('Error fetching visitor ID:', err);
      res.status(500).send('Error');
    } else if (result.length === 0) {
      res.status(404).send('Visitor not found');
    } else {
      res.status(200).json({ vId: result[0].v_id });
    }
  });
});

app.get('/Server/exhibitorData', (req, res) => {
  const exhibitorQuery = `
    SELECT 
      exhibitors.e_id,
      exhibitors.e_company,
      category.description as e_category,
      exhibitors.stall_id,
      events.event_name as current_event,
      events.start_date as current_event_start_date,
      events.end_date as current_event_end_date,
      organization.admin_name as admin_name,
      event_status.description as current_event_status
    FROM 
      exhibitors
    JOIN 
      category ON exhibitors.e_category = category.id
    LEFT JOIN 
      events ON exhibitors.current_event = events.id
    LEFT JOIN 
      event_status ON exhibitors.status = event_status.id
    LEFT JOIN 
      organization ON events.org_id = organization.org_id
  `;

  db.query(exhibitorQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Ensure results are not empty before sending response
    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json({ exhibitorData: results });
  });
});

// MemberForm Starts
app.get('/Server/eventdates', (req, res) => {
  // Fetch start and end dates of the event from the database
  const getEventDatesQuery = 'SELECT start_date, end_date FROM events WHERE id = ?';
  const eventId = 3; // Assuming event ID is 1, modify it accordingly

  db.query(getEventDatesQuery, [eventId], (err, result) => {
    if (err) {
      console.error('Error fetching event dates from database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const startDate = new Date(result[0].start_date);
    const endDate = new Date(result[0].end_date);

    // Adjust the start date by adding one day
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);



    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]); // Convert date to string in 'YYYY-MM-DD' format
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
    }

    res.status(200).json({ dates: dates });
  });
});


// Backend endpoint to fetch categories based on selected date(s)
app.get('/Server/categories', (req, res) => {
  let selectedDates = req.query.selectedDate; // Assuming the selected dates are sent as a comma-separated string
  if (!Array.isArray(selectedDates)) {
    selectedDates = [selectedDates];
  }

  // Query to fetch categories based on selected date(s)
  const getCategoryQuery = `
    SELECT DISTINCT c.description
    FROM events e
    JOIN exhibitors ex ON e.id = ex.current_event
    JOIN category c ON ex.e_category = c.id
    WHERE (? BETWEEN e.start_date AND e.end_date)
    OR (? BETWEEN e.start_date AND e.end_date)
    OR (e.start_date <= ? AND e.end_date >= ?)
  `;

  // Construct an array to hold the promises of each database query
  const promises = selectedDates.map(date => {
    return new Promise((resolve, reject) => {
      db.query(getCategoryQuery, [date, date, date, date], (err, result) => {
        if (err) {
          reject(err);
        } else {
          const categories = result.map(row => row.description);
          resolve(categories);
        }
      });
    });
  });

  // Execute all promises concurrently
  Promise.all(promises)
    .then(categoriesArray => {
      // Flatten the array of categories and remove duplicates
      const categories = [...new Set(categoriesArray.flat())];
      res.status(200).json({ categories: categories });
    })
    .catch(error => {
      console.error('Error fetching categories from database:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});




// Backend endpoint to fetch time slots based on selected exhibitors
app.get('/Server/timeslots', (req, res) => {
  let selectedExhibitors = req.query.selectedExhibitor;
  const selectedDate = req.query.selectedDate;

  if (!Array.isArray(selectedExhibitors)) {
    selectedExhibitors = [selectedExhibitors];
  }

  // Construct the query to fetch available time slots for each exhibitor
  const getAvailableTimeSlotsQueries = selectedExhibitors.map(exhibitor => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT app_time
        FROM appointments
        JOIN exhibitors ON appointments.e_id = exhibitors.e_id
        WHERE exhibitors.e_company = ?
        AND app_date = ?
        AND app_time NOT IN (
          SELECT app_time
          FROM appointments
          WHERE app_date = ?
          AND e_id <> (SELECT e_id FROM exhibitors WHERE e_company = ?)
        )
      `;

      db.query(query, [exhibitor, selectedDate, selectedDate, exhibitor], (err, result) => {
        if (err) {
          reject(err);
        } else {
          const timeSlots = result.map(row => row.app_time);
          resolve({ exhibitor, timeSlots });
        }
      });
    });
  });

  // Execute all promises concurrently
  Promise.all(getAvailableTimeSlotsQueries)
    .then(results => {
      const exhibitorTimeSlots = {};
      results.forEach(result => {
        exhibitorTimeSlots[result.exhibitor] = result.timeSlots;
      });
      res.status(200).json({ exhibitorTimeSlots: exhibitorTimeSlots });
    })
    .catch(error => {
      console.error('Error fetching time slots:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Endpoint to store appointments
app.post('/Server/submitForm', (req, res) => {
  const { selectedDate, selectedTimeSlots, selectedExhibitor, vId, comments } = req.body;

  console.log('Selected Date:', selectedDate);
  console.log('Selected Time Slots:', selectedTimeSlots);
  console.log('Selected Exhibitor:', selectedExhibitor);
  console.log('Visitor ID:', vId);
  console.log('Comments:', comments); // Log comments

  if (!vId) {
    console.error('Visitor ID is required');
    res.status(400).json({ message: 'Visitor ID is required' });
    return;
  }

  //Fetch e_id for each selected exhibitor
  const getExhibitorIdsQuery = `
    SELECT e_company, e_id
    FROM exhibitors
    WHERE e_company IN (?)
  `;

  db.query(getExhibitorIdsQuery, [selectedExhibitor], (err, exhibitorResults) => {
    if (err) {
      console.error('Error fetching exhibitor IDs:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const exhibitorIdsMap = {};
    exhibitorResults.forEach(row => {
      exhibitorIdsMap[row.e_company] = row.e_id;
    });

    const insertAppointmentPromises = selectedExhibitor.map(exhibitor => {
      const eId = exhibitorIdsMap[exhibitor];
      const timeSlot = selectedTimeSlots[exhibitor];

      const insertAppointmentQuery = `
        INSERT INTO appointments (v_id, e_id, org_id, event_id, status, app_date, app_time, v_feedback, created_at, updated_at)
        VALUES (?, ?, 
          (SELECT org_id FROM events WHERE id = (SELECT current_event FROM exhibitors WHERE e_id = ?)),
          (SELECT current_event FROM exhibitors WHERE e_id = ?), 
          (SELECT status FROM events WHERE id = (SELECT current_event FROM exhibitors WHERE e_id = ?)), ?, ?, ?, NOW(), NOW())
      `;

      return new Promise((resolve, reject) => {
        db.query(insertAppointmentQuery, [vId, eId, eId, eId, eId, selectedDate, timeSlot, comments], (err, result) => {
          if (err) {
            console.error('Error inserting appointment:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(insertAppointmentPromises)
      .then(() => {
        res.status(200).json({ message: 'Appointments submitted successfully' });
      })
      .catch(error => {
        console.error('Error submitting appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
});


// MemberForm Starts
app.post('/Server/memberform', (req, res) => {
  const formData = req.body;

  // Update existing visitor record with form data based on phone number
  const updateQuery = `
    UPDATE visitors
    SET selectedday = ?, selectedcategory = ?, selectedexhibitor = ?, selectedtimeslot = ?, comment = ?
    WHERE v_phone = ?
  `;
  // Convert formData fields to arrays if they are not already arrays
  const selectedDay = Array.isArray(formData.selectedDay) ? formData.selectedDay.join(',') : formData.selectedDay;
  const selectedCategory = Array.isArray(formData.selectedCategory) ? formData.selectedCategory.join(',') : formData.selectedCategory;
  const selectedExhibitor = Array.isArray(formData.selectedExhibitor) ? formData.selectedExhibitor.join(',') : formData.selectedExhibitor;
  const selectedTimeSlot = Array.isArray(formData.selectedTimeSlot) ? formData.selectedTimeSlot.join(',') : formData.selectedTimeSlot;
  const comment = Array.isArray(formData.comment) ? formData.comment.join(',') : formData.comment;

  const values = [
    selectedDay,
    selectedCategory,
    selectedExhibitor,
    selectedTimeSlot,
    comment,
    req.body.phone
  ];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error updating data in database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log('Data updated in database');
    res.status(200).json({ message: 'Form data updated successfully' });
  });
});

// MemberForm Ends

app.get('/Server/calendarData', (req, res) => {
  const calendarQuery = `
  SELECT 
    visitors.v_id, 
    visitors.v_name, 
    visitors.v_email, 
    appointments.id as appointment_id, 
    appointments.app_date, 
    appointments.app_time, 
    exhibitors.e_company, 
    event_status.description
  FROM 
    visitors
  JOIN 
    appointments ON visitors.v_id = appointments.v_id
  JOIN 
    exhibitors ON appointments.e_id = exhibitors.e_id
  LEFT JOIN 
    event_status ON appointments.status = event_status.id
  ORDER BY 
    appointments.status DESC
  LIMIT 10
`;

  db.query(calendarQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Fetched results:', results); // Log results for debugging

    // Ensure results are not empty before sending response
    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json({ calendarData: results });
  });
});

// Fetch appointment status based on appointment ID
app.get('/Server/getAppointmentStatus/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;

  if (!appointmentId) {
    console.error('Appointment ID is missing in the request parameters');
    return res.status(400).json({ message: 'Appointment ID is missing in the request parameters' });
  }

  const fetchAppointmentStatusQuery = `
    SELECT status
    FROM appointments
    WHERE id = ?
  `;

  db.query(fetchAppointmentStatusQuery, [appointmentId], (err, results) => {
    if (err) {
      console.error('Error fetching appointment status:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Appointment not found for ID:', appointmentId);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const status = results[0].status;
    res.status(200).json({ status });
  });
});


app.post('/Server/approveVisitor', (req, res) => {
  const { visitorId, appointmentId, visitorEmail } = req.body;

  if (!visitorId || !appointmentId || !visitorEmail) {
    console.error('Appointment ID or Email is missing in the request body');
    return res.status(400).json({ message: 'Appointment ID or Email is missing in the request body' });
  }


  const fetchVisitorQuery = `
  SELECT v.v_name,v.v_phone, a.app_date, a.app_time, e.e_company 
  FROM visitors v
  JOIN appointments a ON v.v_id = a.v_id
  JOIN exhibitors e ON a.e_id = e.e_id
  WHERE v.v_id = ?
`;


  db.query(fetchVisitorQuery, [visitorId], (err, results) => {
    if (err) {
      console.error('Error fetching visitor details:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Visitor not found for appointment ID:', visitorId);
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const { v_name, v_phone, app_date, app_time, e_company } = results[0];

    const updateAppointmentQuery = `
      UPDATE appointments
      SET status = 2, updated_at = NOW()
      WHERE id = ?
    `;

    db.query(updateAppointmentQuery, [appointmentId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating appointment status to approved:', updateErr);
        return res.status(500).json({ message: 'Error updating appointment status to approved' });
      }
      const appdate = moment(app_date).format('DD-MM-YYYY');
      var whtsappdata = {
        "to_number": "+91" + v_phone,
        "name": v_name,
        "exphitor": e_company,
        "date": appdate,
        "time": app_time,
        "status": "Approved"
      }
      sendWhatsappStaus(whtsappdata);
      sendEmail(whtsappdata, visitorEmail);

      if (updateResult.length === 0) {
        return res.status(500).json({ message: 'Appointment approval failed' });
      }
      res.status(200).json({ message: 'Appointment approval successfully' });

    });
  });
});




// Reject Email
app.post('/Server/rejectVisitor', (req, res) => {
  const { visitorId, appointmentId, visitorEmail } = req.body;

  if (!visitorId || !appointmentId || !visitorEmail) {
    console.error('Visitor ID, Appointment ID or Email is missing in the request body');
    return res.status(400).json({ message: 'Visitor ID, Appointment ID or Email is missing in the request body' });
  }

  const fetchVisitorQuery = `
  SELECT v.v_name,v.v_phone, a.app_date, a.app_time, e.e_company 
  FROM visitors v
  JOIN appointments a ON v.v_id = a.v_id
  JOIN exhibitors e ON a.e_id = e.e_id
  WHERE v.v_id = ?
  `;

  db.query(fetchVisitorQuery, [visitorId], (err, results) => {
    if (err) {
      console.error('Error fetching visitor details:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Visitor not found for ID:', visitorId);
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const { v_name, v_phone, app_date, app_time, e_company } = results[0];

    // Update the appointment record in the database to set the rejection status
    const updateAppointmentQuery = `
      UPDATE appointments
      SET status = 4, updated_at = NOW()
      WHERE id = ?
    `;

    db.query(updateAppointmentQuery, [appointmentId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating appointment rejection status:', updateErr);
        return res.status(500).json({ message: 'Error updating appointment rejection status' });
      }

      const appdate = moment(app_date).format('DD-MM-YYYY');
      var whtsappdata = {
        "to_number": "+91" + v_phone,
        "name": v_name,
        "exphitor": e_company,
        "date": appdate,
        "time": app_time,
        "status": "Approved"
      }
      sendWhatsappStaus(whtsappdata);
      sendEmail(whtsappdata, visitorEmail);

      if (updateResult.length === 0) {
        return res.status(500).json({ message: 'Appointment rejection failed' });
      }
      res.status(200).json({ message: 'Appointment rejected successfully' });
    });
  });
});


app.post('/Server/rescheduleVisitor', (req, res) => {
  const { appointmentId, newDate, newTime, visitorEmail } = req.body;

  if (!appointmentId || !visitorEmail) {
    console.error('Appointment ID or Email is missing in the request body');
    return res.status(400).json({ message: 'Appointment ID or Email is missing in the request body' });
  }

  const fetchAppointmentQuery = `
    SELECT v.v_name,v.v_phone, a.app_date, a.app_time, e.e_company 
    FROM visitors v
    JOIN appointments a ON v.v_id = a.v_id
    JOIN exhibitors e ON a.e_id = e.e_id
    WHERE a.id = ?
  `;

  db.query(fetchAppointmentQuery, [appointmentId], (err, results) => {
    if (err) {
      console.error('Error fetching appointment details:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Appointment not found for ID:', appointmentId);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { v_name, v_phone, app_date, app_time, e_company } = results[0];


    const updateAppointmentQuery = `
      UPDATE appointments
      SET app_date = ?, app_time = ?, status = 3, updated_at = NOW()
      WHERE id = ?
    `;

    db.query(updateAppointmentQuery, [newDate, newTime, appointmentId], (err, updateResult) => {
      if (err) {
        console.error('Error updating appointment record:', err);
        return res.status(500).json({ message: 'Error updating appointment record' });
      }

      const appdate = moment(app_date).format('DD-MM-YYYY');
      var whtsappdata = {
        "to_number": "+91" + v_phone,
        "name": v_name,
        "exphitor": e_company,
        "date": appdate,
        "time": app_time,
        "status": "Re-Schedule"
      }
      sendWhatsappStaus(whtsappdata);
      sendEmail(whtsappdata, visitorEmail);

      if (updateResult.length === 0) {
        return res.status(500).json({ message: 'Appointment rescheduled failed' });
      }
      res.status(200).json({ message: 'Appointment rescheduled successfully' });

    });
  });
});


app.get('/Server/appointmentData', (req, res) => {
  const appointmentQuery = `
    SELECT 
      appointments.id as appointment_id,
      visitors.v_id, 
      visitors.v_name, 
      visitors.v_email,
      visitors.v_phone, 
      appointments.app_date, 
      appointments.app_time, 
      exhibitors.e_company, 
      event_status.description as status_description
    FROM 
      appointments
    JOIN 
      visitors ON appointments.v_id = visitors.v_id
    JOIN 
      exhibitors ON appointments.e_id = exhibitors.e_id
    JOIN 
      event_status ON appointments.status = event_status.id
  `;

  db.query(appointmentQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Ensure results are not empty before sending response
    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json({ appointmentData: results });
  });
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Server is running');
});


//end of pro

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

