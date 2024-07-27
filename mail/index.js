import bodyParser from "body-parser";
import express from "express";
import nodemailer from "nodemailer";

import mailRouter from "./routes/mail-routes.js";

const app = express();
const port = 5000;

app.use("/mail", mailRouter);

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
