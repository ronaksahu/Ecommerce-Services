require('dotenv').config();

const mailjet = require ('node-mailjet')
.connect(process.env.MAILJET_FROM , process.env.MAILJET_TO)


async function sendMail(toEmail, username, otp) {
  const request = await mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "vegetablesdeveloper@gmail.com",
          "Name": "Ronak"
        },
        "To": [
          {
            "Email": toEmail,
            "Name": username
          }
        ],
        "Subject": "OTP for Email Verification",
        "TextPart": `Hello ${username}`,
        "HTMLPart": `Hello ${username}, <br>
          OTP for email Verification is ${otp}.`,
        "CustomID": ""
      }
    ]
  });


  if(request.body.Messages[0].Status === 'success' && (request.body.Messages[0].To[0].Email === toEmail)) {
    return 'OTP SENT';
  }
  return 'OTP FAILED';

  
}


module.exports = sendMail;


