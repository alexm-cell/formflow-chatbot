# Rapport de réparations

Date : 2026-10-16

## Changements réalisés

- Ajout des handlers de création, mise à jour et suppression des formulaires. La suppression enlève aussi les soumissions associées.
- Ajout de la validation structurelle des formulaires et de la validation serveur des champs obligatoires, e-mails, choix multiples et réponses oui/non.
- Ajout de l’enregistrement horodaté des soumissions publiées et de réponses d’erreur JSON cohérentes.
- Reconstruction du tableau de bord avec création, publication/dépublication, suppression, compteurs, soumissions récentes et erreurs visibles.
- Ajout dans l’éditeur du déplacement des questions, des champs de description et de messages, du lien d’aperçu et d’un iframe intégrable vers l’URL publique existante.
- Amélioration du formulaire public : formulaires non publiés masqués, validation visible, confirmation uniquement après acceptation serveur et hauteur adaptée aux petits écrans.
- Correction du type du layout, des métadonnées et de la langue du document.
- Remplacement du README de démarrage générique par la documentation produit, les scripts, les limites du stockage et les étapes de configuration PostgreSQL/Supabase.
- Ajout de `.env.example` avec emplacements vides, et exception `.gitignore` pour que ce fichier de documentation puisse être suivi.

## Persistance et intégrations

Les formulaires et soumissions utilisent toujours le stockage en mémoire de `lib/store.ts`. PostgreSQL/Supabase est documenté, mais aucun client, secret, schéma ou connexion à un service externe n’a été ajouté. La configuration d’un fournisseur n’a donc pas été vérifiée.

## Vérifications réellement effectuées

- `npm run lint` : réussi.
- `npx tsc --noEmit` : réussi.
- `npm run build` : bloqué par la version Node.js installée (18.20.8; Next.js 16.4.1 demande au moins 20.9).
- Aucun test automatisé, parcours navigateur ou test d’API en exécution n’a été réalisé.
