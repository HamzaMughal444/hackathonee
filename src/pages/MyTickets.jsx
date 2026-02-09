import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TicketQR from '../components/TicketQR';
import { Ticket as TicketIcon, Download, Share2, Filter } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const MyTickets = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, 'tickets'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const userTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTickets(userTickets);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [currentUser]);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'valid') return ticket.status === 'valid';
    if (filter === 'used') return ticket.status === 'used';
    if (filter === 'upcoming') return new Date(ticket.eventDate) > new Date();
    if (filter === 'past') return new Date(ticket.eventDate) < new Date();
    return true;
  });

  const downloadAllTickets = () => {
    tickets.forEach((ticket, index) => {
      setTimeout(() => {
        const svg = document.getElementById(`qr-${ticket.ticketId}`);
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            
            const downloadLink = document.createElement('a');
            downloadLink.download = `ticket-${ticket.ticketId}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
          };
          
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
      }, index * 500);
    });
  };

  const shareTicket = async (ticket) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.eventTitle}`,
          text: `My ticket for ${ticket.eventTitle} on ${new Date(ticket.eventDate).toLocaleDateString()}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      const text = `Ticket ID: ${ticket.ticketId}\nEvent: ${ticket.eventTitle}\nDate: ${new Date(ticket.eventDate).toLocaleDateString()}`;
      navigator.clipboard.writeText(text);
      alert('Ticket details copied to clipboard!');
    }
  };

  const stats = {
    total: tickets.length,
    valid: tickets.filter(t => t.status === 'valid').length,
    used: tickets.filter(t => t.status === 'used').length,
    upcoming: tickets.filter(t => new Date(t.eventDate) > new Date()).length
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="my-tickets-container">
      <div className="page-header">
        <TicketIcon size={32} />
        <h1>My Tickets</h1>
        <p>View and manage your booked tickets</p>
      </div>

      {tickets.length > 0 && (
        <>
          <div className="tickets-stats">
            <div className="ticket-stat">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tickets</span>
            </div>
            <div className="ticket-stat">
              <span className="stat-value">{stats.valid}</span>
              <span className="stat-label">Valid</span>
            </div>
            <div className="ticket-stat">
              <span className="stat-value">{stats.used}</span>
              <span className="stat-label">Used</span>
            </div>
            <div className="ticket-stat">
              <span className="stat-value">{stats.upcoming}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          <div className="tickets-actions">
            <div className="filter-tabs">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All ({tickets.length})
              </button>
              <button 
                className={filter === 'valid' ? 'active' : ''} 
                onClick={() => setFilter('valid')}
              >
                Valid ({stats.valid})
              </button>
              <button 
                className={filter === 'used' ? 'active' : ''} 
                onClick={() => setFilter('used')}
              >
                Used ({stats.used})
              </button>
              <button 
                className={filter === 'upcoming' ? 'active' : ''} 
                onClick={() => setFilter('upcoming')}
              >
                Upcoming ({stats.upcoming})
              </button>
            </div>
            
            <button className="btn-primary" onClick={downloadAllTickets}>
              <Download size={18} />
              Download All
            </button>
          </div>
        </>
      )}

      {filteredTickets.length > 0 ? (
        <div className="tickets-grid">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="ticket-wrapper">
              <TicketQR ticket={ticket} />
              <button 
                className="btn-share" 
                onClick={() => shareTicket(ticket)}
                title="Share ticket"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          ))}
        </div>
      ) : tickets.length > 0 ? (
        <div className="no-tickets">
          <Filter size={64} />
          <h2>No tickets in this category</h2>
          <p>Try selecting a different filter</p>
          <button className="btn-primary" onClick={() => setFilter('all')}>
            Show All Tickets
          </button>
        </div>
      ) : (
        <div className="no-tickets">
          <TicketIcon size={64} />
          <h2>No Tickets Yet</h2>
          <p>You haven't booked any tickets. Browse events and book your first ticket!</p>
          <a href="/" className="btn-primary">
            Browse Events
          </a>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
