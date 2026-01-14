import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import withActiveAuth from "../../middleware/withActiveAuth";

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("../../lib/firebaseUtil", () => ({
  getUser: jest.fn(),
  checkAdmin: jest.fn(),
}));

const { getUser, checkAdmin } = require("../../lib/firebaseUtil");

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockCheckAdmin = checkAdmin as jest.MockedFunction<typeof checkAdmin>;

describe("withActiveAuth Middleware", () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockHandler = jest.fn();
    jest.clearAllMocks();
  });

  it("should call handler when user is active", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "Active User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockResolvedValue(false);
    mockGetUser.mockResolvedValue({
      email: "user@example.com",
      active: true,
    } as any);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.status).not.toHaveBeenCalledWith(401);
  });

  it("should call handler when no admin exists (bypass check)", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockResolvedValue(true);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it("should return 401 when session does not exist", async () => {
    mockGetSession.mockResolvedValue(null);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when session user has no email", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: null, name: "Test User" } as any,
      expires: "2025-12-31",
    });

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not active", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "Inactive User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockResolvedValue(false);
    mockGetUser.mockResolvedValue({
      email: "user@example.com",
      active: false,
    } as any);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when user does not exist", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "nonexistent@example.com", name: "Non-existent User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockResolvedValue(false);
    mockGetUser.mockResolvedValue(null);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 500 when an error occurs", async () => {
    const error = new Error("Database error");
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockRejectedValue(error);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith(error);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should check for admin existence before checking user active status", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "User" },
      expires: "2025-12-31",
    });

    mockCheckAdmin.mockResolvedValue(true);

    const wrappedHandler = withActiveAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockCheckAdmin).toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalled();
  });
});
