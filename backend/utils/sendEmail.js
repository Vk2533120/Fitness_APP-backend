const sendEmail = async (to, subject, message) => {
    // Integrate nodemailer or similar here if needed
    console.log(`Email sent to ${to}: ${subject} - ${message}`);
  };
  
  module.exports = sendEmail;
  