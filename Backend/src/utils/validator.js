
const validator= require("validator");


const validate = async (data)=>{

   const mandatoryField = ['firstName','emailId','password'];
   const IsAllowed= mandatoryField.every((k)=>Object.keys(data).includes(k));
   
   if(!IsAllowed){
    throw new Error("Some Fields Missing");
   }

   if(!validator.isEmail(data.emailId)){

       throw new Error("Invalid Email");

   }
   




   if(!(validator.isStrongPassword(data.password)))
   {
    throw new Error("Weak Password")
   }


}


module.exports= validate;