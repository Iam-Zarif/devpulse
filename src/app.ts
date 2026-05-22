import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issues/issue.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import sendResponse from "./utils/sendResponse";
import AppError from "./utils/AppError";
import { metricsRouter } from "./modules/metrics/metrics.route";

const app: Application = express();
const allowedOrigins = [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// root route
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    message: "DevPulse API is running",
  });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use("/api/metrics", metricsRouter);

// not found route
app.use((req: Request, res: Response) => {
  throw new AppError(
    404,
    "Route not found",
    `${req.method} ${req.originalUrl} not found`,
  );
});

app.use(globalErrorHandler);

export default app;
