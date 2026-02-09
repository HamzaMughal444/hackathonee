import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Users, Ticket, AlertCircle } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [event, setEvent] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const foundEvent = events.find(e => e.id === parseInt(id));
    setEvent(foundEvent);
  }, [id]);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (currentUser && event) {
        try {
          const q = query(
            collection(db, 'tickets'),
            where('userId', '==', currentUser.uid),
            where('eventId', '==', parseInt(id))
          );
          const querySnapshot = await getDocs(q);
          const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserTickets(tickets);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
    };
    fetchUserTickets();
  }, [currentUser, event, id]);

  const handleBookTicket = async () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please login to book tickets' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (userRole !== 'attendee') {
      setMessage({ type: 'error', text: 'Only attendees can book tickets' });
      return;
    }

    if (userTickets.length >= 2) {
      setMessage({ type: 'error', text: 'Maximum 2 tickets per user allowed' });
      return;
    }

    if (event.availableTickets <= 0) {
      setMessage({ type: 'error', text: 'Event is sold out' });
      return;
    }

    if (new Date(event.date) < new Date()) {
      setMessage({ type: 'error', text: 'Event has expired' });
      return;
    }

    setLoading(true);

    try {
      const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Save to Firestore
      await addDoc(collection(db, 'tickets'), {
        ticketId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        bookedAt: new Date().toISOString(),
        status: 'valid'
      });

      // Update local events
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = events.map(e => 
        e.id === event.id ? { ...e, availableTickets: e.availableTickets - 1 } : e
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvent({ ...event, availableTickets: event.availableTickets - 1 });

      setMessage({ type: 'success', text: 'Ticket booked successfully!' });
      setTimeout(() => navigate('/my-tickets'), 2000);
    } catch (error) {
      console.error('Error booking ticket:', error);
      setMessage({ type: 'error', text: 'Failed to book ticket. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="loading">Loading...</div>;

  const isExpired = new Date(event.date) < new Date();
  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="event-details-container">
      <div className="event-details-image">
        <img src={event.image} alt={event.title} />
      </div>

      <div className="event-details-content">
        <div className="event-details-header">
          <span className="event-category">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="event-organizer">Organized by {event.organizer}</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <AlertCircle size={18} />
            <span>{message.text}</span>
          </div>
        )}

        <div className="event-info-grid">
          <div className="info-card">
            <Calendar size={24} />
            <div>
              <span>Date</span>
              <strong>{new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</strong>
            </div>
          </div>

          <div className="info-card">
            <Clock size={24} />
            <div>
              <span>Time</span>
              <strong>{event.time}</strong>
            </div>
          </div>

          <div className="info-card">
            <MapPin size={24} />
            <div>
              <span>Location</span>
              <strong>{event.location}</strong>
            </div>
          </div>

          <div className="info-card">
            <Users size={24} />
            <div>
              <span>Available Tickets</span>
              <strong>{event.availableTickets} / {event.totalTickets}</strong>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <div className="event-booking">
          <div className="booking-price">
            <span>Price</span>
            <strong>{event.price === 0 ? 'FREE' : `$${event.price}`}</strong>
          </div>
          <button 
            onClick={handleBookTicket}
            className={`btn-book ${(isSoldOut || isExpired || loading) ? 'btn-disabled' : ''}`}
            disabled={isSoldOut || isExpired || loading}
          >
            <Ticket size={20} />
            {loading ? 'Booking...' : isSoldOut ? 'Sold Out' : isExpired ? 'Event Expired' : 'Book Ticket'}
          </button>
        </div>

        {userTickets.length > 0 && (
          <div className="user-tickets-info">
            <p>You have booked {userTickets.length} ticket(s) for this event</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
