import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import withAuth from "../../middleware/withAuth";

// Mock next-auth
jest.mock("next-auth/react");

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

describe("withAuth Middleware", () => {
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

  it("should call handler when session exists with user", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com", name: "Test User" },
      expires: "2025-12-31",
    });

    const wrappedHandler = withAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 401 when session does not exist", async () => {
    mockGetSession.mockResolvedValue(null);

    const wrappedHandler = withAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should return 401 when session exists but user is missing", async () => {
    mockGetSession.mockResolvedValue({
      user: null as any,
      expires: "2025-12-31",
    });

    const wrappedHandler = withAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith("Unauthorized");
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should pass the correct request to getSession", async () => {
    mockGetSession.mockResolvedValue({
      user: { email: "test@example.com" },
      expires: "2025-12-31",
    });

    const wrappedHandler = withAuth(mockHandler);
    await wrappedHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockGetSession).toHaveBeenCalledWith({ req: mockReq });
  });
});
