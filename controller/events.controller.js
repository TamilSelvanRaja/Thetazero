
const db = require('../config/database');

//********************************************************************\\
//************************* Events Date Function *********************\\
//********************************************************************\\
exports.eventdates = async (req, res) => {
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
};

//********************************************************************\\
//************************* Categories Function **********************\\
//********************************************************************\\
exports.categories = async (req, res) => {
    let selectedDates = req.query.selectedDate;
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
};

//********************************************************************\\
//************************* Time Slots Function **********************\\
//********************************************************************\\
exports.timeslots = async (req, res) => {
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
};

//********************************************************************\\
//************************ Submit Form Function **********************\\
//********************************************************************\\
exports.submitForm = async (req, res) => {
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
};

//********************************************************************\\
//************************ Member Form Function **********************\\
//********************************************************************\\
exports.memberform = async (req, res) => {
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
};

//********************************************************************\\
//******************* Calendar Data Fetch Function *******************\\
//********************************************************************\\
exports.calendarData = async (req, res) => {
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
};