# utilise une image Node.js comme image de base
FROM node:18-alpine

# Définit l'environnement comme celui de production
ARG NODE_ENV=prod
ENV NODE_ENV=$NODE_ENV

# définit le répertoire de travail
WORKDIR /app

# copie les fichiers package.json et package-lock.json
COPY package*.json ./

# # installe les dépendances
# RUN npm install

# installe uniquement les dépendances de prod
RUN npm install --omit=dev


# copie tout le code source
COPY . .

# expose le port 3000 (du conteneur) pour l'API,
# (pour la documentation, le vrai port est celui dans le .env)
EXPOSE 3000

# démarre l'API
CMD ["npm", "run", "start:prod"]
