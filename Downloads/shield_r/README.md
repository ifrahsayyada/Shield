# SHIELD_R 🛡️

**Personal Safety & Emergency Response Platform**

A mobile-first web application designed to help users trigger SOS alerts, manage emergency contacts, track safe zones, and stay connected with trusted people during emergencies.

## Features

### 🚨 SOS System
- One-tap emergency alert triggering
- Automatic location capture and sharing
- Real-time status tracking
- Quick SOS resolution controls

### 📍 Location & Zones
- Live device geolocation tracking
- Safe zone identification (hospitals, police stations)
- Avoid zone warnings
- Nearby zones discovery within configurable radius
- Interactive map view with OpenStreetMap integration

### 👥 Emergency Contacts
- Add and manage trusted emergency contacts
- Set priority levels for contacts
- Relationship categorization (family, friends, colleagues, etc.)
- One-tap call/SMS functionality
- Priority-based notification system

### 📱 Mobile-First UI
- Responsive design optimized for mobile devices
- Fast, intuitive navigation
- Clean, accessible interface
- Real-time status indicators

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Lightning-fast dev server & build tool
- **Vanilla CSS** - Styling (mobile-first responsive design)
- **Fetch API** - HTTP requests to backend

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **In-memory data store** - Ephemeral session storage

### External APIs
- **Overpass API** - OSM data for nearby zone discovery
- **OpenStreetMap** - Map visualization
- **Geolocation API** - Device location capture
- **Google Maps** - Location-based services

## Getting Started

### Prerequisites
- **Node.js** (v16+)
- **npm** (v7+)
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ifrahsayyada/Shield.git
   cd Shield
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend runs on **http://localhost:5000**

#### Terminal 2 - Frontend Dev Server
```bash
cd frontend
npm run dev
```
Frontend runs on **http://localhost:5173**

### Environment Variables

#### Frontend (`.env` or Vite config)
```bash
VITE_API_URL=http://localhost:5000
```
If not set, defaults to `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### SOS Management
```
POST /sos                    # Trigger SOS (body: {lat, lng})
GET  /sos                    # Get current SOS state
POST /sos/resolve            # Clear SOS state
```

### Location Tracking
```
POST /location               # Update device location (body: {lat, lng})
GET  /location               # Retrieve stored location
```

### Emergency Contacts
```
POST /contacts               # Create contact (body: {name, phone, priority, relationship})
GET  /contacts               # Get all contacts (sorted by priority)
PUT  /contacts/:id           # Update contact
DELETE /contacts/:id         # Delete contact
```

### Safety Zones
```
GET /zones                   # Get pre-defined zones
GET /zones/nearby            # Get nearby zones (query: ?lat=X&lng=Y&radius=Z)
```

## Development Notes

- **No TypeScript** - Plain JavaScript for simplicity
- **No Database** - In-memory storage (ephemeral per session)
- **No Auth** - Public API endpoints for development
- **CORS Enabled** - Frontend can call backend from different ports
- **Nodemon** - Auto-reload backend on file changes
- **Vite HMR** - Hot module replacement for frontend

## Future Enhancements

- [ ] **Database Integration** (PostgreSQL/MongoDB)
- [ ] **User Authentication** (JWT/OAuth)
- [ ] **Real-time Notifications** (WebSockets/Push)
- [ ] **SMS/Email Alerts** (Twilio/SendGrid)
- [ ] **Mobile App** (React Native/Flutter)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/ifrahsayyada/Shield/issues)
- Email: ifrahsayyada2025@gmail.com

## Author

**Ifrah Sayyada**
- GitHub: [@ifrahsayyada](https://github.com/ifrahsayyada)
- Email: ifrahsayyada2025@gmail.com

---

**Stay Safe! 🛡️**
