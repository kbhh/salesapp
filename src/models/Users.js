import {resolve} from 'path';
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config({ path:  resolve(__dirname, '../.env')});
const jwt = require('jsonwebtoken'); 

class UserModel{
    initSchema() {
        var userSchema = new Schema({ 
            email: {
                type: String,
                unique: true,
                match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            },
            userId: String,
            phoneNumber: Number,
            username: {
                type: String,
                unique: true
            },
            password: {
                type: String
            }, 
            status:{
                type: String,
                default: "Active",
            }, 
            role:{
                type:String
            },
            profilePicture:String,
            reset_password_token: String,
            token:"",
            reset_password_expires: Date,
            // for password policy
            password_expired_date:Date
            // temp_mac:{
            //     number:String,
            //     request_date:Date,
            //     "status": {
            //         type: String,
            //         default: "Active",
            //     }, 
            // }
        }, {timestamps: true});
        const Account = mongoose.model("Users", userSchema);
    }

    getModel() {
        this.initSchema();
        return mongoose.model("Users");
    }

}

export default UserModel