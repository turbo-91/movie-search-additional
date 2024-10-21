import useLocalStorageState from "use-local-storage-state";

export function useWatchlist(moviesData) {
  const [watchlist, setWatchlist] = useLocalStorageState("watchlist", {
    defaultValue: [],
  });

  // Toggle a movie in/out of the watchlist
  function toggleWatchlist(imdbId) {
    const movie = moviesData[imdbId];

    setWatchlist((currentWatchlist) => {
      const isMovieInWatchlist = currentWatchlist.some(
        (item) => item.imdbId === imdbId
      );

      // If the movie is in the watchlist, remove it
      if (isMovieInWatchlist) {
        return currentWatchlist.filter((item) => item.imdbId !== imdbId);
      }

      // If the movie doesn't exist in moviesData, return the current list
      if (!movie) {
        console.warn(`Movie with IMDb ID ${imdbId} not found in moviesData.`);
        return currentWatchlist;
      }

      // Otherwise, add the movie to the watchlist
      const movieDetails = {
        imdbId: imdbId,
        title: movie.title,
        poster_path: movie.poster_path,
      };

      return [...currentWatchlist, movieDetails];
    });
  }

  // Check if a movie is in the watchlist
  function inWatchlist(imdbId) {
    return watchlist.some((item) => item.imdbId === imdbId);
  }

  return { watchlist, toggleWatchlist, inWatchlist };
}
