# DeepKlarity - AI-Powered Quiz Generator

A powerful quiz generation system that scrapes Wikipedia articles and generates intelligent multiple-choice quizzes with visual feedback.
### Screenshots
### Quiz Generation Page
<img width="1826" height="851" alt="Screenshot 2025-11-09 103751" src="https://github.com/user-attachments/assets/86130e5a-9a93-4f76-8364-7182fd5456fb" />
<img width="1495" height="652" alt="Screenshot 2025-11-09 103816" src="https://github.com/user-attachments/assets/b6971528-f04a-4f3b-bd13-9dab236fcdf7" />
### Quiz History Page
<img width="1753" height="828" alt="Screenshot 2025-11-09 103458" src="https://github.com/user-attachments/assets/ab92730f-f03d-472e-a8a1-257886978a27" />

### Detail Modal Page
<img width="932" height="540" alt="image" src="https://github.com/user-attachments/assets/7b006579-4504-4521-98ee-de58a8e91933" />



## 🎯 Features

### Core Functionality
- **Wikipedia Integration**: Scrape any Wikipedia article using its URL
- **AI-Powered Quiz Generation**: Automatically generate quizzes from article content
- **Multiple Quiz Modes**: Take quiz or view answers modes
- **Interactive User Interface**: Clean, responsive React-based UI
- **Real-time Feedback**: See correct/incorrect answers with color coding

### User Experience
- **Full-Text Options**: All quiz options display complete text (no truncation)
- **Color Coded Feedback**: 
  - ✅ Green highlighting for correct answers
  - ❌ Red highlighting for wrong selections
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Modern, clean interface with smooth animations
- **Quiz History**: Track all generated quizzes

### Technical Features
- **FastAPI Backend**: High-performance Python API server
- **React Frontend**: Modern, interactive user interface
- **SQLite Database**: Persistent quiz storage and caching
- **CORS Support**: Cross-origin requests enabled
- **RESTful API**: Clean, well-structured endpoints

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- pip and npm package managers

### Backend Setup

1. **Create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment** (optional):
   ```bash
   # Create .env file with any custom settings
   cp .env.example .env  # If available
   ```

4. **Run the backend**:
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   Backend will be available at: **http://127.0.0.1:8000**

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend_new
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at: **http://localhost:5173**

---

## 📖 Usage

### Generating a Quiz

1. **Start both servers**:
   - Backend: `http://127.0.0.1:8000`
   - Frontend: `http://localhost:5173`

2. **Enter a Wikipedia URL**:
   - Go to frontend URL
   - Enter any Wikipedia article URL
   - Example: `https://en.wikipedia.org/wiki/Leonardo_da_Vinci`

3. **Generate Quiz**:
   - Click "Generate" button
   - System will scrape the article and create quiz questions

### Taking a Quiz

1. **Click "Take Quiz"** to start answering questions
2. **Select your answers** by clicking radio buttons
3. **Click "Submit Answers"** to see results
4. **View Results**:
   - Correct answers highlighted in **green**
   - Your incorrect selections highlighted in **red**
   - See explanations for each answer

### Viewing Answers

1. **Click "View Answers"** to see all answers without taking quiz
2. **Review** correct answers and explanations
3. **Study** the content for learning

---

## 🏗️ Project Structure

```
DeepKlarity-Assignment/
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                  # Main API server
│   │   ├── utils.py                 # Quiz generation utilities
│   │   ├── models.py                # Database models
│   │   ├── schemas.py               # Request/response schemas
│   │   └── db.py                    # Database configuration
│   ├── venv/                        # Virtual environment
│   ├── requirements.txt             # Python dependencies
│   └── .env                         # Environment variables
│
├── frontend_new/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenerateQuizTabNew.jsx  # Quiz interface
│   │   │   └── HistoryTab.jsx          # Quiz history
│   │   ├── styles.css               # Global styles
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json                 # JavaScript dependencies
│   ├── vite.config.js               # Vite configuration
│   └── node_modules/                # Dependencies
│
└── README.md                         # This file
```

---

## 🔌 API Endpoints

