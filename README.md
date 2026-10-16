# FormFlow

Application Next.js en français pour créer et publier des formulaires conversationnels, recueillir des réponses et intégrer un formulaire dans une page externe.

## Prérequis et démarrage

Next.js 16 requiert Node.js 20.9 ou supérieur. Installez les dépendances avec `npm ci`, copiez `.env.example` vers `.env.local`, puis lancez `npm run dev`. Les scripts disponibles sont `dev`, `build`, `start` et `lint`.

## Fonctionnalités

- Tableau de bord avec formulaires, statut de publication et soumissions horodatées.
- Création, modification, suppression et publication/dépublication de formulaires.
- Questions texte, e-mail, choix multiple et oui/non, avec validation des champs obligatoires et réordonnancement.
- Aperçu public et intégration par iframe. Le formulaire public est accessible à `/forms/<id>` quand il est publié.
- API JSON sous `/api/forms` et `/api/submissions`.

## Stockage et configuration PostgreSQL/Supabase

Le stockage actuel est en mémoire dans `lib/store.ts`. Les formulaires et réponses d'exemple sont réinitialisés au redémarrage et ne sont pas partagés entre plusieurs instances. PostgreSQL/Supabase n'est pas connecté par cette version; aucune variable de connexion ne sera utilisée tant qu'un adaptateur de base de données n'aura pas été implémenté.

Pour un déploiement durable, l'adaptateur devra utiliser PostgreSQL (par exemple Supabase), créer des tables pour `forms`, `questions` et `submissions`, conserver les horodatages côté serveur, et appliquer des politiques d'accès/RLS adaptées. Dans Supabase, `DATABASE_URL` correspond à une chaîne PostgreSQL avec droits limités; les clés Supabase secrètes/service-role ne doivent jamais être exposées au navigateur. Les variables documentées dans `.env.example` sont des emplacements vides, pas une configuration active.

## Publication et intégration

Enregistrez le formulaire dans l'éditeur, puis publiez-le depuis le tableau de bord. L'URL publique est `/forms/<id>`. Le code iframe affiché par l'éditeur peut être copié dans la page hôte; remplacez son origine de démonstration par le domaine public réel de votre déploiement.

## Vérifications

Les commandes réellement exécutées et leurs résultats sont consignés dans `AUDIT_REPORT.md` et `REPAIR_REPORT.md`.
