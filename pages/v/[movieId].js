import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moviesData from '../../data/movies.json';

export default function MoviePlayer() {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      const foundMovie = moviesData.find(m => m.id === parseInt(movieId));
      if (foundMovie) {
        setMovie(foundMovie);
        if (foundMovie.locked) {
          setShowPasswordPrompt(true);
        }
      } else {
        router.push('/');
      }
    }
  }, [movieId, router]);

  const handlePasswordSubmit = () => {
    if (password === movie.password) {
      setShowPasswordPrompt(false);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  const goBack = () => {
    router.push('/');
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-player-container">
      <div className="container">
        <div className="movie-player-header">
          <div className="player-logo-container">
            <img src="/thumbnails/18+.jpg" alt="Movie Watcher Logo" className="player-logo" />
            <h1>watch anime app</h1>
          </div>
          <button className="back-button" onClick={goBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Home
          </button>
        </div>

        {showPasswordPrompt ? (
          <div className="password-prompt">
            <div className="password-prompt-content">
              <div className="prompt-logo-container">
                <img src="/logo.png" alt="Movie Watcher Logo" className="prompt-logo" />
                <h2>Password Required</h2>
              </div>
              <p>This movie is locked. Please enter the password to continue.</p>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              {error && <div className="error">{error}</div>}
              <div className="buttons">
                <button className="cancel-button" onClick={goBack}>Cancel</button>
                <button className="submit-button" onClick={handlePasswordSubmit}>Submit</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="video-container">
              {videoLoading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
              )}
              <video
                src={movie.url}
                controls
                autoPlay
                onLoadedData={handleVideoLoaded}
              />
            </div>
            <div className="movie-info">
              <h2>{movie.title}</h2>
              <div className="category">{movie.category}</div>
              <p>{movie.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
          }
