# utilise une image Node.js comme image de base pour la phase de build
FROM node:18 AS build

# définit le répertoire de travail
WORKDIR /app

# copie les fichiers package.json et package-lock.json
COPY package*.json ./

# installe les dépendances
RUN npm install

# copie tout le code source
COPY . .



# -------------------------------------------------
# -------------------------------------------------
# POUR DES FICHIERS STATIQUES
# -------------------------------------------------
# -------------------------------------------------

# construit l'application React avec Vite
RUN npm run build

# utilise une image Nginx pour faire tourner l'application
FROM nginx:alpine

# copie les fichiers buildés dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# expose le port 80 pour accéder à l'application
EXPOSE 80

# démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]


# -------------------------------------------------
# -------------------------------------------------
# POUR DU DEV
# -------------------------------------------------
# -------------------------------------------------
# # expose le port pour Vite
# EXPOSE 5173

# # commande pour lancer l'application en mode développement
# CMD ["npm", "run", "dev"]