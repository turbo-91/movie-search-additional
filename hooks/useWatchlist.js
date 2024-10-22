import useLocalStorageState from "use-local-storage-state";

export function useWatchlist(moviesData) {
  const [watchlist, setWatchlist] = useLocalStorageState("watchlist", {
    defaultValue: [],
  });

  function inWatchlist(imdbId) {
    return watchlist.some((item) => item.imdbId === imdbId);
  }

  function toggleWatchlist(imdbId) {
    const movie = moviesData[imdbId];

    setWatchlist((currentWatchlist) => {
      if (inWatchlist(imdbId)) {
        return currentWatchlist.filter((item) => item.imdbId !== imdbId);
      }

      // If the movie doesn't exist in moviesData, return the current list
      if (!movie) {
        console.warn(`Movie with IMDb ID ${imdbId} not found in moviesData.`);
        return currentWatchlist;
      }

      // Add the movie to the watchlist
      const movieDetails = {
        imdbId: imdbId,
        title: movie.title,
        poster_path: movie.poster_path,
      };

      return [...currentWatchlist, movieDetails];
    });
  }

  return { watchlist, toggleWatchlist, inWatchlist };
}
