# YUGI - Smart Waste Management Platform

![YUGI Logo](https://img.shields.io/badge/YUGI-Smart%20Waste%20Management-green)
![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)

YUGI is a comprehensive smart waste management platform designed specifically for Kenya. It connects residents who need waste collection services with collectors who provide pickup and disposal services, while promoting environmental sustainability through detailed tracking and community engagement.

## 🌟 Key Features

### For Residents
- **📱 Easy Pickup Requests**: Schedule waste collection with real-time pricing
- **📊 Personal Analytics**: Track waste collection, earnings, and environmental impact
- **🗺️ Interactive Map**: View nearby collectors and track pickup progress
- **📸 Report Illegal Dumping**: Help authorities by reporting unauthorized waste disposal
- **💚 Environmental Impact**: Monitor CO2 savings, recycling rates, and sustainability metrics

### For Collectors
- **🚛 Job Management**: Accept and manage pickup requests efficiently
- **📍 Real-time Navigation**: Built-in GPS navigation to pickup locations
- **💰 Earnings Tracking**: Monitor daily performance and income
- **📞 Customer Communication**: Direct communication with residents
- **📈 Performance Analytics**: Track completed jobs and collected waste

## 👥 User Roles

### 🏠 Resident
- Request waste pickup services
- Choose from 6 waste categories (Organic, Plastic, Paper, Metal, Glass, Electronic)
- Track personal environmental impact
- Report illegal dumping sites
- View analytics and collection history

### 🚚 Collector
- Browse and accept available pickup requests
- Navigate to collection locations
- Update job status in real-time
- Manage earnings and performance metrics
- Communicate with customers

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.1.0, React 18, TypeScript
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom animations
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **Maps**: GPS location services and interactive mapping
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WasteTrackerKenya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/waste_tracker
   SESSION_SECRET=your-session-secret
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📱 Application Structure

### Main Routes
- `/` - Splash screen with auto-redirect to login
- `/login` - Authentication page
- `/role-selection` - Choose between Resident or Collector
- `/resident/dashboard` - Resident home page
- `/collector/dashboard` - Collector home page
- `/map` - Interactive map view
- `/resident/request-pickup` - Schedule waste collection
- `/resident/analytics` - Personal waste statistics
- `/resident/report-dumping` - Report illegal dumping
- `/collector/active-collection` - Manage ongoing collections

### Database Schema
- **users** - User accounts with role-based access
- **pickup_requests** - Waste collection requests
- **collections** - Completed pickup transactions
- **illegal_dumping_reports** - Community reporting system
- **waste_metrics** - Environmental impact analytics

## 🌍 Environmental Impact

YUGI promotes sustainability by:
- Tracking CO2 savings from proper waste disposal
- Monitoring recycling rates and waste diversion
- Encouraging community participation in environmental protection
- Providing detailed analytics on environmental impact
- Supporting the circular economy through waste categorization

## 📊 Waste Categories

The platform supports 6 waste categories:
1. **🍃 Organic** - Food waste, garden waste
2. **🥤 Plastic** - Bottles, containers, packaging
3. **📄 Paper** - Newspapers, cardboard, documents
4. **🔧 Metal** - Cans, scrap metal, appliances
5. **🪟 Glass** - Bottles, jars, containers
6. **💻 Electronic** - E-waste, batteries, devices

## 🗺️ Location Features

- Real-time GPS tracking for collectors
- Interactive map with live updates
- Route optimization for efficient collection
- Location-based illegal dumping reports
- Distance calculation for pricing

## 💰 Pricing System

Dynamic pricing based on:
- Waste type and category
- Estimated weight
- Collection location
- Service demand
- Environmental impact factors

## 🔒 Security Features

- Secure password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation with Zod schemas
- SQL injection prevention with parameterized queries

## 📱 Mobile Responsive

- Progressive Web App (PWA) capabilities
- Mobile-first responsive design
- Touch-friendly interface
- Offline functionality for core features
- Cross-platform compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## 🌟 Demo Accounts

For testing purposes, the application includes demo accounts:
- **Demo Resident**: Quick access to resident features
- **Demo Collector**: Quick access to collector features

## 📞 Support

For support and questions:
1. Check the documentation in `/setup-local-db.md`
2. Review the debugging scripts in `/scripts/`
3. Open an issue in the repository

---

**YUGI** - Making Kenya cleaner, one pickup at a time! 🌱🇰🇪