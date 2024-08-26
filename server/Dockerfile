# Utiliser une image Node.js comme image de base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 3000 pour l'API
EXPOSE 3000

# Démarrer l'API
CMD ["npm", "start"]
