# MovieLandia24 Backend PRD

## 1. Purpose

This document describes the current MovieLandia24 data model and backend behavior, and proposes a REST API contract for a Java/Spring backend. It is intended as a handoff specification for implementing a compatible backend against the existing PostgreSQL database.

### Source of truth and status labels

- **Current schema** means present in `prisma/schema/models/*.prisma`.
- **Current behavior** means present in a Next.js Route Handler or Server Action.
- **Proposed REST API** means a Spring endpoint contract recommended here. It is not necessarily an existing HTTP endpoint.

The database uses PostgreSQL and Prisma. Most application operations are implemented as Next.js Server Actions, not REST endpoints. The only current HTTP routes are listed in section 4.

## 2. Product scope

MovieLandia24 supports:

- Browsing, searching, filtering, and managing movies, TV series, seasons, episodes, actors, crew, and genres.
- User registration, email activation, password reset, profiles, avatars, favorites, ratings, and reviews.
- Review voting and user-to-user follow relationships.
- Private messages and notifications.
- User-created lists containing multiple kinds of media and people, with sharing and edit permissions.
- A discussion forum with categories, topics, posts, replies, tags, votes, attachments, and moderation metadata.
- Administrative content management and user moderation.

## 3. Roles, identity, and shared API conventions

### Roles

The database defines `UserType`: `User`, `Admin`.

- Public catalog reads should not require authentication.
- Mutations to a user's own profile, reviews, favorites, ratings, lists, messages, follows, and forum contributions require authentication.
- Catalog create/update/delete, user administration, forum administration, and moderation require `Admin` or an applicable forum moderator.
- A list collaborator may mutate list contents only when its `ListShare.canEdit` is true.
- Users may edit or delete their own content; administrators/moderators may act under the relevant moderation permissions.

These are proposed REST authorization rules. Validate authorization using the authenticated principal, never a caller-supplied `userId`.

### REST conventions

- Base path: `/api/v1`.
- JSON request and response bodies use camelCase to match the existing Prisma fields.
- Most entity IDs are integers. `Account` and `Session` use string IDs; `VerificationToken` is keyed by `identifier` and `token`; activation/reset token records have integer IDs.
- Collection endpoints accept `page` (default `1`) and `limit` (default `20`); return `{ "items": [], "page": 1, "limit": 20, "total": 0 }`.
- Catalog collection endpoints may accept `sortBy`, `direction` (`asc` or `desc`), and resource-specific filters. Reject unknown sort and filter fields.
- Use ISO-8601 timestamps in UTC.
- `POST` creates, `GET` reads, `PUT` replaces/idempotently upserts, `PATCH` partially updates, and `DELETE` removes.
- Return `400` for invalid input, `401` for unauthenticated requests, `403` for forbidden operations, `404` for missing resources, `409` for uniqueness/state conflicts, and `500` only for unexpected server errors.
- Error response shape: `{ "error": { "code": "VALIDATION_ERROR", "message": "Readable explanation", "fields": {} } }`.
- Do not serialize passwords, password hashes, OAuth tokens, session tokens, or one-time verification tokens in normal resource responses.

## 4. Current HTTP endpoints

These routes exist in the Next.js application today. They are not versioned and should be treated separately from the proposed Spring routes in section 6.

| Method | Current path | Current behavior |
|---|---|---|
| `GET` | `/api` | Returns `{ authenticated: true }` for an active NextAuth session; otherwise `401`. |
| `GET` | `/api/genres` | Returns all genres. |
| `GET` | `/api/search/all?term=...&filters=...` | Case-insensitive substring search across selected movies, series, actors, crew, seasons, episodes, and users. Empty/missing term returns `{}`. Returns up to five items and a total per selected type. |
| `GET` | `/api/notifications?userId=...&page=1&limit=5` | Returns notifications for the supplied user ID, newest first, including limited sender details. The handler does not derive the recipient from the authenticated principal. |
| `GET` | `/api/verifyRegister?token=...&email=...` | Validates an activation token and activates its user. |
| `GET` | `/api/verifyResetPassword?token=...&email=...` | Validates a reset token and sets `canResetPassword`. |
| `POST` | `/api/changePassword` | Accepts `{ "email": "...", "newPassword": "..." }`; changes the password only if `canResetPassword` is true, then clears that flag. |
| NextAuth-managed | `/api/auth/[...nextauth]` | NextAuth authentication endpoints, including configured providers and session behavior. |

