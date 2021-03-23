import CrudService from "../../lib/crud";
class FreightPriceService extends CrudService {
  constructor(model) {
    super(model);
  }
  async addCity(req) {
    try {
      let body = req.body;
      let { city } = body;
      let cityExist = await this.getByField({
        store: req.body.store,
        freight: { $elemMatch: { city: city } },
      });
      if (!cityExist.error) {
        return {
          error: true,
          message: "City already Exists",
          statusCode: 200,
          record: null,
        };
      }
      let record = await this.addByPush(
        { store: req.body.store, status: "Verified" },
        {
          freight: req.body,
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
  async setPrice(req) {
    try {
      let body = req.body;
      let id = req.params.id;
      let { freightId, carriageId } = body;
      let priceExist = await this.getByField({
        _id: id,
        freight: {
          $elemMatch: {
            _id: freightId,
            price: {
              $elemMatch: {
                carriageId: carriageId,
                // packageType: packageType,
                // carriageType: carriageType,
                // carriageCapacity: carriageCapacity,
                status: "Unverified",
              },
            },
          },
        },
      });
      if (!priceExist.error) {
        return {
          error: true,
          message:
            "Please verify the existing Price for this carriage capacity and carriage type first",
          statusCode: 200,
          record: null,
        };
      } else {
        let record = await this.addByPush(
          { _id: id, "freight._id": freightId },
          {
            "freight.$.price": body,
          }
        );
        await this.updateByAddSet(id, {
          log: {
            actor: req.log.actor,
            activity: req.log.activity,
            id: req.log.id,
          },
        });
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
  async verifyCity(req) {
    try {
      let id = req.params.id;
      let record = await this.updateBySet(
        { _id: id, "freight._id": req.body.freightId },
        {
          "freight.$.status": req.body.status,
        }
      );
      await this.updateByAddSet(id, {
        log: {
          actor: req.log.actor,
          activity: req.log.activity,
          id: req.log.id,
        },
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
  async verifyPrice(req) {
    try {
      let freightId = req.params.id;
      let priceId = req.body.priceId;
      let priceExist = await this.getByField(
        {
          freight: { $elemMatch: { "price._id": priceId } },
        },
        { "freight.price.$": 1 }
      );
      if (priceExist.error) {
        return {
          error: true,
          message: "Please select the correct price to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        if (req.body.status == "Verified") {
          let tobemodified = priceExist.record[0].freight[0].price.id(priceId);
          let unverified = await this.getByField(
            {
              "freight._id": freightId,
            },
            { "freight.$": 1 }
          );
          let tempArr = [];
          await unverified.record[0].freight[0].price.forEach((r) => {
            if (
              r.status == "Verified" &&
              r.carriageId == tobemodified.carriageId
            ) {
              tempArr.push(r);
            }
          });
          if (!unverified.error) {
            if (tempArr != "") {
              let verifiedPriceId = tempArr[0]._id;
              await this.updateBySet(
                {
                  "freight._id": freightId,
                  "freight.price._id": verifiedPriceId,
                },
                {
                  "freight.$[i].price.$[j].status": "Suspended",
                },
                {
                  arrayFilters: [
                    { "i._id": freightId },
                    { "j._id": verifiedPriceId },
                  ],
                }
              );
            }
          }
        }
        let record = await this.updateBySet(
          {
            "freight._id": freightId,
            "freight.price._id": priceId,
          },
          {
            "freight.$[i].price.$[j].status": req.body.status,
          },
          {
            arrayFilters: [{ "i._id": freightId }, { "j._id": priceId }],
          }
        );
        await this.addByPush(
          { "freight._id": freightId },
          {
            "freight.$.log": {
              actor: req.log.actor,
              activity: req.log.activity,
              id: req.log.id,
            },
          }
        );
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
  async getPrice(req) {
    try {
      let priceId = req.params.id;
      let priceExist = await this.getByField(
        {
          freight: { $elemMatch: { "price._id": priceId } },
        },
        { "freight.price.$": 1 }
      );
      if (!priceExist.error) {
        return {
          error: false,
          statusCode: 201,
          record: priceExist.record[0].freight[0].price.id(priceId),
        };
      } else {
        return priceExist;
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
  async getPriceMiddleware(req) {
    try {
      let freightPriceId = req.body.freightPriceId;
      let priceExist = await this.getByField(
        {
          freight: {
            $elemMatch: {
              price: {
                $elemMatch: { _id: freightPriceId, status: "Verified" },
              },
            },
          },
        },
        { "freight.price.$": 1 }
      );
      if (!priceExist.error) {
        let tempdata = priceExist.record[0].freight[0].price.id(freightPriceId);
        let freightPrice = tempdata.price;
        req.body.batchFreightPrice = freightPrice;
        let vat = freightPrice * 0.15;
        req.body.batchFreightVAT = vat;
        req.body.totalBatchPrice =
          req.body.totalBatchPrice + freightPrice + vat;
        req.status = true;
      } else {
        req.status = false;
      }
      return req;
    } catch (errormessage) {
      req.status = false;
      return req;
    }
  }
  async getFreight(req) {
    try {
      let freightExist = await this.getByField(
        {
          "freight._id": req.params.id,
        },
        { "freight.$": 1, "freight.price": 1 }
      );
      if (!freightExist.error) {
        let newvar = freightExist.record[0].freight[0];
        delete newvar.log;
        return {
          error: false,
          statusCode: 201,
          record: {
            _id: newvar._id,
            price: newvar.price,
            city: newvar.city,
            status: newvar.status,
          },
        };
      } else {
        return freightExist;
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
  async getVerifiedPrices(req) {
    try {
      let freightId = req.params.id;
      let freightExist = await this.getByField(
        {
          "freight._id": freightId,
        },
        { "freight.$": 1, "freight.price": 1 }
      );
      if (!freightExist.error) {
        let tempArr = [];
        await freightExist.record[0].freight[0].price.forEach((r) => {
          if (r.status == "Verified") {
            tempArr.push(r);
          }
        });
        return {
          error: false,
          statusCode: 201,
          record: tempArr,
        };
      } else {
        return freightExist;
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
  async getFreightByPackage(req) {
    const result = await this.getByField(
      {
        store: req.query.store,
        freight: {
          $elemMatch: {
            city: req.query.city,
            price: {
              $elemMatch: {
                status: "Verified",
              },
            },
          },
        },
      },
      {
        "freight.price.$": 1,
      }
    );
    return result;
  }
}

export default FreightPriceService;
