# Rapport d'Analyse des Routes Frontend vs Backend

## 📊 Résumé Général

- **Routes Backend totales**: 53
- **Routes Frontend totales**: 63
- **Routes manquantes dans le backend**: 62
- **Routes manquantes dans le frontend**: 53
- **Incohérences de méthode HTTP**: 0
- **Routes dupliquées**: 1

## 🚨 Problèmes Détectés

### 1. Routes Frontend Inexistantes dans le Backend (62)


**GET       - /api/v1/anime/id/${id} (route API)**
- Fichier: `test-api-calls.js` (ligne 106)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET       - /api/v1/anime/slug/${slug} (route API)**
- Fichier: `test-api-calls.js` (ligne 105)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET    ✅ /api/v1/anime/id/${id} → Route API par ID**
- Fichier: `test-api-calls.js` (ligne 86)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET    ✅ /api/v1/anime/slug/${slug} → Route API par slug**
- Fichier: `test-api-calls.js` (ligne 85)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n2️⃣ Test GET /api/v1/episodes/search?q=demon**
- Fichier: `test-migration-backend-routes.js` (ligne 31)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n3️⃣ Test GET /api/v1/episodes/anime/slug/:slug**
- Fichier: `test-migration-backend-routes.js` (ligne 47)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n4️⃣ Test GET /api/v1/episodes/anime/:animeId**
- Fichier: `test-migration-backend-routes.js` (ligne 64)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n5️⃣ Test GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber**
- Fichier: `test-migration-backend-routes.js` (ligne 81)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n6️⃣ Test GET /api/v1/episodes (avec filtres)**
- Fichier: `test-migration-backend-routes.js` (ligne 98)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n7️⃣ Test GET /api/v1/anime/slug/:slug**
- Fichier: `test-migration-backend-routes.js` (ligne 115)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET \n8️⃣ Test GET /api/v1/anime/id/:id**
- Fichier: `test-migration-backend-routes.js` (ligne 132)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime**
- Fichier: `api.ts` (ligne 17)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/${animeId}/episodes**
- Fichier: `api.ts` (ligne 29)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/${identifier}**
- Fichier: `api.ts` (ligne 22)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/featured**
- Fichier: `api.ts` (ligne 19)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/id/${id}**
- Fichier: `api.ts` (ligne 21)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/slug/${slug}**
- Fichier: `api.ts` (ligne 20)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/anime/trending**
- Fichier: `api.ts` (ligne 18)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/auth/login**
- Fichier: `api.ts` (ligne 9)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/auth/logout**
- Fichier: `api.ts` (ligne 12)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/auth/refresh**
- Fichier: `api.ts` (ligne 11)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/auth/register**
- Fichier: `api.ts` (ligne 10)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes**
- Fichier: `api.ts` (ligne 27)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes/${id}**
- Fichier: `api.ts` (ligne 28)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes/anime/${animeId}**
- Fichier: `apiRoutes.ts` (ligne 46)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes/anime/${animeId}/episode/${episodeNumber}**
- Fichier: `apiRoutes.ts` (ligne 48)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes/anime/slug/${slug}**
- Fichier: `apiRoutes.ts` (ligne 47)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes/latest**
- Fichier: `apiRoutes.ts` (ligne 49)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/genres**
- Fichier: `api.ts` (ligne 51)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/search**
- Fichier: `api.ts` (ligne 35)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/search/generate-slug**
- Fichier: `api.ts` (ligne 39)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/search/slug-suggestions**
- Fichier: `api.ts` (ligne 38)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/search/slug/${slug}**
- Fichier: `api.ts` (ligne 37)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/search/suggestions**
- Fichier: `api.ts` (ligne 36)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/studios**
- Fichier: `api.ts` (ligne 56)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/users/history**
- Fichier: `api.ts` (ligne 46)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/users/profile**
- Fichier: `api.ts` (ligne 44)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE_URL}/api/${API_VERSION}/users/watchlist**
- Fichier: `api.ts` (ligne 45)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/anime/${ANIME_ID}/episodes**
- Fichier: `test-api-calls.js` (ligne 31)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/anime/${ANIME_SLUG}/episodes**
- Fichier: `test-api-calls.js` (ligne 12)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/anime/${testSlug}/episodes**
- Fichier: `test-migration-backend-routes.js` (ligne 158)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/anime/id/${testId}**
- Fichier: `test-migration-backend-routes.js` (ligne 134)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/anime/slug/${testSlug}**
- Fichier: `test-migration-backend-routes.js` (ligne 117)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes?limit=5&sort=air_date&order=desc**
- Fichier: `test-migration-backend-routes.js` (ligne 100)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes/anime/${testId}**
- Fichier: `test-migration-backend-routes.js` (ligne 66)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes/anime/${testSlug}/episode/1**
- Fichier: `test-migration-backend-routes.js` (ligne 83)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes/anime/slug/${testSlug}**
- Fichier: `test-migration-backend-routes.js` (ligne 49)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes/latest**
- Fichier: `test-migration-backend-routes.js` (ligne 17)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/${API_VERSION}/episodes/search?q=demon**
- Fichier: `test-migration-backend-routes.js` (ligne 33)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/v1/anime/id/${ANIME_ID}**
- Fichier: `test-api-calls.js` (ligne 67)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET ${API_BASE}/api/v1/anime/slug/${ANIME_SLUG}**
- Fichier: `test-api-calls.js` (ligne 50)
- Type: fetch
- Raison: Route inexistante dans le backend


