import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for better matchers
import HomePage from "@/pages";
import { useMovies } from "@/hooks/useMovies";

jest.mock("../components/MovieCard", () => ({ movie }) => (
  <div>{movie[0]?.title || "Mocked MovieCard"}</div>
));

jest.mock("../hooks/useMovies");

describe("HomePage component with mocked useMovies", () => {
  test("renders loading state correctly", () => {
    useMovies.mockReturnValue({
      moviesData: {},
      imdbIds: [],
      netzkinoError: null,
      loading: true,
    });

    render(<HomePage />);
    expect(screen.getByText(/loading data.../i)).toBeInTheDocument();
  });

  test("renders error state correctly", () => {
    useMovies.mockReturnValue({
      moviesData: {},
      imdbIds: [],
      netzkinoError: "Error loading data!",
      loading: false,
    });

    render(<HomePage />);
    expect(screen.getByText(/error loading data!/i)).toBeInTheDocument();
  });

  test("renders movies when data is available", () => {
    useMovies.mockReturnValue({
      moviesData: {
        tt1234567: [{ title: "Mocked Movie 1", poster_path: "/poster1.jpg" }],
        tt2345678: [{ title: "Mocked Movie 2", poster_path: "/poster2.jpg" }],
      },
      imdbIds: ["tt1234567", "tt2345678"],
      netzkinoError: null,
      loading: false,
    });

    render(<HomePage />);

    expect(screen.getByText(/Mocked Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked Movie 2/i)).toBeInTheDocument();
  });
});

describe("HomePage static elements", () => {
  test("renders the input field", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders the input field with correct styles", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement).toHaveStyle(`
        padding: 0.5rem;
        border-radius: 4px;
        width: 100%;
        max-width: 600px;
        margin: 1rem auto;
        border: 1px solid #ccc;
      `);
  });

  test("renders the centered container", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    const containerElement = inputElement.closest("div");
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveStyle(`
        text-align: center;
        max-width: 1200px;
        margin: auto;
        padding: 1rem;
      `);
  });

  test("renders the movie grid container", () => {
    render(<HomePage />);
    const movieGridElement = screen.getByRole("grid");
    expect(movieGridElement).toBeInTheDocument();
    expect(movieGridElement).toHaveStyle(`
        display: grid;
        gap: 1rem;
        max-width: 1200px;
        margin: 2rem auto;
      `);
  });
});