Most domain reads and mutations are Server Actions under `src/actions/`, including catalog CRUD, user actions, reviews/votes, social functions, lists, and forum functions. They are callable by the Next.js app but are not independent REST endpoints. The Spring API below is a proposed replacement/integration contract.

## 5. Data model

All entity and field names below reflect the Prisma schema. Relation tables with a family of near-identical models are grouped for readability; each content kind currently has its own physical Prisma model/table.

### 5.1 Users, authentication, and social graph

| Entity | Fields and relationships |
|---|---|
| `User` | `id`, unique `userName`, unique `email`, nullable `password`, `role` (`UserType`, default `User`), nullable `bio`, nullable `age`, nullable `birthday`, `gender` (`Male`/`Female`, default `Male`), `phone` (default placeholder), `countryFrom` (default `United States`), `active`, `canResetPassword`, `subscribed`. Relates to avatar, auth accounts/sessions/tokens, follows, messages/inboxes, notifications, favorites, ratings, reviews/votes, forum activity, reports/moderation, and lists. |
| `Avatar` | `id`, `photoSrc`, unique `userId`; one avatar per user. |
| `Account` | String `id`, `type`, `provider`, nullable provider token/scope fields, `userId`, `providerAccountId`; unique `(provider, providerAccountId)`. OAuth token fields must remain secret. |
| `Session` | String `id`, unique `sessionToken`, `expires`, `userId`. |
| `VerificationToken` | `identifier`, unique `token`, `expires`; unique `(identifier, token)`. |
| `ActivateToken` | `id`, unique `token`, `createdAt`, nullable `activatedAt`, `userId`. |
| `ResetPasswordToken` | `id`, unique `token`, `createdAt`, nullable `resetPasswordAt`, `userId`. |
| `UserFollow` | `id`, `followerId`, `followingId`, `state` (`pending`, `accepted`, `rejected`, default `pending`); unique `(followerId, followingId)`. |

The existing activation and reset token models have no expiration field. The Spring implementation should add expiry/consumption semantics (through a migration or a separate token store) and use cryptographically random, single-use tokens. The current `canResetPassword` flag is a workflow flag, not a substitute for validating a reset token on the password update request.

### 5.2 Catalog

| Entity | Fields and relationships |
|---|---|
| `Movie` | `id`, `title`, `photoSrc`, `photoSrcProd`, `trailerSrc`, `duration`, `ratingImdb`, nullable `dateAired`, `description`. Has cast, crew, genres, reviews, favorites, ratings, and list items. |
| `Serie` | `id`, `title`, `photoSrc`, `photoSrcProd`, `trailerSrc`, `description`, nullable `dateAired`, `ratingImdb`. Has cast, crew, genres, seasons, reviews, favorites, ratings, and list items. |
| `Season` | `id`, `title`, `photoSrc`, `photoSrcProd`, `trailerSrc`, `description`, nullable `dateAired`, `ratingImdb`, `serieId`. Belongs to a series and has episodes, reviews, favorites, ratings, and list items. |
| `Episode` | `id`, `title`, `photoSrc`, `photoSrcProd`, `trailerSrc`, `description`, `duration`, nullable `dateAired`, `ratingImdb`, `seasonId`. Belongs to a season and has reviews, favorites, ratings, and list items. |
| `Actor` | `id`, `fullname`, `photoSrc`, `photoSrcProd`, `description`, `debut`. Has movie/series cast relations, reviews, favorites, ratings, and list items. |
| `Crew` | `id`, `fullname`, `photoSrc`, `photoSrcProd`, `role`, `description`, `debut`. Has movie/series crew relations, reviews, favorites, ratings, and list items. |
| `Genre` | `id`, `name`; relates to movies, series, and user genre favorites. |
| `CastMovie`, `CastSerie` | Join records connecting an actor to a movie or series; unique per pair. |
| `CrewMovie`, `CrewSerie` | Join records connecting a crew member to a movie or series; unique per pair. The crew `role` is stored on `Crew`, not on the production-specific join. |
| `MovieGenre`, `SerieGenre` | Join records connecting a genre to a movie or series; unique per pair. |

