import { Calendar, Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Calendar size={32} />
              <span>EventFlow</span>
            </div>
            <p className="footer-description">
              Discover and book amazing events. Your gateway to unforgettable experiences.
            </p>
            <div className="footer-social">
              
              <a href="https://www.linkedin.com/in/hamza-mughal-50463a342/" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/HamzaMughal444" className="social-link" aria-label="Github">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Events</Link></li>
              <li><Link to="/my-tickets">My Tickets</Link></li>
              <li><Link to="/organizer">Organizer</Link></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Categories</h3>
            <ul className="footer-links">
              <li><a href="#">Conferences</a></li>
              <li><a href="#">Workshops</a></li>
              <li><a href="#">Meetups</a></li>
              <li><a href="#">Seminars</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <ul className="footer-contact">
              <li>
                <Mail size={18} />
                <span>hamzakhankh416@gmail.com</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+923141198327</span>
              </li>
              <li>
                <MapPin size={18} />
                <span>Quetta</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 EventFlow. Hamza Rauf.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
