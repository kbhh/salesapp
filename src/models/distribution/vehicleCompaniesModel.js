import mongoose, { Schema } from "mongoose";

class VehicleCompaniesModel {
  init() {
    let CompanySchema = new Schema({
      companyName: String,
      status: {
        type: String,
        default: "Unverified",
      },
      agreement: [
        {
          status: {
            type: String,
            default: "Unverified",
          },
          startDate: Date,
          endDate: Date,
          assignedCity: [
            {
              status: {
                type: String,
                default: "Unverified",
              },
              city: String,
            },
          ],
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
    const Order = mongoose.model("VehicleCompanies", CompanySchema);
  }

  getModel() {
    this.init();
    return mongoose.model("VehicleCompanies");
  }
}

export default VehicleCompaniesModel;
