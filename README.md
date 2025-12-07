# World Cup 2026 Simulator

A modern, interactive web application to simulate the expanded 48-team FIFA World Cup 2026.

## 🌟 Features

### 🏆 Playoff Simulator
- **UEFA & Intercontinental Paths**: Select winners for the 6 remaining World Cup spots.
- **Dynamic Integration**: Selected winners are automatically placed into their respective groups.

### ⚽ Group Stage
- **12 Groups (A-L)**: View all 48 teams organized in their official groups.
- **Interactive Scores**: Enter match results to see real-time updates.
- **Live Standings**: Points, Goal Difference, and Goals For are calculated instantly.
- **Visual Indicators**: Highlights for Top 2 (Green) and Best 3rd Place (Yellow) teams.

### 🚀 Knockout Stage (Full Bracket)
- **Round of 32 to Final**: Complete bracket visualization.
- **Specific Matchup Logic**: Implements the complex 3rd-place assignment rules (e.g., 1E vs 3rd Place Pool).
- **Auto-Progression**: Winners of each match automatically advance to the next round.
- **3rd Place Match**: Includes the play-off for the bronze medal.

### 🎨 UI/UX
- **Dark Theme**: Premium design inspired by the official FIFA 2026 branding.
- **Responsive**: Works on desktop and tablet sizes.
- **Animations**: Smooth transitions between tabs and hover effects.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository (or navigate to the directory):
   ```bash
   cd /path/to/CopaMundial
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the port shown in the terminal).

## 📂 Project Structure

```
src/
├── components/
│   ├── GroupStage.jsx       # Group grid and standings tables
│   ├── KnockoutBracket.jsx  # Full tournament bracket visualization
│   ├── MatchInput.jsx       # Reusable score input component
│   └── PlayoffSimulator.jsx # UI for selecting playoff winners
├── data/
│   ├── groups.js            # Initial group definitions
│   └── teams.js             # Database of all 48 teams + playoff candidates
├── utils/
│   └── simulator.js         # Core logic (Standings, Bracket Generation, 3rd Place Math)
└── App.jsx                  # Main application state and layout
```

## 📝 Usage

1. **Playoffs**: Start by selecting the 6 winners in the "Playoffs" tab.
2. **Groups**: Go to the "Groups" tab and simulate all matches.
3. **Knockout**: Switch to "Knockout" to see the qualified teams and simulate the road to the final.

---

*Developed for the World Cup 2026 Simulation Project.*
