# Alioune Facturation Pro - Guide pour l'IA (GEMINI.md)

## Résumé de l'Application
**Alioune Facturation Pro** est une application web moderne et réactive destinée à gérer les factures et le portefeuille de clients pour "Atelier Awa" (Design & direction artistique). Elle est conçue de manière "Mobile First" avec une interface épurée, haut de gamme et dynamique.

## Fonctionnalités Implémentées

### 1. Tableau de Bord (Dashboard)
- **Vue d'ensemble** : Chiffres d'affaires, factures en attente, statistiques globales.
- **Activité Récente** : Liste interactive des factures récentes.

### 2. Gestion des Factures
- **Liste des factures** : Affichage, filtrage et état (brouillon, envoyée, payée, en retard) sous forme de badges visuels.
- **Création / Modification (`/factures/nouvelle`)** :
  - Sélection ou création dynamique d'un nouveau client avec champs intégrés.
  - Ajout/suppression de lignes de facture (désignation, quantité, prix).
  - Calcul automatique du sous-total, TVA (activable/désactivable), et total.
  - **Aperçu PDF interactif en temps réel** (côté droit).
  - Gestion des statuts et affichage de la date/heure de création exacte dans l'aperçu PDF et l'entête.
  - Sauvegarde locale (`localStorage`) et redirection via ID.

### 3. Gestion des Clients
- **Liste des clients (`/clients`)** : Tableau complet de tous les clients avec leur contact et total facturé.
- **Ajout / Édition (`/clients/nouveau`)** :
  - Saisie complète des informations client.
  - Aperçu graphique du profil à droite avec badge de statut.
  - Enregistrement local avec ajout d'une horodatage précis (date/heure de création).

### 4. Paramètres (Settings)
- Mise à jour des informations de l'entreprise émettrice (nom, RC, NINEA, coordonnées).
- Conservation de l'état via le `store.ts` (`localStorage`).

## Structure des Fichiers Principaux

- `src/app/page.tsx` : Tableau de bord (Dashboard principal).
- `src/app/factures/page.tsx` : Liste complète des factures.
- `src/app/factures/nouvelle/page.tsx` : Éditeur de facture interactif avec aperçu PDF.
- `src/app/clients/page.tsx` : Répertoire client.
- `src/app/clients/nouveau/page.tsx` : Formulaire de création / édition client.
- `src/app/parametres/page.tsx` : Configuration de l'entreprise.
- `src/components/layout/Sidebar.tsx` : Menu de navigation global.
- `src/lib/store.ts` : Gestionnaire de l'état global et sauvegarde locale (prototype en `localStorage`).

## Technologies Utilisées
- **Next.js (App Router)** & **React** : Cœur de l'application.
- **Tailwind CSS** : Stylisation rapide, animations et design "glassmorphism" / ombrages.
- **Shadcn UI** & **Lucide React** : Composants d'interface (Modales, Boutons, Icônes) et éléments interactifs (DropdownMenu, AlertDialog).
- **Date-fns** : Gestion robuste des formats de date (en français).

## Décisions de Design (Aesthetics)
- L'interface devait impérativement faire "WOW" : palettes de couleurs modernes (indigo, emerald), ombres subtiles (`shadow-sm`, `shadow-lg`), arrondis généreux (`rounded-xl`, `rounded-3xl`) et textures de fond (grain).
- La structure est mobile-first, garantissant une utilisation simple sur petit écran.
- L'interaction de clic (ligne de tableau cliquable avec `e.stopPropagation()` sur les actions enfants) favorise la vitesse de navigation.

## Instructions pour un Futur Modèle IA (Next Steps)
1. **Migration vers Supabase** : Remplacer tout ce qui se trouve dans `src/lib/store.ts` par des appels réseau Supabase (PostgreSQL). Cela inclut l'ajout du RLS (Row Level Security) et l'authentification.
2. **Génération PDF réelle** : L'aperçu visuel actuel devra être transformé en vrai binaire PDF (via par exemple `react-to-pdf` ou un service backend) au clic sur "Télécharger PDF".
3. **Respect du Design** : Toujours utiliser les classes Tailwind établies (`text-slate-900`, `text-slate-500`, bouton principal en `bg-[#4F46E5]`) lors de l'ajout de nouvelles pages.
4. **Dates** : Les dates doivent toujours s'afficher en français (ex: "le jeudi 08/10/2026 à 14:00") et utiliser la librairie `date-fns` avec la localisation `fr`.
5. **Préserver le flux utilisateur** : Pour la navigation dans les tableaux, toujours conserver le système d'ID dans l'URL (`?id=XXX`) et réutiliser les hooks `useSearchParams()`.
