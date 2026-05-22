import { Router } from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issue.controller";

const router = Router();

router.post("/", auth, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", auth, issueController.updateIssue);
// researched about the method found that patch is required to update data not PUT 
// because PUT is used to replace the whole data but PATCH is used to update the specific field of the data.
router.delete("/:id", auth, issueController.deleteIssue);

export const issueRouter = router;
