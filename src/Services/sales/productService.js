import CrudService from "../../lib/crud";
const jwt = require("jsonwebtoken");
import { imageValidator } from "../../validators/Joi/fileValidator";
import multer from "multer";
class ProductService extends CrudService {
  constructor(model) {
    super(model);
  }
  async add(req) {
    try {
      let body = req.body;
      let { productType } = body;
      let productExist = await this.getByField({ productType: productType });
      if (!productExist.error) {
        return {
          error: true,
          message: "Product Type already Exists",
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
  async setPrice(req) {
    try {
      let body = req.body;
      let id = req.params.id;
      let priceExist = await this.getByField({
        _id: id,
        "price.status": "Unverified",
        "price.packageType": body.packageType,
      });
      if (!priceExist.error) {
        return {
          error: true,
          message:
            "Please Verify the existing Price for this product and package type first",
          statusCode: 200,
          record: null,
        };
      } else {
        body.log = req.log;
        let record = this.updateByAddSet(id, { price: req.body });
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
  async modifyPrice(req) {
    try {
      let id = req.params.id;
      let priceExist = await this.getByField({
        "price._id": id,
        "price.status": "Unverified",
      });
      if (priceExist.error) {
        return {
          error: true,
          message: "The price should be unverified to modify",
          statusCode: 200,
          record: null,
        };
      } else {
        let record = this.updateBySet(
          { "price._id": id },
          { "price.$": req.body }
        );
        await this.addByPush(
          { "price._id": id },
          {
            "price.$.log": {
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
  async verifyPrice(req) {
    try {
      let id = req.params.id;
      let priceExist = await this.getByField({
        "price._id": id,
      });
      if (priceExist.error) {
        return {
          error: true,
          message: "Please select the correct the price to be modified",
          statusCode: 200,
          record: null,
        };
      } else {
        if (req.body.status == "Verified") {
          this.updateBySet(
            {
              "price.packageType": priceExist.record[0].price[0].packageType,
              "price.status": "Verified",
            },
            { "price.$.status": "Unverified" }
          );
        }
        let record = await this.updateBySet(
          { "price._id": id },
          { "price.$.status": req.body.status }
        );
        await this.addByPush(
          { "price._id": id },
          {
            "price.$.log": {
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
  async imageUpload(req, res, next) {
    try {
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/img/products");
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
        },
      });

      let upload = multer({
        storage: storage,
        fileFilter: imageValidator,
      }).single("productImg");

      upload(req, res, function (error) {
        if (req.fileValidationError) {
          return res
            .status(200)
            .send({ error: true, message: " Incorrect File Format" });
        } else if (!req.file) {
          return res.status(200).send({
            error: true,
            message: " Please select an image to upload",
          });
        } else if (error) {
          return res
            .status(200)
            .send({ error: true, message: " Internal Error" });
        }
        req.body.productImg = req.file.filename;
        next();
      });
    } catch (error) {
      return res.status(400).send({ error: true, message: " Internal Error" });
    }
  }
  async getSingle(req) {
    const result = await this.getByField(
      { _id: req.params.id },
      {
        log: 0,
        "price.log": 0,
        "ExportPrice.log": 0,
      }
    );
    if (!result.error) {
      let tempArr = [];
      await result.record[0].price.forEach((r) => {
        if (r.status == "Verified") {
          tempArr.push(r);
        }
      });
      let finalresult = {
        _id: result.record[0]._id,
        productType: result.record[0].productType,
        price: tempArr,
      };
      return {
        error: false,
        statusCode: 201,
        message: "Successfully retrieved",
        record: finalresult,
      };
    } else {
      return result;
    }
  }
}

export default ProductService;
