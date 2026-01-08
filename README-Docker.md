# 🐳 Déploiement Docker - Superstore BI

## 📋 Prérequis

- Docker installé (version 20.10+)
- Docker Compose installé (version 2.0+)

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone https://github.com/opinaka-attik/Atelier-Report-Dataviz.git
cd Atelier-Report-Dataviz


# Construction et démarrage en arrière-plan
docker-compose up -d --build

# Ou sans l'option -d pour voir les logs en temps réel
docker-compose up --build


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