**GET 1️⃣ Test GET /api/v1/episodes/latest**
- Fichier: `test-migration-backend-routes.js` (ligne 15)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/anime/id/:id**
- Fichier: `BackendRoutesTest.tsx` (ligne 102)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/anime/slug/:slug**
- Fichier: `BackendRoutesTest.tsx` (ligne 96)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes (avec filtres)**
- Fichier: `BackendRoutesTest.tsx` (ligne 90)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes/anime/:animeId**
- Fichier: `BackendRoutesTest.tsx` (ligne 78)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber**
- Fichier: `BackendRoutesTest.tsx` (ligne 84)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes/anime/slug/:slug**
- Fichier: `BackendRoutesTest.tsx` (ligne 72)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes/latest**
- Fichier: `BackendRoutesTest.tsx` (ligne 60)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET GET /api/v1/episodes/search?q=demon**
- Fichier: `BackendRoutesTest.tsx` (ligne 66)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET http://localhost:5000/api/v1/episodes/anime/${animeId}**
- Fichier: `api.ts` (ligne 275)
- Type: api_service
- Raison: Route inexistante dans le backend


**GET http://localhost:5000/api/v1/episodes/anime/slug/${animeId}**
- Fichier: `api.ts` (ligne 272)
- Type: api_service
- Raison: Route inexistante dans le backend


### 2. Incohérences de Méthode HTTP (0)



### 3. Routes Dupliquées (1)


**GET ${API_BASE_URL}/api/${API_VERSION}/episodes?sort=air_date&order=desc**
- Fichier: `api.ts` (ligne 30)
- Raison: Route dupliquée dans le frontend


### 4. Routes Backend Non Utilisées (53)


**DELETE /api/v1/:id**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**DELETE /api/v1/id/:id**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**DELETE /api/v1/watchlist/:animeId**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/**
- Fichier: `genreRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/**
- Fichier: `searchRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/**
- Fichier: `studioRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/:id**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/:id**
- Fichier: `genreRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/:id**
- Fichier: `studioRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/anime/:animeId**
- Fichier: `commentRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/anime/:animeId**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/anime/:animeId/episode/:episodeNumber**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/anime/:animeId/episode/:episodeNumber**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/anime/slug/:slug**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api-docs**
- Fichier: `server.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/dashboard**
- Fichier: `adminRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/episode/:episodeId**
- Fichier: `streamRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/featured**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/generate-slug**
- Fichier: `searchRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/history**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/id/:id**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/latest**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/profile**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/search**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/slug-suggestions**
- Fichier: `searchRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/slug/:slug**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/slug/:slug**
- Fichier: `searchRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/slug/:slug/episodes**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/stats**
- Fichier: `analyticsRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/suggestions**
- Fichier: `searchRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/trending**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/users**
- Fichier: `adminRoutes.js`
- Raison: Route non utilisée par le frontend


**GET /api/v1/watchlist**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/**
- Fichier: `commentRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/**
- Fichier: `genreRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/create-intent**
- Fichier: `paymentRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/image**
- Fichier: `uploadRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/login**
- Fichier: `authRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/logout**
- Fichier: `authRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/refresh**
- Fichier: `authRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/register**
- Fichier: `authRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/report**
- Fichier: `streamRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/video**
- Fichier: `uploadRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/view**
- Fichier: `analyticsRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/watchlist**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


**POST /api/v1/webhook**
- Fichier: `paymentRoutes.js`
- Raison: Route non utilisée par le frontend


**PUT /api/v1/:id**
- Fichier: `episodeRoutes.js`
- Raison: Route non utilisée par le frontend


**PUT /api/v1/id/:id**
- Fichier: `animeRoutes.js`
- Raison: Route non utilisée par le frontend


**PUT /api/v1/profile**
- Fichier: `userRoutes.js`
- Raison: Route non utilisée par le frontend


## 🔧 Recommandations de Correction

### Priorité 1: Erreurs Critiques
1. **Corriger les routes inexistantes**: Modifier le frontend pour utiliser des routes backend valides
2. **Corriger les méthodes HTTP**: Aligner les méthodes frontend avec celles du backend
3. **Supprimer les doublons**: Nettoyer les appels API redondants

### Priorité 2: Optimisations
1. **Utiliser les routes backend disponibles**: Implémenter les fonctionnalités manquantes
2. **Standardiser les appels API**: Créer des services API cohérents
3. **Ajouter la gestion d'erreurs**: Implémenter try/catch et gestion d'erreurs

## 📅 Date de Génération

29/08/2025 01:59:42

---

*Ce rapport a été généré automatiquement par le script d'analyse des routes.*
