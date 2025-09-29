![CI Status](https://github.com/BroMineCorp/PaladiumClickerNextJS/actions/workflows/ci.yml/badge.svg)

# https://palatracker.bromine.fr

Site web développé majoritairement par **BroMine__** pour optimiser le [Clicker de Paladium.](https://wiki.paladium-pvp.fr/gameplay/le-clicker)

## Fonctionnalités
### Profil
- Consulte le profil Paladium via un pseudo
- Consulte son évolution, ses succès, sa faction et bien d'autres encore

### Clicker
- Importer son profil Paladium via son pseudo Minecraft
- Conseils en fonction de l'avancement du joueur sur l'achat du prochain bâtiment ou prochaine amélioration
- Calcule approximativement le temps pour atteindre la prochaine amélioration

### Métiers
- Calcule le nombre de ressources à collecter pour passer à un certain niveau.

### Market et Admin-shop
- Analyse l'historique du prix de vente des items pour vendre au bon prix au bon moment.

### Classement
- Consulte les classements quotidiens

### PalaAnimation
- Espace d'entraînement aux PalaAnimations
- Plus de 200 PalaAnimations à découvrir

### Craft
- Calcule rapidement le nombre de ressources nécessaires à un craft.
- Obtiens la liste des crafts les plus rentables à faire du moment.

### Alertes
Configure des alertes Discord pour:
- Les quêtes de faction : Recevez une notification dès qu'une nouvelle quête de faction est disponible.
- Suivi des prix : Soyez informé des variations de prix dans l'admin shop et le market.
- Événements spéciaux : Notification pour les événements PVP ou "On Your Marks".
- Statut des serveurs : Recevez une alerte en cas de changement de statut des serveurs Paladium.
- Vote : Recevez une alerte lorsque vous pouvez voter pour Paladium sur l'un des sites partenaires.


## Informations
### Comment sont importés les profils Paladium ?
- Les profils Paladium sont importés via l'[API de Paladium](https://api.paladium.games/docs).

### Comment est calculé le temps pour atteindre la prochaine amélioration ?
- Le temps est calculé en fonction de la production actuelle du joueur par seconde divisé par le coût d'achat de l'amélioration, multiplié par 1.33 car les ClicCoins sont actualisés toutes les 1.33 seconde

### Comment sont calculés les conseils d'achat ?
- Le site proposera toujours d'acheter le bâtiment ou l'amélioration qui rapportera le plus de ClicCoins par seconde par rapport à son coût d'achat, en prenant en compte les améliorations déjà achetées qui offrent un bonus.


### Est-ce que je prévois d'ajouter d'autres fonctionnalités ?
- Dans l'immédiat, non. Cependant, si vous avez des idées d'améliorations, n'hésitez pas à me les proposer ou à ouvrir des [pull requests](https://github.com/BroMineCorp/PaladiumClickerNextJS/pulls).


## Comment développer
Aujourd'hui seul le frontend est open-source donc certains fonctionnalités du site ne marcheront pas, tel que l'authentification via Discord, les classements, les crafts ...

En revanche, il est possible de charger les profils, de calculer l'xp, d'optimiser le clicker, etc.
Pour cela définissez les variables d'environnements dans le fichier `.env` à la racine comme le fichier `.env.example` le fait. Pour obtenir une clé d'API auprès de Paladium, il faudra suivre les étapes indiquées dans l'[API de Paladium](https://api.paladium.games/docs).

## Technologies utilisées
- [Next.JS 15](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/)

# Installer les dépendances
```shell
npm ci --legacy-peer-deps
```

# Lancer en mode dev
```shell
npm run dev
```

# Faire un build de production et le lancer
```shell
npm run build
npm run start
```

# Lancer les tests
```shell
npm run test:playwright # lancement des tests E2E
npm run test:jest # lancement des tests unitaires
```


## Autres
- [Signaler un bug sur le site](https://github.com/BroMineCorp/PaladiumClickerNextJS/issues/new)
- Le site n'a pas forcément été pensé pour téléphone, il est donc déconseillé sur mobile mais reste tout de même fonctionnel.