import mongoose, { Schema } from "mongoose";  
import { date } from "joi";

class GateKeeperLogModel {
    init() {
        let GateKeeperLogSchema = new Schema({ 
            vehicleId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Order'
            },
            plateNumber:String,
            EntranceDate:String,
            EntranceReason:String

        }, {timestamps: true});         
        const GateKeeperLog = mongoose.model("GateKeeperLog", DriverSchema);
    }

    getModel() {
        this.init();
        return mongoose.model("GateKeeperLog");
    }
}

export default TransportModel 