### Quiz Generation
**POST** `/generate_quiz/`
- **Request**: `{ "url": "https://en.wikipedia.org/wiki/..." }`
- **Response**: Quiz with questions, options, answers, and explanations

### Quiz History
**GET** `/history`
- **Response**: List of all previously generated quizzes

### Health Check
**GET** `/`
- **Response**: Server status message

---

## 🎨 Features in Detail

### Full-Text Option Display
- All quiz options show complete text from the article
- No truncation or ellipsis ("...")
- Text wraps naturally to multiple lines
- Professional, readable format

### Color-Coded Feedback
- **Green Background**: Correct answer (shown after submission)
- **Red Background**: Wrong answer that was selected (shown after submission)
- **Visual Distinction**: Easy to identify correct vs incorrect at a glance

### Smart Quiz Generation
- Extracts long sentences from Wikipedia articles
- Creates realistic multiple-choice options
- Uses different sentences as distractors
- Ensures educational value

### Responsive Design
- Desktop: Full-featured interface
- Tablet: Optimized layout
- Mobile: Compact, touch-friendly interface

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: SQLite + SQLAlchemy ORM
- **Web Scraping**: BeautifulSoup
- **Language**: Python 3.8+

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Pure CSS
- **HTTP Client**: Fetch API
- **Language**: JavaScript/JSX

### Development Tools
- Git for version control
- npm for JavaScript package management
- pip for Python package management

---

## 📝 Key Bug Fixes & Features

### Version 1.0 - Initial Release
- ✅ Wikipedia article scraping
- ✅ AI-powered quiz generation
- ✅ Quiz taking interface
- ✅ Quiz history tracking
- ✅ CORS support
- ✅ Responsive design
- ✅ Green/red answer highlighting
- ✅ Full-text option display
- ✅ Option randomization

---

## 🐛 Troubleshooting

### Backend Issues

**Backend won't start**:
```bash
# Check Python version
python --version  # Should be 3.8+

# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Database errors**:
```bash
# Delete and recreate database
rm quiz.db
python -m uvicorn app.main:app --reload
```

### Frontend Issues

**Frontend not loading**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Vite not starting**:
```bash
# Check if port 5173 is in use
# Try clearing cache
rm -rf node_modules/.vite
npm run dev
```

### Connection Issues

**Can't connect to backend**:
- Verify backend is running on `127.0.0.1:8000`
- Check firewall settings
- Verify CORS is enabled

**Quiz generation fails**:
- Check Wikipedia URL is valid
- Ensure internet connection
- Verify article has enough content

---

## 🎓 Learning Resources

### Key Concepts
1. **Quiz Generation**: Uses sentence extraction from Wikipedia articles
2. **Option Randomization**: Shuffles options each time to prevent patterns
3. **Caching**: Stores generated quizzes to avoid regeneration
4. **Color Feedback**: Visual cues for correct/incorrect answers

### Code Structure
- **MVC Pattern**: Separation of concerns in both frontend and backend
- **RESTful API**: Standard HTTP methods and status codes
- **Component-Based UI**: Modular React components
- **Database ORM**: Clean, abstracted database interactions

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review code comments in source files
3. Check backend logs for error messages
4. Verify all prerequisites are installed

---

## 📄 License

This project is part of an educational assignment.

---

## ✅ System Requirements

- **OS**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 14 or higher
- **RAM**: 2GB minimum
- **Storage**: 500MB for dependencies
- **Internet**: Required for Wikipedia scraping

---

## 🚀 Deployment

### Local Development
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 - Frontend
cd frontend_new
npm run dev
```

### Production Deployment
- Use production ASGI server (Gunicorn + Uvicorn)
- Build React app: `npm run build`
- Serve static files through web server
- Use environment variables for configuration

---

## 🎉 Getting Started

Ready to generate quizzes? 

1. **Start backend**: `python -m uvicorn app.main:app --reload`
2. **Start frontend**: `npm run dev`
3. **Open browser**: http://localhost:5173
4. **Enter Wikipedia URL**: https://en.wikipedia.org/wiki/[article]
5. **Click Generate**: And enjoy your custom quiz!

---

**Last Updated**: November 7, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

Enjoy learning with DeepKlarity! 🎓

