

const mongoose = require('mongoose');
const mailsender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');

const otpSchema = new mongoose.Schema({
  
 email:{
    type:String,
    required:true
 },
 otp:{
    type:String,
    required:true
 },

 createdAt:{ 
    type:Date,
    default:Date.now(),
    expires: 5*60
 }
      
})


// sending otp to email 

async function sendVerificationcode(email  , otp) {
      try {

        let response = await mailsender(email ,
       `   Thank you for registering with StudyNotion. To complete your registration, please use the following OTP (One-Time Password) to verify your account:  
          ${otp}
       ` ,
         otp);
        console.log("MAIL RESPONSE:  ",response);
        
        
      } catch (error) {
          console.log("error while sending mail " , error.message )   ;
          throw error; 
          
      }
}


otpSchema.pre("save" , async function(next){
        await sendVerificationcode(this.email,this.otp);
        next()
})

  module.exports  = mongoose.model("OTP" , otpSchema);