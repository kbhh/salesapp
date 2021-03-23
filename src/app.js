import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import Connection from "./config/database";
import messages from "./lib/messages.json";

const app = express();
const accessLogStream = fs.createWriteStream(__dirname + "/access.log", {
  flags: "a",
});

// Middlewares
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
const dbcon = new Connection();
const con = dbcon.connect();

if (con) {
  console.log(messages.success.dbcon);
} else {
  console.log(messages.error.dbcon, con);
}

import staffAccount from "./routes/staffAccount/staffAccountRoute";
import customerRoutes from "./routes/customer/customerRoute";

// Admin
import branchRoutes from "./routes/admin/branchRoute";

//sales
import productRoutes from "./routes/sales/productRoute";
import commericalOrderRoutes from "./routes/sales/commericalOrderRoute";

//System
import accountManagementRoute from "./routes/system/accountManagementRoute";
import authorizationRoute from "./routes/system/authorizationRoute";

//Store
import storeRoute from "./routes/inventory/storeRoute";

//Distribution
import freightPriceRoute from "./routes/distribution/freightPriceRoute";
import vehicleRoute from "./routes/distribution/vehicleRoute";
import vehicleCompaniesRoute from "./routes/distribution/vehicleCompaniesRoute";
import carriageRoute from "./routes/distribution/carriageRoute";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});
//app.use('/products', productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/staff", staffAccount);
app.use("/api/branch", branchRoutes);

//Sales
app.use("/api/product", productRoutes);
app.use("/api/commericalorder", commericalOrderRoutes);
// System
app.use("/api/accountmanagement", accountManagementRoute);
app.use("/api/authorization", authorizationRoute);

//Inventory
app.use("/api/store", storeRoute);

//distribution
app.use("/api/freightprice", freightPriceRoute);
app.use("/api/vehicle", vehicleRoute);
app.use("/api/vehiclecompanies", vehicleCompaniesRoute);
app.use("/api/carriage", carriageRoute);
app.use((req, res, tekeze) => {
  const error = new Error("Not Found");
  error.status = 404;
  tekeze(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

export default app;
