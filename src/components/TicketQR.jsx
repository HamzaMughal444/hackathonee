import { QRCodeSVG } from 'qrcode.react';
import { Download, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

const TicketQR = ({ ticket }) => {
  const downloadTicket = () => {
    const svg = document.getElementById(`qr-${ticket.ticketId}`);
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
  };

  return (
    <div className="ticket-qr">
      <div className="ticket-header">
        <div className="ticket-logo">
          <Ticket size={32} />
          <h2>EventHub</h2>
        </div>
        <span className={`ticket-status ${ticket.status}`}>
          {ticket.status === 'valid' ? '✓ Valid' : '✗ Used'}
        </span>
      </div>

      <div className="ticket-event-info">
        <h3>{ticket.eventTitle}</h3>
        <div className="ticket-details">
          <div className="ticket-detail">
            <Calendar size={18} />
            <span>{new Date(ticket.eventDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="ticket-detail">
            <Clock size={18} />
            <span>{ticket.eventTime}</span>
          </div>
          <div className="ticket-detail">
            <MapPin size={18} />
            <span>{ticket.eventLocation}</span>
          </div>
        </div>
      </div>

      <div className="qr-container">
        <QRCodeSVG 
          id={`qr-${ticket.ticketId}`}
          value={JSON.stringify({
            ticketId: ticket.ticketId,
            eventId: ticket.eventId,
            userId: ticket.userId,
            bookedAt: ticket.bookedAt
          })}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="ticket-info">
        <div className="ticket-id">
          <span>Ticket ID</span>
          <strong>{ticket.ticketId}</strong>
        </div>
        <div className="ticket-holder">
          <span>Holder</span>
          <strong>{ticket.userEmail}</strong>
        </div>
        <div className="ticket-booked">
          <span>Booked On</span>
          <strong>{new Date(ticket.bookedAt).toLocaleDateString()}</strong>
        </div>
      </div>

      <button onClick={downloadTicket} className="btn-download">
        <Download size={18} />
        Download Ticket
      </button>
    </div>
  );
};

export default TicketQR;
