import jwt from "jsonwebtoken";

const auth = (role, activity, authenticated = false) => {
  return async (req, res, next) => {
    try {
      const token = req.header("token");
      const decoded = jwt.verify(token, process.env.MY_SECRET);
      if (role !== "") {
        if (decoded.role === role || role.includes(decoded.role)) {
          req.role = decoded.role;
          req.id = decoded.id;
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
      } else if (authenticated) {
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
