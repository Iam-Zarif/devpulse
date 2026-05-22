import { pool } from "../../db";
import AppError from "../../utils/AppError";
import type { UserRole } from "../auth/auth.types";
import type {
  CreateIssuePayload,
  IssueStatus,
  IssueType,
  UpdateIssuePayload,
} from "./issue.types";
import { issueValidation } from "./issue.validation";

const createIssueIntoDB = async (
  payload: CreateIssuePayload,
  reporterId: number,
) => {
  issueValidation.validateCreateIssuePayload(payload);

  const reporter = await pool.query(
    `
      SELECT id FROM users
      WHERE id = $1
    `,
    [reporterId],
  );

  if (reporter.rows.length === 0) {
    throw new AppError(404, "Reporter not found");
  }

  const { title, description, type } = payload;

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort = "newest", type, status } = query;

  const allowedSortValues = ["newest", "oldest"];
  const allowedTypes: IssueType[] = ["bug", "feature_request"];
  const allowedStatuses: IssueStatus[] = ["open", "in_progress", "resolved"];

  if (!allowedSortValues.includes(sort)) {
    throw new AppError(400, "Sort must be newest or oldest");
  }

  if (type && !allowedTypes.includes(type as IssueType)) {
    throw new AppError(400, "Type must be bug or feature_request");
  }

  if (status && !allowedStatuses.includes(status as IssueStatus)) {
    throw new AppError(400, "Status must be open, in_progress or resolved");
  }

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderBy = sort === "oldest" ? "ASC" : "DESC";

  const issuesResult = await pool.query(
    `
      SELECT id, title, description, type, status, reporter_id, created_at, updated_at
      FROM issues
      ${whereClause}
      ORDER BY created_at ${orderBy}
    `,
    values,
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reportersResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1::int[])
    `,
    [reporterIds],
  );

  const reporterMap = new Map();

  reportersResult.rows.forEach((reporter) => {
    reporterMap.set(reporter.id, reporter);
  });

  const formattedIssues = issues.map((issue) => {
    const reporter = reporterMap.get(issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
          }
        : null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return formattedIssues;
};

const getSingleIssueFromDB = async (issueId: number) => {
  const issueResult = await pool.query(
    `
      SELECT id, title, description, type, status, reporter_id, created_at, updated_at
      FROM issues
      WHERE id = $1
    `,
    [issueId],
  );

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter
      ? {
          id: reporter.id,
          name: reporter.name,
          role: reporter.role,
        }
      : null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueIntoDB = async (
  issueId: number,
  payload: UpdateIssuePayload,
  requesterId: number,
  requesterRole: UserRole,
) => {
  issueValidation.validateUpdateIssuePayload(payload);

  const issueResult = await pool.query(
    `
      SELECT id, reporter_id, status
      FROM issues
      WHERE id = $1
    `,
    [issueId],
  );

  if (issueResult.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  const issue = issueResult.rows[0];

  const isMaintainer = requesterRole === "maintainer";
  const isOwnIssue = Number(issue.reporter_id) === requesterId;
  const isOpenIssue = issue.status === "open";

  if (!isMaintainer && !(isOwnIssue && isOpenIssue)) {
    throw new AppError(
      403,
      "Forbidden",
      "You do not have permission to update this issue",
    );
  }

  const { title, description, type } = payload;

  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, issueId],
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (issueId: number, requesterRole: UserRole) => {
  if (requesterRole !== "maintainer") {
    throw new AppError(403, "Forbidden", "Only maintainers can delete issues");
  }

  const result = await pool.query(
    `
      DELETE FROM issues
      WHERE id = $1
      RETURNING id
    `,
    [issueId],
  );

  if (result.rows.length === 0) {
    throw new AppError(404, "Issue not found");
  }

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
