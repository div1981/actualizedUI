var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'actualizedconnect@gmail.com',
    pass: 'koyxuncctjmtdyjx' //$$Clevel99'
  }
});

transporter.verify().then(console.log).catch(console.error);

var html = '<body><p>Hi, <br/><br/>Thank you for trying Actualized beta, our company&#39;s very first product. Our beta is available only to a select group of business leaders. <br/><br/>' +
                'Our simple goal at Actualized is: We want to democratize access to data and ' +
                'enable business leaders like you to know and grow your market value. <br/><br/>' +
                'With our beta launch you were able to see if: a) You are paid in line with the ' +
                'market b) Your performance matched the market c) Your pay matched your ' +
                'performance. You could also assess how attractive you are to the market. ' +
                'All of this information is not available anywhere else. <br/><br/>' +
                'This is just the beginning. At Actualized, we are fast expanding the analytics ' +
                'that we can offer you. Very soon, we will also be presenting career opportunities ' +
                'that match the unique value that you bring. <br/><br/>' +
                'Please connect with us if you liked our beta, or if you have any questions or' +
                'would just like to share your thoughts. We like to listen. <br/><br/>' +
                'Thank you and welcome to Actualized,<br/><br/>' +
                'The Actualized Team <br/>' +
                'At the intersection of Market Economics and Human Aspiration.</p></body>';
var mailOptions = {
  from: 'Contact@actualized.io',
  to: 'divak.n@gmail.com',
  subject: 'Welcome to actualized.io',
  html : html
  
};



const sendEmail = (email) => {
    mailOptions.to = email;
    console.log("option = " , mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {
    sendEmail
}