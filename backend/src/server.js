import express from "express";
import path from "path";
import tryRouter from "./routes/try.js";
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use("/api", tryRouter);

if (ENV.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "..", "frontend", "dist");

    app.use(express.static(frontendPath));

    // Express 5 safe SPA fallback
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

app.listen(ENV.PORT, () => {
    console.log(`App is running at PORT : ${ENV.PORT}`);
});
