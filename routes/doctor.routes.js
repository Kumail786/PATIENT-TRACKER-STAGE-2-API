const router = require('express').Router();
const Joi = require('@hapi/joi')
const Doctor = require('../models/doctor.model')
const Patient = require('../models/patient.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "123456789Rawjani$$"


//========================================================Doctor SignedUp==========================================//


const happyJoiSignupSchema = Joi.object({
    name: Joi.string().required(),
    email : Joi.string().required(),
    password : Joi.string().required(),

})
  
  router.post('/signup',async (req,res)=>{
    let{
      name,
      email,
      password,
    } = req.body
    if(!email){
      return res.status(400).send({
        message : "Please Fill Email"
      })
    }
    if(!name){
      return res.status(400).send({
        message : "Must Fill Username"
      })
    }
    if(!password){
      return res.status(400).send({
        message : "Password is requried"
      })
    }
    email = email.toLowerCase();
    email = email.trim();
  
    const emailformatting = email.split("@");
    if (emailformatting.length < 2) {
      return res.status(400).send({
        success: false,
        message: "Format of Email is Wrong"
      });
    }
  
    try{
     const doctorexist = await Doctor.findOne({email})
  
  if(doctorexist){
    return res.status(400).send({
  message : "Doctor Already Exist"
    })
  }
  name = name.trim()
  
  
  const { error } = happyJoiSignupSchema.validate({
    name,
    email,
    password,
  });
  if(error){
    res.send({
      message : error.details[0].message
    })
  }
  
 
  const doctor = await new Doctor({
   name,
   email,
    password,
   
  });
  console.log(doctor)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  doctor.password = hash;
  console.log(doctor)
   await doctor.save();

   const payload = {
    doctor: {
      email,
      _id: doctor._id
    }
  };
  const token = await jwt.sign(payload, JWT_SECRET, {
    expiresIn: "365d"
  });
console.log(token)
  return res.status(200).send({
    message : "Doctor Added",
    doctor,
    token
  })
  
    }
    catch{
  res.send({
   message : "Internal Error"
  })
    }
  }
  )


  //============================================Doctor SignIn=====================================================//


  const happyJoiloginSchema = Joi.object({
  
    email : Joi.string().required(),
    password : Joi.string().required(),
  })
  
  router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please enter the email address"
      });
    }
    email = email.toLowerCase();
  
    const { error } = happyJoiloginSchema.validate({
      password,
      email
    });
    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message
      });
    }
  
    try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.send({
          success: false,
          message: "login failed check your email"
        });
      }
  
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
        return res.status(400).send({
          success: false,
          message: "Invalid Password"
        });
      }
  
      const payload = {
        doctor: {
          email: doctor.email,
          _id: doctor._id
        }
      };
  
      const token = jwt.sign(payload, JWT_SECRET);
  
      return res.send({
        success: true,
        message: "Doctor logged-in successfully",
        doctor,
        token
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "Internal server error"
      });
    }
  });



  //==================================Doctor Getting List of All Patients off himself =====================>//
router.get('/patients',(req,res)=>{
  Patient.find().then(patients=>{
    res.send({
      patients
    })
  }).catch(error=>{
res.status(400).send({
  error
})
  })
})

//====================Doctor getting History of Specific Patient of him=========================>//

router.get('/patients/:id',(req,res)=>{
  Patient.findById(req.params.id).then(patient=>{
    res.send({
      patient,
      
    })
  }).catch(error=>{
    res.status(400).send({
      error
    })
  })
})

//=====================Doctor Adding New Record of Specific Patient==============================>//

router.post('/patients/adddata/:id',(req,res)=>{
  Patient.findByIdAndUpdate(req.params.id).then(patient=>{
    const oldrecords = patient.history
    const newrecord = req.body
    oldrecords.push(newrecord)

    patient.history = oldrecords
    patient.save()
    res.send({
      history : patient.history,
      message : "Record Added"
    })
  }).catch(error=>{
    res.status(400).send({
      error
    })
  })
})

//======================Doctor Getting History of Specific Patient ===============================>/

router.get('/patients/history/:id',(req,res)=>{
  Patient.findById(req.params.id).then(patient=>{
    res.send({
     history : patient.history
    })
  }).catch(error=>{
    res.status(400).send({
      error
    })
  })
})

  
  module.exports = router;