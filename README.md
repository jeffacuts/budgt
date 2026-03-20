# Bewindvoering v1

Een applicatie voor het beheren van financiën, inclusief banktransacties en budgetplanning.

## Projectstructuur

- `src/`: React frontend (Vite)
- `backend/`: Python backend (FastAPI + SQLite)

## Hoe te runnen

### Backend
1. Navigeer naar de `backend` map.
2. Installeer afhankelijkheden: `pip install -r requirements.txt`
3. Start de server: `python main.py` (of `fastapi dev main.py`)

### Frontend
1. Navigeer naar de hoofdmap.
2. Installeer afhankelijkheden: `npm install`
3. Start de development server: `npm run dev`

## GitHub Setup

Dit project is voorbereid voor GitHub. Zorg ervoor dat persoonlijke gegevens zoals bankafschriften (`.csv`) en databases (`.db`) niet worden gepusht (deze staan in `.gitignore`).
