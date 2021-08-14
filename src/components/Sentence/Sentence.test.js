import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import fetchMock from "fetch-mock";

import Sentence from "./Sentence";

beforeEach(() => {
  fetchMock.restore();
});

const expectedSentence = "Gads , there is a snake in my boots";
const data = {
  inflected: expectedSentence,
  id: "666",
  base: [
    { pk: 1, category: "woof", base: "gads" },
    { pk: 1, category: "punc", base: "," },
    { pk: 1, category: "woof", base: "there" },
    { pk: 2, category: "woof", base: "is" },
    { pk: 3, category: "woof", base: "a" },
    { pk: 4, category: "whatever", base: "snake" },
    { pk: 5, category: "woof", base: "in" },
    { pk: 6, category: "woof", base: "my" },
    { pk: 7, category: "woof", base: "boots" },
  ],
  poops: "lots",
};

describe("Sentence", () => {
  it("should render a sentence", async () => {
    render(<Sentence sentence={data} />);
    expectedSentence
      .split(" ")
      .forEach((word) =>
        expect(screen.getByRole("button", { name: word })).toBeInTheDocument()
      );
  });

  it("should show sentence data", async () => {
    render(<Sentence sentence={data} />);
    expect(screen.queryByText("category")).not.toBeInTheDocument();
    expect(screen.queryByText("noun")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "snake" }));
    expect(screen.queryByText("category")).toBeInTheDocument();
  });

  it("should show sentence data", () => {
    render(<Sentence sentence={data} />);
    expect(screen.queryByText("poops")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "See sentence data" }));
    expect(screen.queryByText("poops")).toBeInTheDocument();
  });

  it("should disable the incorrect button after click", async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    render(<Sentence sentence={data} />);
    expect(screen.queryByText("Thank you!")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Is this grammatically incorrect?" })
    );
    expect(screen.queryByText("Thank you!")).toBeInTheDocument();
    expect(mockFetch).toBeCalledWith(
      "http://localhost:8000/randsense/api/v1/sentences/666/mark-incorrect/",
      { method: "POST" }
    );
  });

  it("should disable the remove button after click", async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    render(<Sentence sentence={data} />);

    expect(screen.queryByText("Thank you!")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "there" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Vote to remove this word?" })
    );
    expect(screen.queryByText("Thank you!")).toBeInTheDocument();
    expect(mockFetch).toBeCalledWith(
      "http://localhost:8000/randsense/api/v1/words/woof/1/vote-to-remove/",
      { method: "POST" }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "snake" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Vote to remove this word?" })
    );
    expect(mockFetch).toBeCalledWith(
      "http://localhost:8000/randsense/api/v1/words/whatever/4/vote-to-remove/",
      { method: "POST" }
    );
  });
});
