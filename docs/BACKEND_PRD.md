# MovieLandia24 Backend PRD

## 1. Purpose

This document describes the current MovieLandia24 backend behavior and data model as implemented with Next.js and Prisma. Repository paths are relative to the project root.

### Source of truth and status labels

- **Current schema** means present in `prisma/schema/models/*.prisma`.
- **Current behavior** means present in a Next.js Route Handler or Server Action.
- **Known gap** means a behavior or schema limitation that should be considered when changing the backend.

The database uses PostgreSQL and Prisma. Most application operations are implemented as Next.js Server Actions. The current HTTP routes are listed in section 4.

## 2. Product scope

MovieLandia24 supports:

- Browsing, searching, filtering, and managing movies, TV series, seasons, episodes, actors, crew, and genres.
- User registration, email activation, password reset, profiles, avatars, favorites, ratings, and reviews.
- Review voting and user-to-user follow relationships.
- Private messages and notifications.
- User-created lists containing multiple kinds of media and people, with sharing and edit permissions.
- A discussion forum with categories, topics, posts, replies, tags, votes, attachments, and moderation metadata.
- Administrative content management and user moderation.

## 3. Identity and authorization considerations

### Roles in the schema

The database defines `UserType`: `User`, `Admin`.

- Forum category moderators are represented by `UserForumModerator`; they are not a separate global `UserType`.
- `ListShare.canEdit` records whether a collaborator has edit permission.

Authorization for private data and mutations must be checked on the server using the authenticated session and resource ownership or role. A caller-supplied `userId` alone is not proof of authorization. The current notification handler is a known exception: it accepts a `userId` query parameter without checking that it belongs to the session user.

## 4. Current HTTP endpoints

These are the HTTP routes implemented in the Next.js application today.

| Method | Current path | Current behavior |
|---|---|---|
| `GET` | `/api` | Returns `{ authenticated: true }` when a NextAuth session exists; otherwise `401`. |
| `GET` | `/api/genres` | Returns all genres. |
| `GET` | `/api/search/all?term=...&filters=...` | Case-insensitive substring search across selected movies, series, actors, crew, seasons, episodes, and users. Empty/missing term returns `{}`. Returns up to five items and a total per selected type. |
| `GET` | `/api/notifications?userId=...&page=1&limit=5` | Returns notifications for the supplied user ID, newest first, including limited sender details. The handler does not derive the recipient from the authenticated principal. |
| `GET` | `/api/verifyRegister?token=...&email=...` | Validates an activation token and activates its user. |
| `GET` | `/api/verifyResetPassword?token=...&email=...` | Validates a reset token and sets `canResetPassword`. |
| `POST` | `/api/changePassword` | Accepts `{ "email": "...", "newPassword": "..." }`; changes the password only if `canResetPassword` is true, then clears that flag. |
| NextAuth-managed | `/api/auth/[...nextauth]` | NextAuth authentication endpoints, including configured providers and session behavior. |

Most domain reads and mutations are Server Actions under `src/actions/`, including catalog CRUD, user actions, reviews/votes, social functions, lists, and forum functions. They are callable by the Next.js app and are not separate HTTP routes.

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

The activation and reset token models have no expiration field. The current reset flow verifies a token, sets `canResetPassword`, then checks that flag during password update. Any future reset-flow changes should add explicit token expiration and preserve single-use behavior.

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

Catalog descriptions are PostgreSQL text fields. IMDb ratings and durations are numeric fields in the schema; acceptable ranges and units are not consistently constrained there and must be validated by the application. The schema does not include pagination or filter models; those are query behavior.

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
- Join, favorite, rating, vote, watch, bookmark, and share tables are relationship entities; their unique constraints should be preserved by the application and database.

## 6. Validation and business rules to preserve or decide

### Existing database constraints to preserve

- `User.userName` and `User.email` are unique.
- Account provider identity is unique by `(provider, providerAccountId)`.
- Follow relationship, favorite, rating, review, vote, forum upvote/bookmark/watch, list item, and list share pairs are unique as described above.
- Forum category/topic/post slugs and forum tag names are unique.
- A list item can occur once per list and content ID; ordering is scoped to list.
- Deleting many catalog/user/forum records cascades to dependent data according to Prisma `onDelete` rules. Backend changes must preserve and verify these foreign-key behaviors.

### Validation rules present in the current application

- Registration schema requires username length 3–20 using letters, numbers, and underscore; valid email; strong password (8+ characters, uppercase, lowercase, number, and one of `@$!%*?&`); matching confirmation; birthday between 1900 and today; `Male`/`Female`; valid international phone; country; and acceptance of terms.
- User profile schema requires a non-empty username/email, age 13–120 when supplied, `Male`/`Female`, valid phone, and country of at least two characters.
- List creation requires non-empty name and boolean `isPrivate`; description is optional.

Preserve client-facing validation where compatibility requires it, but enforce all security-sensitive and integrity rules on the server.

### Open backend product and technical decisions

- Rating scale and accepted precision for IMDb/user/review ratings.
- Duration units and valid duration ranges.
- Whether follow requests are required for every account or only private profiles (the schema has no profile privacy field).
- Whether deleting user content is hard-delete or soft-delete; current models use cascade behavior, while forum content also has deletion flags.
- List default/system-list creation behavior; schema has `isDefault` but no seeded-list contract.
- Whether review content/rating are independently optional and how aggregate ratings are calculated.
- Activation and reset token expiration; the current token models have no expiration fields.
- Forum attachment limits/storage provider and reportable target types.
- Whether to add explicit indexes/constraints for polymorphic moderation/report references and mutually exclusive review voting.

## 7. Current implementation references

- Prisma schema: `prisma/schema/models/`
- Next.js Route Handlers: `src/app/api/`
- Catalog Server Actions: `src/actions/`
- User, review, and social Server Actions: `src/actions/user/`
- List Server Actions: `src/actions/list/`
- Forum Server Actions: `src/actions/forum/`
- Validation schemas: `src/schemas/`
