# 🎫 EventHub - Event Management & Ticketing System

A modern, premium event management and ticketing platform with stunning UI/UX, built with React, Firebase, and advanced animations.

## ✨ Premium Features

### 🎨 Advanced UI/UX
- **Gradient Animations** - Smooth color transitions
- **Glassmorphism Effects** - Modern frosted glass design
- **Micro-interactions** - Hover, focus, and click animations
- **Smooth Scrolling** - Custom scrollbar with gradient
- **Loading States** - Skeleton loaders and spinners
- **Ripple Effects** - Material Design button feedback
- **Float Animations** - Subtle movement effects
- **Glow Effects** - Dynamic shadows and highlights

### 🚀 Performance
- **Optimized Animations** - 60fps smooth transitions
- **Lazy Loading** - Fast initial load
- **Responsive Design** - Mobile-first approach
- **Print Styles** - Ticket printing support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Attendee** | attendee@demo.com | demo123 |
| **Organizer** | organizer@demo.com | demo123 |

## ✨ Complete Features

### For Attendees
- ✅ Browse events with beautiful cards
- ✅ **Live Stats Dashboard** - Total, Available, Upcoming events
- ✅ **Advanced Search** - Instant filtering by name/location
- ✅ **Category Filter** - Filter by event type
- ✅ **Sort Options** - By date, popularity, or price
- ✅ **Clear Filters** - Reset all filters instantly
- ✅ **Results Counter** - See filtered results count
- ✅ Book tickets (max 2 per event)
- ✅ Generate animated QR codes
- ✅ **Download All Tickets** - Bulk download feature
- ✅ **Share Tickets** - Share via native share or clipboard
- ✅ **Ticket Filters** - All, Valid, Used, Upcoming, Past
- ✅ **Ticket Stats** - Total, Valid, Used, Upcoming counts
- ✅ View all booked tickets
- ✅ Smooth page transitions

### For Organizers
- ✅ **Premium Dashboard** - Overall statistics
- ✅ **Total Revenue Tracking** - Calculate earnings
- ✅ **Active Events Counter** - Track live events
- ✅ **Progress Bars** - Visual ticket sales progress
- ✅ Real-time statistics per event
- ✅ Animated event selection
- ✅ **Search Attendees** - Find by email or ticket ID
- ✅ **Filter by Status** - Valid or Used tickets
- ✅ **Export to CSV** - Download attendee list
- ✅ Track attendees per event
- ✅ **Enhanced Validation** - Success/Error/Warning states
- ✅ **Used At Timestamp** - Track when tickets were used
- ✅ **Keyboard Support** - Press Enter to validate
- ✅ Mark tickets as used
- ✅ Live ticket counter
- ✅ Beautiful data tables

### Smart Logic (20+ Features)
- 🚫 Login required for booking
- 🎟️ Max 2 tickets per user
- 🔢 Unique ticket IDs
- 💾 Persistent storage
- ⏰ Auto-disable expired events
- 📊 Real-time "Sold Out" status
- 🔍 **Multi-field search**
- 📁 **Category filtering**
- 🔄 **Sort by multiple criteria**
- ✅ **Advanced ticket validation**
- 📥 **Bulk download**
- 📤 **Share functionality**
- 🎯 **Filter tickets by status**
- 📊 **Live statistics**
- 💰 **Revenue calculation**
- 📈 **Progress tracking**
- 🔎 **Attendee search**
- 📋 **CSV export**
- ⏱️ **Timestamp tracking**
- 🔄 Live updates
- 🎨 Smooth animations
- ⚡ Fast performance

## 🎨 Design Highlights

### Color System
- **Primary:** Indigo (#6366f1)
- **Secondary:** Purple (#8b5cf6)
- **Accent:** Pink (#ec4899)
- **Success:** Green (#10b981)
- **Error:** Red (#ef4444)

### Animations
- Gradient text animations
- Card hover effects
- Button ripple effects
- Float animations
- Shimmer effects
- Fade in transitions
- Slide in effects
- Pulse animations
- Glow effects
- Scale transforms

### Effects
- Glassmorphism navbar
- Gradient backgrounds
- Custom scrollbar
- Smooth transitions
- Shadow effects
- Border animations
- Loading skeletons
- Hover states

## 🛠️ Tech Stack

- **React 19** - Latest version
- **React Router DOM** - Navigation
- **Firebase Auth** - Authentication
- **Firestore** - Database
- **qrcode.react** - QR generation
- **lucide-react** - Icons
- **Vite** - Build tool
- **CSS3** - Advanced animations

## 📁 Project Structure

```
src/
├── components/
│   ├── EventCard.jsx          # Animated event cards
│   ├── TicketQR.jsx           # Premium QR tickets
│   ├── Navbar.jsx             # Glassmorphism nav
│   └── ProtectedRoute.jsx     # Route protection
├── pages/
│   ├── Home.jsx               # Event listing
│   ├── EventDetails.jsx       # Event details
│   ├── MyTickets.jsx          # User tickets
│   ├── Organizer.jsx          # Dashboard
│   ├── Login.jsx              # Login page
│   └── Signup.jsx             # Signup page
├── context/
│   └── AuthContext.jsx        # Auth state
├── data/
│   └── events.js              # Event data
├── firebase.js                # Firebase config
├── App.jsx                    # Main app
└── App.css                    # Premium styles
```

## 🎯 User Experience

### Attendee Flow
1. **Sign up** - Smooth form with validation
2. **Browse** - Animated event cards
3. **Search** - Instant filtering
4. **Details** - Beautiful event page
5. **Book** - One-click booking
6. **QR Code** - Animated generation
7. **Download** - High-quality export

### Organizer Flow
1. **Login** - Premium auth page
2. **Dashboard** - Animated stats
3. **Select Event** - Smooth transitions
4. **View Stats** - Real-time data
5. **Check Attendees** - Interactive table
6. **Validate** - Instant verification
7. **Mark Used** - Status updates

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder
```

### Firebase Hosting
```bash
firebase init hosting
npm run build
firebase deploy
```

## 📝 Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

## 🎨 Premium Design Features

- ✨ Gradient animations
- 🌊 Smooth transitions
- 💫 Micro-interactions
- 🎭 Glassmorphism
- 🌈 Color gradients
- ⚡ Fast animations
- 🎪 Hover effects
- 🎨 Custom scrollbar
- 💎 Premium UI
- 🚀 Performance optimized

## 🔒 Security

- Firebase Authentication
- Protected routes
- Role-based access
- Input validation
- Secure tickets
- Error handling

## 📱 Responsive

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Print-friendly

## 🏆 Why This Stands Out

✅ **Premium UI** - Professional animations  
✅ **12+ Features** - Exceeds requirements  
✅ **Beautiful Design** - Modern aesthetics  
✅ **Smooth UX** - 60fps animations  
✅ **Production Ready** - Fully functional  
✅ **Well Documented** - Clear code  
✅ **Easy Deploy** - Multiple options  
✅ **Scalable** - Clean architecture  

## 📄 License

MIT License - Open source

---

**Built with ❤️ and premium design for the Hackathon**

🎉 **Ready to impress!**
