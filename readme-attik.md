Maintenant, je vais créer les fichiers Docker nécessaires pour containeriser ce projet de BI Superstore.

## Configuration Docker pour le projet Atelier-Report-Dataviz

Voici les fichiers Docker à ajouter à votre projet pour containeriser le backend FastAPI et le frontend Streamlit.

### **1. Dockerfile pour le Backend (FastAPI)**

Créez le fichier `backend/Dockerfile`:

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Définition du répertoire de travail
WORKDIR /app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copie du fichier requirements (uniquement les dépendances backend)
COPY requirements.txt .

# Installation des dépendances Python
RUN pip install --no-cache-dir \
    fastapi==0.109.0 \
    uvicorn[standard]==0.27.0 \
    pydantic==2.5.3 \
    pandas==2.1.4 \
    numpy==1.26.3

# Copie du code backend
COPY main.py .

# Exposition du port FastAPI
EXPOSE 8000

# Healthcheck pour vérifier que l'API est opérationnelle
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/')"

# Commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### **2. Dockerfile pour le Frontend (Streamlit)**

Vous devez d'abord obtenir le contenu du fichier `frontend/dashboard.py`. Créez le fichier `frontend/Dockerfile`:

```dockerfile
# frontend/Dockerfile
FROM python:3.11-slim

# Définition du répertoire de travail
WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copie du fichier requirements
COPY requirements.txt .

# Installation des dépendances Python pour le frontend
RUN pip install --no-cache-dir \
    streamlit==1.30.0 \
    plotly==5.18.0 \
    requests==2.31.0 \
    pandas==2.1.4

# Copie du code frontend
COPY dashboard.py .

# Exposition du port Streamlit
EXPOSE 8501

# Configuration Streamlit pour désactiver les avertissements
RUN mkdir -p ~/.streamlit && \
    echo "[server]" > ~/.streamlit/config.toml && \
    echo "headless = true" >> ~/.streamlit/config.toml && \
    echo "port = 8501" >> ~/.streamlit/config.toml && \
    echo "enableCORS = false" >> ~/.streamlit/config.toml && \
    echo "enableXsrfProtection = false" >> ~/.streamlit/config.toml

# Healthcheck pour Streamlit
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl --fail http://localhost:8501/_stcore/health || exit 1

# Commande de démarrage
CMD ["streamlit", "run", "dashboard.py", "--server.address", "0.0.0.0"]
```

### **3. Docker Compose**

Créez le fichier `docker-compose.yml` à la racine du projet:

```yaml
version: '3.8'

services:
  # Service Backend - API FastAPI
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: superstore-api
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    networks:
      - superstore-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  # Service Frontend - Dashboard Streamlit
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: superstore-dashboard
    ports:
      - "8501:8501"
    environment:
      - PYTHONUNBUFFERED=1
      - API_URL=http://backend:8000
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - superstore-network
    restart: unless-stopped

networks:
  superstore-network:
    driver: bridge
    name: superstore-network

volumes:
  # Volume pour persister les données si nécessaire
  data-volume:
    name: superstore-data
```

### **4. Fichier .dockerignore**

Créez `.dockerignore` à la racine du projet:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.egg-info/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Git
.git/
.gitignore

# Tests
tests/
pytest_cache/
.coverage
htmlcov/

# Documentation
README.md
docs/

# Docker
Dockerfile
docker-compose.yml
.dockerignore
```

### **5. Fichier README-Docker.md** (Documentation d'utilisation)

```markdown
# 🐳 Déploiement Docker - Superstore BI

## 📋 Prérequis

- Docker installé (version 20.10+)
- Docker Compose installé (version 2.0+)

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone https://github.com/opinaka-attik/Atelier-Report-Dataviz.git
cd Atelier-Report-Dataviz
```

### 2. Construire et démarrer les conteneurs
```bash
# Construction et démarrage en arrière-plan
docker-compose up -d --build

# Ou sans l'option -d pour voir les logs en temps réel
docker-compose up --build
```

### 3. Accéder aux services

- **API Backend (FastAPI)**: http://localhost:8000
- **Documentation API (Swagger)**: http://localhost:8000/docs
- **Dashboard Frontend (Streamlit)**: http://localhost:8501

## 🛠️ Commandes utiles

### Gestion des conteneurs
```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Redémarrer les services
docker-compose restart

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Vérifier l'état des conteneurs
```bash
# Voir les conteneurs actifs
docker-compose ps

# Voir l'utilisation des ressources
docker stats
```

