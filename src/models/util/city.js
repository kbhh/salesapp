import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class CityModel {
    init() {
        let CitySchema = new Schema({ 
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
        const City = mongoose.model("City", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("City");
    }
}

export default TransportModel 