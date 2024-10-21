import React from "react";
import styled from "styled-components";

const Box = styled.div`
  max-width: 500px;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  // Responsive styles
  @media (max-width: 768px) {
    max-width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 80%;
  }

  @media (min-width: 1025px) {
    max-width: 500px;
  }
`;

const Title = styled.h3`
  font-family: "Helvetica", sans-serif;
  text-align: left;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;

  // Responsive styles
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;

  // Responsive styles
  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }

  @media (min-width: 1025px) {
    width: 100%;
  }
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

const MovieCard = ({ movie, isInWatchlist, toggleWatchlist }) => {
  const movieTitle = movie?.title || "Unknown";
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "Kein Poster verfügbar";

  return (
    <Box role="article">
      <Title>{movieTitle}</Title>
      <PosterImage src={posterUrl} alt={movieTitle} />
      <WatchlistButton isInWatchlist={isInWatchlist} onClick={toggleWatchlist}>
        {isInWatchlist ? "Von Watchlist entfernen" : "Zu Watchlist hinzufügen"}
      </WatchlistButton>
    </Box>
  );
};

export default MovieCard;
