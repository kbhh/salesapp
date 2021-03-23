import CrudService from "../../lib/crud";
import messages from "../../lib/messages.json";
class UserService extends CrudService {
  constructor(model) {
    super(model);
  }
  async write(req) {
    try {
      let body = req.body;
      let { carriageType } = body;
      let CarriageExist = await this.getByField({ carriageType: carriageType });
      if (!CarriageExist.error) {
        return {
          error: true,
          message: "Carriage Type " + messages.error.parameterAlreadyExists,
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
      let { carriageType } = body;
      let newCarriageExist = await this.getByField({
        carriageType: carriageType,
      });
      let id = req.params.id;
      let oldCarriage = await this.getById(id);
      if (
        !newCarriageExist.error &&
        oldCarriage.record.carriageType != carriageType
      ) {
        return {
          error: true,
          message: "Carriage Type" + messages.error.parameterAlreadyExists,
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
  async writeCarriage(req) {
    try {
      let id = req.params.id;
      let record = await this.addByPush({ _id: id }, { carriage: req.body });
      await this.addByPush({ _id: id }, { log: req.log });
      return record;
    } catch (errorMessage) {
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
  async changeCarriageStatus(req) {
    try {
      let status = req.body.status;
      let id = req.params.id;
      let carriageId = req.body.carriageId;
      let carriageExist = await this.getByField({
        _id: id,
        carriage: { $elemMatch: { _id: carriageId } },
      });

      if (!carriageExist.error) {
        let carriageData = carriageExist.record[0];
        let verifiedCarriage = await this.getByField({
          _id: id,
          carriage: {
            $elemMatch: {
              carriageCapacity: carriageData.carriageCapacity,
              packageType: carriageData.packageType,
              status: "Verified",
            },
          },
        });
        if (!verifiedCarriage.error && status == "Verified") {
          await this.updateBySet(
            { "carriage._id": verifiedCarriage.record[0]._id },
            { "carriage.$.status": "Suspended" }
          );
        }
        let record = await this.updateBySet(
          { "carriage._id": carriageId },
          { "carriage.$.status": status }
        );
        await this.addByPush({ _id: id }, { log: req.log });
        return record;
      } else {
        return {
          error: true,
          message: messages.error.doesnotexist,
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
  async getByStatus(req) {
    const result = await this.getByField(
      {
        status: req.query.status,
      },
      { log: 0 }
    );
    return result;
  }
  async getVerified() {
    const resultExist = await this.getByField(
      {
        status: "Verified",
        carriage: { $elemMatch: { status: "Verified" } },
      },
      { log: 0 }
    );
    let verifiedResult;
    let i = 0;
    verifiedResult = {
      error: resultExist.error,
      message: resultExist.message,
      statusCode: resultExist.statusCode,
      record: [],
    };
    let j;
    if (!resultExist.error) {
      resultExist.record.forEach((r) => {
        j = 0;
        verifiedResult.record[i] = {
          _id: r.id,
          carriageType: r.carriageType,
          carriage: [],
        };
        r.carriage.forEach((cr) => {
          if (cr.status == "Verified") {
            verifiedResult.record[i].carriage[j] = cr;
            j++;
          }
        });
        i++;
      });
    }
    return verifiedResult;
  }
  async getLogs(req) {
    const result = await this.getById(req.params.id, { log: 1 });
    return result;
  }
}

export default UserService;