Catalog descriptions are PostgreSQL text fields. IMDb ratings and durations are numeric fields in the schema; acceptable ranges and units are not consistently constrained there and must be validated by the API. The schema does not include pagination or filter models; those are query behavior.

### 5.3 User favorites and ratings

Favorite models are `UserMovieFavorite`, `UserSerieFavorite`, `UserSeasonFavorite`, `UserEpisodeFavorite`, `UserActorFavorite`, `UserCrewFavorite`, and `UserGenreFavorite`. Each has an ID and the relevant `userId` plus content ID, with a unique user/content pair.

Rating models are `UserMovieRating`, `UserSerieRating`, `UserSeasonRating`, `UserEpisodeRating`, `UserActorRating`, and `UserCrewRating`. Each has an ID, `rating` (`Float`), `userId`, and the relevant content ID, with a unique user/content pair. There is no `UserGenreRating`.

### 5.4 Reviews and review votes

There are `MovieReview`, `SerieReview`, `SeasonReview`, `EpisodeReview`, `ActorReview`, and `CrewReview` models. Each has `id`, nullable `content`, nullable `rating`, `createdAt`, nullable `updatedAt`, `userId`, and its target content ID. A unique `(userId, targetId)` constraint allows at most one review by a user for a given target.

Each review family has separate `Upvote*Review` and `Downvote*Review` tables. A vote record stores `id`, `userId`, target content ID, and review ID, and is unique per `(userId, targetId, reviewId)` within that up/down table. Because upvotes and downvotes are separate tables, the current schema alone does not prevent the same user from both upvoting and downvoting one review. The API should enforce a single vote state per user/review and change or remove the previous vote transactionally.

### 5.5 Lists and list collaboration

| Entity | Fields and relationships |
|---|---|
| `List` | `id`, `name`, nullable `description`, `isPrivate`, `isArchived`, `isDefault`, `createdAt`, nullable `contentType`, `updatedAt`, nullable `lastViewedAt`, `userId`. |
| `ListShare` | `id`, `canEdit`, `sharedAt`, `listId`, `userId`; unique `(listId, userId)`. |
| `ListMovie`, `ListSerie`, `ListSeason`, `ListEpisode`, `ListActor`, `ListCrew` | Each has `id`, `addedAt`, nullable `note`, `orderIndex`, `listId`, the relevant content ID, and adding `userId`; unique `(listId, contentId)` and indexed by `(listId, orderIndex)`. |
| `ListActivityMovie`, `ListActivitySerie`, `ListActivitySeason`, `ListActivityEpisode`, `ListActivityActor`, `ListActivityCrew` | Each records `id`, `actionType`, nullable JSON `metadata`, `createdAt`, `listId`, relevant content ID, and `userId`. |
| `UserListStats` | `id`, unique `userId`, `totalLists`, `totalItems`, `sharedLists`, nullable `lastListAt`. |

`ListActionType`: `Created`, `Updated`, `Deleted`, `ItemAdded`, `ItemRemoved`, `Shared`, `Unshared`. `ContentType`: `movie`, `serie`, `season`, `episode`, `actor`, `crew`, `user`. The schema has no `ListUser` item model despite `ContentType.user`. List content should be restricted to actual item tables unless a user-item relationship is deliberately added.

### 5.6 Messaging and notifications

| Entity | Fields and relationships |
|---|---|
| `Inbox` | `id`; groups participants and messages. |
| `UserInbox` | `id`, `userId`, `inboxId`; unique `(userId, inboxId)`. |
| `Message` | `id`, `text`, `createdAt`, `read`, nullable `editedAt`, `senderId`, `receiverId`, `inboxId`. |
| `Notification` | `id`, `type`, `content`, `status`, `createdAt`, recipient `userId`, sender `senderId`. |

`NotificationStatus`: `read`, `unread`. `NotificationType`: `follow_request`, `message_received`, `liked_review`, `disliked_review`, `list_shared`, `list_permission_updated`, `list_activity`.

