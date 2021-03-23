import mongoose, { Schema } from "mongoose";

class BranchModel {
  init() {
    let BranchSchema = new Schema({
      name: String,
      country: {
        type: String,
        required: true,
        default: "Ethiopia",
      },
      region: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      specificAdress: {
        type: String,
        required: true,
      },
      managerName: String,
      managerPhoneNumber: String,
      status: {
        type: String,
        default: "Unverified",
      },
      storeCapacity: Number,
      store: [
        {
          productType: String,
          packaging: String,
          remaining: Number,
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
    const Branch = mongoose.model("Branches", BranchSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Branches");
  }
}

export default BranchModel;
