import mongoose, { Schema } from "mongoose";  
import { time } from "console";
import { Timestamp } from "bson";

class DeliveryModel {
    init() {
        let TransportSchema = new Schema({ 
            driverId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'driver'
            },
            TotalNumberofPanality:Number,
            diffects:[{
                QueueId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Queue'
                },
                FeeAmount:Number,
            }]

        }, {timestamps: true});         
        const Order = mongoose.model("Transport", TransportSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Transport");
    }
}

export default DeliveryModel 