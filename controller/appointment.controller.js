const db = require('../config/database');

//********************************************************************\\
//*********************** Get Appointment Function *******************\\
//********************************************************************\\
exports.getAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    if (!appointmentId) {
        console.error('Appointment ID is missing in the request parameters');
        return res.status(400).json({ message: 'Appointment ID is missing in the request parameters' });
    }
    const fetchAppointmentStatusQuery = `SELECT status FROM appointments WHERE id = ?`;
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
};

//********************************************************************\\
//****************  Appointment Approve Visitor Function *************\\
//********************************************************************\\
exports.approveVisitor = async (req, res) => {
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
};

//********************************************************************\\
//*****************  Appointment Reject Visitor Function *************\\
//********************************************************************\\
exports.rejectVisitor = async (req, res) => {
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
};

//********************************************************************\\
//***************  Appointment Reschedule Visitor Function ***********\\
//********************************************************************\\
exports.rescheduleVisitor = async (req, res) => {
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
}

//********************************************************************\\
//*********************  Appointment Data Function *******************\\
//********************************************************************\\
exports.appointmentData = async (req, res) => {
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
}