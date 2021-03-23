import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class StatusConfigurationModel {
    init() {
        let StatusConfigurationSchema = new Schema({ 
            currentDemandStatus:{
                type:String,
                enum:['Surpress']  // 
            },
            // to check the working loaders
            LineNumber:[
                {
                    name:String,
                    status:String,
                }
            ],
            estimatedLoaderTimePerCar:Number,
        }, {timestamps: true});         
        const StatusConfiguration = mongoose.model("StatusConfiguration", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("StatusConfiguration");
    }
}

export default TransportModel 