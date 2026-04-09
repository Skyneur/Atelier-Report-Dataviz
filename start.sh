#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Tuer les éventuels processus existants par nom
echo "==> Nettoyage des processus existants..."
pkill -f "python.*main.py" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# --- Backend ---
echo "==> Démarrage du backend FastAPI..."

if [ ! -d "$ROOT_DIR/.venv" ]; then
    echo "    Création du virtualenv..."
    python3 -m venv "$ROOT_DIR/.venv" || { echo "ERREUR: python3 -m venv a échoué"; exit 1; }
fi

echo "    Installation des dépendances Python..."
"$ROOT_DIR/.venv/bin/pip" install -r "$ROOT_DIR/backend/requirements.txt" -q || { echo "ERREUR: pip install a échoué"; exit 1; }

"$ROOT_DIR/.venv/bin/python" "$ROOT_DIR/backend/main.py" &
BACKEND_PID=$!

echo "    Attente du backend (http://localhost:8000)..."
READY=0
for i in $(seq 1 20); do
    if curl -s http://localhost:8000/ > /dev/null 2>&1; then
        echo "    Backend prêt."
        READY=1
        break
    fi
    sleep 1
done

if [ $READY -eq 0 ]; then
    echo "ERREUR: le backend n'a pas démarré dans les temps."
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# --- Frontend ---
echo "==> Démarrage du frontend React..."
cd "$ROOT_DIR/frontend"

echo "    Installation des dépendances npm..."
npm install 2>&1 | tail -3

npm run dev &
FRONTEND_PID=$!

echo ""
echo "Serveurs démarrés :"
echo "  API FastAPI  -> http://localhost:8000"
echo "  Dashboard    -> http://localhost:3000"
echo ""
echo "Appuyez sur Ctrl+C pour tout arrêter."

cleanup() {
    echo ""
    echo "Arrêt des serveurs..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM

wait
