import Controller from "../Controller";
import Service from "../../Services/system/accountManagementService";
import Model from "../../models/system/accountManagementModel";

const model = new Model().getModel();
const service = new Service(model);

class AccountManagementController extends Controller {
  constructor(service) {
    super(service);
  }
  async addRole(req, res) {
    const result = await service.addRole(req);
    res.status(result.statusCode).send(result);
  }
  async canbeCeatedby(req, res) {
    const result = await service.canbeCeatedby(req);
    res.status(result.statusCode).send(result);
  }
  async canbeVerifiedby(req, res) {
    const result = await service.canbeVerifiedby(req);
    res.status(result.statusCode).send(result);
  }
  async accountMiddleware(req, res, next) {
    const result = await service.getByField({
      role: req.body.role,
      "canBeCreatedBy.createdBy": req.role,
    });
    const creator = await service.getByField({
      role: req.role,
    });
    if (result.error) {
      return res.status(401).json({
        error: true,
        message: "You are not authorized to create an account for this role",
      });
    } else {
      if (
        !creator.record[0].isSuper &&
        result.record[0].sameOffice &&
        req.body.office !== req.office
      ) {
        return res.status(401).json({
          error: true,
          message:
            "You are not authorized to create an account for another office",
        });
      } else {
        next();
      }
    }
  }
  async changeRoleMiddleware(req, res, next) {
    const result = await service.getByField({
      role: req.body.existingRole,
      "canBeCreatedBy.createdBy": req.role,
    });
    if (result.error) {
      return res.status(401).json({
        error: true,
        message:
          "You are not authorized to change an account for the existing role",
      });
    } else {
      const response = await service.getByField({
        role: req.body.role,
        "canBeCreatedBy.createdBy": req.role,
      });
      if (response.error) {
        return res.status(401).json({
          error: true,
          message:
            "You are not authorized to change an account for the existing role",
        });
      } else {
        const creator = await service.getByField({
          role: req.role,
        });
        if (
          !creator.record[0].isSuper &&
          response.record[0].sameOffice &&
          req.body.office !== req.office
        ) {
          return res.status(401).json({
            error: true,
            message:
              "You are not authorized to create an account for another office",
          });
        } else {
          next();
        }
      }
    }
  }
  async verifyMiddleware(req, res, next) {
    const result = await service.getByField({
      role: req.body.role,
      "canBeVerifiedBy.verifiedBy": req.role,
    });
    if (result.error) {
      return res.status(401).json({
        error: true,
        message:
          "You are not authorized to modify an account for " + req.body.role,
      });
    } else {
      const creator = await service.getByField({
        role: req.role,
      });
      if (
        !creator.record[0].isSuper &&
        result.record[0].sameOffice &&
        req.body.office !== req.office
      ) {
        return res.status(401).json({
          error: true,
          message:
            "You are not authorized to modify an account for another office",
        });
      } else {
        next();
      }
    }
  }
}

export default new AccountManagementController(service);
