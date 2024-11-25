import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '.././models/doctor.model.js'
import jwt from "jsonwebtoken"

const addDoctor = async(req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;
        const imageFile= req.file;

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a Valid Email"})
        }

        if(password.length <8){
            return res.json({success:false,message:"Enter a Strong Password"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //upload img to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({
            success:true,
            message:"Doctor Added Successfully",
        })

    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Something Went Wrong"
        })
        
    }
}

const loginAdmin = async(req,res)=>{
    try {

        const{email,password}=req.body;

        if(email === process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
    
        } else{
            res.json({success:false,message:"Invalid Email or Password"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Something Went Wrong"
        })
        
    }
}

const allDoctors =async(req,res)=>{
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({
            success:true,
            doctors
        })


    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Something Went Wrong"
        })
    }
}



export {addDoctor,loginAdmin,allDoctors}