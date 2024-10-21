import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for better matchers
import MovieCard from "@/components/MovieCard";

const mockMovie = {
  title: "Test Movie",
  poster_path: "/testposter.jpg",
};

describe("MovieCard - Static Elements", () => {
  test("renders the movie card container (Box)", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        toggleWatchlist={jest.fn()}
      />
    );

    const boxElement = screen.getByRole("article");
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).toHaveStyle(`
      max-width: 500px;
      margin-bottom: 1rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    `);
  });

  test("renders the movie title", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        toggleWatchlist={jest.fn()}
      />
    );

    const titleElement = screen.getByText("Test Movie");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle(`
      font-family: "Helvetica",sans-serif;  
      text-align: left;
      font-size: 1.5rem;
    `);
  });

  test("renders the poster image", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        toggleWatchlist={jest.fn()}
      />
    );

    const posterImageElement = screen.getByRole("img");
    expect(posterImageElement).toBeInTheDocument();
    expect(posterImageElement).toHaveStyle(`
      width: 100%;
      height: auto;
      border-radius: 8px;
    `);
  });
});

describe("MovieCard - Watchlist Button", () => {
  test("renders the watchlist button with 'Zu Watchlist hinzufügen' text when not in watchlist", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        toggleWatchlist={jest.fn()}
      />
    );

    const buttonElement = screen.getByText("Zu Watchlist hinzufügen");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle(`
      background-color: #4682b4;
      color: white;
      border: none;
      border-radius: 4px;
    `);
  });

  test("renders the watchlist button with 'Von Watchlist entfernen' text when in watchlist", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={true}
        toggleWatchlist={jest.fn()}
      />
    );

    const buttonElement = screen.getByText("Von Watchlist entfernen");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle(`
      background-color: #ff6347;
      color: white;
      border: none;
      border-radius: 4px;
    `);
  });

  test("calls toggleWatchlist function when button is clicked", () => {
    const toggleWatchlistMock = jest.fn();
    render(
      <MovieCard
        movie={mockMovie}
        isInWatchlist={false}
        toggleWatchlist={toggleWatchlistMock}
      />
    );

    const buttonElement = screen.getByText("Zu Watchlist hinzufügen");
    fireEvent.click(buttonElement);

    expect(toggleWatchlistMock).toHaveBeenCalledTimes(1);
  });
});
