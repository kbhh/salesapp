import mongoose, { Schema } from "mongoose";

class CarriageModel {
  init() {
    let CarriageSchema = new Schema({
      carriageType: String,
      status: {
        type: String,
        default: "Unverified",
      },
      carriage: [
        {
          status: {
            type: String,
            default: "Unverified",
          },
          carriageCapacity: Number,
          packageType: String,
        },
      ],
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
    mongoose.model("Carriage", CarriageSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Carriage");
  }
}

export default CarriageModel;
