import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { metricsService } from "./metrics.service";

const getSystemMetrics = catchAsync(async (req, res) => {
  const result = await metricsService.getSystemMetricsFromDB();

  sendResponse(res, {
    statusCode: 200,
    message: "System metrics fetched successfully",
    data: result,
  });
});

export const metricsController = {
  getSystemMetrics,
};
