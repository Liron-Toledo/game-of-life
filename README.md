# Conway's Game of Life

This is a React implementation of Conway's Game of Life, a zero-player cellular automaton where the grid evolves based on predefined rules. This project offers interactive controls for managing the grid and supports light/dark themes, mobile responsiveness, and file import/export functionality.

---

## Features

- 🟦 **Dynamic Grid**: View and interact with the grid using mouse or touch.
- 🎛️ **Controls**:
  - Start/Pause the simulation.
  - Clear or randomize the grid.
  - Adjust grid size and simulation speed.
  - Navigate through simulation history with "Step Back" and "Step Forward."
- 🌗 **Theme Toggle**: Switch between light and dark themes.
- 📱 **Mobile-Friendly**: Optimized for mobile devices with responsive design.
- 📁 **Export/Import**: Save the grid state to a JSON file or load a saved grid.
- 🔔 **Notifications**: Provides feedback on actions like grid export, import, or size adjustments.

---

## Installation

To get started locally:

   ```bash
   git clone https://github.com/yourusername/conways-game-of-life.git
   cd conways-game-of-life
   npm install
   npm start
   ```
The app will be accessible at http://localhost:5173.

## Usage

### Controls
1. **Start/Pause**: Begin or pause the simulation.
2. **Clear**: Reset the grid to an empty state.
3. **Random**: Populate the grid with random alive cells.
4. **Speed**: Adjust the simulation's speed in milliseconds.
5. **Grid Size**: Resize the grid dynamically.
6. **Step Back/Forward**: Navigate through the history of grid states.
7. **Export/Import**: Save the current grid or load a previously saved grid.

### Theme Toggle
Switch between light and dark themes by clicking the 🌙/☀️ button.

### Mobile
On mobile devices, controls are accessible through a settings icon in the header. The grid occupies the full screen for a better viewing experience.

---

## Architecture

- **React**: Core library for building the UI.
- **TypeScript**: Adds type safety to the project.
- **Framer Motion**: For smooth animations (e.g., notifications).
- **react-window**: Virtualized grid rendering for optimal performance.
- **tailwindcss**: For styling and responsive design.
- **File APIs**: Used for exporting and importing grid state as JSON.

---

## Project Structure

src/
├── components/
│   ├── Cell.tsx           # Individual cell rendering
│   ├── Grid.tsx           # Main grid component
│   ├── Controls.tsx       # Sidebar and overlay controls
│   ├── Notification.tsx   # Animated notification messages
│   └── ThemeToggle.tsx    # Light/Dark mode toggle
├── utils/
│   ├── coordinate.ts      # Coordinate serialization/deserialization
│   ├── grid.ts            # Grid helper functions
│   ├── logic.ts           # Game logic for the next grid state
├── App.tsx                # Main application component
├── types.ts               # Type definitions

## Testing

This project includes jest unit tests.

### Run Tests

```bash
npm test
```

## Known Issues & Future Enhancements

- **Mobile Optimization**: While functional, there is potential for further refinement in grid interaction on touch devices.
- **Additional Features**:
  - Enable saving simulation history across sessions.
  - Add more customization options for cell colors and grid styles.
  - Implement presets for different initial configurations.