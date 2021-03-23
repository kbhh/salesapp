import Controller from "../Controller";
import UserService from "../../Services/staffAccount/accountService";
import User from "../../models/staff/staffAccountModel";
import multer from "multer";

const Account = new User().getModel();
const userService = new UserService(Account);
multer({ dest: "uploads" });

class UserController extends Controller {
  constructor(service) {
    super(service);
  }
  async signup(req, res) {
    const result = await userService.signup(req);
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
  async updateProfile(req, res) {
    const result = await userService.update(req.id, req.body);
    res.status(result.statusCode).send(result);
  }
  async uploadProfileImg(req, res, next) {
    const result = await userService.imageUpload(req, res, next);
  }
  async updateProfileImg(req, res) {
    const result = await userService.update(req.id, req.body);
    res.status(result.statusCode).send(result);
  }
  async changeRole(req, res) {
    const result = await userService.changeRole(req);
    res.status(result.statusCode).send(result);
  }
  async changeStatus(req, res) {
    const result = await userService.changeStatus(req);
    res.status(result.statusCode).send(result);
  }
  async manualpasswordReset(req, res) {
    const result = await userService.manualpasswordReset(req);
    res.status(result.statusCode).send(result);
  }
  async getAllEmployee(req, res) {
    let result = await userService.getAll("", { log: 0, password: 0 });
    return res.status(result.statusCode).send(result);
  }
  async addProfileMiddleware(req, res, next) {
    const result = await userService.getById(req.id);
    if (result.record) {
      req.office = result.record.office;
    }
    next();
  }
  async changeRoleMiddleware(req, res, next) {
    const result = await userService.getById(req.id);
    if (result.record) {
      req.office = result.record.office;
    }
    const record = await userService.getById(req.params.id);
    if (record.record) {
      req.body.office = record.record.office;
      req.body.existingRole = record.record.role;
    }
    next();
  }
  async getRoleMiddleware(req, res, next) {
    const result = await userService.getById(req.params.id);
    if (!result.error) {
      req.body.role = result.record.role;
      next();
    } else {
      return res.status(401).json({
        err: true,
        message: "User doesn't exist ",
      });
    }
  }
}

export default new UserController(userService);
