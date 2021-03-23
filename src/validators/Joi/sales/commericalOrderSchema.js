let Joi = require("joi");
const schemas = {
  orderSchema: Joi.object().keys({
    quantity: Joi.number()
      .required()
      .error(() => " Qunatity must be a number "),
    orderType: Joi.string()
      .required()
      .error(() => " Order Type must be a string "),
    shippingAddressId: Joi.string()
      .required()
      .error(() => " Select the shipping Address "),
    priceId: Joi.string()
      .required()
      .error(() => " Select the price "),
    delivery: Joi.string()
      .required()
      .error(() => " Delivery Type must be a string "),
  }),
  salesofficerorderSchema: Joi.object().keys({
    quantity: Joi.number()
      .required()
      .error(() => " Qunatity must be a number "),
    orderType: Joi.string()
      .required()
      .error(() => " Order Type must be a string "),
    shippingAddressId: Joi.string()
      .required()
      .error(() => " Select the shipping Address "),
    priceId: Joi.string()
      .required()
      .error(() => " Select the price "),
    delivery: Joi.string()
      .required()
      .error(() => " Delivery Type must be a string "),
    customerId: Joi.string()
      .required()
      .error(() => " Package Type must be a string "),
  }),
  priceSchema: Joi.object().keys({
    freightId: Joi.string()
      .required()
      .error(() => " Select the freight city "),
    carriageCapacity: Joi.number()
      .required()
      .error(() => " Carriage Capacity must be a number "),
    carriageType: Joi.string()
      .required()
      .error(() => " Carriage Type must be a string "),
    price: Joi.number()
      .required()
      .error(() => " Price Type must be a number "),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  VerifyOrderSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    comment: Joi.string().error(() => "Comment must be a string"),
    // paymentDueDate: Joi.date().error(
    //   () => "Please select the correct payment due date"
    // ),
    approvedQuantity: Joi.number().error(
      () => "Please select the amount approved"
    ),
  }),
  batchIdSchema: Joi.object().keys({
    batchId: Joi.string().error(() => "Please select the correct batch"),
  }),
  VerifyBatchSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    comment: Joi.string().error(() => "Comment must be a string"),
    paymentDueDate: Joi.date().error(
      () => "Please select the correct payment due date"
    ),
    batchId: Joi.string()
      .required()
      .error(() => "Please select the correct batch"),
  }),
  paymentSchema: Joi.object().keys({
    bankName: Joi.string()
      .required()
      .error(() => "Bank Name must be a string"),
    accountNumber: Joi.string().error(() => "Account Number must be a string"),
    invoiceNumber: Joi.string()
      .required()
      .error(() => "Invoice Number must be a string"),
    paidAmount: Joi.number()
      .required()
      .error(() => "Account Number must be a string"),
    batchId: Joi.string()
      .required()
      .error(() => "Please select the correct batch"),
  }),
  orderPaymentSchema: Joi.object().keys({
    bankName: Joi.string()
      .required()
      .error(() => "Bank Name must be a string"),
    accountNumber: Joi.string().error(() => "Account Number must be a string"),
    invoiceNumber: Joi.string()
      .required()
      .error(() => "Invoice Number must be a string"),
    paidAmount: Joi.number()
      .required()
      .error(() => "Account Number must be a string"),
  }),
  cancleBatchSchema: Joi.object().keys({
    batchId: Joi.string()
      .required()
      .error(() => "Please select the correct batch"),
    cancellationReason: Joi.string().error(
      () => "Cancellation Reason must be string"
    ),
  }),
  VerifyPriceSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    priceId: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    comment: Joi.string().error(() => "Comment must be a string"),
  }),
  orderBatchSchema: Joi.object().keys({
    batchQuantity: Joi.number()
      .required()
      .error(() => "Batch Quantity must be a number"),
    freightPriceId: Joi.string().error(() => "Select the Freight"),
  }),
};
export default schemas;
