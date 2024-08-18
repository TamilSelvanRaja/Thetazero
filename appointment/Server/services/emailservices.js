const nodemailer = require('nodemailer');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zeptomail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'emailapikey',
    pass: 'wSsVR60k/xH5Xa19zTarIe88nFVcVA/0QRl5jASg6iKtH6rK8cdpkE3LVwOjSaUXEzQ8RTIXpu58n0oDhzIJjN17y15WCSiF9mqRe1U4J3x17qnvhDzNV2lbkxuKL4MJxQlumGVgEM4j+g=='
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

/**
 * Whats App SMS Send Service
 * @public
 */
const sendEmail = (senddata, visitorEmail) => {
  // Send confirmation email to the visitor
  const mailOptions = {
    from: 'noreply@eventink.in',
    to: visitorEmail,
    subject: 'Water Today Pvt. Ltd.',
    html: `<!DOCTYPE html>
      <html>
      <head>
          <style>
              /* Base styling */
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .banner-image {
                  width: 100%;
                  height: auto;
                  border-radius: 8px;
              }
              h1, h2 {
                  margin: 0 0 10px 0;
                  padding: 0;
                  color: #333;
              }
              p {
                  margin: 0 0 10px 0;
                  padding: 0;
                  color: #666;
              }
              ul {
                  padding: 0;
                  margin: 0;
                  list-style: none;
                  color: #666;
              }
              li {
                  margin: 5px 0;
              }
              a {
                  color: #007bff;
                  text-decoration: none;
              }
              a:hover {
                  text-decoration: underline;
              }
              /* Responsive styles */
              @media only screen and (max-width: 600px) {
                  .email-container {
                      padding: 10px;
                  }
                  .banner-image {
                      width: 100%;
                      height: auto;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Top Banner Image -->
              <img src="https://app.eventink.in/images/banner.png" alt="Banner Image" class="banner-image">
              
              <!-- Email Content -->
              <h1>Appointment Status!</h1>
              <h2>Dear ${senddata.name},</h2>
              <p>Your appointment with ${senddata.exphitor} at Water Expo 2024 on ${senddata.date} at ${senddata.time} has been ${senddata.status}.</p>
              <br>
              <p>We are eager to see you on the auspicious day!</p>
              <p>If you want to reschedule again, <a href="http://creat.ink/MemberRescheduleLogin">Click Here</a></p>
              <br>
              <p>Best regards,</p>
              <p>Water Today Pvt. Ltd.</p>
              <br>
              <p><b>Note: This is a system generated email for information. Please do not reply to this email id.</b></p>
          </div>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (mailErr, info) => {
    if (mailErr) {
      console.error('Error sending reschedule confirmation email:', mailErr);
    } else {
      console.log('Reschedule confirmation email sent:', info.response);
    }
  });
};

module.exports = { sendEmail };

// `<p>Dear ${v_name},</p>
//               <p>We apologize for any inconvenience caused.</p> 
//               <p>Your previous appointment with ${e_company} which has been successfully rescheduled to ${newDate} at ${newTime}.</p>
//               <p>Here is the updated schedule:</p>
//               <ul>
//                   <li>Visitor Name: ${v_name}</li>
//                   <li>Visiting Day: ${newDate}</li>
//                   <li>Visiting Exhibitor: ${e_company}</li>
//                   <li>Visiting Time Slot: ${newTime}</li>
//               </ul>
