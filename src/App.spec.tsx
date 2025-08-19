import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./Routes", () => () => <div>Mocked AppRoutes</div>);

describe("App", () => {
  it("should render AppRoutes inside BrowserRouter", () => {
    render(<App />);

    expect(screen.getByText("Mocked AppRoutes")).toBeInTheDocument();
  });
});
