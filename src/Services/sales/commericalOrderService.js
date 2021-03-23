import { isValidObjectId } from "mongoose";
import CrudService from "../../lib/crud";
class FreightPriceService extends CrudService {
  constructor(model) {
    super(model);
  }
  async addOrder(req) {
    try {
      let record;
      req.body.totalUnBatched = req.body.quantity;
      req.body.orderedBy = req.role;
      req.body.orderedDate = new Date();
      req.body.orders = {
        log: req.log,
      };
      if (req.role == "Customer") {
        record = await this.addByPush(
          { customerId: req.id },
          {
            orders: req.body,
          }
        );
      } else {
        record = await this.addByPush(
          { customerId: req.body.customerId },
          {
            orders: req.body,
          }
        );
      }
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async modifyOrder(req) {
    try {
      let id = req.params.id;
      let customerId;
      if (req.role == "Customer") {
        customerId = req.id;
      } else {
        customerId = req.body.customerId;
      }
      let orderExist = await this.getByField(
        { customerId: customerId, orders: { $elemMatch: { _id: id } } },
        {
          "orders.$": 1,
        }
      );
      if (!orderExist.error) {
        if (
          orderExist.record[0].orders[0].status == "Unverified" ||
          orderExist.record[0].orders[0].status == "Rejected"
        ) {
          let record = await this.updateBySet(
            { "orders._id": id },
            {
              "orders.$.status": "Unverified",
              "orders.$.store": req.body.store,
              "orders.$.totalUnBatched": req.body.quantity,
              "orders.$.quantity": req.body.quantity,
              "orders.$.orderType": req.body.orderType,
              "orders.$.productType": req.body.productType,
              "orders.$.packageType": req.body.packageType,
              "orders.$.delivery": req.body.delivery,
              "orders.$.shippingAddressId": req.body.shippingAddressId,
            }
          );
          await this.addByPush(
            { "orders._id": id },
            {
              "orders.$.log": {
                actor: req.log.actor,
                activity: req.log.activity,
                id: req.log.id,
              },
            }
          );
          return record;
        } else {
          return {
            error: true,
            message: "You can only modfiy Unverified or Rejected Order",
            statusCode: 200,
            record: null,
          };
        }
      } else {
        return {
          error: true,
          message: "Please select the record to edit ",
          statusCode: 200,
          record: null,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async verifyOrder(req) {
    try {
      let record;
      let orderId = req.params.id;
      let status = req.body.status;
      let orderExist = await this.getByField(
        {
          "orders._id": orderId,
        },
        { "orders.$": 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct order to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        if (status == "Batching") {
          if (orderExist.record[0].orders[0].status == "Waiting") {
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.status": status,
              }
            );
          } else {
            return {
              error: true,
              message:
                " You need to limit the approved quantity first before batching",
              statusCode: 200,
              record: null,
            };
          }
        } else if (status == "Waiting") {
          if (
            req.body.approvedQuantity <= orderExist.record[0].orders[0].quantity
          ) {
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.status": status,
                "orders.$.approvedQuantity": req.body.approvedQuantity,
                "orders.$.totalUnBatched": req.body.approvedQuantity,
              }
            );
          } else {
            return {
              error: true,
              message: " You can't verify more than the customer requested",
              statusCode: 200,
              record: null,
            };
          }
        } else {
          record = await this.updateBySet(
            {
              "orders._id": orderId,
            },
            {
              "orders.$.status": status,
            }
          );
          await this.addByPush(
            { "orders._id": orderId },
            {
              "orders.$.log": {
                actor: req.log.actor,
                activity: req.log.activity,
                id: req.log.id,
              },
            }
          );
          if (req.body.comment) {
            await this.addByPush(
              { "orders._id": orderId },
              {
                "orders.$.comments": {
                  comment: req.body.comment,
                  commenterName: req.log.actor,
                },
              }
            );
          }
        }
        return record;
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async getOrder(req) {
    try {
      let orderId = req.params.id;
      let orderExist = await this.getByField(
        {
          orders: { $elemMatch: { _id: orderId } },
        },
        { "orders.$": 1, customerId: 1 }
      );
      return orderExist;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async getOrdersByStatus(req) {
    try {
      let status = req.query.status;
      let orderExist = await this.getByAgregate([
        { $unwind: "$orders" },
        { $project: { "orders.log": 0 } },
        {
          $match: { "orders.status": status },
        },
      ]);
      return orderExist;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async addBatch(req) {
    try {
      let status;
      let orderId = req.params.id;
      let totalUnBatched = req.body.totalUnBatched;
      let batchQuantity = req.body.batchQuantity;
      let batchDifference = totalUnBatched - batchQuantity;
      if (batchDifference >= 0) {
        req.body.totalUnBatched = batchDifference;
        let record = await this.addByPush(
          { "orders._id": orderId },
          {
            "orders.$.batches": req.body,
          }
        );
        await this.updateBySet(
          { "orders._id": orderId },
          {
            "orders.$.totalUnBatched": req.body.totalUnBatched,
          }
        );
        await this.addByPush(
          { "orders._id": orderId },
          {
            "orders.$.log": req.log,
          }
        );
        if (batchDifference == 0) {
          status = "Batched";
        } else {
          status = "Partial Batching";
        }
        await this.updateBySet(
          {
            "orders._id": orderId,
          },
          {
            "orders.$.status": status,
          }
        );
        return record;
      } else {
        return {
          error: true,
          message:
            " You can't batch " +
            batchQuantity +
            " as you have " +
            totalUnBatched +
            " unbatched ",
          statusCode: 400,
          record: null,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async verifyBatch(req) {
    try {
      let record;
      let orderId = req.params.id;
      let batchId = req.body.batchId;
      let status = req.body.status;
      let orderExist = await this.getByField(
        {
          orders: {
            $elemMatch: {
              _id: orderId,
              batches: { $elemMatch: { _id: batchId } },
            },
          },
        },
        { "orders.$": 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct batch to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        let tempData = orderExist.record[0].orders[0].batches.id(batchId);
        let orderData = orderExist.record[0].orders[0];
        if (status == "Verified" && tempData.status !== "Verified") {
          req.body.totalBatchedProductPrice =
            orderData.totalBatchedProductPrice +
            tempData.batchPrice +
            tempData.batchVAT;
          if (orderData.delivery == "Yes") {
            req.body.totalBatchedFreightPrice =
              orderData.totalBatchedFreightPrice +
              tempData.batchFreightPrice +
              tempData.batchFreightVAT;
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.totalBatchedFreightPrice":
                  req.body.totalBatchedFreightPrice,
                "orders.$.totalBatchedProductPrice":
                  req.body.totalBatchedProductPrice,
                "orders.$.status": "Payment",
                "orders.$.totalBatchedPrice":
                  req.body.totalBatchedProductPrice +
                  req.body.totalBatchedFreightPrice,
              }
            );
          } else {
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.totalBatchedProductPrice":
                  req.body.totalBatchedProductPrice,
                "orders.$.status": "Payment",
                "orders.$.totalBatchedPrice":
                  req.body.totalBatchedProductPrice +
                  orderData.totalBatchedFreightPrice,
              }
            );
          }
        } else if (status == "Rejected" && tempData.status == "Verified") {
          req.body.totalBatchedProductPrice =
            orderData.totalBatchedProductPrice -
            tempData.batchPrice -
            tempData.batchVAT;
          if (orderData.delivery == "Yes") {
            req.body.totalBatchedFreightPrice =
              orderData.totalBatchedFreightPrice -
              tempData.batchFreightPrice -
              tempData.batchFreightVAT;
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.totalBatchedFreightPrice":
                  req.body.totalBatchedFreightPrice,
                "orders.$.totalBatchedProductPrice":
                  req.body.totalBatchedProductPrice,
                "orders.$.status": "Batched",
              }
            );
          } else {
            record = await this.updateBySet(
              {
                "orders._id": orderId,
              },
              {
                "orders.$.totalBatchedProductPrice":
                  req.body.totalBatchedProductPrice,
                "orders.$.status": "Batched",
              }
            );
          }
        }
        record = await this.updateBySet(
          {
            "orders._id": orderId,
            "orders.batches._id": batchId,
          },
          {
            "orders.$[i].batches.$[j].status": status,
            "orders.$[i].batches.$[j].paymentDueDate": req.body.paymentDueDate,
          },
          {
            arrayFilters: [{ "i._id": orderId }, { "j._id": batchId }],
          }
        );

        await this.addByPush(
          { "orders._id": orderId },
          {
            "orders.$.log": {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
        if (req.body.comment) {
          await this.addByPush(
            { "orders._id": orderId },
            {
              "orders.$.comments": {
                comment: req.body.comment,
                commenterName: req.log.actor,
              },
            }
          );
        }
      }
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async cancelBatch(req) {
    try {
      let record;
      let orderId = req.params.id;
      let batchId = req.body.batchId;
      let orderExist = await this.getByField(
        {
          orders: {
            $elemMatch: {
              _id: orderId,
              batches: { $elemMatch: { _id: batchId } },
            },
          },
        },
        { "orders.$": 1, canceledBatchNumber: 1, customerId: 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct batch to be modified",
          statusCode: 200,
          record: null,
        };
      } else if (
        req.role == "customer" &&
        orderExist.record[0].customerId != req.id
      ) {
        return {
          error: true,
          message: "You are not authorized to cancel this batch",
          statusCode: 200,
          record: null,
        };
      } else {
        let tempData = orderExist.record[0].orders[0].batches.id(batchId);
        let orderData = orderExist.record[0].orders[0];
        let totalPaid = tempData.totalPaid;
        let totalCancelledAmount = tempData.totalCancelledAmount;
        let outStandingQuantity = orderData.outStandingQuantity;
        if (tempData.status == "Paid") {
          totalPaid = orderData.totalPaid - tempData.payment.paidAmount;
          totalCancelledAmount =
            orderData.totalCancelledAmount + tempData.payment.paidAmount;
          outStandingQuantity = outStandingQuantity - tempData.batchQuantity;
        }
        if (
          tempData.status != "Unverified" &&
          tempData.status != "Rejected" &&
          tempData.status != "Cancelled"
        ) {
          req.body.totalBatchedProductPrice =
            orderData.totalBatchedProductPrice -
            tempData.batchPrice -
            tempData.batchVAT;
          if (orderData.delivery == "Yes") {
            req.body.totalBatchedFreightPrice =
              orderData.totalBatchedFreightPrice -
              tempData.batchFreightPrice -
              tempData.batchFreightVAT;
          }
        } else {
          req.body.totalBatchedFreightPrice =
            orderData.totalBatchedFreightPrice;
          req.body.totalBatchedProductPrice =
            orderData.totalBatchedProductPrice;
        }
        await this.updateBySet(
          {
            "orders._id": orderId,
          },
          {
            "orders.$.status": "Cancellation",
            "orders.$.totalBatchedFreightPrice":
              req.body.totalBatchedFreightPrice,
            "orders.$.totalBatchedProductPrice":
              req.body.totalBatchedProductPrice,
            "orders.$.totalPaid": totalPaid,
            "orders.$.totalCancelledAmount": totalCancelledAmount,
            "orders.$.outStandingQuantity": outStandingQuantity,
            "orders.$.totalBatchedPrice":
              req.body.totalBatchedProductPrice +
              req.body.totalBatchedFreightPrice,
          }
        );
        if (
          tempData.status == "Verified" ||
          tempData.status == "Paid" ||
          tempData.status == "Partially Paid"
        ) {
          let cancelledBatchNumber;
          if (orderExist.record[0].cancelledBatchNumber !== undefined) {
            cancelledBatchNumber =
              orderExist.record[0].cancelledBatchNumber + 1;
          } else {
            cancelledBatchNumber = 1;
          }
          await this.update(orderExist.record[0]._id, {
            cancelledBatchNumber: cancelledBatchNumber,
          });
        }
        record = await this.updateBySet(
          {
            "orders._id": orderId,
            "orders.batches._id": batchId,
          },
          {
            "orders.$[i].batches.$[j].status": "Cancelled",
            "orders.$[i].batches.$[j].cancellationReason":
              req.body.cancellationReason,
            "orders.$[i].batches.$[j].cancelledBy": req.role,
          },
          {
            arrayFilters: [{ "i._id": orderId }, { "j._id": batchId }],
          }
        );

        await this.addByPush(
          { "orders._id": orderId },
          {
            "orders.$.log": {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
        if (req.body.comment) {
          await this.addByPush(
            { "orders._id": orderId },
            {
              "orders.$.comments": {
                comment: req.body.comment,
                commenterName: req.log.actor,
              },
            }
          );
        }
      }
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async getBatch(req) {
    try {
      let orderId = req.params.id;
      let batchId = req.body.batchId;
      let orderExist = await this.getByField(
        {
          customerId: req.id,
          orders: {
            $elemMatch: {
              _id: orderId,
              batches: { $elemMatch: { _id: batchId } },
            },
          },
        },
        { "orders.$": 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct batch to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        let tempData = orderExist.record[0].orders[0].batches.id(batchId);
        return {
          error: false,
          message: "Successfully Retrieved",
          statusCode: 200,
          record: tempData,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async batchPayment(req) {
    try {
      let record;
      let orderId = req.params.id;
      let batchId = req.body.batchId;
      let orderExist = await this.getByField(
        {
          orders: {
            $elemMatch: {
              _id: orderId,
              batches: { $elemMatch: { _id: batchId } },
            },
          },
        },
        { "orders.$": 1, customerId: 1, orderType: 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct batch to be modified",
          statusCode: 200,
          record: null,
        };
      } else if (
        req.role == "customer" &&
        orderExist.record[0].customerId != req.id
      ) {
        return {
          error: true,
          message: "You are not authorized to pay on this batch",
          statusCode: 200,
          record: null,
        };
      } else {
        let tempData = orderExist.record[0].orders[0].batches.id(batchId);
        let orderData = orderExist.record[0].orders[0];
        if (tempData.status == "Verified") {
          let totalBatchedProductPrice =
            tempData.batchPrice + tempData.batchVAT;
          let totalBatchFreightPrice = 0;
          if (orderData.delivery == "Yes") {
            totalBatchFreightPrice =
              tempData.batchFreightPrice + tempData.batchFreightVAT;
          }
          let totalPayment = totalBatchFreightPrice + totalBatchedProductPrice;
          if (totalPayment !== req.body.paidAmount) {
            return {
              error: true,
              message: "Your payment should be equal to " + totalPayment,
              statusCode: 200,
              record: null,
            };
          } else {
            record = await this.updateBySet(
              {
                "orders._id": orderId,
                "orders.batches._id": batchId,
              },
              {
                "orders.$[i].batches.$[j].payment": req.body,
                "orders.$[i].batches.$[j].status": "Unverified Payment",
              },
              {
                arrayFilters: [{ "i._id": orderId }, { "j._id": batchId }],
              }
            );
            await this.addByPush(
              { "orders._id": orderId },
              {
                "orders.$.log": {
                  actor: req.log.actor,
                  activity: req.log.activity,
                  id: req.log.id,
                },
              }
            );
          }
          return record;
        } else {
          return {
            error: true,
            message: "Your Batch should be verified first ",
            statusCode: 200,
            record: null,
          };
        }
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async verifyBatchPayment(req) {
    try {
      let record;
      let orderId = req.params.id;
      let batchId = req.body.batchId;
      let status = req.body.status;
      let orderExist = await this.getByField(
        {
          orders: {
            $elemMatch: {
              _id: orderId,
              batches: { $elemMatch: { _id: batchId } },
            },
          },
        },
        { "orders.$": 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct batch to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        let batchData = orderExist.record[0].orders[0].batches.id(batchId);
        let orderData = orderExist.record[0].orders[0];
        if (status == "Verified" && batchData.status == "Unverified Payment") {
          let outStandingQuantity =
            batchData.batchQuantity + orderData.outStandingQuantity;
          let totalPaid = orderData.totalPaid + batchData.payment.paidAmount;
          let paymentStatus;
          if (totalPaid == orderData.totalBatchedPrice) {
            paymentStatus = "Paid";
          } else {
            paymentStatus = "Partially Paid";
          }
          await this.updateBySet(
            {
              "orders._id": orderId,
            },
            {
              "orders.$.totalPaid": totalPaid,
              "orders.$.outStandingQuantity": outStandingQuantity,
              "orders.$.status": paymentStatus,
            }
          );
        }
        let orderStatus = status;
        if (status == "Verified") {
          orderStatus = "Paid";
        }
        record = await this.updateBySet(
          {
            "orders._id": orderId,
            "orders.batches._id": batchId,
          },
          {
            "orders.$[i].batches.$[j].status": orderStatus,
          },
          {
            arrayFilters: [{ "i._id": orderId }, { "j._id": batchId }],
          }
        );

        await this.addByPush(
          { "orders._id": orderId },
          {
            "orders.$.log": {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
        if (req.body.comment) {
          await this.addByPush(
            { "orders._id": orderId },
            {
              "orders.$.comments": {
                comment: req.body.comment,
                commenterName: req.log.actor,
              },
            }
          );
        }
      }
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async orderPayment(req) {
    try {
      let record;
      let orderId = req.params.id;
      let orderExist = await this.getByField(
        {
          orders: {
            $elemMatch: {
              _id: orderId,
            },
          },
        },
        { "orders.$": 1, customerId: 1, orderType: 1 }
      );
      if (orderExist.error) {
        return {
          error: true,
          message: "Please select the correct order to be modified",
          statusCode: 200,
          record: null,
        };
      } else if (
        req.role == "customer" &&
        orderExist.record[0].customerId != req.id
      ) {
        return {
          error: true,
          message: "You are not authorized to pay on this order",
          statusCode: 200,
          record: null,
        };
      } else {
        let orderData = orderExist.record[0].orders[0];
        if (orderData.status == "Payment") {
          if (orderData.totalBatchedPrice != req.body.paidAmount) {
            return {
              error: true,
              message:
                "Your payment should be equal to " +
                orderData.totalBatchedPrice,
              statusCode: 200,
              record: null,
            };
          } else {
            record = await this.updateBySet(
              { "orders._id": orderId },
              {
                "orders.$.payment": req.body,
              }
            );
            let batchId;
            orderData.batches.forEach(async (od) => {
              batchId = od._id;
              await this.updateBySet(
                {
                  "orders._id": orderId,
                },
                {
                  "orders.$[i].batches.$[j].payment.paidAmount":
                    od.totalBatchPrice,
                  "orders.$[i].batches.$[j].status": "Unverified Payment",
                },
                {
                  arrayFilters: [{ "i._id": orderId }, { "j._id": batchId }],
                }
              );
            });

            await this.addByPush(
              { "orders._id": orderId },
              {
                "orders.$.log": {
                  actor: req.log.actor,
                  activity: req.log.activity,
                  id: req.log.id,
                },
              }
            );
          }
          return record;
        } else {
          return {
            error: true,
            message: "Your Batches for this order should be verified first ",
            statusCode: 200,
            record: null,
          };
        }
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
}

export default FreightPriceService;