### 5.7 Forum

| Entity | Fields and relationships |
|---|---|
| `ForumCategory` | `id`, `name`, `description`, `createdAt`, `updatedAt`, `order`, `isActive`, unique `slug`, `topicCount`, `postCount`, nullable `lastPostAt`, nullable unique `lastPostId`. |
| `UserForumModerator` | `id`, `createdAt`, `userId`, `categoryId`; unique user/category pair. |
| `ForumTopic` | `id`, `title`, `content`, `createdAt`, `updatedAt`, `isPinned`, `isLocked`, unique `slug`, `viewCount`, `lastPostAt`, `isModerated`, nullable `closedAt`, `status`, nullable `closedById`, `categoryId`, `userId`. Has tags, posts, bookmarks, votes, and watchers. |
| `ForumTag` | `id`, unique `name`, nullable `description`, nullable `color`, `createdAt`; many-to-many with topics. |
| `ForumPost` | `id`, `content`, `createdAt`, nullable `updatedAt`, `isEdited`, `isModerated`, unique `slug`, `type`, `isAnswer`, `isDeleted`, nullable `answeredAt`/`deletedAt`, `topicId`, `userId`, nullable `answeredById`/`deletedById`. Has replies, attachments, votes, and edit history. |
| `ForumReply` | `id`, `content`, `createdAt`, nullable `updatedAt`, `isEdited`, `isModerated`, `postId`, `userId`; has votes and edit history. |
| `Attachment` | `id`, `filename`, `fileUrl`, `fileSize`, `mimeType`, `uploadedAt`, `isPublic`, nullable `description`, `postId`, `userId`. |
| `UpvoteForumTopic`, `UpvoteForumPost`, `UpvoteForumReply` | Unique user/target vote records. Forum topic/post/reply models have upvotes, but no corresponding downvote models. |
| `UserForumTopicFavorite`, `UserForumTopicWatch` | Topic bookmark/watch relationships unique per user/topic; watch records also have `createdAt`. |
| `ForumPostHistory`, `ForumReplyHistory` | Immutable prior `content`, `editedAt`, target ID, and `editedById`. |
| `ForumUserStats` | `id`, unique `userId`, `topicCount`, `postCount`, `replyCount`, `upvotesReceived`, `reputation`, nullable `lastPostAt`. |

Enums: `TopicStatus` = `Open`, `Closed`, `Archived`; `PostType` = `Normal`, `Announcement`, `Sticky`, `Question`, `Answered`.

### 5.8 Reports and moderation

| Entity | Fields and relationships |
|---|---|
| `ReportedContent` | `id`, `reportType`, nullable `reason`, `createdAt`, `status`, nullable `resolutionDetails`, `contentId`, `reportingUserId`, nullable `reportedUserId`. |
| `ModerationLog` | `id`, `actionType`, `timestamp`, nullable `details`, `moderatorUserId`, nullable `targetUserId`, nullable `targetContentId`. |

`ReportType`: `Review`, `Comment`, `User`, `Message`, `Other`. `ReportStatus`: `Pending`, `Resolved`, `Rejected`. `ModerationAction`: `DeleteReview`, `DeleteComment`, `BanUser`, `WarnUser`.

`ReportedContent.contentId` and moderation `targetContentId` are polymorphic integer references without database foreign keys or an explicit content-type column. Add an explicit target type in a migration before relying on them across heterogeneous content types.

### 5.9 Aggregate/support entities

- `UserListStats` and `ForumUserStats` are stored counters; update them transactionally or recompute them from source records to prevent drift.
- `ForumCategory.topicCount`, `postCount`, `lastPostAt`, and `lastPostId` are also denormalized summary data.
- Join, favorite, rating, vote, watch, bookmark, and share tables are relationship entities; their unique constraints should be preserved in the Spring/JPA or database layer.

## 6. Proposed REST API for Spring

All paths below are under `/api/v1`. Unless marked public, require an authenticated user. The API should take the acting user from the security principal.

