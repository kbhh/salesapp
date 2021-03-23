import Controller from "../Controller";
import Service from "../../Services/sales/productService";
import Model from "../../models/sales/productsModel";

const model = new Model().getModel();
const service = new Service(model);

class ProductController extends Controller {
  constructor(service) {
    super(service);
  }
  async getVerified(req, res) {
    const result = await service.getByField(
      {
        status: "Verified",
      },
      { log: 0, "price.log": 0 }
    );
    res.status(result.statusCode).send(result);
  }
  async getSingle(req, res) {
    const result = await service.getSingle(req);
    res.status(result.statusCode).send(result);
  }
  async add(req, res) {
    const result = await service.add(req);
    res.status(result.statusCode).send(result);
  }
  async modify(req, res) {
    const result = await service.modify(req);
    res.status(result.statusCode).send(result);
  }
  async setPrice(req, res) {
    const result = await service.setPrice(req);
    res.status(result.statusCode).send(result);
  }
  async modifyPrice(req, res) {
    const result = await service.modifyPrice(req);
    res.status(result.statusCode).send(result);
  }
  async verifyPrice(req, res) {
    const result = await service.verifyPrice(req);
    res.status(result.statusCode).send(result);
  }
  async getProductLogs(req, res) {
    const result = await service.getById(req.params.id, { log: 1 });
    res.status(result.statusCode).send(result);
  }
  async getPriceLogs(req, res) {
    const result = await service.getByField(
      { "price._id": req.params.id },
      { "price.log": 1 }
    );
    res.status(result.statusCode).send(result);
  }
  async uploadImg(req, res, next) {
    const result = await service.imageUpload(req, res, next);
  }
  async updateImg(req, res) {
    req.body.log = req.log;
    const result = await service.update(req.params.id, req.body);
    res.status(result.statusCode).send(result);
  }
  async getPriceMiddleware(req, res, next) {
    try {
      const result = await service.getByField(
        { "price._id": req.body.priceId },
        {
          "price.$": 1,
          productType: 1,
        }
      );
      if (!result.error) {
        let tempData = result.record[0].price[0];
        //let unitPrice = tempData.unitPrice;
        req.body.store = tempData.store;
        req.body.packageType = tempData.packageType;
        req.body.productType = result.record[0].productType;
        //req.body.unitPrice = unitPrice;
        // let productPrice = unitPrice * req.body.quantity;
        // let vat = productPrice * 0.15;
        // req.body.productPrice = productPrice;
        // req.body.productVAT = vat;
        next();
      } else {
        return res.status(401).json({
          error: true,
          message: "Select the correct product type",
        });
      }
    } catch (errormessage) {
      return res.status(401).json({
        error: true,
        message: errormessage,
      });
    }
  }
  async getBatchPriceMiddleware(req, res, next) {
    try {
      const result = await service.getByField(
        {
          productType: req.body.productType,
          price: {
            $elemMatch: {
              store: req.body.store,
              packageType: req.body.packageType,
            },
          },
        },
        {
          "price.$": 1,
          productType: 1,
        }
      );
      if (!result.error) {
        let tempData = result.record[0].price[0];
        let unitPrice = tempData.unitPrice;
        req.body.unitPrice = unitPrice;
        let batchPrice = unitPrice * req.body.batchQuantity;
        let vat = batchPrice * 0.15;
        req.body.batchPrice = batchPrice;
        req.body.batchVAT = vat;
        req.body.totalBatchPrice = batchPrice + vat;
        next();
      } else {
        return res.status(401).json({
          error: true,
          message: "Select the correct product type",
        });
      }
    } catch (errormessage) {
      return res.status(401).json({
        error: true,
        message: errormessage,
      });
    }
  }
  async getPriceCalculator(req, res) {
    try {
      const result = await service.getByField(
        {
          price: {
            $elemMatch: {
              _id: req.params.id,
              status: "Verified",
            },
          },
        },
        {
          "price.$": 1,
        }
      );
      if (!result.error) {
        let tempData = result.record[0].price[0];
        let unitPrice = tempData.unitPrice;
        let price = unitPrice * req.body.quantity;
        let vat = price * 0.15;
        let totalPrice = price + vat;
        return res.status(200).send({
          error: false,
          record: {
            quantity: req.body.quantity,
            store: tempData.store,
            unitPrice: unitPrice,
            productPrice: price,
            productVAT: vat,
            totalPrice: totalPrice,
          },
        });
      } else {
        return res.status(401).send({
          error: true,
          message: "Select the correct product type",
        });
      }
    } catch (errormessage) {
      return res.status(401).send({
        error: true,
        message: errormessage,
      });
    }
  }
}

export default new ProductController(service);
