const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.userRegister = (req, res) => {

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        const {userName, email, password, confirmPassword} = fields;
        const {image} = files;
        const error = [];

        if(!userName){
            error.push('Please Provide Your username');
        }
        if(!email){
            error.push('Please Provide Your Email');
        }
        if(email && !validator.isEmail(email)){
            error.push('Please Provide Your valid Email');
        }
        if(!password){
            error.push('Please Provide Your password');
        }
        if(!confirmPassword){
            error.push('Please Provide Your conform password');
        }
        if(password && confirmPassword && password !== confirmPassword){
            error.push('Your Password Not match');
        }
        if(password && password.length < 6){
            error.push('password must be 6 caracters');
        }
        if(Object.keys(files).length === 0){
            error.push('Please provide user image');
        }
        if(error.length > 0){
            res.status(400).json({
                error:{
                    errorMessage: error
                }
            })
        }else{
            const getImageName = files.image.originalFilename;
            const randNumber = Math.floor(Math.random() * 9999);
            const newImageName = randNumber + getImageName;
            files.image.originalFilename = newImageName;

            const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`;

            try{
                const checkUser = await registerModel.findOne({
                    email: email
                });
                if(checkUser){
                    res.status(404).json({
                        error:{
                            errorMessage: ['Email Already exist']
                        }
                    })
                }else{
                    fs.copyFile(files.image.filepath, newPath, async(error) =>{
                        if(!error){
                            const userCreate = await registerModel.create({
                                userName,
                                email, 
                                password: await bcrypt.hash(password, 10),
                                image: files.image.originalFilename 
                            })

                            const token = jwt.sign({
                                id: userCreate._id,
                                email: userCreate.email, 
                                userName: userCreate.userName,
                                image: userCreate.image,
                                registerTime: userCreate.createdAt
                            }, process.env.SECRET, {
                                expiresIn: process.env.TOKEN_EXP
                            });

                            const option = {expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}
                            res.status(201).cookie('authToken', token, option).json({
                                successMessage: 'Your Registration Successful', token
                            })
                        }else{
                            res.status(500).json({
                                error: {
                                    errorMessage: ['Internal Server Error']
                                }
                            })
                        }
                    });
                }
            }catch(error){
                res.status(500).json({
                    error: {
                        errorMessage: ['Internal Server Error']
                    }
                })
            }
        }
        
    }) // end formidable

}

module.exports.userLogin = async (req, res) => {
    const error = [];
    const {email, password} = req.body;
    if(!email){
        error.push('Please Provide Your Email');
    }
    if(!password){
        error.push('Please Provide Your Password');
    }
    if(email && !validator.isEmail(email)){
        error.push('Please Provide Your valid email');
    }
    if(error.length > 0){
        res.status(400).json({
            error: {
                errorMessage: error
            }
        })
    }else{
        try{
            const checkUser = await registerModel.findOne({
                email: email
            }).select('+password');

            if(checkUser){
                const matchPassword = await bcrypt.compare(password, checkUser.password);
                if(matchPassword){
                    const token = jwt.sign({
                        id: checkUser._id,
                        email: checkUser.email, 
                        userName: checkUser.userName,
                        image: checkUser.image,
                        registerTime: checkUser.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    });
                    const option = {expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}
                    res.status(201).cookie('authToken', token, option).json({
                        successMessage: 'Your Login Successful', token
                    });


                }else{
                    res.status(400).json({
                        error: {
                            errorMessage: ['Your password Not valid']
                        }
                    })
                }
            }else{
                res.status(400).json({
                    error: {
                        errorMessage: ['Your Email Not Found']
                    }
                })
            }
        }catch{
            res.status(404).json({
                error: {
                    errorMessage: ['Internal Server Error']
                }
            })
        }
    }
}