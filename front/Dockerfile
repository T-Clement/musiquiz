# ------------------------------------
#    Build du frontend
# ------------------------------------

# utilise une image Node.js comme image de base pour la phase de build
FROM node:latest AS build

# argument qui servira au build
ARG VITE_API_URL

# définit le répertoire de travail
WORKDIR /app

# copie les fichiers package.json et package-lock.json
COPY package*.json ./

# installe les dépendances
RUN npm install

# copie tout le code source
COPY . .

# utiliser l'argument pour builder l'application React avec Vite, 
# Vite génère un dossier 'dist' avec tous les fichiers 
RUN VITE_API_URL=$VITE_API_URL npm run build



# -------------------------------------------------
# -------------------------------------------------
# Génération cinfg & exécution Nginx
# -------------------------------------------------
# -------------------------------------------------
                
    

    

    
    
    
    
    
    
# utilise une image Nginx pour faire tourner l'application
# FROM nginx:alpine

# # ajout de envsubst dispo dans la bibliotheque gettext
# RUN apk add --no-cache gettext

# # par defaut si aucune valeur n'est passée prend localhost
# ARG FRONT_DOMAIN=localhost
# # env convertir l'ARG en ENV pour envsubst
# ENV FRONT_DOMAIN=$FRONT_DOMAIN


# # copie le template dans un répertoire temporaire
# COPY default.conf.template /etc/nginx/templates/default.conf.template

# # utiliser envsubst pour substituer le placeholder dans le template nginx
# RUN envsubst '$FRONT_DOMAIN' < /etc/nginx/templates/default.conf.template \
# > /etc/nginx/conf.d/default.conf


# # copie les fichiers buildés dans le répertoire de Nginx
# COPY --from=build /app/dist /usr/share/nginx/html


# # expose le port 80 pour accéder à l'application
# EXPOSE 80


# # démarrer Nginx
# CMD ["nginx", "-g", "daemon off;"]


# -------------------------------------------------
# -------------------------------------------------
# POUR DU DEV
# -------------------------------------------------
# -------------------------------------------------
# # expose le port pour Vite
# EXPOSE 5173

# # commande pour lancer l'application en mode développement
# CMD ["npm", "run", "dev"]