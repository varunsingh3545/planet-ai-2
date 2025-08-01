# Planet AI - React Version

A React application featuring an interactive 3D Earth globe with AI monitoring points, built with Three.js and Tailwind CSS.

## Features

- 🌍 Interactive 3D Earth globe with realistic textures
- 🎯 Clickable AI monitoring points with detailed information
- ✨ Animated data connections between monitoring stations
- 🎨 Modern UI with Tailwind CSS styling
- 📱 Responsive design
- 🎬 Background video effects

## File Structure

```
planet-ai/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Globe.js        # Three.js globe component
│   │   ├── AIInfoCard.js   # Info card component
│   │   ├── Navbar.js       # Navigation component
│   │   └── HeroSection.js  # Hero section component
│   ├── App.js              # Main App component
│   ├── index.js            # React entry point
│   └── index.css           # Main CSS with Tailwind
├── videos/                 # Background videos
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Technologies Used

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **OrbitControls** - Camera controls

## Key Components

### Globe.js
- Complete Three.js scene setup
- Earth globe with realistic textures
- Interactive markers and data connections
- Mouse controls and raycasting

### AIInfoCard.js
- Displays information when markers are clicked
- Shows AI monitoring data and metrics
- Animated appearance/disappearance

### App.js
- Main application state management
- Coordinates between components
- Handles marker interactions

## Original vs React Version

This React version maintains **exactly the same functionality** as the original:
- Same 3D globe appearance and behavior
- Same interactive markers and data
- Same visual styling and animations
- Same background video effects

The only difference is the code is now organized in React components for better maintainability and reusability.

## Running the Application

After running `npm start`, the application will be available at `http://localhost:3000`

Click on the glowing markers on the globe to see detailed information about each AI monitoring station!