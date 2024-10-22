import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for better matchers
import HomePage from "@/pages";
import { useMovies } from "@/hooks/useMovies";
import { useWatchlist } from "@/hooks/useWatchlist";

jest.mock("use-local-storage-state", () => {
  return jest.fn(() => [[], jest.fn()]);
});

jest.mock(
  "../components/MovieCard",
  () =>
    ({ movie, isInWatchlist, toggleWatchlist }) =>
      (
        <div>
          <p>{movie.title || "Mocked MovieCard"}</p>
          <button onClick={toggleWatchlist}>
            {isInWatchlist
              ? "Von Watchlist entfernen"
              : "Zu Watchlist hinzufügen"}
          </button>
        </div>
      )
);

jest.mock("../hooks/useMovies");
jest.mock("../hooks/useWatchlist");

describe("HomePage component with mocked useMovies and useWatchlist", () => {
  test("renders loading state correctly", () => {
    useMovies.mockReturnValue({
      moviesData: {},
      imdbIds: [],
      netzkinoError: null,
      loading: true,
    });
    useWatchlist.mockReturnValue({
      watchlist: [],
      toggleWatchlist: jest.fn(),
      inWatchlist: jest.fn(() => false),
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
    useWatchlist.mockReturnValue({
      watchlist: [],
      toggleWatchlist: jest.fn(),
      inWatchlist: jest.fn(() => false),
    });

    render(<HomePage />);
    expect(screen.getByText(/error loading data!/i)).toBeInTheDocument();
  });

  test("renders movies and watchlist button correctly", () => {
    useMovies.mockReturnValue({
      moviesData: {
        tt1234567: { title: "Mocked Movie 1", poster_path: "/poster1.jpg" },
        tt2345678: { title: "Mocked Movie 2", poster_path: "/poster2.jpg" },
      },
      imdbIds: ["tt1234567", "tt2345678"],
      netzkinoError: null,
      loading: false,
    });

    useWatchlist.mockReturnValue({
      watchlist: [],
      toggleWatchlist: jest.fn(),
      inWatchlist: jest.fn((imdbId) => imdbId === "tt1234567"),
    });

    render(<HomePage />);

    expect(screen.getByText(/Mocked Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked Movie 2/i)).toBeInTheDocument();

    expect(screen.getByText(/Von Watchlist entfernen/i)).toBeInTheDocument(); // For tt1234567
    expect(screen.getByText(/Zu Watchlist hinzufügen/i)).toBeInTheDocument(); // For tt2345678
  });

  test("handles watchlist toggling", () => {
    const toggleWatchlistMock = jest.fn();
    useMovies.mockReturnValue({
      moviesData: {
        tt1234567: { title: "Mocked Movie 1", poster_path: "/poster1.jpg" },
      },
      imdbIds: ["tt1234567"],
      netzkinoError: null,
      loading: false,
    });

    useWatchlist.mockReturnValue({
      watchlist: [],
      toggleWatchlist: toggleWatchlistMock,
      inWatchlist: jest.fn(() => false),
    });

    render(<HomePage />);

    const button = screen.getByText(/Zu Watchlist hinzufügen/i);
    fireEvent.click(button);

    expect(toggleWatchlistMock).toHaveBeenCalledWith("tt1234567");
  });

  test("renders empty watchlist message", () => {
    useMovies.mockReturnValue({
      moviesData: {},
      imdbIds: [],
      netzkinoError: null,
      loading: false,
    });

    useWatchlist.mockReturnValue({
      watchlist: [],
      toggleWatchlist: jest.fn(),
      inWatchlist: jest.fn(() => false),
    });

    render(<HomePage />);

    expect(
      screen.getByText(/Füge Filme zu deiner Watchlist hinzu/i)
    ).toBeInTheDocument();
  });

  test("renders movies in watchlist section", () => {
    useMovies.mockReturnValue({
      moviesData: {
        tt1234567: { title: "Mocked Movie 1", poster_path: "/poster1.jpg" },
      },
      imdbIds: ["tt1234567"],
      netzkinoError: null,
      loading: false,
    });

    useWatchlist.mockReturnValue({
      watchlist: [
        {
          imdbId: "tt1234567",
          title: "Mocked Movie 1",
          poster_path: "/poster1.jpg",
        },
      ],
      toggleWatchlist: jest.fn(),
      inWatchlist: jest.fn(() => true),
    });

    render(<HomePage />);

    // Check that there are two instances of "Mocked Movie 1"
    const movieTitles = screen.getAllByText(/Mocked Movie 1/i);
    expect(movieTitles).toHaveLength(2);
    expect(movieTitles[0]).toBeInTheDocument();
    expect(movieTitles[1]).toBeInTheDocument();
  });
});
