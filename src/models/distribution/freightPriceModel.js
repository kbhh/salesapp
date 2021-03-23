import mongoose, { Mongoose, Schema } from "mongoose";

class FreightPriceModel {
  init() {
    let FreightPriceSchema = new Schema({
      store: String,
      status: {
        type: String,
        default: "Verified",
      },
      freight: [
        {
          city: { type: String },
          status: {
            type: String,
            default: "Unverified",
          },
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
          price: [
            {
              carriageId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carriage",
              },
              // packageType: String,
              // carriageType: String,
              // carriageCapacity: Number, //If a vehicle has "Togotach" then each will be considered seprately
              price: Number,
              status: {
                type: String,
                default: "Unverified",
              },
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
    const Order = mongoose.model("FreightPrice", FreightPriceSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("FreightPrice");
  }
}

export default FreightPriceModel;
