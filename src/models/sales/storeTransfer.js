import mongoose, { Schema } from "mongoose"; 

class StoreTransferModel {
    init() {
        let StoreTransferSchema = new Schema({
            branchId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Branch'
            },
            AmountProductInStore:Number,
            transfer:[
               { 
                requestDate:Date,
                requestedNumber:Number,
                productType:String,
                approvedAmount:Number,
                totalPrice:Number,
                batches:[{
                    status:{
                        type:String,
                        default:'Pending',
                        enum:['Shipped','On Route','Delivered']
                    },  
                    shappingDate:Date,
                    expectedDeliveryDate:Date,
                    expectedDeliveryTime:Timestamp,
                    actulaDeliveryDate:Date,
                    actualDeliveryTime:Timestamp,
                    shippedQuantity:Number,
                    feedBack:String,
                    // defference
                    approverId:{ 
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'Users'
                    },
                }],
                status:{
                    type:String,
                    default:'Pending'
                },  
                schedule:{
                    type:Number,
                    enum:['400','430','460']
                }, }
            ]  ,              
        }, {timestamps: true});         
        const StoreTransfer = mongoose.model("StoreTransfers", productSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("StoreTransfers");
    }
}

export default ProductModel