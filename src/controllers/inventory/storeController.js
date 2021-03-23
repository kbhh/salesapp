import Controller from "../Controller";
import Service from "../../Services/inventory/storeService";
import Model from "../../models/inventory/storeModel";

const model = new Model().getModel();
const service = new Service(model);

class StoreController extends Controller {
  constructor(service) {
    super(service);
  }
  async registerStore(req, res) {
    const result = await service.addStore(req);
    res.status(result.statusCode).send(result);
  }
  async addProduct(req, res) {
    const result = await service.addProduct(req);
    res.status(result.statusCode).send(result);
  }
  async modifyProduct(req, res) {
    const result = await service.modifyProduct(req);
    res.status(result.statusCode).send(result);
  }
  async depositProduct(req, res) {
    const result = await service.depositProduct(req);
    res.status(result.statusCode).send(result);
  }
  async deductDepoistProduct(req, res) {
    const result = await service.deductDepositProduct(req);
    res.status(result.statusCode).send(result);
  }
  async getVerified(req, res) {
    const result = await service.getByField(
      {
        status: "Verified",
      },
      { log: 0, store: 0 }
    );
    res.status(result.statusCode).send(result);
  }
  async getLogs(req, res) {
    const result = await service.getById(req.params.id, { log: 1 });
    res.status(result.statusCode).send(result);
  }
}

export default new StoreController(service);
