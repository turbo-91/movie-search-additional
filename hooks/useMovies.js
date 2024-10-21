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

  // SWR data fetching for TMDB
  const { data: tmdbData, error: tmdbError } = useSWR(
    imdbIds.length > 0
      ? imdbIds.map(
          (id) =>
            `https://api.themoviedb.org/3/find/${id}?api_key=78247849b9888da02ffb1655caa3a9b9&language=de&external_source=imdb_id`
        )
      : null,
    (urls) => Promise.all(urls.map(fetcher))
  );

  // Set moviesData when TMDB data is available
  useEffect(() => {
    if (tmdbData && imdbIds.length > 0) {
      const movieDataById = {};
      imdbIds.forEach((id, index) => {
        movieDataById[id] = tmdbData[index]; // Assign results to each IMDb ID
      });
      setMoviesData(movieDataById);
    }
  }, [tmdbData, imdbIds]);

  return {
    moviesData,
    imdbIds,
    netzkinoError,
    tmdbError,
    loading:
      (!netzkinoData && debouncedInput && !netzkinoError) ||
      (!tmdbData && imdbIds.length > 0 && !tmdbError),
  };
}
