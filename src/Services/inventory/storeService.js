import CrudService from "../../lib/crud";
const jwt = require("jsonwebtoken");
class StoreService extends CrudService {
  constructor(model) {
    super(model);
  }
  async addStore(req) {
    try {
      let body = req.body;
      let storeName = body.storeName;
      let storeExist = await this.getByField({
        storeName: storeName,
      });
      if (!storeExist.error) {
        return {
          error: true,
          message: "Store already Exists",
          statusCode: 200,
          record: null,
        };
      }
      body.log = req.log;
      let record = await this.create(body);
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
  async addProduct(req) {
    try {
      let body = req.body;
      let id = req.params.id;
      let { productType, packageType } = body;
      // let productExist = await this.getByElementMatch(store, {
      //   productType: productType,
      //   packageType: packageType,
      // });
      let productExist = await this.getByField({
        store: {
          $elemMatch: { productType: productType, packageType: packageType },
        },
      });
      if (!productExist.error) {
        return {
          error: true,
          message: "Product Type and Package already Exist",
          statusCode: 200,
          record: null,
        };
      }
      body.log = req.log;
      let record = this.updateByAddSet(id, { store: body });
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
  async modify(req) {
    try {
      let body = req.body;
      let id = req.params.id;
      let { productType } = body;
      let productExist = await this.getById(id);
      if (!productExist.error) {
        if (productType == productExist.record.productType) {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          });
          return record;
        } else {
          let productTypeExist = await this.getByField({
            productType: productType,
          });
          if (!productTypeExist.error) {
            return {
              error: true,
              message: "Product Type already Exists",
              statusCode: 200,
              record: null,
            };
          }
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          });
          return record;
        }
      } else {
        return {
          error: true,
          message: "Please select the correct Item to modify",
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
  async modifyProduct(req) {
    try {
      let id = req.params.id;
      let record = await this.updateBySet(
        { "store._id": id },
        {
          "store.$.productType": req.body.productType,
          "store.$.packageType": req.body.packageType,
        }
      );
      await this.addByPush(
        { "store._id": id },
        {
          "store.$.log": req.log,
        }
      );
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
  async depositProduct(req) {
    try {
      let id = req.params.id;
      let depositedAmount = req.body.depositedAmount;
      let productExist = await this.getByField(
        {
          "store._id": id,
        },
        { "store.$": 1 }
      );
      if (!productExist.error) {
        let avaliableBalance =
          productExist.record[0].store[0].avaliableBalance + depositedAmount;
        let record = this.updateBySet(
          { "store._id": id },
          { "store.$.avaliableBalance": avaliableBalance }
        );
        await this.addByPush(
          { "store._id": id },
          {
            "store.$.log": {
              actor: req.log.actor,
              depositedAmount: depositedAmount,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
        return record;
      } else {
        return {
          error: true,
          message: errormessage,
          statusCode: 400,
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
  async deductDepositProduct(req) {
    try {
      let id = req.params.id;
      let depositedAmount = req.body.depositedAmount;
      let productExist = await this.getByField(
        {
          "store._id": id,
        },
        { "store.$": 1 }
      );
      if (!productExist.error) {
        let avaliableBalance =
          productExist.record[0].store[0].avaliableBalance - depositedAmount;
        let record = this.updateBySet(
          { "store._id": id },
          { "store.$.avaliableBalance": avaliableBalance }
        );
        await this.addByPush(
          { "store._id": id },
          {
            "store.$.log": {
              actor: req.log.actor,
              depositedAmount: depositedAmount,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
        return record;
      } else {
        return {
          error: true,
          message: errormessage,
          statusCode: 400,
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
}

export default StoreService;