### 6.1 Authentication and account

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register account; validate unique username/email and registration fields; send activation email. |
| `POST` | `/auth/login` | Public | Authenticate by email or username and password; return the configured session/token response. |
| `POST` | `/auth/logout` | Authenticated | Invalidate current session/refresh token. |
| `POST` | `/auth/refresh` | Refresh credential | Rotate/refresh authentication credentials if token-based auth is selected. |
| `GET` | `/auth/me` | Authenticated | Return current principal and authentication state. |
| `POST` | `/auth/email-verification-requests` | Public | Resend activation request without revealing whether an account exists. |
| `POST` | `/auth/email-verifications` | Public | Consume activation token; activate account. Body: `{ "token": "..." }`. |
| `POST` | `/auth/password-reset-requests` | Public | Create one-time reset token and send email. |
| `POST` | `/auth/password-resets` | Public with valid token | Set a new password and consume token. Body: `{ "token": "...", "newPassword": "..." }`. |
| `POST` | `/auth/password-changes` | Authenticated | Change password after verifying current password. |

Use Spring Security. Choose and document a session-cookie or bearer-token contract before implementation; the existing browser client currently uses NextAuth sessions, so changing auth mechanisms requires a coordinated frontend change. Never accept an email alone as authorization to change a password.

### 6.2 Catalog, search, and genres

Apply this resource pattern to `movies`, `series`, `seasons`, `episodes`, `actors`, `crew`, and `genres`:

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/{resource}` | Public | Paginated collection with search, filter, and sort query parameters. |
| `GET` | `/{resource}/{id}` | Public | Resource details, with related catalog data where applicable. |
| `POST` | `/{resource}` | Admin | Create catalog record. |
| `PATCH` | `/{resource}/{id}` | Admin | Update catalog record and its supplied relationships. |
| `DELETE` | `/{resource}/{id}` | Admin | Delete catalog record; define cascades consistently with database relations. |

Additional catalog routes:

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/search?term=...&types=...` | Public | Search across selected catalog types and optionally users; paginated per type or as a normalized result collection. |
| `GET` | `/movies/{id}/related` | Public | Related movies based on catalog relations or genres. |
| `GET` | `/series/{id}/related` | Public | Related series. |
| `GET` | `/seasons/{id}/related` | Public | Related seasons. |
| `GET` | `/episodes/{id}/related` | Public | Related episodes. |
| `GET` | `/movies/latest` | Public | Recently aired/added movies, with documented ordering. |
| `GET` | `/series/latest` | Public | Recently aired/added series. |
| `GET` | `/seasons/latest` | Public | Recently aired/added seasons. |
| `GET` | `/episodes/latest` | Public | Recently aired/added episodes. |

Catalog collection query parameters should include `page`, `limit`, `sortBy`, `direction`, `q` (case-insensitive substring search), and relevant filters such as `genreId`, `dateAiredFrom`, `dateAiredTo`, `ratingImdbMin`, `ratingImdbMax`, `durationMin`, `durationMax`, and parent IDs (`serieId`, `seasonId`). Do not permit arbitrary database field names from clients.

For movies/series, create/update should accept relation ID arrays such as `actorIds`, `crewIds`, and `genreIds`; validate referenced IDs and update join tables in the same transaction.

