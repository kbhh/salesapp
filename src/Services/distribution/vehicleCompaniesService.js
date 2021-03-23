import CrudService from "../../lib/crud";
import messages from "../../lib/messages.json";
class UserService extends CrudService {
  constructor(model) {
    super(model);
  }
  async write(req) {
    try {
      let body = req.body;
      let { companyName } = body;
      let companyExist = await this.getByField({ companyName: companyName });
      if (!companyExist.error) {
        return {
          error: true,
          message: "Company Name " + messages.error.parameterAlreadyExists,
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
      let { companyName } = body;
      let companyExist = await this.getByField({ companyName: companyName });
      let id = req.params.id;
      let oldCompany = await this.getById(id);
      if (!companyExist.error && oldCompany.record.companyName != companyName) {
        return {
          error: true,
          message: "New Company Name " + messages.error.parameterAlreadyExists,
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
  async writeAgreement(req) {
    try {
      let id = req.params.id;
      let record = await this.addByPush({ _id: id }, { agreement: req.body });
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
  async changeAgreementStatus(req) {
    try {
      let status = req.body.status;
      let id = req.params.id;
      let agreementId = req.body.agreementId;
      let agreementExist = await this.getByField({
        _id: id,
        agreement: { $elemMatch: { _id: agreementId } },
      });

      if (!agreementExist.error) {
        let verifiedAgreement = await this.getByField({
          _id: id,
          agreement: {
            $elemMatch: {
              status: "Verified",
            },
          },
        });
        if (!verifiedAgreement.error && status == "Verified") {
          await this.updateBySet(
            { "agreement._id": verifiedAgreement.record[0]._id },
            { "agreement.$.status": "Suspended" }
          );
        }
        let record = await this.updateBySet(
          { "agreement._id": agreementId },
          { "agreement.$.status": status }
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
  async writeCity(req) {
    try {
      let city = req.body.city;
      let id = req.params.id;
      let agreementId = req.body.agreementId;
      let agreementExist = await this.getByField({
        _id: id,
        agreement: {
          $elemMatch: {
            _id: agreementId,
            assignedCity: { $elemMatch: { city: city } },
          },
        },
      });
      if (agreementExist.error) {
        let record = await this.addByPush(
          { _id: id, "agreement._id": agreementId },
          { "agreement.$.assignedCity": req.body }
        );
        await this.addByPush({ _id: id }, { log: req.log });
        return record;
      } else {
        return {
          error: true,
          message: "The City is already assigned to the company",
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
  async changeCityStatus(req) {
    try {
      let status = req.body.status;
      let id = req.params.id;
      let agreementId = req.body.agreementId;
      let assignedId = req.body.assignedId;
      let record = await this.updateBySet(
        {
          _id: id,
          "agreement._id": agreementId,
          "agreement.assignedCity._id": assignedId,
        },
        {
          "agreement.$[i].assignedCity.$[j].status": status,
        },
        {
          arrayFilters: [{ "i._id": agreementId }, { "j._id": assignedId }],
        }
      );
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
}

export default UserService;
