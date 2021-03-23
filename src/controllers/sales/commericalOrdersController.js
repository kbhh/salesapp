import Controller from "../Controller";
import Service from "../../Services/sales/commericalOrderService";
import Model from "../../models/sales/commericialOrdersModel";

const model = new Model().getModel();
const service = new Service(model);

class FreightPriceController extends Controller {
  constructor(service) {
    super(service);
  }
  async addOrder(req, res) {
    const result = await service.addOrder(req);
    res.status(result.statusCode).send(result);
  }
  async addBatch(req, res) {
    const result = await service.addBatch(req);
    res.status(result.statusCode).send(result);
  }
  async modifyOrder(req, res) {
    const result = await service.modifyOrder(req);
    res.status(result.statusCode).send(result);
  }
  async verifyOrder(req, res) {
    const result = await service.verifyOrder(req);
    res.status(result.statusCode).send(result);
  }

  async getOrder(req, res) {
    const result = await service.getOrder(req);
    res.status(result.statusCode).send(result);
  }
  async getOrdersByStatus(req, res) {
    const result = await service.getOrdersByStatus(req);
    res.status(result.statusCode).send(result);
  }
  async getOrderMiddleware(req, res, next) {
    const result = await service.getOrder(req);
    if (!result.error) {
      let tempdata = result.record[0].orders[0];
      if (
        tempdata.status == "Batching" ||
        tempdata.status == "Partial Batching"
      ) {
        req.body.store = tempdata.store;
        req.body.packageType = tempdata.packageType;
        req.body.productType = tempdata.productType;
        req.body.delivery = tempdata.delivery;
        req.body.totalUnBatched = tempdata.totalUnBatched;
        next();
      } else {
        return res.status(401).send({
          error: true,
          message:
            "You can't batch an order that is not permitted to be batched",
        });
      }
    } else {
      return res.status(401).json({
        error: true,
        message: "Select the correct order",
      });
    }
  }

  async verifyBatch(req, res) {
    const result = await service.verifyBatch(req);
    res.status(result.statusCode).send(result);
  }
  async cancelBatch(req, res) {
    const result = await service.cancelBatch(req);
    res.status(result.statusCode).send(result);
  }
  async batchPayment(req, res) {
    const result = await service.batchPayment(req);
    res.status(result.statusCode).send(result);
  }
  async verifyBatchPayment(req, res) {
    const result = await service.verifyBatchPayment(req);
    res.status(result.statusCode).send(result);
  }
  async orderPayment(req, res) {
    const result = await service.orderPayment(req);
    res.status(result.statusCode).send(result);
  }
  async getBatch(req, res) {
    const result = await service.getBatch(req);
    res.status(result.statusCode).send(result);
  }
  async getMyOrders(req, res) {
    const result = await service.getByField(
      {
        customerId: req.id,
      },
      { "orders.log": 0 }
    );
    res.status(result.statusCode).send(result);
  }
}

export default new FreightPriceController(service);
