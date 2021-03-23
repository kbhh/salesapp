import Controller from "../Controller";
import Service from "../../services/distribution/vehicleCompaniesService";
import Model from "../../models/distribution/vehicleCompaniesModel";

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
  async writeAgreement(req, res) {
    const result = await service.writeAgreement(req);
    res.status(result.statusCode).send(result);
  }
  async changeStatus(req, res) {
    const result = await service.changeStatus(req);
    res.status(result.statusCode).send(result);
  }
  async changeAgreementStatus(req, res) {
    const result = await service.changeAgreementStatus(req);
    res.status(result.statusCode).send(result);
  }
  async writeCity(req, res) {
    const result = await service.writeCity(req);
    res.status(result.statusCode).send(result);
  }
  async changeCityStatus(req, res) {
    const result = await service.changeCityStatus(req);
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
}

export default new CustomerController(service);
