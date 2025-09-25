import { useState, useEffect } from 'react';
import moviesData from '../data/movies.json';

export default function Home() {
  const [movies, setMovies] = useState(moviesData);
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

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

  // Handle movie selection
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setVideoLoading(true);
    
    if (movie.locked) {
      setShowPasswordPrompt(true);
      setShowPlayer(false);
    } else {
      setShowPlayer(true);
      setShowPasswordPrompt(false);
    }
  };

  // Handle password submission
  const handlePasswordSubmit = () => {
    if (password === selectedMovie.password) {
      setShowPlayer(true);
      setShowPasswordPrompt(false);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // Close player
  const closePlayer = () => {
    setShowPlayer(false);
    setShowPasswordPrompt(false);
    setSelectedMovie(null);
    setPassword('');
    setError('');
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Movie Watcher</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search movies by title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Movie Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredMovies.length} of {moviesData.length} movies
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <div 
              key={movie.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => handleMovieSelect(movie)}
            >
              <div className="relative">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full h-48 object-cover"
                />
                {movie.locked && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Locked
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{movie.title}</h3>
                <p className="text-gray-600 text-sm">{movie.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No movies found. Try a different search or category.</p>
          </div>
        )}
      </main>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Password Required</h2>
            <p className="mb-4">This movie is locked. Please enter the password to continue.</p>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={closePlayer}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showPlayer && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
              <button
                className="text-white hover:text-gray-300"
                onClick={closePlayer}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative pt-[56.25%] bg-black">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              <video
                className="absolute inset-0 w-full h-full"
                src={selectedMovie.url}
                controls
                autoPlay
                onLoadedData={handleVideoLoaded}
              />
            </div>
            <div className="mt-4 text-white">
              <p className="mb-2"><span className="font-semibold">Category:</span> {selectedMovie.category}</p>
              <p><span className="font-semibold">Description:</span> {selectedMovie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
