const { queryservices } = require('../config/database');

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
    const result = queryservices(checkUserQuery, [email]);
    if (result.length === 0) {
        return res.status(401).send('Invalid email or password');
    }
    // User found, verify the password
    let storedPassword;
    if (select === '1') {
        storedPassword = result[0].admin_password;
    } else if (select === '2') {
        storedPassword = result[0].u_password;
    }

    if (password === storedPassword) {
        // Passwords match, send success response
        var adminId;
        if (select === '1') {
            adminId = result[0].org_id;
        } else if (select === '2') {
            adminId = result[0].e_id;
        }
        return res.status(200).json({ message: 'Login successful', tableName: tableName, adminId: adminId, select: select });
    } else {
        // Passwords do not match
        return res.status(401).send('Invalid email or password');
    }
};


//********************************************************************\\
//************************ Member Login Function *********************\\
//********************************************************************\\
exports.memberlogin = async (req, res) => {
    const { phone } = req.body;
    const checkUserQuery = 'SELECT * FROM visitors WHERE v_phone = ?';
    const result = queryservices(checkUserQuery, [phone]);
    if (result.length === 0) {
        return res.status(401).send('Invalid phone number');
    } else {
        const userName = result[0].v_name;
        const userId = result[0].v_id;
        const userPhone = result[0].v_phone;
        res.status(200).json({ message: 'Login successful', userName: userName, userId: userId, userPhone: userPhone });
    }
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
    const result = queryservices(getExhibitorsQuery, [selectedCategories]);
    if (result.length === 0) {
        return res.status(401).send('Exhibitor Not Found');
    } else {
        const exhibitors = result.map(row => row.e_company);
        return res.status(200).json({ exhibitors: exhibitors });
    }
};

//********************************************************************\\
//*********************** Get Visitors Function **********************\\
//********************************************************************\\
exports.visitors = async (req, res) => {
    const { phone } = req.query;
    const getVisitorIdQuery = 'SELECT v_id FROM visitors WHERE v_phone = ?';

    const result = queryservices(getVisitorIdQuery, [phone]);
    if (result.length === 0) {
        return res.status(401).send('Visitor not found');
    } else {
        return res.status(200).json({ vId: result[0].v_id });
    }
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

    const result = queryservices(exhibitorQuery, []);
    if (result.length === 0) {
        return res.status(404).json({ message: 'No data found' });
    } else {
        return res.status(200).json({ exhibitorData: result });
    }
};
