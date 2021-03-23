import Controller from "../Controller";
import Service from "../../Services/admin/branchService";
import Model from "../../models/admin/branchModel";

const model = new Model().getModel();
const service = new Service(model);

class branchController extends Controller {
  constructor(service) {
    super(service);
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

export default new branchController(service);
