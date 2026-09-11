import { useState, useEffect } from "react";
import { fetchWatchProviders } from "../api/tmdb";
import "./WatchProviders.css";

function WatchProviders({ movieId }) {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchProviders(movieId)
      .then(setProviders)
      .catch(() => setProviders(null))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <p className="watch-loading">Loading...</p>;

  if (!providers) return null;

  const allProviders = [...providers.flatrate, ...providers.rent, ...providers.buy];
  const uniqueProviders = Array.from(
    new Map(allProviders.map((p) => [p.provider_id, p])).values()
  );

  if (uniqueProviders.length === 0) {
    return <p className="watch-empty">No streaming info available</p>;
  }

  return (
    <div className="watch-providers">
      {uniqueProviders.slice(0, 6).map((provider) => (
        <img
          key={provider.provider_id}
          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
          alt={provider.provider_name}
          title={provider.provider_name}
          className="provider-logo"
        />
      ))}
      {providers.link && (
        <a href={providers.link} target="_blank" rel="noreferrer" className="watch-link">
          More options →
        </a>
      )}
    </div>
  );
}

export default WatchProviders;