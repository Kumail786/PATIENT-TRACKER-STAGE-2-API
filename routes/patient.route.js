const router = require('express').Router();
const Joi = require('@hapi/joi')
const Doctor = require('../models/doctor.model')
const Patient = require('../models/patient.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "123456789Rawjani$$"


//=====================================Doctor Adding Patient For The Very First Time =================>//
try{
    router.post('/add',async(req,res)=>{
      let Patient = {
        name,
        disease,
        dateOfArrival,
      } = req.body
    
     const patient = new Patient({

     })
    
     await patient.save()
     console.log(patient)
    })
    }catch{
    res.status(400).send({
      message : "Internal Error"
    })
    }

    module.exports = router;