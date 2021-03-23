import mongoose, { Schema } from "mongoose";  

class agreementModel {
    init() {
        let agreementSchema = new Schema({ 
            cusomerId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Customers'
            },          
            projects:[{
            status:{
                type:String,
                default:'Pending'
            },                 
            agreementDate:Date,
            agreementNumber:String,
            projectName:String,        
            approverId:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users'
            } ,
            paymentTerms:{
                type:String,
                enum:['Net 30','Net 60','Net 75']
            },
            startDate:Date,
            endDate:Date,
            bank:{
                type:String,
                enum:['Commericial','Birhane']
            },
            collatral:
            {
                type:String,
                enum:['Letter','Agreement','Unconditional Bank Gurantee']
            }
        }]
        }, {timestamps: true});         
        const agreement = mongoose.model("Agreement", agreementSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("Agreement");
    }
}

export default agreementModel 