### 6.3 Profiles, favorites, ratings, and reviews

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/users` | Admin | Search and paginate users; response must omit secrets. |
| `GET` | `/users/{id}` | Public profile | Return public profile information. |
| `GET` | `/users/me` | Authenticated | Return current user's private profile view. |
| `PATCH` | `/users/me` | Authenticated | Update allowed profile fields. |
| `PUT` / `DELETE` | `/users/me/avatar` | Authenticated | Set or clear avatar URL/reference. |
| `PATCH` | `/admin/users/{id}` | Admin | Update administrative fields and role/state. |
| `DELETE` | `/admin/users/{id}` | Admin | Delete account subject to cascade and audit policy. |
| `GET` | `/users/{id}/favorites` | Public or owner | List favorites; restrict private data as appropriate. |
| `PUT` / `DELETE` | `/users/me/favorites/{type}/{contentId}` | Authenticated | Add/remove a favorite. `{type}` is `movies`, `series`, `seasons`, `episodes`, `actors`, `crew`, or `genres`. |
| `GET` | `/users/me/ratings` | Authenticated | List current user's content ratings. |
| `PUT` | `/users/me/ratings/{type}/{contentId}` | Authenticated | Create/update rating; validate rating range agreed with the product. |
| `DELETE` | `/users/me/ratings/{type}/{contentId}` | Authenticated | Remove rating. |
| `GET` | `/{type}/{contentId}/reviews` | Public | Paginated reviews for a supported target type. |
| `PUT` | `/{type}/{contentId}/reviews/me` | Authenticated | Create or replace the current user's single review for the target. |
| `DELETE` | `/{type}/{contentId}/reviews/me` | Authenticated | Delete the current user's review. |
| `PUT` | `/reviews/{reviewId}/vote` | Authenticated | Set current user's vote; body `{ "value": 1 }` or `{ "value": -1 }`. |
| `DELETE` | `/reviews/{reviewId}/vote` | Authenticated | Remove current user's vote. |
| `GET` | `/users/{id}/reviews` | Public | List reviews written by a user. |

`{type}` for ratings/reviews is `movies`, `series`, `seasons`, `episodes`, `actors`, or `crew`. Review `rating` range and whether text-only reviews are permitted must be confirmed as product rules; the Prisma schema does not constrain them.

### 6.4 Follows, inboxes, messages, and notifications

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/users/{id}/followers` | Public | List accepted followers. |
| `GET` | `/users/{id}/following` | Public | List users followed by this user. |
| `POST` | `/users/{id}/follow-requests` | Authenticated | Request to follow; create pending or accepted relation according to privacy policy. |
| `DELETE` | `/users/{id}/follow` | Authenticated | Unfollow or cancel pending request. |
| `GET` | `/users/me/follow-requests` | Authenticated | List pending requests received by current user. |
| `POST` | `/users/me/follow-requests/{requestId}/accept` | Authenticated | Accept a pending request addressed to current user. |
| `POST` | `/users/me/follow-requests/{requestId}/reject` | Authenticated | Reject a pending request addressed to current user. |
| `GET` | `/users/me/inboxes` | Authenticated | List current user's inboxes. |
| `GET` | `/inboxes/{inboxId}/messages` | Participant | Paginated inbox messages. |
| `POST` | `/inboxes/{inboxId}/messages` | Participant | Send message; body `{ "text": "..." }`. |
| `PATCH` | `/messages/{messageId}` | Sender | Edit own message. |
| `DELETE` | `/messages/{messageId}` | Sender or Admin | Delete message under documented deletion policy. |
| `POST` | `/messages/{messageId}/read` | Receiver | Mark message read. |
| `GET` | `/users/me/notifications` | Authenticated | Paginated notifications, newest first; optional unread filter. |
| `GET` | `/users/me/notifications/unread-count` | Authenticated | Return unread count. |
| `POST` | `/users/me/notifications/read` | Authenticated | Mark all current user's notifications read. |
| `POST` | `/users/me/notifications/{notificationId}/read` | Authenticated | Mark one owned notification read. |

Messages and notifications must be scoped to the authenticated participant/recipient. The existing notification route takes `userId` from the query string without checking ownership; do not preserve that authorization pattern in Spring.

