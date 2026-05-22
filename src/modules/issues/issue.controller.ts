import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }

  const result = await issueService.createIssueIntoDB(req.body, req.user.id);

  sendResponse(res, {
    statusCode: 201,
    message: "Issue created successfully",
    data: result,
  });
});

const getAllIssues = catchAsync(async (req, res) => {
  const result = await issueService.getAllIssuesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: "Issues fetched successfully",
    data: result,
  });
});

const getSingleIssue = catchAsync(async (req, res) => {
  const issueId = Number(req.params.id);

  if (!issueId) {
    throw new AppError(400, "Invalid issue id");
  }

  const result = await issueService.getSingleIssueFromDB(issueId);

  sendResponse(res, {
    statusCode: 200,
    message: "Issue fetched successfully",
    data: result,
  });
});

const updateIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }

  const issueId = Number(req.params.id);

  if (!issueId) {
    throw new AppError(400, "Invalid issue id");
  }

  const result = await issueService.updateIssueIntoDB(
    issueId,
    req.body,
    req.user.id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Issue updated successfully",
    data: result,
  });
});

const deleteIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }

  const issueId = Number(req.params.id);

  if (!issueId) {
    throw new AppError(400, "Invalid issue id");
  }

  await issueService.deleteIssueFromDB(issueId, req.user.role);

  sendResponse(res, {
    statusCode: 200,
    message: "Issue deleted successfully",
  });
});

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
