import { useState, useEffect } from 'react';
import moviesData from '../data/movies.json';
import Link from 'next/link';
import Popup from '../components/Popup';

export default function Home() {
  const [movies, setMovies] = useState(moviesData);
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ type: '', title: '', message: '' });

  // Get unique categories
  const categories = ['All', ...new Set(moviesData.map(movie => movie.category))];

  // Filter movies based on search query and selected category
  useEffect(() => {
    let result = moviesData;
    
    if (searchQuery) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(movie => movie.category === selectedCategory);
    }
    
    setFilteredMovies(result);
  }, [searchQuery, selectedCategory]);

  // Show welcome popup on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcomePopup(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Show notification when filters change
  useEffect(() => {
    if (searchQuery || selectedCategory !== 'All') {
      setNotification({
        type: 'info',
        title: 'Filter Applied',
        message: `Showing ${filteredMovies.length} of ${moviesData.length} movies`
      });
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [filteredMovies.length, moviesData.length, searchQuery, selectedCategory]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setNotification({
      type: 'success',
      title: 'Filters Cleared',
      message: 'Showing all movies'
    });
    setShowNotification(true);
    
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  // Handle movie click
  const handleMovieClick = (movie) => {
    if (movie.locked) {
      setNotification({
        type: 'error',
        title: 'Locked Content',
        message: 'This movie requires a password to watch'
      });
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <img src="/logo.png" alt="Movie Watcher Logo" className="logo" />
              <h1>Movie Watcher</h1>
            </div>
            <p className="site-description">Stream your favorite movies anytime, anywhere</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Features Section */}
        <div className="features">
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Unlimited Streaming
            </h3>
            <p>Watch as many movies as you want, anytime you want.</p>
          </div>
          
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              HD Quality
            </h3>
            <p>All movies are available in high definition for the best viewing experience.</p>
          </div>
          
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
            </svg>
              Secure Content
            </h3>
            <p>Some movies are password protected to ensure content security.</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button onClick={clearFilters}>Clear Filters</button>
          <button onClick={() => setShowFeaturePopup(true)}>Features</button>
        </div>

        {/* Movie Count */}
        <div className="movie-count">
          Showing {filteredMovies.length} of {moviesData.length} movies
        </div>

        {/* Movie Grid */}
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <Link key={movie.id} href={`/v/${movie.id}`} onClick={() => handleMovieClick(movie)}>
              <div className="movie-card">
                <div style={{ position: 'relative' }}>
                  <img 
                    src={movie.thumbnail} 
                    alt={movie.title} 
                  />
                  {movie.locked && (
                    <div className="locked-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                      </svg>
                      Locked
                    </div>
                  )}
                </div>
                <div className="movie-card-content">
                  <h3>{movie.title}</h3>
                  <p>{movie.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="no-movies">
            <p>No movies found. Try a different search or category.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-description">
              <p>Movie Watcher is your ultimate destination for streaming movies online. We offer a wide variety of movies across different genres, all available for instant streaming.</p>
              <p>© 2023 Movie Watcher. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Welcome Popup */}
      <Popup 
        isOpen={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)}
        title="Welcome to Movie Watcher"
      >
        <div>
          <p>Thank you for visiting Movie Watcher! Here you can stream your favorite movies anytime, anywhere.</p>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li>Browse our collection of movies</li>
            <li>Filter by category or search by title</li>
            <li>Enjoy high-quality streaming</li>
            <li>Some content may be password protected</li>
          </ul>
          <button 
            style={{ 
              marginTop: '20px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: 'var(--border-radius)', 
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={() => setShowWelcomePopup(false)}
          >
            Get Started
          </button>
        </div>
      </Popup>

      {/* Features Popup */}
      <Popup 
        isOpen={showFeaturePopup} 
        onClose={() => setShowFeaturePopup(false)}
        title="Our Features"
      >
        <div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Unlimited Streaming</h4>
            <p>Watch as many movies as you want without any limits.</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>HD Quality</h4>
            <p>All movies are available in high definition for the best viewing experience.</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Secure Content</h4>
            <p>Some movies are password protected to ensure content security.</p>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '5px', color: 'var(--primary-color)' }}>Easy Navigation</h4>
            <p>Simple and intuitive interface to find your favorite movies quickly.</p>
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
            onClick={() => setShowFeaturePopup(false)}
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
