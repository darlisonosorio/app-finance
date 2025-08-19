import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FinancePage from "./Finances";
import * as FinanceService from "../services/FinanceService";
import { toast } from "react-toastify";

jest.mock("host/Toolbar", () => () => <div data-testid="toolbar" />);
jest.mock("host/ConfirmModal", () => ({ open, message, onConfirm }: any) =>
  open ? <div data-testid="confirm-modal" onClick={onConfirm}>{message}</div> : null
);

jest.mock("../services/FinanceService");
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: "/finances", key: "123" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe("FinancePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (FinanceService.fetchFinances as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, description: "Aluguel", value: 1000 },
        { id: 2, description: "Internet", value: 200 },
      ],
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
  });

  it("renders toolbar and finance table", async () => {
    render(<FinancePage />);
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Aluguel")).toBeInTheDocument();
      expect(screen.getByText("Internet")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
  });

  it("navigates correctly when creating or editing a finance", async () => {
    render(<FinancePage />);

    fireEvent.click(screen.getByText(/Nova Finança/i));
    expect(mockNavigate).toHaveBeenCalledWith("/finances/add");

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("edit-1"));
      expect(mockNavigate).toHaveBeenCalledWith("/finances/1");
    });
  });

  it("handles finance deletion via ConfirmModal", async () => {
    (FinanceService.deleteFinance as jest.Mock).mockResolvedValue({});

    render(<FinancePage />);
    await waitFor(() => screen.getByText("Aluguel"));

    fireEvent.click(screen.getByLabelText("delete-1"));
    const modal = screen.getByTestId("confirm-modal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent("Deseja realmente remover este item?");

    fireEvent.click(modal);
    await waitFor(() => {
      expect(FinanceService.deleteFinance).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("Finança removida.");
    });
  });

  it("handles pagination correctly", async () => {
    (FinanceService.fetchFinances as jest.Mock).mockResolvedValue({
      data: [{ id: 1, description: "Aluguel", value: 1000 }],
      meta: { page: 1, limit: 10, total: 20, totalPages: 2 },
    });

    render(<FinancePage />);
    await waitFor(() => screen.getByText("Aluguel"));

    fireEvent.click(screen.getByLabelText("next-page"));
    await waitFor(() => {
      expect(FinanceService.fetchFinances).toHaveBeenCalledWith(2, 10, "");
    });

    fireEvent.click(screen.getByLabelText("prev-page"));
    await waitFor(() => {
      expect(FinanceService.fetchFinances).toHaveBeenCalledWith(1, 10, "");
    });
  });

});
