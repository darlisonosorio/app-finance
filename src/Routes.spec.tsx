import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./Routes";

jest.mock("./pages/Finances", () => () => <div>Mocked Finances Page</div>);
jest.mock("./pages/AddFinance", () => () => <div>Mocked AddFinance Page</div>);

describe("AppRoutes (Finances)", () => {
  it("should render Finances page at '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked Finances Page")).toBeInTheDocument();
  });

  it("should render AddFinance page at '/add'", () => {
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked AddFinance Page")).toBeInTheDocument();
  });

  it("should render AddFinance page at '/:id'", () => {
    render(
      <MemoryRouter initialEntries={["/123"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked AddFinance Page")).toBeInTheDocument();
  });
});
