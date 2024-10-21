import React, { useState } from "react";
import styled from "styled-components";
import MovieCard from "../components/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import useLocalStorageState from "use-local-storage-state";
import { useWatchlist } from "@/hooks/useWatchlist";

// Styled components
const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  border: 1px solid #ccc;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const CenteredContainer = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
`;

const WatchlistButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.isInWatchlist ? "#ff6347" : "#4682b4")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default function HomePage() {
  const [input, setInput] = useState("");
  const { moviesData, imdbIds, netzkinoError, loading } = useMovies(input);
  const { watchlist, toggleWatchlist, inWatchlist } = useWatchlist(moviesData);

  // Render states
  if (loading) return <div>Loading data...</div>;
  if (netzkinoError) return <div>Error loading data!</div>;

  return (
    <CenteredContainer>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Suchbegriff eingeben..."
        data-testid="search-input"
      />
      <MovieGrid role="grid">
        {imdbIds.map((imdbId) =>
          moviesData[imdbId] ? (
            <div key={imdbId}>
              <MovieCard key={imdbId} movie={moviesData[imdbId]} />
              <WatchlistButton
                isInWatchlist={inWatchlist(imdbId)} // Changed prop name here
                onClick={() => toggleWatchlist(imdbId)}
              >
                {inWatchlist(imdbId)
                  ? "Von Watchlist entfernen"
                  : "Zu Watchlist hinzufügen"}
              </WatchlistButton>
            </div>
          ) : (
            <p key={imdbId}>Loading data for IMDb ID: {imdbId}...</p>
          )
        )}
      </MovieGrid>
      <h2>Your Watchlist</h2>
      <div id="watchlist-section">
        {watchlist.length === 0 ? (
          <p>Deine Watchlist ist leer</p>
        ) : (
          <MovieGrid>
            {watchlist.length === 0 ? (
              <p>Deine Watchlist ist leer</p>
            ) : (
              watchlist.map((movie) => (
                <div key={`watchlist-${movie.imdbId}`}>
                  <MovieCard key={`watchlist-${movie.imdbId}`} movie={movie} />
                  <WatchlistButton
                    isInWatchlist={true} // Always true for watchlist items
                    onClick={() => toggleWatchlist(movie.imdbId)}
                  >
                    Von Watchlist entfernen
                  </WatchlistButton>
                </div>
              ))
            )}
          </MovieGrid>
        )}
      </div>
    </CenteredContainer>
  );
}
