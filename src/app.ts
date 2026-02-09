import "dotenv/config";
import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

// controllers
import productsRoutes from "./routes/productsRoutes";

const app: Application = express();

app.use(bodyParser.json());

// rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);

// db connection
const dbUri = process.env.DB as string;
mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Connection Failed: ${err.message}`));

// url dispatching
app.use("/api/v1/products", productsRoutes);

// swagger api doc config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
    },
  },
  apis: ["./dist/controllers/*.js"],
};

const openApiSpecs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve);

app.get("/api-docs", (req, res) => {
  const html = swaggerUi.generateHTML(openApiSpecs, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  });
  res.send(html);
});

app.listen(4000, () => console.log("Server running on port 4000"));
