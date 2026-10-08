---
description: Règle globale pour la génération automatique de Walkthroughs
---

# Génération Automatique de Walkthrough

À chaque fois que l'agent termine l'implémentation d'une fonctionnalité majeure ou d'une nouvelle interface utilisateur (UI), il **DOIT** automatiquement :

1. Créer un **Artifact Markdown** nommé `walkthrough_<nom_fonctionnalite>.md` dans le répertoire des artifacts.
2. Utiliser le format **Carrousel** (` ```carousel `) pour présenter le processus, les fonctionnalités clés développées, et comment l'utilisateur peut les tester.
3. Fournir le lien de cet artifact (Walkthrough) directement dans le message de conclusion sans que l'utilisateur n'ait besoin de le demander.

**Objectif** : Permettre à l'utilisateur de visualiser les étapes du processus ou les explications visuelles dans l'IDE immédiatement après la création du code.
