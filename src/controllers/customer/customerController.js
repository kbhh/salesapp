import Controller from "../Controller";
import UserService from "../../services/customer/customerService";
import User from "../../models/customer/Customer";
import multer from "multer";

const Account = new User().getModel();
const userService = new UserService(Account);
multer({ dest: "uploads" });

class CustomerController extends Controller {
  constructor(service) {
    super(service);
  }
  async register(req, res) {
    const result = await userService.register(req);
    res.status(result.statusCode).send(result);
  }
  async updateRegistation(req, res) {
    const result = await userService.updateRegistration(req);
    res.status(result.statusCode).send(result);
  }
  async registerAddress(req, res) {
    const result = await userService.registerAddress(req);
    res.status(result.statusCode).send(result);
  }
  async updateAddress(req, res) {
    const result = await userService.updateAddress(req);
    res.status(result.statusCode).send(result);
  }
  async requestPaymentMethodChange(req, res) {
    const result = await userService.requestPaymentMethodChange(req);
    res.status(result.statusCode).send(result);
  }
  async verifyPaymentMethodChange(req, res) {
    const result = await userService.verifyPaymentMethodChange(req);
    res.status(result.statusCode).send(result);
  }
  async requestPriorityChange(req, res) {
    const result = await userService.requestPriorityChange(req);
    res.status(result.statusCode).send(result);
  }
  async verifyPriorityChange(req, res) {
    const result = await userService.verifyPriorityChange(req);
    res.status(result.statusCode).send(result);
  }
  async accountCreate(req, res) {
    const result = await userService.accountCreate(req);
    res.status(result.statusCode).send(result);
  }
  async login(req, res) {
    const result = await userService.login(req.body);
    res.status(result.statusCode).send(result);
  }
  async getme(req, res) {
    const result = await userService.getById(req.id);
    res.status(result.statusCode).send(result);
  }
  async uploadProfileImg(req, res, next) {
    const result = await userService.imageUpload(req, res, next);
  }
  async updateProfileImg(req, res) {
    const result = await userService.update(req.id, req.body);
    res.status(result.statusCode).send(result);
  }
  async changeStatus(req, res) {
    const result = await userService.changeStatus(req);
    res.status(result.statusCode).send(result);
  }
  async getByStatus(req, res) {
    const result = await userService.getByField(
      {
        status: req.query.status,
      },
      { log: 0, projects: 0 }
    );
    res.status(result.statusCode).send(result);
  }
  async getLogs(req, res) {
    const result = await userService.getById(req.params.id, { log: 1 });
    res.status(result.statusCode).send(result);
  }
  async getAllCustomers(req, res) {
    let result = await userService.getAll("", {
      log: 0,
      projects: 0,
    });
    return res.status(result.statusCode).send(result);
  }
}

export default new CustomerController(userService);
