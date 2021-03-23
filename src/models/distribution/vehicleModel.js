import mongoose, { Schema } from "mongoose";

class VehicleModel {
  init() {
    let VehicleSchema = new Schema({
      driver: [
        {
          driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
          },
          assignedDate: Date,
          resignedDate: Date,
          status: String,
        },
      ],
      carriageTypeId: mongoose.Schema.ObjectId,
      plateNumber: String,
      sideNumber: String,
      status: {
        type: String,
        default: "Unverified",
      },
      expectedWeight: Number,
      log: [
        {
          actor: String,
          activity: String,
          activityDate: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    });
    mongoose.model("Vehicle", VehicleSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Vehicle");
  }
}

export default VehicleModel;
