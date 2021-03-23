import Controller from "./Controller"
import ProductService from "../services/ProductService"
import Product from "../models/sales/Products"

const productModel = new Product().getModel()
const productService = new ProductService(
  productModel
)
 
// import multer from "multer"
// import { imageValidator } from "../utils/validator"
// import path from "path"
class ProductController extends Controller{ 
  constructor(service) {
    super(service);
  }  
}

export default new ProductController(productService)
