import mongoose, { Schema } from "mongoose"; 

class DistributionModel {
    init() {
        let distributionSchema = new Schema({
            customerType:String,
            productType:String,
            quantity:{
                min:Number,
                max:Number
            },
            duration:{
                type:String,
                enum:['daily','weekly']
            }                      
        }, {timestamps: true});         
        const Distribution = mongoose.model("Distributions", productSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Distributions");
    }
}

export default ProductModel