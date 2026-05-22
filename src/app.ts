import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import sendResponse from "./utils/sendResponse";

const app: Application = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// root route
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    message: "DevPulse API is running",
  });
});

// future routes
app.use("/api/auth", authRouter);
// app.use("/api/issues", issueRouter);
// app.use("/api/metrics", metricsRouter);

app.use(globalErrorHandler);

export default app;
