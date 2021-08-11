import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import fetchMock from "fetch-mock";

import Home from "./Home";

beforeEach(() => {
  fetchMock.restore();
});

describe("Home", () => {
  it("should render a sentence", async () => {
    const expectedSentence = ["There", "is", "a", "snake", "in", "my", "boots"];
    fetchMock.mock("end:/randsense/api/v1/sentences/", {
      inflected: expectedSentence.join(' '),
      base: [
        { inflected: "There"},
        { inflected: "is"},
        { inflected: "a"},
        { inflected: "snake"},
        { inflected: "in"},
        { inflected: "my"},
        { inflected: "boots"},
      ]
    });
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Generate sentence" }));
    await waitFor(() => {
      expectedSentence
        .forEach((word) =>
          expect(screen.getByRole("button", { name: word })).toBeInTheDocument()
        );
    });
  });

  it("should render a fetch error", async () => {
    fetchMock.mock("end:/randsense/api/v1/sentences/", { throws: "NO" });
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Generate sentence" }));
    await waitFor(() =>
      expect(screen.getByText("Error: NO")).toBeInTheDocument()
    );
  });
});
