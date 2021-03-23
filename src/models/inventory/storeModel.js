import mongoose, { Schema, Mongoose } from "mongoose";

class InventoryModel {
  init() {
    let inventorySchema = new Schema({
      storeName: { type: String, unique: true },
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
      status: {
        type: String,
        default: "Unverified",
        enum: ["Unverified", "Suspended", "Verified"],
      },
      store: [
        {
          productType: String,
          packageType: String,
          avaliableBalance: {
            type: Number,
            default: 0,
          },
          log: [
            {
              actor: String,
              activity: String,
              depositedAmount: Number,
              activityDate: {
                type: Date,
                default: Date.now("<YYYY-mm-dd>"),
              },
            },
          ],
        },
      ],
    });
    const Product = mongoose.model("Store", inventorySchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Store");
  }
}

export default InventoryModel;
