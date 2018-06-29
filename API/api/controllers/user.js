const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const User = require('../models/user');

exports.Signup =(req, res, next)=>{
    User.find({email : req.body.email})
       .exec()
       .then(user => {
           if (user.length >= 1){
               return res.status(409).json({
                   message: 'Mail Exist'
               });
           }else{
            //    convert password to hash value
               bcrypt.hash(req.body.password, 10, (err, hash) => {
                   if (err) {
                       return res.status(500).json({
                           error: err
                       });
                   }else{
                       const user= new User({
                           _id: new mongoose.Types.ObjectId(),
                           name: req.body.name,
                           email: req.body.email,
                           password: hash
                       });
                       user
                           .save()
                           .then(result => {
                               console.log(result);
                               res.status(201).json({
                                   message: 'User Created'
                               });
                           })
                           .catch(err => {
                               console.log(err);
                               res.status(500).json({
                                   message: err
                               });
                           });
                   }
               })
           }
       })        
}

exports.login = (req, res, next) =>{
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length<1){
                return res.status(401).json({
                    message: 'Email not found'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Worng Password'
                    });
                }
                if(result){
                    const token =jwt.sign(
                    {
                        email:user[0].email,
                        userID: user[0]._id
                    },
                    "secret", 
                    {
                        expiresIn: "1h"
                    }
                );
                    return res.status(200).json({
                        message: 'Login Successfull',
                        token: token,
                        userID: user[0]._id,
                        email: user[0].email,
                        name: user[0].name
                    });
                }
                return res.status(401).json({
                    message: 'Wrong Password'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.deleteuser=(req, res, next) => {
    User.remove({ _id: req.params.userID})
        .exec()
        .then(result =>{
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

exports.users_get_all =  (req, res, next) =>{
    User.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error:err
            });
        });
}

exports.search_users =(req, res, next)=>{
    const x= req.params.pro;
    Project.find().or([{memberID:{ "$regex": x, "$options": "i" }}])
        .exec()
        .then(docs => {
            if(docs.length >=0){
                res.status(200).json(docs);
            }
            else{
                res.status(404).json({
                    message: "No Users Found"
                });
            }
           
        })
        .catch(err => {
            
            res.status(500).json({
                error: err
            });
        });
};

exports.authenticate =(req, res, next) => {
    try {
        const token = req.body.token.split(" ")[1];
        console.log(token);
        const decoded =jwt.verify(token, "secret");
        req.uderData = decoded;

        return res.status(200).json({
            message: 'Authentication success'
        });

    } catch (error) {
        return res.status(401).json({
            message: 'Authentication Failed'+error
        });
    }   
};