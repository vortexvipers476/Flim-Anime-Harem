import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moviesData from '../../data/movies.json';
import Popup from '../../components/Popup';

export default function MoviePlayer() {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ type: '', title: '', message: '' });

  useEffect(() => {
    if (movieId) {
      const foundMovie = moviesData.find(m => m.id === parseInt(movieId));
      if (foundMovie) {
        setMovie(foundMovie);
        // Set first episode as default
        setCurrentEpisode(foundMovie.episodes[0]);
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
      setNotification({
        type: 'success',
        title: 'Access Granted',
        message: 'Enjoy watching the movie!'
      });
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setError('Incorrect password');
      setNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'The password you entered is incorrect'
      });
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoading(false);
    setNotification({
      type: 'success',
      title: 'Video Loaded',
      message: 'Your episode is ready to watch'
    });
    setShowNotification(true);
    
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  const goBack = () => {
    router.push('/');
  };

  const handleVideoError = () => {
    setNotification({
      type: 'error',
      title: 'Video Error',
      message: 'Unable to load the video. Please try again later.'
    });
    setShowNotification(true);
    
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  const selectEpisode = (episode) => {
    setCurrentEpisode(episode);
    setVideoLoading(true);
  };

  if (!movie) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="movie-player-container">
      <div className="container">
        <div className="movie-player-header">
          <div className="player-logo-container">
            <h1>{movie.title}</h1>
          </div>
          <div>
            <button className="back-button" onClick={goBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Home
            </button>
            <button 
              className="back-button" 
              style={{ marginLeft: '10px' }} 
              onClick={() => setShowInfoPopup(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Info
            </button>
          </div>
        </div>

        {showPasswordPrompt ? (
          <div className="password-prompt">
            <div className="password-prompt-content">
              <div className="prompt-logo-container">
                <h2>Password Required</h2>
              </div>
              <p>This series is locked. Please enter the password to continue.</p>
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
                  <div className="loading-spinner"></div>
                </div>
              )}
              {currentEpisode && (
                <video
                  src={currentEpisode.url}
                  controls
                  autoPlay
                  onLoadedData={handleVideoLoaded}
                  onError={handleVideoError}
                />
              )}
            </div>
            
            <div className="episode-info">
              <h2>{currentEpisode ? currentEpisode.title : 'Select an episode'}</h2>
              <div className="episode-meta">
                <span className="category">{movie.category}</span>
                {currentEpisode && (
                  <span className="duration">{currentEpisode.duration}</span>
                )}
              </div>
              <p>{movie.description}</p>
            </div>
            
            <div className="episodes-list">
              <h3>Episodes</h3>
              <div className="episodes-grid">
                {movie.episodes.map(episode => (
                  <div 
                    key={episode.id} 
                    className={`episode-card ${currentEpisode && currentEpisode.id === episode.id ? 'active' : ''}`}
                    onClick={() => selectEpisode(episode)}
                  >
                    <div className="episode-number">EP {episode.id}</div>
                    <div className="episode-details">
                      <h4>{episode.title}</h4>
                      <span className="episode-duration">{episode.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button 
                className="back-button" 
                onClick={() => setShowInfoPopup(true)}
              >
                More Information
              </button>
            </div>
          </>
        )}
      </div>

      {/* Movie Info Popup */}
      <Popup 
        isOpen={showInfoPopup} 
        onClose={() => setShowInfoPopup(false)}
        title={movie.title}
      >
        <div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Category</h4>
            <p>{movie.category}</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Description</h4>
            <p>{movie.description}</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Episodes</h4>
            <p>{movie.episodes.length} episodes available</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Status</h4>
            <p>{movie.locked ? 'Password Protected' : 'Publicly Available'}</p>
          </div>
          <button 
            style={{ 
              marginTop: '10px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: 'var(--border-radius)', 
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={() => setShowInfoPopup(false)}
          >
            Close
          </button>
        </div>
      </Popup>

      {/* Notification */}
      {showNotification && (
        <div className={`notification-popup ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            {notification.type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            {notification.type === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
    }
