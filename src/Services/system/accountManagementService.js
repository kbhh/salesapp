import CrudService from "../../lib/crud";
class AccountManagementService extends CrudService {
  constructor(model) {
    super(model);
  }
  async addRole(req) {
    try {
      let roleExist = await this.getByField({ role: req.body.role });
      if (roleExist.error) {
        let record = await this.create(req.body);
        return record;
      } else {
        return {
          error: true,
          message: "The role already exists",
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
  async canbeCeatedby(req) {
    try {
      console.log(req.baseUrl);
      let record = await this.updateByAddSet(req.params.id, {
        canBeCreatedBy: req.body,
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
  async canbeVerifiedby(req) {
    try {
      let record = await this.updateByAddSet(req.params.id, {
        canBeVerifiedBy: req.body,
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
