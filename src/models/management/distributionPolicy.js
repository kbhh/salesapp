import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class distributionPolicyModel {
    init() {
        let distributionPolicySchema = new Schema({ 
           [{
                policy:{
                policyDate:Date,
                class:String,
                region:String,
                city:String,
                ConstrucationType:String,
                priorityNumber:Number,
                Amount:Number,
                maxOrderQuantity:Number,
                Duration:String,
                status:String,
                waitingDuration:Number
            }}]

        }, {timestamps: true});         
        const distributionPolicy = mongoose.model("distributionPolicy", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("distributionPolicy");
    }
}

export default TransportModel 