import BaseService from "host/BaseService";
import {
  fetchUsers,
} from "./UsersService";

jest.mock("host/BaseService");

describe("UsersService", () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (BaseService as jest.Mock).mockImplementation(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    }));
  });

  describe("fetchUsers", () => {
    it("should call get with correct params and return data", async () => {
      const mockData = {
        data: ["user1", "user2"],
        meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await fetchUsers(1, 10, "john");

      expect(mockGet).toHaveBeenCalledWith("/", {
        params: { page: 1, limit: 10, search: "john" },
      });
      expect(result).toEqual(mockData);
    });
  });
});
