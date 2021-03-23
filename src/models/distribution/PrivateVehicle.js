import mongoose, { Schema } from "mongoose";  

class PrivateVehicleModel {
    init() {
        let PrivateVehicleSchema = new Schema({ 
                plateNumber:String,
                sideNumber:String,
                driver:[{
                        driverName:String,
                        licenseNumber:String
                    }],
                    status:String ,
                    vehicleType:String,
                    expectedWight:Number,
                    minWight:Number,
                    maxWight:Number,
                    registeredBy:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'User'
                    }
                    
        }, {timestamps: true});         
        const Order = mongoose.model("PrivateVehicle", PrivateVehicleSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("PrivateVehicle");
    }
}

export default TransportModel 