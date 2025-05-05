import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
  console.log("Running recurring transactions");
  await processRecurringTransactions();
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import goalsRoutes from "./routes/goals.routes.js";
import tagsRoutes from "./routes/tags.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import { protect } from "./middleware/auth.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
app.use(helmet()); // Use helmet to set security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "http://localhost:3030"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"], 
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "http://localhost:3030"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "data:"], // Ensure no wildcard sources
      upgradeInsecureRequests: [],
    },
  })
); // Set Content Security Policy (CSP) headers

app.use((_, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://cdn.jsdelivr.net 'sha256-ISInfOBSUWFgeTRFLf63g+rFNSswGDl15oK0iXgYM='; style-src 'self' https://stackpath.bootstrapcdn.com https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self'; frame-src 'self'"
  );
  next();
});

app.use(xss()); // Use xss-clean to sanitize user inputs
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"]; // Fallback to allow all origins
const corsOptions = {
  origin: allowedOrigins, // Allow multiple origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions)); // Use CORS with specified options

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter); // Apply rate limiting

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Connection Successful!");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", protect, transactionRoutes);
app.use("/api/budgets", protect, budgetRoutes);
app.use("/api/categories", protect, categoriesRoutes);
app.use("/api/goals", protect, goalsRoutes);
app.use("/api/tags", protect, tagsRoutes);
app.use("/api/notifications", protect, notificationRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });