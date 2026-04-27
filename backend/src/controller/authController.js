import dotenv from "dotenv";

dotenv.config();

const authentication = (req, res) => {
  const { adminName, password } = req.body;

  if (!adminName || !password) {
    return res.status(400).json({
      success: false,
      message: "Name and password are required",
    });
  }

  if (
    adminName === process.env.ADMIN_NAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
};

export default authentication;
