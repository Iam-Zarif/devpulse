import AppError from "../../utils/AppError";
import type {
  CreateIssuePayload,
  IssueType,
  UpdateIssuePayload,
} from "./issue.types";

const allowedIssueTypes: IssueType[] = ["bug", "feature_request"];

const validateCreateIssuePayload = (payload: CreateIssuePayload) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new AppError(400, "Title, description and type are required");
  }

  if (title.length > 150) {
    throw new AppError(400, "Title must not exceed 150 characters");
  }

  if (description.length < 20) {
    throw new AppError(400, "Description must be at least 20 characters");
  }

  if (!allowedIssueTypes.includes(type)) {
    throw new AppError(400, "Type must be bug or feature_request");
  }
};

const validateUpdateIssuePayload = (payload: UpdateIssuePayload) => {
  const { title, description, type } = payload;

  if (!title && !description && !type) {
    throw new AppError(400, "At least one field is required to update");
  }

  if (title && title.length > 150) {
    throw new AppError(400, "Title must not exceed 150 characters");
  }

  if (description && description.length < 20) {
    throw new AppError(400, "Description must be at least 20 characters");
  }

  if (type && !allowedIssueTypes.includes(type)) {
    throw new AppError(400, "Type must be bug or feature_request");
  }
};

export const issueValidation = {
  validateCreateIssuePayload,
  validateUpdateIssuePayload,
};
