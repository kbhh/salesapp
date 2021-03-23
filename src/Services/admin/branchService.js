import CrudService from "../../lib/crud";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
class BranchService extends CrudService {
  constructor(model) {
    super(model);
  }
}

export default BranchService;