### 6.5 Lists and sharing

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/users/{id}/lists` | Public/private according to visibility | List user's visible collections. |
| `GET` | `/users/me/lists` | Authenticated | List current user's collections. |
| `POST` | `/users/me/lists` | Authenticated | Create list. Body includes `name`, optional `description`, and `isPrivate`. |
| `GET` | `/lists/{listId}` | Owner, collaborator, or public | Read list metadata and visibility-appropriate contents. |
| `PATCH` | `/lists/{listId}` | Owner or edit collaborator | Update metadata, visibility, archive state, and content type. |
| `DELETE` | `/lists/{listId}` | Owner | Delete list. |
| `GET` | `/lists/{listId}/items` | Reader | Paginated items, ordered by `orderIndex`; optionally filter by type. |
| `POST` | `/lists/{listId}/items` | Owner or edit collaborator | Add one or more items of supported types, with optional note. |
| `DELETE` | `/lists/{listId}/items/{type}/{contentId}` | Owner or edit collaborator | Remove an item. |
| `DELETE` | `/lists/{listId}/items` | Owner or edit collaborator | Remove all list items. |
| `PATCH` | `/lists/{listId}/items/order` | Owner or edit collaborator | Reorder items; validate each item belongs to this list and update transactionally. |
| `GET` | `/users/me/shared-lists` | Authenticated | Lists shared with current user. |
| `POST` | `/lists/{listId}/shares` | Owner | Share with user; body `{ "userId": 123, "canEdit": false }`. |
| `PATCH` | `/lists/{listId}/shares/{userId}` | Owner | Change collaborator permission. |
| `DELETE` | `/lists/{listId}/shares/{userId}` | Owner | Revoke sharing. |

`{type}` is `movies`, `series`, `seasons`, `episodes`, `actors`, or `crew`. Enforce the unique list/content constraint, item content type, owner/collaborator permissions, and private-list visibility. When adding a shared-list item, record the authenticated actor in that item's `userId`.

### 6.6 Forum

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/forum/categories` | Public | Paginated/ordered active categories. |
| `GET` | `/forum/categories/{categoryId}` | Public | Category details and summary. |
| `POST` / `PATCH` / `DELETE` | `/admin/forum/categories[/{categoryId}]` | Admin | Manage categories. |
| `GET` | `/forum/topics` | Public | Filter/paginate topics by category, tag, status, and sort order. |
| `POST` | `/forum/topics` | Authenticated | Create topic with title, body, category, and optional tag IDs. |
| `GET` | `/forum/topics/{topicId}` | Public | Topic detail; increment view count according to defined policy. |
| `PATCH` | `/forum/topics/{topicId}` | Owner/moderator | Edit topic or moderation state. |
| `DELETE` | `/forum/topics/{topicId}` | Owner/moderator | Delete topic according to retention policy. |
| `POST` | `/forum/topics/{topicId}/pin` | Moderator | Pin/unpin topic. |
| `POST` | `/forum/topics/{topicId}/lock` | Moderator | Lock/unlock topic. |
| `POST` | `/forum/topics/{topicId}/close` | Moderator | Close/archive topic and record closer/time. |
| `PUT` / `DELETE` | `/forum/topics/{topicId}/bookmark` | Authenticated | Add/remove topic favorite. |
| `PUT` / `DELETE` | `/forum/topics/{topicId}/watch` | Authenticated | Start/stop watching topic. |
| `PUT` / `DELETE` | `/forum/topics/{topicId}/vote` | Authenticated | Add/remove topic upvote. |
| `GET` / `POST` | `/forum/topics/{topicId}/posts` | Public read; authenticated write | List/create posts in topic. |
| `GET` / `PATCH` / `DELETE` | `/forum/posts/{postId}` | Public read; owner/moderator write | Read, edit, or delete a post. |
| `POST` | `/forum/posts/{postId}/answer` | Topic owner/moderator | Mark post as the accepted answer or clear accepted answer. |
| `PUT` / `DELETE` | `/forum/posts/{postId}/vote` | Authenticated | Add/remove post upvote. |
| `GET` / `POST` | `/forum/posts/{postId}/replies` | Public read; authenticated write | List/create replies. |
| `PATCH` / `DELETE` | `/forum/replies/{replyId}` | Owner/moderator | Edit/delete reply. |
| `PUT` / `DELETE` | `/forum/replies/{replyId}/vote` | Authenticated | Add/remove reply upvote. |
| `GET` / `POST` | `/forum/tags` | Public read; Admin write | List/create tags. |
| `PATCH` / `DELETE` | `/admin/forum/tags/{tagId}` | Admin | Edit/delete tag. |
| `GET` | `/forum/search?q=...` | Public | Search topic/post content. |
| `POST` | `/forum/posts/{postId}/attachments` | Authenticated | Add attachment metadata for an uploaded file. |
| `GET` | `/forum/stats` | Public | Forum/category statistics. |
| `PUT` / `DELETE` | `/admin/forum/categories/{categoryId}/moderators/{userId}` | Admin | Add/remove category moderator. |

Forum edits should append history records and update `isEdited`, `updatedAt`, and editor metadata. Enforce topic lock/status before accepting new posts. Uploaded binary storage is not described by the Prisma schema; define a storage provider and upload limits independently.

