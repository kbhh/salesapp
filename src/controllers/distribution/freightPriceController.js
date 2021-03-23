import Controller from "../Controller";
import Service from "../../Services/distribution/freightPriceService";
import Model from "../../models/distribution/freightPriceModel";

const model = new Model().getModel();
const service = new Service(model);

class FreightPriceController extends Controller {
  constructor(service) {
    super(service);
  }

  async addCity(req, res) {
    const result = await service.addCity(req);
    res.status(result.statusCode).send(result);
  }
  async verifyCity(req, res) {
    const result = await service.verifyCity(req);
    res.status(result.statusCode).send(result);
  }
  async modify(req, res) {
    const result = await service.modify(req);
    res.status(result.statusCode).send(result);
  }
  async setPrice(req, res) {
    const result = await service.setPrice(req);
    res.status(result.statusCode).send(result);
  }
  async verifyPrice(req, res) {
    const result = await service.verifyPrice(req);
    res.status(result.statusCode).send(result);
  }
  async getAllFreight(req, res) {
    const result = await service.getByField(
      {
        status: req.query.status,
      },
      {
        log: 0,
        "freight.price": 0,
        "freight.log": 0,
      }
    );
    res.status(result.statusCode).send(result);
  }
  async getFreight(req, res) {
    const result = await service.getFreight(req);
    res.status(result.statusCode).send(result);
  }
  async getPrice(req, res) {
    const result = await service.getPrice(req);
    res.status(result.statusCode).send(result);
  }
  async getVerifiedPrices(req, res) {
    const result = await service.getVerifiedPrices(req);
    res.status(result.statusCode).send(result);
  }
  async getPriceMiddleware(req, res, next) {
    if (req.body.delivery == "Yes") {
      await service.getPriceMiddleware(req);
      if (req.status) {
        next();
      } else {
        return res.status(401).json({
          error: true,
          message: "Select the correct freight type",
        });
      }
    } else {
      next();
    }
  }
  async getFreightByPackage(req, res) {
    const result = await service.getFreightByPackage(req);
    res.status(result.statusCode).send(result);
  }
}

export default new FreightPriceController(service);
