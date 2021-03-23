import mongoose, { Schema } from "mongoose";

class ProductModel {
  init() {
    let productSchema = new Schema({
      productType: {
        type: String,
        unique: true,
      },
      description: String,
      productImg: String,
      status: {
        type: String,
        default: "Unverified",
        enum: ["Unverified", "Suspended", "Verified"],
      },
      price: [
        {
          store: String,
          packageType: String,
          unitPrice: Number,
          status: {
            type: String,
            default: "Unverified",
            enum: ["Unverified", "Suspended", "Verified"],
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
        },
      ],
      ExportPrice: [
        {
          country: String,
          packageType: String,
          unitprice: Number,
          status: String,
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
    const Product = mongoose.model("Products", productSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Products");
  }
}

export default ProductModel;
