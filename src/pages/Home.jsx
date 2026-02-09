import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { events as initialEvents } from '../data/events';
import { Search, Filter, Calendar, TrendingUp, Users } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [stats, setStats] = useState({ total: 0, available: 0, upcoming: 0 });

  useEffect(() => {
    // Load events from localStorage or use initial data
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(initialEvents);
      localStorage.setItem('events', JSON.stringify(initialEvents));
    }
  }, []);

  useEffect(() => {
    // Calculate stats
    const total = events.length;
    const available = events.filter(e => e.availableTickets > 0).length;
    const upcoming = events.filter(e => new Date(e.date) > new Date()).length;
    setStats({ total, available, upcoming });
  }, [events]);

  const categories = ['all', ...new Set(events.map(event => event.category))];

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'popular':
          return (b.totalTickets - b.availableTickets) - (a.totalTickets - a.availableTickets);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('date');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Discover Amazing Events</h1>
        <p>Book tickets for conferences, concerts, workshops and more</p>
        
        {/* Stats Cards */}
        <div className="stats-overview">
          <div className="stat-box">
            <Calendar size={24} />
            <div>
              <span>{stats.total}</span>
              <p>Total Events</p>
            </div>
          </div>
          <div className="stat-box">
            <TrendingUp size={24} />
            <div>
              <span>{stats.available}</span>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-box">
            <Users size={24} />
            <div>
              <span>{stats.upcoming}</span>
              <p>Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events by name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>

        <div className="category-filter">
          <Filter size={20} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-filter">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="popular">Most Popular</option>
            <option value="price">Price</option>
          </select>
        </div>

        {(searchTerm || selectedCategory !== 'all' || sortBy !== 'date') && (
          <button className="btn-clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-info">
        <p>Showing {filteredEvents.length} of {events.length} events</p>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events">
            <Search size={64} />
            <h2>No events found</h2>
            <p>Try adjusting your search or filters</p>
            <button className="btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
