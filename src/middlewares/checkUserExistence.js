// import User from "../models/Users";
import mongoose from 'mongoose';

const Account = new mongoose.model('Users');

export default async (req, res, next) => {
    let accountExists = await Account.findOne({username: req.body.username}); 
    if(!accountExists)
    { 
      next();
    }
    else{
      return res.send({
        err: true, 
        statusCode: 401,
        message:'Account already exists' 
      });
    }
}