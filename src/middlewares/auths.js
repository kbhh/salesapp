import jwt from "jsonwebtoken";
import controller from "../controllers/system/authorizationController";
const auth = (path, activity) => {
  return async (req, res, next) => {
    try {
      const token = req.header("token");
      const decoded = jwt.verify(token, process.env.MY_SECRET);
      req.role = decoded.role;
      req.id = decoded.id;
      if (path !== "") {
        req.authPath = path;
        await controller.checkAuth(req);
        if (req.authorized) {
          if (activity) {
            req.log = {
              actor: decoded.fullName,
              activity: activity,
              id: decoded.id,
            };
          }
          next();
        } else {
          return res
            .status(401)
            .json({ err: true, message: "Unauthorized Access!." });
        }
      } else {
        if (decoded.id) {
          next();
        } else {
          return res
            .status(401)
            .json({ err: true, message: "Unauthorized Access!." });
        }
      }
    } catch (error) {
      res.status(401).send({ error: "Unauthorized Access!" });
    }
  };
};

export default auth;
