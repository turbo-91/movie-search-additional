import { renderHook, act } from "@testing-library/react";
import { useWatchlist } from "../hooks/useWatchlist";

// Mock useLocalStorageState manually
jest.mock("use-local-storage-state", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("useWatchlist hook", () => {
  const mockMoviesData = {
    tt1234567: { title: "Mocked Movie 1", poster_path: "/poster1.jpg" },
    tt2345678: { title: "Mocked Movie 2", poster_path: "/poster2.jpg" },
  };

  let useLocalStorageStateMock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock implementation of useLocalStorageState
    useLocalStorageStateMock = jest.fn();
    require("use-local-storage-state").default.mockImplementation(
      useLocalStorageStateMock
    );
  });

  test("should initialize with an empty watchlist", () => {
    useLocalStorageStateMock.mockReturnValue([[], jest.fn()]);

    const { result } = renderHook(() => useWatchlist(mockMoviesData));

    expect(result.current.watchlist).toEqual([]);
  });

  test("should add a movie to the watchlist", () => {
    const setWatchlistMock = jest.fn();
    useLocalStorageStateMock.mockReturnValue([[], setWatchlistMock]);

    const { result } = renderHook(() => useWatchlist(mockMoviesData));

    act(() => {
      result.current.toggleWatchlist("tt1234567");
    });

    expect(setWatchlistMock).toHaveBeenCalledWith(expect.any(Function));
    expect(setWatchlistMock).toHaveBeenCalledTimes(1);

    const expectedMovie = {
      imdbId: "tt1234567",
      title: "Mocked Movie 1",
      poster_path: "/poster1.jpg",
    };

    const watchlistUpdater = setWatchlistMock.mock.calls[0][0];
    expect(watchlistUpdater([])).toEqual([expectedMovie]);
  });

  test("should remove a movie from the watchlist", () => {
    const setWatchlistMock = jest.fn();
    const initialWatchlist = [
      {
        imdbId: "tt1234567",
        title: "Mocked Movie 1",
        poster_path: "/poster1.jpg",
      },
    ];

    useLocalStorageStateMock.mockReturnValue([
      initialWatchlist,
      setWatchlistMock,
    ]);

    const { result } = renderHook(() => useWatchlist(mockMoviesData));

    act(() => {
      result.current.toggleWatchlist("tt1234567");
    });

    expect(setWatchlistMock).toHaveBeenCalledWith(expect.any(Function));
    expect(setWatchlistMock).toHaveBeenCalledTimes(1);

    const watchlistUpdater = setWatchlistMock.mock.calls[0][0];
    expect(watchlistUpdater(initialWatchlist)).toEqual([]);
  });

  test("should return true when a movie is in the watchlist", () => {
    const initialWatchlist = [
      {
        imdbId: "tt1234567",
        title: "Mocked Movie 1",
        poster_path: "/poster1.jpg",
      },
    ];

    useLocalStorageStateMock.mockReturnValue([initialWatchlist, jest.fn()]);

    const { result } = renderHook(() => useWatchlist(mockMoviesData));

    const isInWatchlist = result.current.inWatchlist("tt1234567");

    expect(isInWatchlist).toBe(true);
  });

  test("should return false when a movie is not in the watchlist", () => {
    const initialWatchlist = [
      {
        imdbId: "tt1234567",
        title: "Mocked Movie 1",
        poster_path: "/poster1.jpg",
      },
    ];

    useLocalStorageStateMock.mockReturnValue([initialWatchlist, jest.fn()]);

    const { result } = renderHook(() => useWatchlist(mockMoviesData));

    const isInWatchlist = result.current.inWatchlist("tt2345678");

    expect(isInWatchlist).toBe(false);
  });
});
