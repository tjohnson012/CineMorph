# CineMorph

**Extract. Remix. Redefine Cinema.**

CineMorph is an AI-powered cinematography DNA extraction and remixing tool. Extract the exact lighting, camera work, and color palette from any film. Remix it. Make it yours.

## Project Structure

This is a full-stack application with:

- **Backend**: FastAPI (Python) - Located in `app/`
- **Frontend**: React + TypeScript + Vite - Located in `frontend/`

## Quick Start

### Backend Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your FIBO API key
cp .env.example .env
# Edit .env and add your fal_api_key

# Run the server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Features

### 🎬 Extract
Analyze any image to extract its cinematographic DNA:
- Camera angles and lens settings
- Lighting direction, intensity, and color temperature
- Color palette, saturation, and mood
- Atmospheric conditions

### 🎨 Remix
Fine-tune every aspect of the extracted DNA:
- Adjust camera parameters (angle, FOV, depth of field)
- Control lighting (direction, intensity, style, time of day)
- Modify colors (saturation, contrast, mood, grade)
- Set atmosphere (weather, particles, haze)

### 🔀 Blend
Merge the cinematographic styles of two different films:
- Upload two reference images
- Adjust blend ratio (0-100%)
- Generate unique hybrid styles

### 🎭 Director Presets
Apply signature styles from legendary filmmakers:
- Stanley Kubrick - Symmetrical perfection
- Quentin Tarantino - Bold colors & violence
- Wes Anderson - Pastel whimsy
- Denis Villeneuve - Epic scale & mood
- Christopher Nolan - Dark realism
- Wong Kar-wai - Neon romance
- David Fincher - Cold precision
- Steven Spielberg - Warm nostalgia

## Tech Stack

### Backend
- FastAPI
- Python 3.12
- FIBO AI API
- Pydantic for data validation

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS v4 for styling
- Framer Motion for animations
- Zustand for state management
- React Router v7 for navigation
- Lucide React for icons

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Backend (.env)
```env
fal_api_key=your_fibo_api_key_here
fal_base_url=https://fal.run/fal-ai/fibo
```

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:8000
```

## Development

### Backend Development
```bash
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

#### Backend
```bash
# Backend is ready for deployment as-is
# Use a production ASGI server like Gunicorn with Uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

#### Frontend
```bash
cd frontend
npm run build
# Built files will be in frontend/dist/
```

## License

© 2024 CineMorph. All rights reserved.

Powered by FIBO AI.