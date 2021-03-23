import mongoose, { Schema } from "mongoose";
import { Timestamp } from "bson";

class OrderModel {
  init() {
    let orderSchema = new Schema(
      {
        cusomerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customers",
        },
        canceledOrderNumber: Number,
        totalProduct: Number, // this is for performance
        orders: [
          {
            orderLetterNumber: String, // for gov.tal projects
            orderedDate: Date,
            projectAgreement: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Agreement",
            },
            shipping: {
              country: String,
              region: String,
              city: String,
              specificAddress: String,
            },
            quantity: {
              type: Number,
              default: 1,
            },
            orderType: {
              type: String,
              enum: ["Credit", "Cash", "Loan"],
            },
            productType: String,
            packingType: {
              type: String,
            },
            delivery: {
              type: String,
            },
            schedule: {
              type: Number,
              enum: ["400", "430", "460"],
            },
            prices: [
              {
                VAT: Number,
                freightPrice: Number,
                product: Number,
              },
            ],
            store: String,
            PO: String,
            approvedQuantity: Number,
            amountOutstanding: Number, //Payment
            amountReceived: Number,
            paymentDueDate: Date, // to notifying the payment date for the customer
            paymentType: String, // cash  or check
            cashPayment: {
              bankName: String,
              accountNumber: String,
              invoiceDate: Date,
              invoiceNumber: String,
              invoiceAmount: Number,
            },
            checkPayment: {
              bankName: String,
              registrationDate: Date,
              checkNumber: String,
              Amount: Number,
            },
            reasonForCancellation: String,
            cancelRequestedBy: String, // customer or sells officers //
            approvedBy: String,
            status: [
              {
                type: String,
                settedDate: Date,
                settedBy: {
                  type: String,
                  enum: ["buyer", "seller"],
                },
              },
            ],
            batches: [
              {
                status: {
                  type: String,
                  default: "Pending",
                  enum: ["Shipped", "On Route", "Delivered"],
                },
                arrivalShipper: {
                  date: Date,
                  time: Timestamp,
                },
                loadingCompeleted: {
                  date: Date,
                  time: Timestamp,
                },
                arrivalconsignee: {
                  date: Date,
                  time: Timestamp,
                },
                shippedQuantity: Number,
                feedBack: String,
                shipperfeedBack: String,
                approverId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Users",
                },
                diffects: {
                  amount: Number,
                  totalprice: Number,
                  frieghtPrice: Number,
                },
                // for shipping
                shipping: [
                  {
                    shippingDate: Date,
                    emptyWeight: Number,
                    grossWeight: Number,
                    status: String,
                    AmountBug: Number,
                    shipperApproval: String,
                    ApproveBy: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Users",
                    },
                  },
                ],
              },
            ],
            approverId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Users",
            },
          },
        ],
      },
      { timestamps: true }
    );
    const Order = mongoose.model("Orders", orderSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Orders");
  }
}

export default OrderModel;
