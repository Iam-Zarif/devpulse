import { pool } from "../../db";

const getSystemMetricsFromDB = async () => {
  const totalUsersResult = await pool.query(`
    SELECT COUNT(*)::int AS total_users
    FROM users
  `);

  const totalIssuesResult = await pool.query(`
    SELECT COUNT(*)::int AS total_issues
    FROM issues
  `);

  const statusCountResult = await pool.query(`
    SELECT status, COUNT(*)::int AS count
    FROM issues
    GROUP BY status
  `);

  const typeCountResult = await pool.query(`
    SELECT type, COUNT(*)::int AS count
    FROM issues
    GROUP BY type
  `);

  const statusSummary = {
    open: 0,
    in_progress: 0,
    resolved: 0,
  };

  statusCountResult.rows.forEach((row) => {
    statusSummary[row.status as keyof typeof statusSummary] = row.count;
  });

  const typeSummary = {
    bug: 0,
    feature_request: 0,
  };

  typeCountResult.rows.forEach((row) => {
    typeSummary[row.type as keyof typeof typeSummary] = row.count;
  });

  return {
    users: {
      total: totalUsersResult.rows[0].total_users,
    },
    issues: {
      total: totalIssuesResult.rows[0].total_issues,
      by_status: statusSummary,
      by_type: typeSummary,
    },
  };
};

export const metricsService = {
  getSystemMetricsFromDB,
};
