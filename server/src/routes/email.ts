import express from "express";
import Emailer from "../classes/Emailer";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const emailer = new Emailer();
    const options = req.body;
    console.log("OPTIONS:", options);
    console.log("BODY:", req.body);
    await emailer.sendEmail(options);

    return res.status(200).json({ message: "email sent!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error?.message || JSON.stringify(error) });
  }
});

export default router;
