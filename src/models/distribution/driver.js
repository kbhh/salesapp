import mongoose, { Schema } from "mongoose";
import { date } from "joi";

class DriverModel {
  init() {
    let DriverSchema = new Schema(
      {
        fullname: String,
        phoneNumber: String,
        licenseNumber: String,
        status: {
          type: String,
          default: "Pending",
        },
        startedDate: Date,
        company: [
          {
            companyId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Customer",
            },
            startdate: Date,
            enddate: Date,
          },
        ],
      },
      { timestamps: true }
    );
    const Driver = mongoose.model("Driver", DriverSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Driver");
  }
}

export default TransportModel;
