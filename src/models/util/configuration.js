import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class ConfigurationModel {
    init() {
        let ConfigurationSchema = new Schema({ 
            Name:String,
            Type:String, // small , large
          
            pricing:[{
                 branch:{
                     Mantruck:{
                         cost:Number,
                         status:String
                     },
                     OtherCost:{
                        cost:Number,
                        status:String
                    },
                },
            }
            ]

        }, {timestamps: true});         
        const Configuration = mongoose.model("Configuration", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Configuration");
    }
}

export default TransportModel 