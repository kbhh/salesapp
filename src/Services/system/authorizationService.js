import CrudService from "../../lib/crud";
class AccountManagementService extends CrudService {
  constructor(model) {
    super(model);
  }
  async addPath(req) {
    try {
      let pathExist = await this.getByField({ path: req.body.path });
      if (pathExist.error) {
        let record = await this.create(req.body);
        return record;
      } else {
        return {
          error: true,
          message: "The path already exists",
          statusCode: 200,
          record: null,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async addRoles(req) {
    try {
      let record = await this.updateByAddSet(req.params.id, {
        roles: req.body,
      });
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
}

export default AccountManagementService;
