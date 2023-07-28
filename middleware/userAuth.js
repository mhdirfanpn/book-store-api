import jwt from "jsonwebtoken";

let JWT_SECRET = "hello-world"


export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(403).json({ error: "Access Denied" });
    }

    const token = authHeader.split(" ").pop();

    jwt.verify(token,JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(200).json({ message: "Authentication failed", err });
      }
      req.decoded = decoded;
      next();
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};