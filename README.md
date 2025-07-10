# 🏠 Smart Home System Frontend

> **Bachelor's Engineering Thesis Project**  
> A comprehensive web-based frontend for managing and controlling smart home devices with real-time monitoring and automation capabilities.

[![Demo](https://img.shields.io/badge/Demo-YouTube%20Shorts-red)](https://www.youtube.com/shorts/l88tk7wHQCE)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-10.7.0-orange)](https://primereact.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-cyan)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-black)](https://socket.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This Smart Home System frontend is a modern, responsive web application designed to provide comprehensive control and monitoring of various smart home devices. Built as part of a Bachelor's Engineering Thesis, it demonstrates advanced web development techniques and IoT integration patterns.

The application features a sleek, dark-themed interface with real-time device control, automation scenarios, security monitoring, and detailed analytics. It communicates with Arduino-based hardware and backend services through WebSocket connections for instant updates.

## ✨ Features

### 🎛️ Device Management
- **Smart Lighting Control** - Brightness adjustment and on/off switching
- **Heat Pump Controller** - Temperature regulation and scheduling
- **Sensor Monitoring** - Real-time environmental data tracking
- **Camera Integration** - Live video streaming and security monitoring
- **Front Gate Control** - Access management and visitor monitoring

### 🤖 Automation & Intelligence
- **Scenario Management** - Custom automation rules and triggers
- **Task Scheduling** - Automated device operations
- **Activity Monitoring** - Comprehensive system activity logs
- **Statistics Dashboard** - Usage analytics and performance metrics

### 💬 Communication & Alerts
- **Real-time Chat** - Integrated communication system
- **Alarm System** - Security alerts and notifications
- **Session Management** - Secure user authentication and timeout handling

### 📱 User Experience
- **Responsive Design** - Optimized for desktop and mobile devices
- **Dark Theme** - Modern, eye-friendly interface
- **Real-time Updates** - Instant device status synchronization
- **Intuitive Navigation** - Clean, organized dashboard layout

## 🛠️ Technologies

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **Create React App** - Development toolchain and build system

### UI/UX Libraries
- **PrimeReact 10.7.0** - Comprehensive React UI component library
- **PrimeIcons 7.0.0** - Rich icon set for consistent visual language
- **PrimeFlex 3.3.1** - CSS utility library for responsive layouts

### Styling & Design
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Tailwind Merge** - Conditional class merging utility
- **Inter Font** - Modern, readable typography
- **Custom Color Palette** - Branded design system with `larablue` accent

### Real-time Communication
- **Socket.IO Client 4.8.1** - WebSocket communication for live updates
- **Real-time Device Control** - Instant command execution and status updates

### Navigation & Routing
- **React Router DOM 6.24.0** - Client-side routing and navigation
- **Multi-page Application** - Organized route structure

### Calendar & Scheduling
- **FullCalendar 6.1.15** - Advanced calendar functionality
- **Core & DayGrid** - Comprehensive scheduling features

### Utilities & Enhancement
- **Lodash** - Utility functions for data manipulation and debouncing
- **React Transition Group** - Smooth animations and transitions
- **Querystring ES3** - URL parameter parsing

### Development & Testing
- **Testing Library** - Comprehensive testing utilities
  - Jest DOM
  - React Testing Library
  - User Event Testing
- **ESLint** - Code quality and consistency
- **Web Vitals** - Performance monitoring

## 📁 Project Structure

```
frontend-arduino/
├── public/
│   ├── certificates/      # SSL certificates
│   ├── details/          # Project documentation assets
│   ├── img/              # Static images and assets
│   └── manifest.json     # PWA configuration
├── src/
│   ├── components/       # Reusable React components
│   │   ├── dashboard-tabs/      # Dashboard tab components
│   │   ├── cameraStreamComponent.jsx
│   │   ├── chatComponent.jsx
│   │   ├── dashboard-header.jsx
│   │   ├── frontGateComponent.jsx
│   │   ├── heatPumpController.jsx
│   │   ├── scenarioComponent.jsx
│   │   ├── sensorAlarmComponent.jsx
│   │   ├── statisticCompomnent.jsx
│   │   └── tasksComponents.jsx
│   ├── pages/           # Application pages/routes
│   │   ├── home.jsx             # Landing page
│   │   ├── panel-dashboard.jsx  # Main dashboard
│   │   ├── login-app-home.jsx   # Authentication
│   │   ├── add-new-app-home.jsx # Device setup
│   │   ├── author.jsx           # Author information
│   │   ├── details.jsx          # Project details
│   │   ├── stack.jsx            # Technology stack
│   │   └── mockup.jsx           # Design mockups
│   ├── styles/          # Global styles and utilities
│   ├── scripts/         # Utility scripts
│   ├── downloads/       # Downloadable assets
│   └── icons/           # Custom icon components
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **Arduino/IoT Backend** (for full functionality)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seveneqqq/frontend-arduino.git
   cd frontend-arduino
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The optimized production build will be created in the `build/` directory.

## 📖 Usage

### Development Mode
```bash
npm start
```
- Runs the app in development mode
- Hot reload enabled for instant updates
- Open [http://localhost:3000](http://localhost:3000) to view

### Testing
```bash
npm test
```
- Launches the test runner in interactive watch mode
- Includes unit tests for components and utilities

### Production Build
```bash
npm run build
```
- Creates optimized production bundle
- Minified and optimized for deployment
- Ready for hosting on any static server

## 🧩 Components

### Core Dashboard Components
- **HeaderDashboard** - Navigation and user controls
- **DevicesTab** - Device management interface
- **ActivityTab** - System activity monitoring
- **AutomationTab** - Scenario and automation rules
- **SettingsTab** - System configuration
- **AccountTab** - User account management

### Device Control Components
- **HeatPumpController** - Temperature control interface
- **CameraStreamComponent** - Live video streaming
- **FrontGateComponent** - Access control system
- **SensorAlarmComponent** - Security monitoring

### Utility Components
- **ChatComponent** - Real-time communication
- **ScenarioComponent** - Automation management
- **StatisticComponent** - Analytics dashboard
- **TasksComponent** - Scheduled operations
- **SessionTimedOut** - Security timeout handling

## 🔧 Development

### Code Style
- **ESLint** configuration included
- **Prettier** recommended for formatting
- **React hooks** and functional components preferred
- **Tailwind CSS** for styling consistency

### Real-time Features
- WebSocket connection management
- Device state synchronization
- Live data streaming
- Instant UI updates

### Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints
- Flexible layouts with PrimeFlex

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is part of a Bachelor's Engineering Thesis. Please respect academic integrity guidelines when using or referencing this work.

## 👤 Author

**Paweł Boroń**
- Email: pawel.boron01@interia.pl
- Project: Bachelor's Engineering Thesis - Smart Home System

## 🎥 Demo

Check out the [YouTube Shorts demonstration](https://www.youtube.com/shorts/l88tk7wHQCE) to see the system in action!

---

*Built with ❤️ using React, PrimeReact, and Tailwind CSS*
