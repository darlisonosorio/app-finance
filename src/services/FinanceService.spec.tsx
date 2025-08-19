import BaseService from "host/BaseService";
import {
  fetchFinances,
  getFinance,
  deleteFinance,
  createFinance,
  updateFinance,
  getFinanceService
} from "./FinanceService";

jest.mock("host/BaseService");

describe("FinancesService", () => {
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

  describe("fetchFinances", () => {
    it("should call get with correct params and return data", async () => {
      const mockData = { data: ["finance1", "finance2"], meta: { page: 1, limit: 10, total: 2, totalPages: 1 } };
      mockGet.mockResolvedValue({ data: mockData });

      const result = await fetchFinances(1, 10, "rent");

      expect(mockGet).toHaveBeenCalledWith("/", { params: { page: 1, limit: 10, search: "rent" } });
      expect(result).toEqual(mockData);
    });
  });

  describe("getFinance", () => {
    it("should call get with id and return data", async () => {
      const mockFinance = { id: 1, amount: 1000 };
      mockGet.mockResolvedValue({ data: mockFinance });

      const result = await getFinance(1);

      expect(mockGet).toHaveBeenCalledWith("/1");
      expect(result).toEqual(mockFinance);
    });
  });

  describe("deleteFinance", () => {
    it("should call delete with id", async () => {
      mockDelete.mockResolvedValue({});

      await deleteFinance(2);

      expect(mockDelete).toHaveBeenCalledWith("/2");
    });
  });

  describe("createFinance", () => {
    it("should call post with financeForm and return id", async () => {
      const mockForm = { description: "Rent", amount: 1000 } as any;
      mockPost.mockResolvedValue({ status: 201, data: 42 });

      const result = await createFinance(mockForm);

      expect(mockPost).toHaveBeenCalledWith("/", mockForm);
      expect(result).toBe(42);
    });

    it("should throw error if status is not 2xx/3xx", async () => {
      const mockForm = { description: "Invalid" } as any;
      mockPost.mockResolvedValue({ status: 400, data: { message: "Invalid data" } });

      await expect(createFinance(mockForm)).rejects.toThrow("Invalid data");
    });
  });

  describe("updateFinance", () => {
    it("should call put with id and financeForm and return data", async () => {
      const mockForm = { description: "Updated" } as any;
      mockPut.mockResolvedValue({ status: 200, data: {} });

      const result = await updateFinance(5, mockForm);

      expect(mockPut).toHaveBeenCalledWith("/5", mockForm);
      expect(result).toEqual({});
    });

    it("should throw error if status is not 2xx/3xx", async () => {
      const mockForm = { description: "Invalid" } as any;
      mockPut.mockResolvedValue({ status: 500, data: { message: "Server error" } });

      await expect(updateFinance(5, mockForm)).rejects.toThrow("Server error");
    });
  });

  describe("getFinanceService", () => {
    it("should return an instance of BaseService with correct path", () => {
      const service = getFinanceService();
      expect(BaseService).toHaveBeenCalledWith("/finance");
      expect(service).toBeDefined();
    });
  });
});
