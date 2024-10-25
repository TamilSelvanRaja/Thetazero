
const db = require('../config/database');

// async function queryservices  (conditions, values) {
//     try {   
//         const responce = await db.query(conditions, [values]);   
//         return responce[0];     
//         }catch(err){
//             console.log("err"+err);
//             return res.status(500).json({ message: 'Internal server error' });
//         } 
// };


//********************************************************************\\
//************************* Admin Login Function *********************\\
//********************************************************************\\
exports.adminlogin = async (req, res) => {
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
};


//********************************************************************\\
//************************ Member Login Function *********************\\
//********************************************************************\\
exports.memberlogin = async (req, res) => {
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
};

//********************************************************************\\
//*********************** Get Exhibitors Function ********************\\
//********************************************************************\\
exports.exhibitors = async (req, res) => {
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
};

//********************************************************************\\
//*********************** Get Visitors Function **********************\\
//********************************************************************\\
exports.visitors = async (req, res) => {
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
};

//********************************************************************\\
//*********************** Get Exhibitor Details **********************\\
//********************************************************************\\
exports.getExhibitorsDetails = async (req, res) => {
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
};
