const formidable = require('formidable');
const User = require('../models/authModel');
const messageModel = require('../models/messageModel');
const fs = require('fs');

module.exports.getFriends = async(req, res) => {
    const myId = req.myId;
    try{
        const friendGet = await User.find({});
        const filter = friendGet.filter(d=>d.id !== myId)
        res.status(200).json({success: true, friends: filter})
    }catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server Error'
            }
        })
    }
}

module.exports.messageUploadToDB = async(req, res) =>{

    const { senderName, recieverId, message} = req.body;

    const senderId = req.myId;
    try{
        const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            recieverId: recieverId,
            message: {
                text: message,
                image: ''
            }
        })

        res.status(201).json({
            success: true,
            message: insertMessage
        })
    }catch(error){
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server Error'
            }
        })
    }
}

module.exports.messageGet = async (req, res) =>{
    const myId = req.myId;
    const fdid = req.params.id;

    try{
        let getAllMessage = await messageModel.find({})
        getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.recieverId === fdid || m.recieverId === myId && m.senderId === fdid);
        res.status(200).json({
            success: true,
            message: getAllMessage
        })
    }catch (error){
        res.status(500).json({
            error:{
                errorMessage: 'Internal Server Error'
            }
        })
    }
}

module.exports.imageMessageSend = (req, res) => {
    const senderId = req.myId;

    const form = formidable();

    form.parse(req, (err, fields, files) => {

        const {senderName, imagename, recieverId} = fields;
        const newPath = __dirname + `../../../frontend/public/image/${imagename}`
        files.image.originalFilename = imagename;
        try{
            fs.copyFile(files.image.filepath, newPath, async (err) => {
                if(err){
                    res.status(500).json({
                        error: {
                            errorMessage: 'Image Upload Fail'
                        }
                    })
                }else{
                    const insertMessage = await messageModel.create({
                        senderId: senderId,
                        senderName: senderName,
                        recieverId: recieverId,
                        message: {
                            text: '',
                            image: files.image.originalFilename
                        }
                    })
            
                    res.status(201).json({
                        success: true,
                        message: insertMessage
                    })
                }
            });
        }catch (error){
            res.status(500).json({
                error: {
                    errorMessage: 'Internal Server Error'
                }
            })
        }
    })
}