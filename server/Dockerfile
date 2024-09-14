# utilise une image Node.js comme image de base
FROM node:18

# définit le répertoire de travail
WORKDIR /app

# copie les fichiers package.json et package-lock.json
COPY package*.json ./

# installe les dépendances
RUN npm install

# copie tout le code source
COPY . .

# expose le port 3000 pour l'API
EXPOSE 3000

# démarre l'API
CMD ["npm", "start"]
