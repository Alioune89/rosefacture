---
description: Design System et Règles UI/UX pour Alioune Facturation Pro
---

# Design System - Alioune Facturation Pro

Cette règle définit le Design System officiel de l'application, inspiré du tableau de bord (`src/app/page.tsx`). Tous les nouveaux composants et pages doivent OBLIGATOIREMENT respecter ces conventions pour garantir une cohérence visuelle parfaite.

## 1. Animations d'entrée (Staggered Animations)
Chaque nouvelle page ou section doit apparaître avec une animation fluide de bas en haut.
- **Conteneur parent** : Ajouter `animate-in fade-in duration-500`
- **Enfants (Cartes, Tableaux, Blocs)** : Ajouter `animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-{X}` (où `{X}` est 100, 200, 300, etc. pour un effet en cascade).

## 2. Cartes et Conteneurs (Cards)
Toutes les cartes affichant du contenu ou des formulaires doivent avoir le même style, le même arrondi, et les mêmes effets au survol/clic.
- **Classes de base** : `bg-white rounded-2xl border-gray-200 shadow-sm`
- **Survol (Hover)** : `hover:shadow-lg hover:-translate-y-1`
- **Clic (Active)** : `active:scale-[0.98] active:shadow-sm`
- **Transition** : `transition-all duration-300`

## 3. Listes et Lignes de Tableaux (Table Rows)
Les lignes de données interactives doivent réagir dynamiquement.
- **Classes de base** : Ajouter la classe `group` sur la ligne (`tr` ou `div`).
- **Survol (Hover)** : `hover:bg-blue-50/50 hover:shadow-sm hover:-translate-y-[1px]`
- **Clic (Active)** : `active:scale-[0.99] active:bg-blue-100/50`
- **Transition** : `transition-all duration-200`
- **Texte au survol** : Le texte principal de la ligne doit devenir bleu : `group-hover:text-blue-700 transition-colors`.

## 4. Typographie et Couleurs
- **Titres principaux** : `text-gray-900 font-bold` ou `font-extrabold`.
- **Titres de sections/cartes** : `text-gray-800 text-lg font-semibold`.
- **Textes secondaires (dates, sous-titres)** : `text-gray-500 font-medium`.
- **Montants financiers** : `font-bold text-gray-900 tabular-nums`.

## 5. Icônes d'illustration
Les icônes illustrant une section ou une statistique doivent être encapsulées dans un carré arrondi.
- **Conteneur** : `w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center`
- **Couleurs** : Utiliser un fond très clair avec le texte contrasté (ex: `bg-blue-50 text-blue-600` ou `bg-purple-50 text-purple-600`).

## 6. Badges (Statuts)
Les badges d'état (ex: Statut de facture) doivent avoir ce format :
- **Classes** : `rounded-full border-0 px-3 font-medium`
- **Indicateur visuel** : Un petit point de couleur avant le texte `w-1.5 h-1.5 rounded-full mr-2`
- **Exemple (Payée)** : `bg-green-50 text-green-700` avec le point `bg-green-500`.

## 7. Responsivité (Mobile-First)
- Toujours commencer par le design mobile (`w-full`, `grid-cols-1`, `flex-col`, `p-4`).
- Adapter pour tablette/desktop avec `sm:`, `md:`, `lg:` (ex: `sm:p-6`, `sm:grid-cols-2`, `md:flex-row`).
- Ne jamais laisser de contenu déborder sur mobile (utiliser `overflow-hidden` ou `overflow-x-auto` si nécessaire, mais privilégier l'empilement vertical `flex-col`).
