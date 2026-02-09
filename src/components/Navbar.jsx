import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Ticket size={28} />
          <span>EventHub</span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          {currentUser ? (
            <>
              <Link to="/" className="nav-link" onClick={closeMenu}>Events</Link>
              {userRole === 'attendee' && (
                <Link to="/my-tickets" className="nav-link" onClick={closeMenu}>
                  <Ticket size={18} />
                  My Tickets
                </Link>
              )}
              {userRole === 'organizer' && (
                <Link to="/organizer" className="nav-link" onClick={closeMenu}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              <div className="nav-user">
                <User size={18} />
                <span>{currentUser.email}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn-secondary" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
