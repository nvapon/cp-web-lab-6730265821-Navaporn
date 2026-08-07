import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { GreetForm } from "@/components/greet-form";

describe("GreetForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the greeting form", () => {
    render(<GreetForm />);

    expect(
      screen.getByRole("heading", { name: "Say hello" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Student ID and name")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Get greeting" }),
    ).toBeInTheDocument();
  });

  it("submits the name and displays the greeting", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Hello, 6612345621 Ann!",
      }),
    });

    render(<GreetForm />);

    fireEvent.change(screen.getByLabelText("Student ID and name"), {
      target: { value: "6612345621 Ann" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Get greeting" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Hello, 6612345621 Ann!",
      );
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/greet?name=6612345621%20Ann",
    );
  });

  it("shows an error when the request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<GreetForm />);

    fireEvent.click(screen.getByRole("button", { name: "Get greeting" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong. Please try again.",
      );
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/greet");
  });
});
