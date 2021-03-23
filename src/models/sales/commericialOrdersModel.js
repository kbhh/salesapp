import mongoose, { Schema } from "mongoose";
import { Timestamp } from "bson";
import { number, string } from "joi";

class OrderModel {
  init() {
    let orderSchema = new Schema({
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
      },
      canceledBatchNumber: { type: Number, default: 0 },
      orders: [
        {
          status: { type: String, default: "Unverified" },
          totalUnPaidPrice: { type: Number, default: 0 },
          orderedDate: Date,
          quantity: {
            type: Number,
            default: 1,
          },
          orderedBy: {
            type: String,
          },
          orderType: {
            type: String,
            enum: ["Credit", "Cash", "Loan"],
          },
          productType: String,
          packageType: {
            type: String,
          },
          delivery: { type: String, enum: ["Yes", "No"] },
          shippingAddressId: mongoose.Schema.ObjectId,
          store: String,
          PO: String,
          approvedQuantity: Number,
          outStandingQuantity: { type: Number, default: 0 }, //Payment
          totalBatchedPrice: { type: Number, default: 0 },
          totalUnPaidProductPrice: { type: Number, default: 0 },
          totalUnPaidFreightPrice: { type: Number, default: 0 },
          totalBatchedProductPrice: { type: Number, default: 0 },
          totalBatchedFreightPrice: { type: Number, default: 0 },
          totalCancelledAmount: { type: Number, default: 0 },
          totalPaid: { type: Number, default: 0 },
          payment: {
            bankName: String,
            accountNumber: String,
            invoiceNumber: String,
            paidAmount: Number,
          },
          totalUnBatched: Number,
          comments: [
            {
              comment: String,
              commenterName: String,
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
          batches: [
            {
              status: {
                type: String,
                default: "Unverified",
                enum: [
                  "Unveriifed",
                  "Verified",
                  "Shipped",
                  "On Route",
                  "Delivered",
                ],
              },
              paymentDueDate: Date,
              unitPrice: Number,
              carriageType: String,
              batchQuantity: Number,
              totalBatchPrice: Number,
              batchPrice: Number,
              batchVAT: Number,
              batchFreightPrice: Number,
              batchFreightVAT: Number,
              arrivalShipper: {
                date: Date,
                time: String,
              },
              loadingCompeleted: {
                date: Date,
                time: String,
              },
              arrivalconsignee: {
                date: Date,
                time: String,
              },
              shippedQuantity: Number,
              feedBack: String,
              shipperfeedBack: String,
              payment: {
                bankName: String,
                accountNumber: String,
                invoiceNumber: String,
                paidAmount: Number,
              },
              diffects: {
                amount: Number,
                totalprice: Number,
                frieghtPrice: Number,
              },
              cancellationReason: String,
              cancelledBy: String, // customer or sells officers //
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
    });
    const Order = mongoose.model("Orders", orderSchema);
  }

  getModel() {
    this.init();
    return mongoose.model("Orders");
  }
}

export default OrderModel;
