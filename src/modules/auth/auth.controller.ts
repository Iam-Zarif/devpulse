import { authService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const signupUser = catchAsync(async (req, res) => {
  const result = await authService.signupUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserFromDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

export const authController = {
  signupUser,
  loginUser,
};
