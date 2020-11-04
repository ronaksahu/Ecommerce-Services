

const mailjet = require ('node-mailjet')
.connect('681bc600f5618ac5eb0d891cbef5c33d', '9bd772976d90cdcba123d37ea2e30eb5')


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


