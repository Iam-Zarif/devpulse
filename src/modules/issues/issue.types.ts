export type IssueType = "bug" | "feature_request";

export type IssueStatus = "open" | "in_progress" | "resolved";

export type CreateIssuePayload = {
  title: string;
  description: string;
  type: IssueType;
};

export type UpdateIssuePayload = {
  title?: string;
  description?: string;
  type?: IssueType;
};
