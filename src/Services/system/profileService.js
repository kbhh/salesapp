import Service from "../Service";
import bcrypt from "bcryptjs";
import { imageValidator } from "../../validators/schema/Joi/fileValidator";
import multer from "multer";
const jwt = require("jsonwebtoken");
class ProfileService extends Service {
  constructor(model) {
    super(model);
  }
  async signup(body) {
    try {
      let message = "";
      let phoneNumber = body.mobileNumber;
      let phoneExist = await this.getByField({ mobileNumber: phoneNumber });
      if (phoneExist.record) {
        message = "Phone number";
      }
      let email = body.email;
      let emailExists = await this.getByField({ email: email });
      if (emailExists.record) {
        if (message === "") {
          message = " Email is ";
        } else {
          message = message + " and Email are ";
        }
      }
      if (message !== "") {
        message =
          message + " already taken, please login or reset your account ";
        return {
          error: true,
          message: message,
          statusCode: 200,
          record: null,
        };
      } else {
        body.password = await bcrypt.hashSync(body.password, 8);
        let record = await this.insert(body);
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
  async login(body) {
    try {
      let email = body.email;
      let userExists = await this.getOne({ email: email });
      if (userExists.error) {
        return {
          error: true,
          message: "Credentials do not match our records",
          statusCode: 200,
          record: null,
        };
      }
      if (
        userExists.record.status === "Verified" ||
        userExists.record.status === "Reset"
      ) {
        const match = await bcrypt.compare(
          body.password,
          userExists.record.password
        );

        if (match) {
          const payload = {
            id: userExists.record._id,
            role: userExists.record.role,
          };
          const token = jwt.sign(payload, process.env.MY_SECRET);
          return {
            error: false,
            message: "User loggedin successfully!",
            statusCode: 200,
            token: token,
            role: userExists.record.role,
          };
        } else {
          return {
            error: true,
            message: "Credentials do not match our records",
            statusCode: 200,
            record: null,
          };
        }
      } else {
        return {
          error: true,
          message: "Unverified or Suspended Account, Contact your Admin",
          statusCode: 200,
          record: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: error,
        statusCode: 500,
        record: null,
      };
    }
  }
  async imageUpload(req, res, next) {
    try {
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/img");
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
        },
      });

      let upload = multer({
        storage: storage,
        fileFilter: imageValidator,
      }).single("profileImg");

      upload(req, res, function (err) {
        if (req.fileValidationError) {
          return res
            .status(200)
            .send({ error: true, message: " Incorrect File Format" });
        } else if (!req.file) {
          return res
            .status(200)
            .send({
              error: true,
              message: " Please select an image to upload",
            });
        } else if (err) {
          return res
            .status(200)
            .send({ error: true, message: " Internal Error" });
        }
        //const url = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        req.body.profileImg = req.file.filename;
        next();
      });
    } catch (error) {
      return res.status(400).send({ error: true, message: " Internal Error" });
    }
  }
}

export default ProfileService;
