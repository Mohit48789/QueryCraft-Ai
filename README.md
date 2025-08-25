# 🤖 AI-Powered SQL Query Generator

A beautiful, intelligent SQL query generator that converts natural language descriptions into optimized SQL queries. Built with React, TypeScript, TailwindCSS, and Framer Motion with AI integration for seamless query generation.

## ✨ Features

### 🎯 Supported Algorithms
- **First Come First Serve (FCFS)** - Simple, non-preemptive scheduling
- **Shortest Job First (SJF)** - Both preemptive and non-preemptive versions
- **Priority Scheduling** - Both preemptive and non-preemptive versions
- **Round Robin** - Time quantum-based scheduling

### 🎨 Beautiful UI/UX
- **Modern Design** - Glassmorphism and neumorphism effects
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Layout** - Works perfectly on all devices
- **Interactive Gantt Chart** - Real-time process visualization
- **Color-coded Processes** - Easy identification and tracking

### 📊 Comprehensive Results
- **Gantt Chart Visualization** - Animated process execution timeline
- **Performance Metrics** - Turnaround time, waiting time, CPU utilization
- **Detailed Tables** - Complete process information and statistics
- **Algorithm Information** - Advantages, disadvantages, and complexity

### 🔧 Advanced Features
- **Real-time Validation** - Input validation with helpful error messages
- **Sample Data Loading** - Pre-configured examples for quick testing
- **Reset Functionality** - Clear all data and start fresh
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom animations
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for beautiful icons
- **Build Tool**: Create React App with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cpu-scheduling-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

## 📖 Usage Guide

### Adding Processes
1. **Enter Process Details**:
   - Process ID (e.g., P1, P2)
   - Arrival Time (when process arrives)
   - Burst Time (execution time needed)
   - Priority (for priority-based algorithms)

2. **Select Algorithm**:
   - Choose from the dropdown menu
   - For Round Robin, set the time quantum

3. **Calculate Results**:
   - Click "Calculate Scheduling" button
   - Watch the beautiful animations!

### Understanding Results

#### Gantt Chart
- **Horizontal bars** represent process execution
- **Color-coded** processes for easy identification
- **Time scale** shows execution timeline
- **Preemptive indicators** show context switches

#### Performance Metrics
- **Turnaround Time**: Total time from arrival to completion
- **Waiting Time**: Time spent waiting in ready queue
- **CPU Utilization**: Percentage of CPU time used
- **Average Times**: Statistical analysis of performance

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── InputForm.tsx   # Process input and algorithm selection
│   ├── GanttChart.tsx  # Animated Gantt chart visualization
│   └── ResultTable.tsx # Results and metrics display
├── algorithms/         # CPU scheduling algorithms
│   ├── fcfs.ts        # First Come First Serve
│   ├── sjfPreemptive.ts
│   ├── sjfNonPreemptive.ts
│   ├── priorityPreemptive.ts
│   ├── priorityNonPreemptive.ts
│   ├── roundRobin.ts  # Round Robin with time quantum
│   └── index.ts       # Algorithm dispatcher
├── types/             # TypeScript type definitions
│   └── index.ts       # Interfaces and types
├── utils/             # Utility functions
│   └── index.ts       # Helper functions and validation
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## 🎯 Algorithm Implementations

### First Come First Serve (FCFS)
- **Type**: Non-preemptive
- **Complexity**: O(n)
- **Logic**: Processes are executed in order of arrival
- **Advantages**: Simple, no starvation
- **Disadvantages**: Poor performance, high waiting time

### Shortest Job First (SJF)
- **Type**: Both preemptive and non-preemptive
- **Complexity**: O(n²)
- **Logic**: Process with shortest burst time executes first
- **Advantages**: Optimal average waiting time
- **Disadvantages**: May cause starvation

### Priority Scheduling
- **Type**: Both preemptive and non-preemptive
- **Complexity**: O(n²)
- **Logic**: Process with highest priority executes first
- **Advantages**: Priority-based execution
- **Disadvantages**: May cause starvation

### Round Robin
- **Type**: Preemptive
- **Complexity**: O(n)
- **Logic**: Each process gets fixed time quantum
- **Advantages**: Fair scheduling, no starvation
- **Disadvantages**: Overhead due to context switching

## 🎨 Customization

### Colors and Themes
The application uses a custom color palette defined in `tailwind.config.js`:
- Primary colors for main UI elements
- Process-specific colors for Gantt chart
- Status colors for different states

### Animations
Custom animations are defined in the CSS and Framer Motion configurations:
- Fade-in effects for components
- Scale animations for buttons
- Smooth transitions for state changes

## 🧪 Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Made with ❤️ for Computer Science Education**

*This project is perfect for learning CPU scheduling algorithms with beautiful visualizations!* 