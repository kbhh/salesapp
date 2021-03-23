import mongoose, { Schema } from "mongoose"; 

class PlanModel {
    init() {
        let BugSchema = new Schema({
            planType:{
                type:String,
                enum:['daily','monthly','yearly']
            },
            plannedAmount:Number,
            ActualAmount:Number,                 
        }, {timestamps: true});         
        const Bug = mongoose.model("Bugs", productSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Bugs");
    }
}

export default ProductModel