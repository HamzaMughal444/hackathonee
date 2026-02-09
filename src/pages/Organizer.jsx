import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Ticket, CheckCircle, XCircle, Search, Download, TrendingUp, Calendar } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Organizer = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTicket, setSearchTicket] = useState('');
  const [searchAttendee, setSearchAttendee] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    const fetchAttendees = async () => {
      if (selectedEvent) {
        try {
          const q = query(
            collection(db, 'tickets'),
            where('eventId', '==', selectedEvent.id)
          );
          const querySnapshot = await getDocs(q);
          const eventAttendees = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }));
          setAttendees(eventAttendees);
        } catch (error) {
          console.error('Error fetching attendees:', error);
        }
      }
    };
    fetchAttendees();
  }, [selectedEvent]);

  const handleValidateTicket = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'tickets'),
        where('ticketId', '==', searchTicket.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setValidationResult({ valid: false, message: 'Ticket not found', type: 'error' });
        setLoading(false);
        return;
      }

      const ticketDoc = querySnapshot.docs[0];
      const ticket = { id: ticketDoc.id, ...ticketDoc.data() };

      if (ticket.status === 'used') {
        setValidationResult({ valid: false, message: 'Ticket already used', type: 'warning', ticket });
        setLoading(false);
        return;
      }

      if (selectedEvent && ticket.eventId !== selectedEvent.id) {
        setValidationResult({ valid: false, message: 'Ticket not for this event', type: 'error', ticket });
        setLoading(false);
        return;
      }

      setValidationResult({ 
        valid: true, 
        message: 'Valid ticket - Ready to use',
        type: 'success',
        ticket 
      });
    } catch (error) {
      console.error('Error validating ticket:', error);
      setValidationResult({ valid: false, message: 'Error validating ticket', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = async () => {
    if (validationResult && validationResult.valid) {
      try {
        const ticketRef = doc(db, 'tickets', validationResult.ticket.id);
        await updateDoc(ticketRef, {
          status: 'used',
          usedAt: new Date().toISOString()
        });

        setValidationResult({ 
          ...validationResult, 
          ticket: { 
            ...validationResult.ticket, 
            status: 'used',
            usedAt: new Date().toISOString()
          } 
        });
        
        // Refresh attendees list
        if (selectedEvent) {
          const q = query(
            collection(db, 'tickets'),
            where('eventId', '==', selectedEvent.id)
          );
          const querySnapshot = await getDocs(q);
          const eventAttendees = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }));
          setAttendees(eventAttendees);
        }
        
        setSearchTicket('');
      } catch (error) {
        console.error('Error marking ticket as used:', error);
        alert('Failed to mark ticket as used');
      }
    }
  };

  const exportAttendees = () => {
    const csv = [
      ['Ticket ID', 'Email', 'Booked On', 'Status', 'Used At'],
      ...attendees.map(a => [
        a.ticketId,
        a.userEmail,
        new Date(a.bookedAt).toLocaleDateString(),
        a.status,
        a.usedAt ? new Date(a.usedAt).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${selectedEvent?.title || 'event'}.csv`;
    a.click();
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.userEmail.toLowerCase().includes(searchAttendee.toLowerCase()) ||
                         attendee.ticketId.toLowerCase().includes(searchAttendee.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = selectedEvent ? {
    totalTickets: selectedEvent.totalTickets,
    bookedTickets: selectedEvent.totalTickets - selectedEvent.availableTickets,
    availableTickets: selectedEvent.availableTickets,
    usedTickets: attendees.filter(a => a.status === 'used').length,
    revenue: (selectedEvent.totalTickets - selectedEvent.availableTickets) * selectedEvent.price
  } : null;

  const overallStats = {
    totalEvents: events.length,
    totalAttendees: attendees.length,
    activeEvents: events.filter(e => new Date(e.date) > new Date()).length,
    totalRevenue: events.reduce((sum, e) => sum + ((e.totalTickets - e.availableTickets) * e.price), 0)
  };

  return (
    <div className="organizer-container">
      <div className="page-header">
        <LayoutDashboard size={32} />
        <h1>Organizer Dashboard</h1>
        <p>Manage events and validate tickets</p>
      </div>

      <div className="overall-stats">
        <div className="stat-card-large">
          <Calendar size={28} />
          <div>
            <span className="stat-number">{overallStats.totalEvents}</span>
            <span className="stat-text">Total Events</span>
          </div>
        </div>
        <div className="stat-card-large">
          <Users size={28} />
          <div>
            <span className="stat-number">{overallStats.totalAttendees}</span>
            <span className="stat-text">Total Attendees</span>
          </div>
        </div>
        <div className="stat-card-large">
          <TrendingUp size={28} />
          <div>
            <span className="stat-number">{overallStats.activeEvents}</span>
            <span className="stat-text">Active Events</span>
          </div>
        </div>
        <div className="stat-card-large">
          <Ticket size={28} />
          <div>
            <span className="stat-number">${overallStats.totalRevenue}</span>
            <span className="stat-text">Total Revenue</span>
          </div>
        </div>
      </div>

      <div className="organizer-content">
        <div className="events-sidebar">
          <h2>Your Events</h2>
          <div className="events-list">
            {events.map(event => (
              <div
                key={event.id}
                className={`event-item ${selectedEvent?.id === event.id ? 'active' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <span className="ticket-count">
                  {event.totalTickets - event.availableTickets} / {event.totalTickets} booked
                </span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((event.totalTickets - event.availableTickets) / event.totalTickets) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="organizer-main">
          {selectedEvent ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <Ticket size={24} />
                  <div>
                    <span>Total Tickets</span>
                    <strong>{stats.totalTickets}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <Users size={24} />
                  <div>
                    <span>Booked</span>
                    <strong>{stats.bookedTickets}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <CheckCircle size={24} />
                  <div>
                    <span>Used</span>
                    <strong>{stats.usedTickets}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <Ticket size={24} />
                  <div>
                    <span>Available</span>
                    <strong>{stats.availableTickets}</strong>
                  </div>
                </div>
              </div>

              <div className="ticket-validation">
                <h2>Validate Ticket</h2>
                <div className="validation-input">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Enter Ticket ID (e.g., TKT-1234567890-ABC123)"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateTicket()}
                  />
                  <button onClick={handleValidateTicket} className="btn-primary" disabled={loading}>
                    {loading ? 'Validating...' : 'Validate'}
                  </button>
                </div>

                {validationResult && (
                  <div className={`validation-result ${validationResult.type}`}>
                    {validationResult.valid ? (
                      <CheckCircle size={48} />
                    ) : (
                      <XCircle size={48} />
                    )}
                    <h3>{validationResult.message}</h3>
                    {validationResult.ticket && (
                      <div className="ticket-info">
                        <p><strong>Ticket ID:</strong> {validationResult.ticket.ticketId}</p>
                        <p><strong>Event:</strong> {validationResult.ticket.eventTitle}</p>
                        <p><strong>Holder:</strong> {validationResult.ticket.userEmail}</p>
                        <p><strong>Booked:</strong> {new Date(validationResult.ticket.bookedAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span className={`status-badge ${validationResult.ticket.status}`}>{validationResult.ticket.status}</span></p>
                        {validationResult.ticket.status === 'valid' && (
                          <button onClick={handleMarkAsUsed} className="btn-primary">
                            <CheckCircle size={18} />
                            Mark as Used
                          </button>
                        )}
                        {validationResult.ticket.usedAt && (
                          <p><strong>Used At:</strong> {new Date(validationResult.ticket.usedAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="attendees-section">
                <div className="attendees-header">
                  <h2>Attendees ({filteredAttendees.length})</h2>
                  <div className="attendees-actions">
                    <div className="search-bar-small">
                      <Search size={18} />
                      <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchAttendee}
                        onChange={(e) => setSearchAttendee(e.target.value)}
                      />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="valid">Valid</option>
                      <option value="used">Used</option>
                    </select>
                    <button className="btn-secondary" onClick={exportAttendees}>
                      <Download size={18} />
                      Export CSV
                    </button>
                  </div>
                </div>
                
                <div className="attendees-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Email</th>
                        <th>Booked On</th>
                        <th>Status</th>
                        <th>Used At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map(attendee => (
                        <tr key={attendee.ticketId}>
                          <td><code>{attendee.ticketId}</code></td>
                          <td>{attendee.userEmail}</td>
                          <td>{new Date(attendee.bookedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${attendee.status}`}>
                              {attendee.status}
                            </span>
                          </td>
                          <td>{attendee.usedAt ? new Date(attendee.usedAt).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <LayoutDashboard size={64} />
              <h2>Select an Event</h2>
              <p>Choose an event from the sidebar to view details and manage attendees</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organizer;
