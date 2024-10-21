import { render, waitFor } from "@testing-library/react";
import { useMovies } from "../hooks/useMovies";

const TestComponent = ({ input }) => {
  const { moviesData, imdbIds, netzkinoError, loading } = useMovies(input);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {netzkinoError && (
        <div>Error: {netzkinoError.message || netzkinoError}</div>
      )}
      {imdbIds.length > 0 &&
        imdbIds.map((id) => (
          <div key={id}>{moviesData[id]?.[0]?.title || id}</div>
        ))}
    </div>
  );
};

global.fetch = jest.fn();

describe("useMovies hook - Fetching TMDB Data", () => {
  beforeEach(() => {
    // Clear any previous mock calls
    fetch.mockClear();
  });

  test("fetches TMDB data and renders movie titles based on IMDb IDs", async () => {
    // Step 1: Mock the Netzkino API response to return IMDb IDs
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        posts: [
          {
            custom_fields: {
              "IMDb-Link": ["https://www.imdb.com/title/tt1234567/"],
            },
          },
        ],
      }),
    });

    // Step 2: Mock the TMDB API response to return movie details based on the fetched IMDb ID
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        movie_results: [
          { title: "Mocked Movie 1", poster_path: "/poster1.jpg" },
        ],
      }),
    });

    // Loading and Title are rendered in the test component
    const { getByText, queryByText } = render(<TestComponent input="movie" />);
    expect(getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(getByText("Mocked Movie 1")).toBeInTheDocument();
    });
  });
});
