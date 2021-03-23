import Controller from "./Controller"
import OrderService from "../services/orderService"
import Order from "../models/sales/Orders"
const orderModel = new Order().getModel()
const orderService = new OrderService(
  orderModel
) 
class OrderController extends Controller{ 
  constructor(service) {
    super(service);
  } 
}

export default new OrderController(orderService)
