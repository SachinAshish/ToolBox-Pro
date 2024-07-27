import express from "express";

const mailRouter = express.Router();

mailRouter.get("/", (req, res) => {
   res.send("Mail router working");
});

export default mailRouter;
