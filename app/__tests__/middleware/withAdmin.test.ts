import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import withAdmin from "../../middleware/withAdmin";

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("../../lib/firebaseUtil", () => ({
  getUser: jest.fn(),
}));

const { getUser } = require("../../lib/firebaseUtil");

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

describe("withAdmin Middleware", () => {
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

  it("should call handler when user is admin and active", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "admin@example.com", name: "Admin User" },
      expires: "2025-12-31",
    });

    mockGetUser.mockResolvedValue({
      email: "admin@example.com",
      active: true,
      admin: true,
    } as any);

    const wrappedHandler = withAdmin(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.status).not.toHaveBeenCalledWith(401);
  });

  it("should return 401 when session does not exist", async () => {
    mockGetSession.mockResolvedValue(null);

    const wrappedHandler = withAdmin(mockHandler);
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

    const wrappedHandler = withAdmin(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "user@example.com", name: "Regular User" },
      expires: "2025-12-31",
    });

    mockGetUser.mockResolvedValue({
      email: "user@example.com",
      active: true,
      admin: false,
    } as any);

    const wrappedHandler = withAdmin(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not active", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "admin@example.com", name: "Admin User" },
      expires: "2025-12-31",
    });

    mockGetUser.mockResolvedValue({
      email: "admin@example.com",
      active: false,
      admin: true,
    } as any);

    const wrappedHandler = withAdmin(mockHandler);
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

    mockGetUser.mockResolvedValue(null);

    const wrappedHandler = withAdmin(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 500 when an error occurs", async () => {
    const error = new Error("Database error");
    mockGetSession.mockResolvedValue({
      user: { email: "admin@example.com", name: "Admin User" },
      expires: "2025-12-31",
    });

    mockGetUser.mockRejectedValue(error);

    const wrappedHandler = withAdmin(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith(error);
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
