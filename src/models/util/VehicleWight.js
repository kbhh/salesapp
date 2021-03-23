import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class VehicleWightLogModel {
    init() {
        let VehicleWightSchema = new Schema({ 
            vehicleType:String,
            expectedWight:Number,
            minWight:Number,
            maxWight:Number,

        }, {timestamps: true});         
        const VehicleWight = mongoose.model("VehicleWight", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("VehicleWight");
    }
}

export default TransportModel 