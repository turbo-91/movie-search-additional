import { useState, useEffect } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

// Fetcher function
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

export function useMovies(input) {
  const [debouncedInput] = useDebounce(input, 300);
  const [moviesData, setMoviesData] = useState({});
  const [imdbIds, setImdbIds] = useState([]);

  // SWR data fetching
  const { data: netzkinoData, error: netzkinoError } = useSWR(
    debouncedInput
      ? `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${debouncedInput
          .split(" ")
          .join("+")}&d=devtest`
      : null,
    fetcher
  );

  // Handle input clearing by resetting states when input is empty
  useEffect(() => {
    if (debouncedInput === "") {
      setImdbIds([]);
      setMoviesData({});
    }
  }, [debouncedInput]);

  // Extract IMDb IDs when data is fetched
  useEffect(() => {
    if (netzkinoData) {
      const imdbLinks = netzkinoData.posts
        .map((movie) => {
          const imdbLink = movie.custom_fields["IMDb-Link"][0];
          const parts = imdbLink.split("/");
          const imdbId = parts.find((part) => part.startsWith("tt"));
          return imdbId || null;
        })
        .filter(Boolean);

      setImdbIds(imdbLinks);
    }
  }, [netzkinoData]);

  // Fetch movies data from TMDB using IMDb IDs
  useEffect(() => {
    if (imdbIds.length > 0) {
      const fetchMovieData = async () => {
        const requests = imdbIds.map((id) =>
          fetch(
            `https://api.themoviedb.org/3/find/${id}?api_key=78247849b9888da02ffb1655caa3a9b9&language=de&external_source=imdb_id`
          ).then((res) => res.json())
        );

        const results = await Promise.all(requests);

        // Create the movieDataById object using forEach instead of reduce
        const movieDataById = {};
        imdbIds.forEach((id, index) => {
          movieDataById[id] = results[index]; // Assign results to each IMDb ID
        });

        setMoviesData(movieDataById); // Set the state with the new movie data object
      };

      fetchMovieData();
    }
  }, [imdbIds]);

  return {
    moviesData,
    imdbIds,
    netzkinoError,
    loading: !netzkinoData && debouncedInput && !netzkinoError,
  };
}
