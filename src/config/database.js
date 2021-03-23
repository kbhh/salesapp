import {resolve} from 'path';
import dotenv from "dotenv";
dotenv.config({ path:  resolve(__dirname, '../.env')});

import mongoose from 'mongoose'

class Connection {
    async connect() { 
        const DB_NAME = process.env.DB_NAME
        const DB_URL = process.env.DB_URL || `mongodb://localhost:27017/${DB_NAME}`
 
        const options = {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        try {
          let con = await mongoose.connect(DB_URL , options) 
          return con
        } catch(err) {
          return err 
        }
    }

    async disconnect() {
        try {

            mongoose.connection.close()
            return true
        } catch (err) {
            return err
        }
    }
}

export default Connection