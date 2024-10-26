const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = require('../config/variables');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

/**
 * Email Service
 * @public
 */
const sendEmail = (senddata, visitorEmail) => {
  const mailOptions = {
    from: EMAIL_FROM,
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