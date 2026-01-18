import express from "express";
import tryRouter from "./routes/try.js";
import { ENV } from "./lib/env.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api",tryRouter);

app.listen(port,()=>{
    console.log(`App is running at PORT : ${ENV.PORT}`);
})