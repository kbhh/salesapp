import mongoose, { Schema } from "mongoose";  
import { date } from "joi";
import { time } from "console";

class QueueModel {
    init() {
        let QueueSchema = new Schema({ 
            batchId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Order'
            },
            shipperNumber:Number,
            shippmentDuration:{
                date:Date,
                time:time,
            },
            vehicle:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Order' 
            },
            EntranceStatus:String,
            EntranceDatetime:Date,

           
        }, {timestamps: true});         
        const Queue = mongoose.model("Queue", QueueSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Queue");
    }
}

export default TransportModel 