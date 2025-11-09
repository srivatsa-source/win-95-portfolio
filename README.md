# Windows 95 Portfolio - Retro Portfolio with AI Chatbot

A nostalgic Windows 95-themed portfolio website featuring an OpenAI GPT-powered chatbot named Ora the cat! Fully responsive and mobile-optimized.

## ✨ Features

- 🎨 Authentic Windows 95 UI (taskbar, windows, icons)
- 🐱 **AI-Powered Chatbot** - Ora the cat uses OpenAI GPT for intelligent conversations
- 📱 Fully responsive and mobile-optimized
- 🎮 Playable Minesweeper game
- 📝 Interactive guestbook
- 🎯 Guided tour with Driver.js
- 💼 Portfolio sections (About, Skills, Projects, Experience, Contact)
- 🎨 Pixel-art cat mascot

## 🤖 Chatbot Integration

This portfolio features **Ora**, an AI-powered chatbot assistant powered by OpenAI GPT!

### Quick Start

1. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your OpenAI API key to .env
   npm start
   ```

2. **Open the portfolio** and start chatting with Ora!

📖 **Full guide:** See [CHATBOT_INTEGRATION_GUIDE.md](CHATBOT_INTEGRATION_GUIDE.md)

## 📁 Project Structure

```
win 95 portfolio/
├── index.html                      # Main HTML file
├── backend/                        # OpenAI chatbot backend
│   ├── server.js                   # Express server
│   ├── package.json                # Dependencies
│   ├── .env.example                # Environment template
│   └── README.md                   # Backend documentation
├── css/
│   ├── main.css                    # Base styles, reset, typography
│   ├── desktop.css                 # Desktop icons, context menu
│   ├── windows.css                 # Window components, dialogs
│   ├── taskbar.css                 # Taskbar, start menu, counters
│   ├── chat.css                    # Chatbot, guestbook, tour cat
│   ├── components.css              # Reusable components (buttons, forms)
│   ├── minesweeper.css             # Minesweeper game styles
│   └── responsive.css              # Mobile optimization
├── js/
│   ├── windows.js                  # Window management, drag/resize
│   ├── desktop.js                  # Desktop icons, context menu
│   ├── tour.js                     # Driver.js tour guide integration
│   ├── chat.js                     # Chatbot with OpenAI integration
│   ├── guestbook.js                # Guestbook system
│   ├── minesweeper.js              # Minesweeper game logic
│   └── main.js                     # Startup, initialization
├── cat-smile.png                   # Cat mascot (smiling)
├── cat-normal.png                  # Cat mascot (normal)
├── cat-pointing.png                # Cat mascot (pointing)
├── CHATBOT_INTEGRATION_GUIDE.md    # Complete chatbot setup guide
├── MOBILE_OPTIMIZATION.md          # Mobile features documentation
└── README.md                       # This file
```

## 🎨 CSS Files

### main.css
- CSS reset and base styles
- Body background (Windows 95 teal pattern)
- Typography (headings, paragraphs, lists)
- Global animations (spin, shimmer, slideUp)

### desktop.css
- Desktop icons (positioning, hover effects)
- Icon images (folder, file, computer, game)
- Context menu styling
- Draggable icon states

### windows.css
- Window component base styles
- Title bars and window controls
- Resize handles
- Welcome window
- Window animations

### taskbar.css
- Taskbar layout
- Start button and menu
- Submenu cascading
- Time display
- Visitor counter
- Guestbook icon

### chat.css
- Tour guide cat animations
- Floating cat (bouncing, pointing)
- Chatbot window (with fullscreen mode)
- Chat messages and bubbles
- Typing indicator
- Guestbook window

### components.css
- Win95-style buttons
- Forms and input fields
- Skill progress bars
- Project cards
- Social links
- Loading indicators
- Alert windows
- Startup screen

### minesweeper.css
- Game grid layout
- Mine cells (revealed, flagged, etc.)
- Mine counter display

## 📜 JavaScript Files

### main.js
- Startup sequence and animations
- Windows 95 boot screen
- Welcome window with cat mascot
- Time display updates
- Initial setup

### windows.js
- Window open/close/minimize
- Window dragging functionality
- Window resizing (SE, S, E handles)
- Window maximize/restore
- Z-index management

### desktop.js
- Desktop icon dragging
- Icon selection states
- Context menu (right-click)
- Icon arrangement
- Double-click to open windows

### tour.js
- Driver.js integration
- Tour guide cat positioning
- Tour step configuration (7 steps)
- Tour start/end handlers
- Cat state changes (normal, smile, pointing)

### chat.js
- Chatbot window management
- Knowledge base responses
- Message sending/receiving
- Typing indicator
- Chat history
- Fullscreen mode toggle

### guestbook.js
- Visitor counter (localStorage)
- Guestbook entry submission
- Profanity filter
- Entry display/loading
- LocalStorage persistence

### minesweeper.js
- Game initialization
- Mine placement
- Cell revelation logic
- Flag placement
- Win/lose detection
- Reset functionality

## 🚀 Usage

Simply open `index.html` in a web browser. All CSS and JavaScript files are automatically loaded.

## 🔧 Development

To modify specific features:
- **Styles**: Edit the relevant CSS file in `css/`
- **Functionality**: Edit the relevant JS file in `js/`
- **Layout**: Edit `index.html`

## 📝 Notes

- All external dependencies (Driver.js, fonts) are loaded via CDN
- Cat images must be in the root directory
- LocalStorage is used for visitor counter and guestbook
- Supports modern browsers with ES6+ features

## 🎯 Features

✅ Windows 95 authentic UI
✅ Draggable/resizable windows
✅ Interactive desktop icons
✅ Guided tour with cat mascot
✅ Chatbot assistant (Ora)
✅ Visitor counter
✅ Guestbook system
✅ Working Minesweeper game
✅ Fully responsive design
✅ No emoji distractions

---

**Original file**: `enh.html` (3299 lines) 
**Refactored**: Modular structure with 13 separate files for better maintainability