### 6.7 Reports and administration

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/reports` | Authenticated | Report content/user; body identifies explicit `targetType`, `targetId`, `reportType`, and optional reason. |
| `GET` | `/admin/reports` | Admin/moderator | Filter/paginate reports by status/type. |
| `PATCH` | `/admin/reports/{reportId}` | Admin/moderator | Resolve/reject with resolution details. |
| `POST` | `/admin/moderation-actions` | Admin/moderator | Record moderation action and perform associated operation (warn, ban, remove content). |
| `GET` | `/admin/moderation-logs` | Admin | Search/paginate audit log. |
| `GET` | `/admin/stats` | Admin | User, catalog, list, and forum totals for administrative screens. |

Before implementing reports, add a `targetType` (or equivalent typed relation) to `ReportedContent`; validate the target and reporting policy. Do not trust a submitted `reportedUserId` without resolving the target entity.

## 7. Validation and business rules to preserve or decide

### Existing database constraints to preserve

- `User.userName` and `User.email` are unique.
- Account provider identity is unique by `(provider, providerAccountId)`.
- Follow relationship, favorite, rating, review, vote, forum upvote/bookmark/watch, list item, and list share pairs are unique as described above.
- Forum category/topic/post slugs and forum tag names are unique.
- A list item can occur once per list and content ID; ordering is scoped to list.
- Deleting many catalog/user/forum records cascades to dependent data according to Prisma `onDelete` rules. The Spring migration must explicitly verify equivalent FK behavior.

### Validation rules present in the current application

- Registration schema requires username length 3–20 using letters, numbers, and underscore; valid email; strong password (8+ characters, uppercase, lowercase, number, and one of `@$!%*?&`); matching confirmation; birthday between 1900 and today; `Male`/`Female`; valid international phone; country; and acceptance of terms.
- User profile schema requires a non-empty username/email, age 13–120 when supplied, `Male`/`Female`, valid phone, and country of at least two characters.
- List creation requires non-empty name and boolean `isPrivate`; description is optional.

Preserve client-facing validation where compatibility requires it, but enforce all security-sensitive and integrity rules on the server.

### Product/API decisions required before final implementation

- Rating scale and accepted precision for IMDb/user/review ratings.
- Duration units and valid duration ranges.
- Whether follow requests are required for every account or only private profiles (the schema has no profile privacy field).
- Authentication mechanism and frontend migration from NextAuth.
- Whether deleting user content is hard-delete or soft-delete; current models use cascade behavior, while forum content also has deletion flags.
- List default/system-list creation behavior; schema has `isDefault` but no seeded-list contract.
- Whether review content/rating are independently optional and how aggregate ratings are calculated.
- Forum attachment limits/storage provider and reportable target types.
- Whether to add explicit indexes/constraints for polymorphic moderation/report references and mutually exclusive review voting.

## 8. Spring implementation notes

- Map Prisma `Int` IDs to PostgreSQL integer-compatible Java IDs and `Float` to a deliberate decimal type. Consider `BigDecimal` plus a database migration for ratings if exact decimal arithmetic is needed.
- Keep persistence entities separate from public DTOs; never serialize user password, tokens, or private OAuth fields.
- Use DTO validation (`jakarta.validation`) at API boundaries and service-level authorization for all mutations.
- Use database transactions for multi-table operations: catalog relationship updates, vote switching, list reorder/bulk item changes/shares, forum answer changes/history, notification state changes, and account activation/reset token consumption.
- Preserve database unique constraints as race-condition protection and translate conflicts to `409`.
- Avoid returning `any`-style unbounded relation graphs; define stable response DTOs and explicit include/expand behavior.
- Add integration tests for authentication, authorization, ownership, unique constraints, cascade behavior, list collaboration, token single-use, pagination, and forum moderation.

## 9. Current implementation references

- Prisma schema: `prisma/schema/models/`
- Next.js REST handlers: `src/app/api/`
- Catalog Server Actions: `src/actions/`
- User, review, and social Server Actions: `src/actions/user/`
- List Server Actions: `src/actions/list/`
- Forum Server Actions: `src/actions/forum/`
- Validation schemas: `src/schemas/`
