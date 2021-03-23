import Controller from "../Controller";
import Service from "../../services/distribution/vehicleService";
import Model from "../../models/distribution/vehicleModel";

const GettedModel = new Model().getModel();
const service = new Service(GettedModel);

class CustomerController extends Controller {
  constructor(service) {
    super(service);
  }
  async write(req, res) {
    const result = await service.write(req);
    res.status(result.statusCode).send(result);
  }
  async modify(req, res) {
    const result = await service.modify(req);
    res.status(result.statusCode).send(result);
  }
  async changeStatus(req, res) {
    const result = await service.changeStatus(req);
    res.status(result.statusCode).send(result);
  }
  async getByStatus(req, res) {
    const result = await service.getByStatus(req);
    res.status(result.statusCode).send(result);
  }
  async getLogs(req, res) {
    const result = await service.getLogs(req);
    res.status(result.statusCode).send(result);
  }
  async getVerified(req, res) {
    const result = await service.getVerified();
    res.status(result.statusCode).send(result);
  }
}

export default new CustomerController(service);
