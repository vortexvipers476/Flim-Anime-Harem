import { useState, useEffect } from 'react';
import moviesData from '../data/movies.json';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState(moviesData);
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="container">
          <h1>Movie Watcher</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
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
        </div>

        {/* Movie Count */}
        <div className="movie-count">
          Showing {filteredMovies.length} of {moviesData.length} movies
        </div>

        {/* Movie Grid */}
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <Link key={movie.id} href={`/v/${movie.id}`}>
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
    </div>
  );
                    }
