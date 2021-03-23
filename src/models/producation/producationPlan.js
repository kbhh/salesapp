import mongoose, { Schema } from "mongoose"; 

class PlanModel {
    init() {
        let planSchema = new Schema({
            planType:{
                type:String,
                enum:['daily','monthly','yearly']
            },
            productType:String,
            plannedAmount:Number,
            ActualAmount:Number,
            status:{
                type:String,
                default:'Pending'
            }
            // planDuration:{
            //     start:{
            //         type:Date
            //     },
            //     end:{
            //         type:Date
            //     }
            // }                      
        }, {timestamps: true});         
        const Plan = mongoose.model("Plans", productSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Plans");
    }
}

export default ProductModel