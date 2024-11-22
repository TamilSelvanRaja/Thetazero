const axios = require('axios');

/**
 * Whats App SMS Send Service
 * @public
 */
const sendWhatsappStaus = (senddata) => {
        const options = {
          method: 'POST',
          url: 'https://public.doubletick.io/whatsapp/message/template',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'key_WKTzed4Hjj'
          },
          data: {
            messages: [
              {
                content: {
                  language: 'en',
                  templateData: {body: {placeholders: [
                        senddata.name,
                        senddata.exphitor,
                        senddata.date,
                        senddata.time,
                        senddata.status,
                        
                ]},
                buttons: [
                  {type: 'URL', parameter: 'http://creat.ink/MemberRescheduleLogin'},
                ]
              },
                  templateName: 'water_today_appointment_status'
                },
                from: '+919629016337',
                to: senddata.to_number
              }
            ]
          }
        };
        
        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.error(error);
          });
          
};



module.exports = { sendWhatsappStaus };