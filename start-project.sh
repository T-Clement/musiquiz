#!/bin/bash

# ouvre les ports nécessaires
echo "Ouvrir les ports nécessaires..."
sudo ufw allow 5173
sudo ufw allow 3000

# lance le backend
echo "Lancement du backend..."
cd server && npm start &

# lance le frontend
echo "Lancement du frontend..."
# cd front && npm run dev &
cd front && npm run dev -- --host &

# attend la fin du processus (ou un CTRL+C pour fermer)
echo "Appuyez sur CTRL+C pour arrêter le projet."

# ferme les ports quand le projet est arrêté
trap 'echo "Fermeture des ports..."; sudo ufw delete allow 5173; sudo ufw delete allow 3000; exit 0' SIGINT

# garde le script actif
wait
