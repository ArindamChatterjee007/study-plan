# Interview Prep Study Plan

A professional, modern study plan website for interview preparation built with React, Vite, and Tailwind CSS.

## Features

- 📚 **Week-wise Navigation** - Organized curriculum with dropdown navigation
- 📑 **Tab-based Content** - Concepts, Visuals, LeetCode, and Notes for each day
- 🎨 **Modern UI** - Clean, Notion-like design with smooth animations
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast** - Built with Vite for optimal performance

## Tech Stack

- React 18
- React Router DOM v6
- Vite
- Tailwind CSS
- lucide-react icons

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx       # Main layout with sidebar
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Tabs.jsx         # Tab navigation component
│   └── ui/
│       └── index.jsx    # Reusable UI components
├── config/
│   └── studyPlanConfig.js  # Study plan data configuration
├── content/
│   └── week1/
│       └── day1/        # Day 1 content components
├── pages/
│   ├── Home.jsx         # Homepage
│   ├── PlaceholderDay.jsx
│   └── week1/
│       └── Day1.jsx     # Week 1 Day 1 page
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

## Adding New Content

1. Add day configuration in `src/config/studyPlanConfig.js`
2. Create content components in `src/content/weekX/dayY/`
3. Create page component in `src/pages/weekX/`
4. Add route in `src/App.jsx`

## License

MIT
