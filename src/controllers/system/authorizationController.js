import Controller from "../Controller";
import Service from "../../Services/system/authorizationService";
import Model from "../../models/system/authorizationModels";

const model = new Model().getModel();
const service = new Service(model);

class authorizationController extends Controller {
  constructor(service) {
    super(service);
  }
  async addPath(req, res) {
    const result = await service.addPath(req);
    res.status(result.statusCode).send(result);
  }
  async addRoles(req, res) {
    const result = await service.addRoles(req);
    res.status(result.statusCode).send(result);
  }
  async checkAuth(req, res) {
    const result = await service.getByField({
      path: req.authPath,
      roles: { $elemMatch: { role: req.role } },
    });
    if (result.error) {
      req.authorized = false;
    } else {
      req.authorized = true;
    }
    return req;
  }
}

export default new authorizationController(service);
