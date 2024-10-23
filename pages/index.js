import React, { useState } from "react";
import styled from "styled-components";
import MovieCard from "../components/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { useWatchlist } from "@/hooks/useWatchlist";
import Head from "next/head";

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
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MovieGridContainer = styled.div`
  max-width: calc(3 * 260px);
  margin: 0 auto;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  margin: 2rem auto;
  & > div {
    padding: 0.1rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(200px, 1fr)
    ); // Adjust to smaller screens
  }
`;

const WatchlistContainer = styled.div`
  padding: 1rem;

  height: fit-content;
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; 
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  & > div {
    transform: scale(0.9); /
  }
`;

const CenteredContainer = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
`;

const Headline = styled.h2`
  font-family: Helvetica, sans-serif;
  font-size: 1.5rem;
  text-align: left;
  margin-bottom: 1rem;
`;

const StyledParagraph = styled.p`
  font-family: Helvetica, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
`;

export default function HomePage() {
  const [input, setInput] = useState("");
  const { moviesData, imdbIds, netzkinoError, tmdbError, loading } =
    useMovies(input);
  const { watchlist, toggleWatchlist, inWatchlist } = useWatchlist(moviesData);

  // Render states
  if (loading) return <div>Loading data...</div>;
  if (netzkinoError) return <div>Error loading data!</div>;
  if (tmdbError) return <div>Error loading data from TMDB!</div>;

  return (
    <CenteredContainer>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Suchbegriff eingeben..."
        data-testid="search-input"
      />
      <LayoutGrid>
        <WatchlistContainer>
          <Headline>Deine Watchlist</Headline>
          {watchlist.length === 0 ? (
            <StyledParagraph>
              Füge Filme zu deiner Watchlist hinzu
            </StyledParagraph>
          ) : (
            <WatchlistGrid>
              {watchlist.map((movie) => (
                <MovieCard
                  key={`watchlist-${movie.imdbId}`}
                  movie={movie}
                  isInWatchlist={true}
                  toggleWatchlist={() => toggleWatchlist(movie.imdbId)}
                />
              ))}
            </WatchlistGrid>
          )}
        </WatchlistContainer>
        <MovieGridContainer>
          <MovieGrid role="grid">
            {imdbIds.length === 0 ? (
              <StyledParagraph>Jetzt nach Filmen suchen</StyledParagraph>
            ) : (
              imdbIds.map((imdbId) =>
                moviesData[imdbId] ? (
                  <div key={imdbId}>
                    <MovieCard
                      movie={moviesData[imdbId]}
                      isInWatchlist={inWatchlist(imdbId)}
                      toggleWatchlist={() => toggleWatchlist(imdbId)}
                    />
                  </div>
                ) : (
                  <p key={imdbId}>Loading data for IMDb ID: {imdbId}...</p>
                )
              )
            )}
          </MovieGrid>
        </MovieGridContainer>
      </LayoutGrid>
    </CenteredContainer>
  );
}
