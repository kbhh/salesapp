import mongoose, { Schema } from "mongoose";  

class NonCommercialOrderModel {
    init() {
        let orderSchema = new Schema({ 
            class:String, // donation,internal use
            priorityNumber:String,
            organizationName:String,   
            
            Address:{
                Country:String,
                region:String,
                city:String,
                specificAddress:String,
                contactPerson:{
                    Name:String,
                    phoneNumber:String
                }
            },
           
            orders:[{
                applicationLetterNumber:String,
                requestedDate:String,
                reason:String,
                GMApproval:{
                    name:String,
                    status:String,
                    description:String
                },
                HRDApproval:{
                    name:String,
                    status:String,
                    description:String
                },
                FinanceApproval:{
                    name:String,
                    status:String,
                    description:String
                },
                MarketingApproval:{
                    name:String,
                    status:String,
                    description:String
                },
            orderedDate:Date,
            quantity: {
                type: Number,
                default: 1
            },
            productType:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Products'
            },
            packing: 
            {
                type:String,
                enum:['Small Bag','Bulk','Jumbo']
            }, 
            delivery:{
                type:String,
                enum:['EX-Factory','Delivery','AA Store']
            },
            schedule:{
                type:Number,
                enum:['400','430','460']
            },
            branch:String,
            approvedQuantity:Number,
            amountOutstanding:Number,//Payment
            amountReceived:Number,
            totlaPrice:Number,
            status:[{
                type:String,
                settedDate:Date,
                settedBy:{
                    type:String,
                    enum:['buyer','seller']
                }
            }], 
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
            approverId:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users'
            }  }]
        }, {timestamps: true});         
        const Order = mongoose.model("Orders", orderSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Orders");
    }
}

export default OrderModel 