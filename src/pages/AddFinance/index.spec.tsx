import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddFinancePage from "./index";
import { toast } from "react-toastify";
import { createFinance, getFinance, updateFinance } from "../../services/FinanceService";

jest.mock("host/Toolbar", () => () => <div data-testid="toolbar" />);
jest.mock("../../services/FinanceService");
jest.mock("../../services/UsersService", () => ({
  fetchUsers: jest.fn().mockResolvedValue({ data: [{ id: 1, name: "John Doe" }] }),
}));
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("react-select/async", () => {
  return ({ onChange, value }: any) => (
    <select
      data-testid="async-select"
      value={value?.value || ""}
      onChange={(e) =>
        onChange({ value: Number(e.target.value), label: e.target.options[e.target.selectedIndex].text })
      }
    >
      <option value="1">John Doe</option>
    </select>
  );
});

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({}));
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/finances/add" }),
  useParams: () => mockUseParams(),
}));

describe("AddFinancePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits form to create a finance", async () => {
    (createFinance as jest.Mock).mockResolvedValueOnce({});

    render(<AddFinancePage />);

    fireEvent.change(screen.getByTestId("async-select"), { target: { value: "1" } });

    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Teste de finança" } });

    fireEvent.click(screen.getByTestId("btn-save"));

    await waitFor(() => {
      expect(createFinance).toHaveBeenCalledWith({
        user_id: 1,
        value: "100",
        description: "Teste de finança",
      });
      expect(toast.success).toHaveBeenCalledWith("Finança criada com sucesso!");
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("submits form to update a finance without validating user", async () => {
    const financeData = { user_id: 1, value: 200, description: "Finança existente" };
    (getFinance as jest.Mock).mockResolvedValueOnce(financeData);
    (updateFinance as jest.Mock).mockResolvedValueOnce({});

    mockUseParams.mockReturnValue({ id: "1" });

    render(<AddFinancePage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Valor/i)).toHaveValue(financeData.value);
      expect(screen.getByLabelText(/Descrição/i)).toHaveValue(financeData.description);
    });

    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: "300" } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: "Atualização de finança" } });

    fireEvent.click(screen.getByTestId("btn-save"));

    await waitFor(() => {
      expect(updateFinance).toHaveBeenCalledWith(1, {
        user_id: financeData.user_id,
        value: "300",
        description: "Atualização de finança",
      });
      expect(toast.success).toHaveBeenCalledWith("Finança atualizada com sucesso!");
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
