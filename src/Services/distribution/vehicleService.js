import CrudService from "../../lib/crud";
import messages from "../../lib/messages.json";
class UserService extends CrudService {
  constructor(model) {
    super(model);
  }
  async write(req) {
    try {
      let body = req.body;
      let { plateNumber } = body;
      let vehicleExist = await this.getByField({ plateNumber: plateNumber });
      if (!vehicleExist.error) {
        return {
          error: true,
          message: "Plate Number " + messages.error.parameterAlreadyExists,
          statusCode: 200,
          record: null,
        };
      } else {
        body.log = { actor: req.log.actor, activity: req.log.activity };
        let record = await this.create(body);
        return record;
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
  async modify(req) {
    try {
      let body = req.body;
      body.status = "Modified";
      let { plateNumber } = body;
      let newVehicleExist = await this.getByField({ plateNumber: plateNumber });
      let id = req.params.id;
      let oldVehicle = await this.getById(id);
      if (
        !newVehicleExist.error &&
        oldVehicle.record.plateNumber != plateNumber
      ) {
        return {
          error: true,
          message: "Plate Number " + messages.error.parameterAlreadyExists,
          statusCode: 200,
          record: null,
        };
      } else {
        let record = await this.update(id, req.body);
        await this.addByPush({ _id: id }, { log: req.log });
        return record;
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
  async changeStatus(req) {
    try {
      let id = req.params.id;
      let record = await this.update(id, req.body);
      await this.addByPush({ _id: id }, { log: req.log });
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
  async getByStatus(req) {
    const result = await this.getByField(
      {
        status: req.query.status,
      },
      { log: 0 }
    );
    return result;
  }
  async getLogs(req) {
    const result = await this.getById(req.params.id, { log: 1 });
    return result;
  }
  async getVerified(req) {
    const result = await this.getByField(
      {
        status: "Verified",
      },
      { log: 0 }
    );
    return result;
  }
}

export default UserService;