### Reconstruction
```bash
# Reconstruire après modification du code
docker-compose up -d --build

# Reconstruire un service spécifique
docker-compose build backend
docker-compose up -d backend
```

### Nettoyage
```bash
# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer également les volumes
docker-compose down -v

# Nettoyer les images non utilisées
docker image prune -a
```

## 🔧 Configuration

### Variables d'environnement

Vous pouvez créer un fichier `.env` à la racine pour personnaliser:

```env
# Ports
BACKEND_PORT=8000
FRONTEND_PORT=8501

# Configuration backend
PYTHONUNBUFFERED=1
DATASET_URL=https://raw.githubusercontent.com/leonism/sample-superstore/master/data/superstore.csv
```

### Modifier docker-compose.yml pour utiliser .env

```yaml
services:
  backend:
    ports:
      - "${BACKEND_PORT:-8000}:8000"
  
  frontend:
    ports:
      - "${FRONTEND_PORT:-8501}:8501"
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas
```bash
# Vérifier les logs
docker-compose logs

# Reconstruire from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Erreur de connexion entre frontend et backend
```bash
# Vérifier le réseau
docker network ls
docker network inspect superstore-network

# Tester la connexion depuis le frontend
docker exec superstore-dashboard curl http://backend:8000
```

### Port déjà utilisé
```bash
# Modifier les ports dans docker-compose.yml
# Par exemple, changer 8000:8000 en 8080:8000
```

## 📊 Architecture

```
┌─────────────────────────────────────┐
│     Utilisateur (Navigateur)        │
└────────────┬────────────────────────┘
             │
             ├─────────────┐
             │             │
     ┌───────▼──────┐  ┌──▼──────────────┐
     │   Frontend   │  │    Backend      │
     │  Streamlit   │◄─┤    FastAPI      │
     │  Port 8501   │  │   Port 8000     │
     └──────────────┘  └─────────────────┘
             │                 │
             └────────┬────────┘
                      │
             ┌────────▼────────┐
             │  Docker Network │
             │ superstore-net  │
             └─────────────────┘
```

## ✅ Tests

### Tester l'API
```bash
# Test depuis l'hôte
curl http://localhost:8000/

# Test depuis le conteneur frontend
docker exec superstore-dashboard curl http://backend:8000/
```

### Tester le dashboard
```bash
# Ouvrir dans le navigateur
open http://localhost:8501
```

## 🔒 Production

Pour un déploiement en production, modifiez:

1. **CORS** dans `backend/main.py`: spécifier les origines autorisées
2. **Secrets**: utiliser des variables d'environnement sécurisées
3. **Reverse proxy**: ajouter Nginx/Traefik
4. **SSL/TLS**: configurer HTTPS
5. **Monitoring**: ajouter Prometheus/Grafana

## 📝 Notes

- Les conteneurs redémarrent automatiquement (`restart: unless-stopped`)
- Les healthchecks vérifient que les services sont opérationnels
- Le frontend attend que le backend soit prêt (`depends_on` avec condition)
- Le réseau `superstore-network` permet la communication entre services

## 🤝 Support

Pour toute question, ouvrir une issue sur GitHub ou contacter le formateur.
```

### **6. Modification nécessaire dans frontend/dashboard.py**

Pour que le frontend puisse communiquer avec le backend dans Docker, modifiez l'URL de l'API:

```python
# Remplacer cette ligne dans dashboard.py:
API_BASE_URL = "http://localhost:8000"

# Par:
import os
API_BASE_URL = os.getenv("API_URL", "http://localhost:8000")
```

## 📝 Instructions d'implémentation

Pour ajouter ces fichiers à votre repository GitHub:

1. **Créez les Dockerfiles**:
   - `backend/Dockerfile`
   - `frontend/Dockerfile`

2. **Créez à la racine**:
   - `docker-compose.yml`
   - `.dockerignore`
   - `README-Docker.md`

3. **Testez en local**:
   ```bash
   docker-compose up --build
   ```

4. **Commitez et pushez**:
   ```bash
   git add .
   git commit -m "feat: Add Docker configuration for backend and frontend"
   git push origin main
   ```

Cette configuration Docker vous permet de déployer facilement votre application BI Superstore avec une architecture microservices isolée et scalable.

[1](https://github.com/opinaka-attik/Atelier-Report-Dataviz)