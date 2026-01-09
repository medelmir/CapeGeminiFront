# Système de Gestion de Réservations - Frontend

## Description
Application web développée avec Angular pour la gestion de boîtes de stockage, de réservations et d'utilisateurs.

## Fonctionnalités
- 🏠 Tableau de bord d'accueil
- 📦 Gestion des boîtes
- 📅 Gestion des réservations
- 👥 Administration des utilisateurs
- 🔐 Système d'authentification
- 📊 Panneau Lefat

## Prérequis
- Node.js (version 14 ou supérieure)
- npm (Node Package Manager)
- Angular CLI

## Installation

### 1. Cloner le dépôt
```bash
git clone <url-du-dépôt>
cd CapgeminiProjetFront
```

### 2. Installer les dépendances
```bash
npm install
```

## Exécuter le Projet

### Mode Développement
```bash
ng serve
```

L'application sera disponible sur `http://localhost:4200/`


## Structure des Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Page d'accueil |
| `/login` | LoginFormComponent | Connexion |
| `/lefat` | LefatComponent | Panneau Lefat |
| `/boites` | BoiteListComponent | Liste des boîtes |
| `/reservations` | ReservationListComponent | Liste des réservations |
| `/utilisateurs` | UtilisateurListComponent | Liste des utilisateurs |

## Technologies Utilisées
- Angular
- TypeScript
- RxJS
- Angular Router

## Développement

### Serveur de développement
Exécutez `ng serve` pour démarrer le serveur de développement. Naviguez vers `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez un fichier source.

### Générer des composants
```bash
ng generate component nom-du-composant
```

### Exécuter les tests
```bash
ng test
```

## Contribuer
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request
