# Microgreens Tracker App

A mobile application for tracking and managing your microgreens growing process. Built with React Native and Expo.

## Features

- **Bed Management**
  - Create and track multiple microgreens beds
  - Record sowing dates, substrate types, and expected harvest dates
  - Monitor growth progress

- **Phenological Journal**
  - Daily records of plant growth
  - Track height and moisture levels
  - Add notes and photos
  - Visual growth charts

- **Plant Library**
  - Comprehensive database of microgreens varieties
  - Growing recommendations
  - Temperature and moisture guidelines

- **Notifications**
  - Watering reminders
  - Growth check reminders
  - Harvest date notifications
  - Growing tips and advice

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd microgreens-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API URL:
```
API_URL=your_api_url_here
```

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## API Integration

The app requires a backend API with the following endpoints:

### Authentication
- POST /api/v1/register
- POST /api/v1/login

### User Profile
- GET /api/v1/user/profile
- PUT /api/v1/user/profile

### Beds Management
- POST /api/v1/beds
- GET /api/v1/beds
- GET /api/v1/beds/:id
- PUT /api/v1/beds/:id
- DELETE /api/v1/beds/:id

### Records
- POST /api/v1/beds/:id/records
- GET /api/v1/beds/:id/records
- PUT /api/v1/records/:id
- DELETE /api/v1/records/:id

### Plant Library
- GET /api/v1/plants
- GET /api/v1/plants/:id

### Notifications
- GET /api/v1/notifications
- PUT /api/v1/notifications/:id/read

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 