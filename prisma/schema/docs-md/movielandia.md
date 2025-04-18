# Movielandia24
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

## default
```mermaid
erDiagram
"Actor" {
  Int id PK
  String fullname
  String photoSrc
  String photoSrcProd
  String description
  String debut
}
"ActorReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int actorId FK
}
"UpvoteActorReview" {
  Int id PK
  Int userId FK
  Int actorId FK
  Int actorReviewId FK
}
"DownvoteActorReview" {
  Int id PK
  Int userId FK
  Int actorId FK
  Int actorReviewId FK
}
"Account" {
  String id PK
  String type
  String provider
  String refresh_token "nullable"
  String access_token "nullable"
  Int expires_at "nullable"
  String token_type "nullable"
  String scope "nullable"
  String id_token "nullable"
  String session_state "nullable"
  Int userId FK
  String providerAccountId
}
"Session" {
  String id PK
  String sessionToken UK
  DateTime expires
  Int userId FK
}
"VerificationToken" {
  String identifier
  String token UK
  DateTime expires
}
"ActivateToken" {
  Int id PK
  String token UK
  DateTime createdAt
  DateTime activatedAt "nullable"
  Int userId FK
}
"ResetPasswordToken" {
  Int id PK
  String token UK
  DateTime createdAt
  DateTime resetPasswordAt "nullable"
  Int userId FK
}
"Crew" {
  Int id PK
  String fullname
  String photoSrc
  String role
  String photoSrcProd
  String description
  String debut
}
"CrewReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int crewId FK
}
"UpvoteCrewReview" {
  Int id PK
  Int userId FK
  Int crewId FK
  Int crewReviewId FK
}
"DownvoteCrewReview" {
  Int id PK
  Int userId FK
  Int crewId FK
  Int crewReviewId FK
}
"Episode" {
  Int id PK
  String title
  String photoSrc
  String photoSrcProd
  String trailerSrc
  String description
  Int duration
  DateTime dateAired "nullable"
  Float ratingImdb
  Int seasonId FK
}
"EpisodeReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int episodeId FK
}
"UpvoteEpisodeReview" {
  Int id PK
  Int userId FK
  Int episodeId FK
  Int episodeReviewId FK
}
"DownvoteEpisodeReview" {
  Int id PK
  Int userId FK
  Int episodeId FK
  Int episodeReviewId FK
}
"ForumCategory" {
  Int id PK
  String name
  String description
  DateTime createdAt
  DateTime updatedAt
  Int order
  Boolean isActive
  String slug UK
  Int topicCount
  Int postCount
  DateTime lastPostAt "nullable"
  Int lastPostId FK,UK "nullable"
}
"UserForumModerator" {
  Int id PK
  DateTime createdAt
  Int userId FK
  Int categoryId FK
}
"ForumPost" {
  Int id PK
  String content
  DateTime createdAt
  DateTime updatedAt "nullable"
  Boolean isEdited
  Int editCount
  DateTime lastEditAt "nullable"
  Boolean isModerated
  String slug UK
  PostType type
  Boolean isAnswer
  Boolean isDeleted
  DateTime answeredAt "nullable"
  DateTime deletedAt "nullable"
  Int topicId FK
  Int userId FK
  Int answeredById FK "nullable"
  Int deletedById FK "nullable"
}
"Attachment" {
  Int id PK
  String filename
  String fileUrl
  Int fileSize
  String mimeType
  DateTime uploadedAt
  Boolean isPublic
  String description "nullable"
  Int postId FK
  Int userId FK
}
"UpvoteForumPost" {
  Int id PK
  Int userId FK
  Int postId FK
}
"DownvoteForumPost" {
  Int id PK
  Int userId FK
  Int postId FK
}
"ForumPostHistory" {
  Int id PK
  String content
  DateTime editedAt
  Int postId FK
  Int editedById FK
}
"ForumReply" {
  Int id PK
  String content
  DateTime createdAt
  DateTime updatedAt "nullable"
  Boolean isEdited
  Int editCount
  DateTime lastEditAt "nullable"
  Boolean isModerated
  Int postId FK
  Int userId FK
}
"UpvoteForumReply" {
  Int id PK
  Int userId FK
  Int replyId FK
}
"DownvoteForumReply" {
  Int id PK
  Int userId FK
  Int replyId FK
}
"ForumReplyHistory" {
  Int id PK
  String content
  DateTime editedAt
  Int replyId FK
  Int editedById FK
}
"ForumTag" {
  Int id PK
  String name UK
  String description "nullable"
  String color "nullable"
  DateTime createdAt
}
"ForumTopic" {
  Int id PK
  String title
  String content
  DateTime createdAt
  DateTime updatedAt
  Boolean isPinned
  Boolean isLocked
  String slug UK
  Int viewCount
  DateTime lastPostAt
  Boolean isModerated
  DateTime closedAt "nullable"
  TopicStatus status
  Int closedById FK "nullable"
  Int categoryId FK
  Int userId FK
}
"UserForumTopicWatch" {
  Int id PK
  DateTime createdAt
  Int userId FK
  Int topicId FK
}
"UserForumTopicFavorite" {
  Int id PK
  Int userId FK
  Int topicId FK
}
"UpvoteForumTopic" {
  Int id PK
  Int userId FK
  Int topicId FK
}
"DownvoteForumTopic" {
  Int id PK
  Int userId FK
  Int topicId FK
}
"Genre" {
  Int id PK
  String name
}
"List" {
  Int id PK
  String name
  String description "nullable"
  Boolean isPrivate
  Boolean isArchived
  Boolean isDefault
  DateTime createdAt
  ContentType contentType "nullable"
  DateTime updatedAt
  DateTime lastViewedAt "nullable"
  Int userId FK
}
"ListShare" {
  Int id PK
  Boolean canEdit
  DateTime sharedAt
  Int listId FK
  Int userId FK
}
"ListMovie" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int movieId FK
  Int userId FK
}
"ListSerie" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int serieId FK
  Int userId FK
}
"ListSeason" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int seasonId FK
  Int userId FK
}
"ListEpisode" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int episodeId FK
  Int userId FK
}
"ListActor" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int actorId FK
  Int userId FK
}
"ListCrew" {
  Int id PK
  DateTime addedAt
  String note "nullable"
  Int orderIndex
  Int listId FK
  Int crewId FK
  Int userId FK
}
"ListActivityMovie" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int movieId FK
  Int userId FK
}
"ListActivitySerie" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int serieId FK
  Int userId FK
}
"ListActivitySeason" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int seasonId FK
  Int userId FK
}
"ListActivityEpisode" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int episodeId FK
  Int userId FK
}
"ListActivityActor" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int actorId FK
  Int userId FK
}
"ListActivityCrew" {
  Int id PK
  ListActionType actionType
  Json metadata "nullable"
  DateTime createdAt
  Int listId FK
  Int crewId FK
  Int userId FK
}
"Inbox" {
  Int id PK
}
"Message" {
  Int id PK
  String text
  DateTime createdAt
  Boolean read
  DateTime editedAt "nullable"
  Int senderId FK
  Int receiverId FK
  Int inboxId FK
}
"UserInbox" {
  Int id PK
  Int userId FK
  Int inboxId FK
}
"ReportedContent" {
  Int id PK
  ReportType reportType
  String reason "nullable"
  DateTime createdAt
  ReportStatus status
  String resolutionDetails "nullable"
  Int contentId
  Int reportingUserId FK
  Int reportedUserId FK "nullable"
}
"ModerationLog" {
  Int id PK
  ModerationAction actionType
  DateTime timestamp
  String details "nullable"
  Int moderatorUserId FK
  Int targetUserId FK "nullable"
  Int targetContentId "nullable"
}
"Movie" {
  Int id PK
  String title
  String photoSrc
  String photoSrcProd
  String trailerSrc
  Int duration
  Float ratingImdb
  DateTime dateAired "nullable"
  String description
}
"MovieReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int movieId FK
}
"UpvoteMovieReview" {
  Int id PK
  Int userId FK
  Int movieId FK
  Int movieReviewId FK
}
"DownvoteMovieReview" {
  Int id PK
  Int userId FK
  Int movieId FK
  Int movieReviewId FK
}
"CastMovie" {
  Int id PK
  Int movieId FK
  Int actorId FK
}
"CrewMovie" {
  Int id PK
  Int movieId FK
  Int crewId FK
}
"MovieGenre" {
  Int id PK
  Int movieId FK
  Int genreId FK
}
"Notification" {
  Int id PK
  NotificationType type
  String content
  NotificationStatus status
  DateTime createdAt
  Int userId FK
  Int senderId FK
}
"Season" {
  Int id PK
  String title
  String photoSrc
  String photoSrcProd
  String trailerSrc
  String description
  DateTime dateAired "nullable"
  Float ratingImdb
  Int serieId FK
}
"SeasonReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int seasonId FK
}
"UpvoteSeasonReview" {
  Int id PK
  Int userId FK
  Int seasonId FK
  Int seasonReviewId FK
}
"DownvoteSeasonReview" {
  Int id PK
  Int userId FK
  Int seasonId FK
  Int seasonReviewId FK
}
"Serie" {
  Int id PK
  String title
  String photoSrc
  String photoSrcProd
  String trailerSrc
  String description
  DateTime dateAired "nullable"
  Float ratingImdb
}
"UpvoteSerieReview" {
  Int id PK
  Int userId FK
  Int serieId FK
  Int serieReviewId FK
}
"DownvoteSerieReview" {
  Int id PK
  Int userId FK
  Int serieId FK
  Int serieReviewId FK
}
"SerieReview" {
  Int id PK
  String content "nullable"
  Float rating "nullable"
  DateTime createdAt
  DateTime updatedAt "nullable"
  Int userId FK
  Int serieId FK
}
"SerieGenre" {
  Int id PK
  Int serieId FK
  Int genreId FK
}
"CastSerie" {
  Int id PK
  Int serieId FK
  Int actorId FK
}
"CrewSerie" {
  Int id PK
  Int serieId FK
  Int crewId FK
}
"User" {
  Int id PK
  String userName UK
  String email UK
  String password "nullable"
  UserType role
  String bio "nullable"
  Int age "nullable"
  DateTime birthday "nullable"
  Gender gender
  String phone
  String countryFrom
  Boolean active
  Boolean canResetPassword
  Boolean subscribed
}
"Avatar" {
  Int id PK
  String photoSrc
  Int userId FK,UK
}
"UserFollow" {
  Int id PK
  FollowState state
  Int followerId FK
  Int followingId FK
}
"ForumUserStats" {
  Int id PK
  Int userId FK,UK
  Int topicCount
  Int postCount
  Int replyCount
  Int upvotesReceived
  Int reputation
  DateTime lastPostAt "nullable"
}
"UserListStats" {
  Int id PK
  Int userId FK,UK
  Int totalLists
  Int totalItems
  Int sharedLists
  DateTime lastListAt "nullable"
}
"UserMovieFavorite" {
  Int id PK
  Int userId FK
  Int movieId FK
}
"UserGenreFavorite" {
  Int id PK
  Int userId FK
  Int genreId FK
}
"UserSerieFavorite" {
  Int id PK
  Int userId FK
  Int serieId FK
}
"UserEpisodeFavorite" {
  Int id PK
  Int userId FK
  Int episodeId FK
}
"UserSeasonFavorite" {
  Int id PK
  Int userId FK
  Int seasonId FK
}
"UserActorFavorite" {
  Int id PK
  Int userId FK
  Int actorId FK
}
"UserCrewFavorite" {
  Int id PK
  Int userId FK
  Int crewId FK
}
"UserMovieRating" {
  Int id PK
  Float rating
  Int userId FK
  Int movieId FK
}
"UserSerieRating" {
  Int id PK
  Float rating
  Int userId FK
  Int serieId FK
}
"UserSeasonRating" {
  Int id PK
  Float rating
  Int userId FK
  Int seasonId FK
}
"UserEpisodeRating" {
  Int id PK
  Float rating
  Int userId FK
  Int episodeId FK
}
"UserActorRating" {
  Int id PK
  Float rating
  Int userId FK
  Int actorId FK
}
"UserCrewRating" {
  Int id PK
  Float rating
  Int userId FK
  Int crewId FK
}
"_ForumTagToForumTopic" {
  String A FK
  String B FK
}
"ActorReview" }o--|| "User" : user
"ActorReview" }o--|| "Actor" : actor
"UpvoteActorReview" }o--|| "User" : user
"UpvoteActorReview" }o--|| "Actor" : actor
"UpvoteActorReview" }o--|| "ActorReview" : actorReview
"DownvoteActorReview" }o--|| "User" : user
"DownvoteActorReview" }o--|| "Actor" : actor
"DownvoteActorReview" }o--|| "ActorReview" : actorReview
"Account" }o--|| "User" : user
"Session" }o--|| "User" : user
"ActivateToken" }o--|| "User" : user
"ResetPasswordToken" }o--|| "User" : user
"CrewReview" }o--|| "User" : user
"CrewReview" }o--|| "Crew" : crew
"UpvoteCrewReview" }o--|| "User" : user
"UpvoteCrewReview" }o--|| "Crew" : crew
"UpvoteCrewReview" }o--|| "CrewReview" : crewReview
"DownvoteCrewReview" }o--|| "User" : user
"DownvoteCrewReview" }o--|| "Crew" : crew
"DownvoteCrewReview" }o--|| "CrewReview" : crewReview
"Episode" }o--|| "Season" : season
"EpisodeReview" }o--|| "User" : user
"EpisodeReview" }o--|| "Episode" : episode
"UpvoteEpisodeReview" }o--|| "User" : user
"UpvoteEpisodeReview" }o--|| "Episode" : episode
"UpvoteEpisodeReview" }o--|| "EpisodeReview" : episodeReview
"DownvoteEpisodeReview" }o--|| "User" : user
"DownvoteEpisodeReview" }o--|| "Episode" : episode
"DownvoteEpisodeReview" }o--|| "EpisodeReview" : episodeReview
"ForumCategory" |o--o| "ForumPost" : lastPost
"UserForumModerator" }o--|| "User" : user
"UserForumModerator" }o--|| "ForumCategory" : category
"ForumPost" }o--|| "ForumTopic" : topic
"ForumPost" }o--|| "User" : user
"ForumPost" }o--o| "User" : answeredBy
"ForumPost" }o--o| "User" : deletedBy
"Attachment" }o--|| "User" : user
"Attachment" }o--|| "ForumPost" : post
"UpvoteForumPost" }o--|| "User" : user
"UpvoteForumPost" }o--|| "ForumPost" : post
"DownvoteForumPost" }o--|| "User" : user
"DownvoteForumPost" }o--|| "ForumPost" : post
"ForumPostHistory" }o--|| "ForumPost" : post
"ForumPostHistory" }o--|| "User" : editedBy
"ForumReply" }o--|| "ForumPost" : post
"ForumReply" }o--|| "User" : user
"UpvoteForumReply" }o--|| "User" : user
"UpvoteForumReply" }o--|| "ForumReply" : reply
"DownvoteForumReply" }o--|| "User" : user
"DownvoteForumReply" }o--|| "ForumReply" : reply
"ForumReplyHistory" }o--|| "ForumReply" : reply
"ForumReplyHistory" }o--|| "User" : editedBy
"ForumTopic" }o--o| "User" : closedBy
"ForumTopic" }o--|| "ForumCategory" : category
"ForumTopic" }o--|| "User" : user
"UserForumTopicWatch" }o--|| "User" : user
"UserForumTopicWatch" }o--|| "ForumTopic" : topic
"UserForumTopicFavorite" }o--|| "User" : user
"UserForumTopicFavorite" }o--|| "ForumTopic" : topic
"UpvoteForumTopic" }o--|| "User" : user
"UpvoteForumTopic" }o--|| "ForumTopic" : topic
"DownvoteForumTopic" }o--|| "User" : user
"DownvoteForumTopic" }o--|| "ForumTopic" : topic
"List" }o--|| "User" : user
"ListShare" }o--|| "List" : list
"ListShare" }o--|| "User" : user
"ListMovie" }o--|| "List" : list
"ListMovie" }o--|| "Movie" : movie
"ListMovie" }o--|| "User" : user
"ListSerie" }o--|| "List" : list
"ListSerie" }o--|| "Serie" : serie
"ListSerie" }o--|| "User" : user
"ListSeason" }o--|| "List" : list
"ListSeason" }o--|| "Season" : season
"ListSeason" }o--|| "User" : user
"ListEpisode" }o--|| "List" : list
"ListEpisode" }o--|| "Episode" : episode
"ListEpisode" }o--|| "User" : user
"ListActor" }o--|| "List" : list
"ListActor" }o--|| "Actor" : actor
"ListActor" }o--|| "User" : user
"ListCrew" }o--|| "List" : list
"ListCrew" }o--|| "Crew" : crew
"ListCrew" }o--|| "User" : user
"ListActivityMovie" }o--|| "List" : list
"ListActivityMovie" }o--|| "Movie" : movie
"ListActivityMovie" }o--|| "User" : user
"ListActivitySerie" }o--|| "List" : list
"ListActivitySerie" }o--|| "Serie" : serie
"ListActivitySerie" }o--|| "User" : user
"ListActivitySeason" }o--|| "List" : list
"ListActivitySeason" }o--|| "Season" : season
"ListActivitySeason" }o--|| "User" : user
"ListActivityEpisode" }o--|| "List" : list
"ListActivityEpisode" }o--|| "Episode" : episode
"ListActivityEpisode" }o--|| "User" : user
"ListActivityActor" }o--|| "List" : list
"ListActivityActor" }o--|| "Actor" : actor
"ListActivityActor" }o--|| "User" : user
"ListActivityCrew" }o--|| "List" : list
"ListActivityCrew" }o--|| "Crew" : crew
"ListActivityCrew" }o--|| "User" : user
"Message" }o--|| "User" : receiver
"Message" }o--|| "User" : sender
"Message" }o--|| "Inbox" : inbox
"UserInbox" }o--|| "User" : user
"UserInbox" }o--|| "Inbox" : inbox
"ReportedContent" }o--|| "User" : reportingUser
"ReportedContent" }o--o| "User" : reportedUser
"ModerationLog" }o--|| "User" : moderatorUser
"ModerationLog" }o--o| "User" : targetUser
"MovieReview" }o--|| "User" : user
"MovieReview" }o--|| "Movie" : movie
"UpvoteMovieReview" }o--|| "User" : user
"UpvoteMovieReview" }o--|| "Movie" : movie
"UpvoteMovieReview" }o--|| "MovieReview" : movieReview
"DownvoteMovieReview" }o--|| "User" : user
"DownvoteMovieReview" }o--|| "Movie" : movie
"DownvoteMovieReview" }o--|| "MovieReview" : movieReview
"CastMovie" }o--|| "Movie" : movie
"CastMovie" }o--|| "Actor" : actor
"CrewMovie" }o--|| "Movie" : movie
"CrewMovie" }o--|| "Crew" : crew
"MovieGenre" }o--|| "Movie" : movie
"MovieGenre" }o--|| "Genre" : genre
"Notification" }o--|| "User" : user
"Notification" }o--|| "User" : sender
"Season" }o--|| "Serie" : serie
"SeasonReview" }o--|| "User" : user
"SeasonReview" }o--|| "Season" : season
"UpvoteSeasonReview" }o--|| "User" : user
"UpvoteSeasonReview" }o--|| "Season" : season
"UpvoteSeasonReview" }o--|| "SeasonReview" : seasonReview
"DownvoteSeasonReview" }o--|| "User" : user
"DownvoteSeasonReview" }o--|| "Season" : season
"DownvoteSeasonReview" }o--|| "SeasonReview" : seasonReview
"UpvoteSerieReview" }o--|| "User" : user
"UpvoteSerieReview" }o--|| "Serie" : serie
"UpvoteSerieReview" }o--|| "SerieReview" : serieReview
"DownvoteSerieReview" }o--|| "User" : user
"DownvoteSerieReview" }o--|| "Serie" : serie
"DownvoteSerieReview" }o--|| "SerieReview" : serieReview
"SerieReview" }o--|| "User" : user
"SerieReview" }o--|| "Serie" : serie
"SerieGenre" }o--|| "Serie" : serie
"SerieGenre" }o--|| "Genre" : genre
"CastSerie" }o--|| "Serie" : serie
"CastSerie" }o--|| "Actor" : actor
"CrewSerie" }o--|| "Serie" : serie
"CrewSerie" }o--|| "Crew" : crew
"Avatar" |o--|| "User" : user
"UserFollow" }o--|| "User" : follower
"UserFollow" }o--|| "User" : following
"ForumUserStats" |o--|| "User" : user
"UserListStats" |o--|| "User" : user
"UserMovieFavorite" }o--|| "User" : user
"UserMovieFavorite" }o--|| "Movie" : movie
"UserGenreFavorite" }o--|| "User" : user
"UserGenreFavorite" }o--|| "Genre" : genre
"UserSerieFavorite" }o--|| "User" : user
"UserSerieFavorite" }o--|| "Serie" : serie
"UserEpisodeFavorite" }o--|| "User" : user
"UserEpisodeFavorite" }o--|| "Episode" : episode
"UserSeasonFavorite" }o--|| "User" : user
"UserSeasonFavorite" }o--|| "Season" : season
"UserActorFavorite" }o--|| "User" : user
"UserActorFavorite" }o--|| "Actor" : actor
"UserCrewFavorite" }o--|| "User" : user
"UserCrewFavorite" }o--|| "Crew" : crew
"UserMovieRating" }o--|| "User" : user
"UserMovieRating" }o--|| "Movie" : movie
"UserSerieRating" }o--|| "User" : user
"UserSerieRating" }o--|| "Serie" : serie
"UserSeasonRating" }o--|| "User" : user
"UserSeasonRating" }o--|| "Season" : season
"UserEpisodeRating" }o--|| "User" : user
"UserEpisodeRating" }o--|| "Episode" : episode
"UserActorRating" }o--|| "User" : user
"UserActorRating" }o--|| "Actor" : actor
"UserCrewRating" }o--|| "User" : user
"UserCrewRating" }o--|| "Crew" : crew
"_ForumTagToForumTopic" }o--|| "ForumTag" : ForumTag
"_ForumTagToForumTopic" }o--|| "ForumTopic" : ForumTopic
```

### `Actor`

**Properties**
  - `id`: 
  - `fullname`: 
  - `photoSrc`: 
  - `photoSrcProd`: 
  - `description`: 
  - `debut`: 

### `ActorReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `actorId`: 

### `UpvoteActorReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `actorId`: 
  - `actorReviewId`: 

### `DownvoteActorReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `actorId`: 
  - `actorReviewId`: 

### `Account`

**Properties**
  - `id`: 
  - `type`: 
  - `provider`: 
  - `refresh_token`: 
  - `access_token`: 
  - `expires_at`: 
  - `token_type`: 
  - `scope`: 
  - `id_token`: 
  - `session_state`: 
  - `userId`: 
  - `providerAccountId`: 

### `Session`

**Properties**
  - `id`: 
  - `sessionToken`: 
  - `expires`: 
  - `userId`: 

### `VerificationToken`

**Properties**
  - `identifier`: 
  - `token`: 
  - `expires`: 

### `ActivateToken`

**Properties**
  - `id`: 
  - `token`: 
  - `createdAt`: 
  - `activatedAt`: 
  - `userId`: 

### `ResetPasswordToken`

**Properties**
  - `id`: 
  - `token`: 
  - `createdAt`: 
  - `resetPasswordAt`: 
  - `userId`: 

### `Crew`

**Properties**
  - `id`: 
  - `fullname`: 
  - `photoSrc`: 
  - `role`: 
  - `photoSrcProd`: 
  - `description`: 
  - `debut`: 

### `CrewReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `crewId`: 

### `UpvoteCrewReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `crewId`: 
  - `crewReviewId`: 

### `DownvoteCrewReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `crewId`: 
  - `crewReviewId`: 

### `Episode`

**Properties**
  - `id`: 
  - `title`: 
  - `photoSrc`: 
  - `photoSrcProd`: 
  - `trailerSrc`: 
  - `description`: 
  - `duration`: 
  - `dateAired`: 
  - `ratingImdb`: 
  - `seasonId`: 

### `EpisodeReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `episodeId`: 

### `UpvoteEpisodeReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `episodeId`: 
  - `episodeReviewId`: 

### `DownvoteEpisodeReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `episodeId`: 
  - `episodeReviewId`: 

### `ForumCategory`

**Properties**
  - `id`: 
  - `name`: 
  - `description`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `order`: 
  - `isActive`: 
  - `slug`: 
  - `topicCount`: 
  - `postCount`: 
  - `lastPostAt`: 
  - `lastPostId`: 

### `UserForumModerator`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `userId`: 
  - `categoryId`: 

### `ForumPost`

**Properties**
  - `id`: 
  - `content`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `isEdited`: 
  - `editCount`: 
  - `lastEditAt`: 
  - `isModerated`: 
  - `slug`: 
  - `type`: 
  - `isAnswer`: 
  - `isDeleted`: 
  - `answeredAt`: 
  - `deletedAt`: 
  - `topicId`: 
  - `userId`: 
  - `answeredById`: 
  - `deletedById`: 

### `Attachment`

**Properties**
  - `id`: 
  - `filename`: 
  - `fileUrl`: 
  - `fileSize`: 
  - `mimeType`: 
  - `uploadedAt`: 
  - `isPublic`: 
  - `description`: 
  - `postId`: 
  - `userId`: 

### `UpvoteForumPost`

**Properties**
  - `id`: 
  - `userId`: 
  - `postId`: 

### `DownvoteForumPost`

**Properties**
  - `id`: 
  - `userId`: 
  - `postId`: 

### `ForumPostHistory`

**Properties**
  - `id`: 
  - `content`: 
  - `editedAt`: 
  - `postId`: 
  - `editedById`: 

### `ForumReply`

**Properties**
  - `id`: 
  - `content`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `isEdited`: 
  - `editCount`: 
  - `lastEditAt`: 
  - `isModerated`: 
  - `postId`: 
  - `userId`: 

### `UpvoteForumReply`

**Properties**
  - `id`: 
  - `userId`: 
  - `replyId`: 

### `DownvoteForumReply`

**Properties**
  - `id`: 
  - `userId`: 
  - `replyId`: 

### `ForumReplyHistory`

**Properties**
  - `id`: 
  - `content`: 
  - `editedAt`: 
  - `replyId`: 
  - `editedById`: 

### `ForumTag`

**Properties**
  - `id`: 
  - `name`: 
  - `description`: 
  - `color`: 
  - `createdAt`: 

### `ForumTopic`

**Properties**
  - `id`: 
  - `title`: 
  - `content`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `isPinned`: 
  - `isLocked`: 
  - `slug`: 
  - `viewCount`: 
  - `lastPostAt`: 
  - `isModerated`: 
  - `closedAt`: 
  - `status`: 
  - `closedById`: 
  - `categoryId`: 
  - `userId`: 

### `UserForumTopicWatch`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `userId`: 
  - `topicId`: 

### `UserForumTopicFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `topicId`: 

### `UpvoteForumTopic`

**Properties**
  - `id`: 
  - `userId`: 
  - `topicId`: 

### `DownvoteForumTopic`

**Properties**
  - `id`: 
  - `userId`: 
  - `topicId`: 

### `Genre`

**Properties**
  - `id`: 
  - `name`: 

### `List`

**Properties**
  - `id`: 
  - `name`: 
  - `description`: 
  - `isPrivate`: 
  - `isArchived`: 
  - `isDefault`: 
  - `createdAt`: 
  - `contentType`: 
  - `updatedAt`: 
  - `lastViewedAt`: 
  - `userId`: 

### `ListShare`

**Properties**
  - `id`: 
  - `canEdit`: 
  - `sharedAt`: 
  - `listId`: 
  - `userId`: 

### `ListMovie`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `movieId`: 
  - `userId`: 

### `ListSerie`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `serieId`: 
  - `userId`: 

### `ListSeason`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `seasonId`: 
  - `userId`: 

### `ListEpisode`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `episodeId`: 
  - `userId`: 

### `ListActor`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `actorId`: 
  - `userId`: 

### `ListCrew`

**Properties**
  - `id`: 
  - `addedAt`: 
  - `note`: 
  - `orderIndex`: 
  - `listId`: 
  - `crewId`: 
  - `userId`: 

### `ListActivityMovie`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `movieId`: 
  - `userId`: 

### `ListActivitySerie`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `serieId`: 
  - `userId`: 

### `ListActivitySeason`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `seasonId`: 
  - `userId`: 

### `ListActivityEpisode`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `episodeId`: 
  - `userId`: 

### `ListActivityActor`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `actorId`: 
  - `userId`: 

### `ListActivityCrew`

**Properties**
  - `id`: 
  - `actionType`: 
  - `metadata`: 
  - `createdAt`: 
  - `listId`: 
  - `crewId`: 
  - `userId`: 

### `Inbox`

**Properties**
  - `id`: 

### `Message`

**Properties**
  - `id`: 
  - `text`: 
  - `createdAt`: 
  - `read`: 
  - `editedAt`: 
  - `senderId`: 
  - `receiverId`: 
  - `inboxId`: 

### `UserInbox`

**Properties**
  - `id`: 
  - `userId`: 
  - `inboxId`: 

### `ReportedContent`

**Properties**
  - `id`: 
  - `reportType`: 
  - `reason`: 
  - `createdAt`: 
  - `status`: 
  - `resolutionDetails`: 
  - `contentId`: 
  - `reportingUserId`: 
  - `reportedUserId`: 

### `ModerationLog`

**Properties**
  - `id`: 
  - `actionType`: 
  - `timestamp`: 
  - `details`: 
  - `moderatorUserId`: 
  - `targetUserId`: 
  - `targetContentId`: 

### `Movie`

**Properties**
  - `id`: 
  - `title`: 
  - `photoSrc`: 
  - `photoSrcProd`: 
  - `trailerSrc`: 
  - `duration`: 
  - `ratingImdb`: 
  - `dateAired`: 
  - `description`: 

### `MovieReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `movieId`: 

### `UpvoteMovieReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `movieId`: 
  - `movieReviewId`: 

### `DownvoteMovieReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `movieId`: 
  - `movieReviewId`: 

### `CastMovie`

**Properties**
  - `id`: 
  - `movieId`: 
  - `actorId`: 

### `CrewMovie`

**Properties**
  - `id`: 
  - `movieId`: 
  - `crewId`: 

### `MovieGenre`

**Properties**
  - `id`: 
  - `movieId`: 
  - `genreId`: 

### `Notification`

**Properties**
  - `id`: 
  - `type`: 
  - `content`: 
  - `status`: 
  - `createdAt`: 
  - `userId`: 
  - `senderId`: 

### `Season`

**Properties**
  - `id`: 
  - `title`: 
  - `photoSrc`: 
  - `photoSrcProd`: 
  - `trailerSrc`: 
  - `description`: 
  - `dateAired`: 
  - `ratingImdb`: 
  - `serieId`: 

### `SeasonReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `seasonId`: 

### `UpvoteSeasonReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `seasonId`: 
  - `seasonReviewId`: 

### `DownvoteSeasonReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `seasonId`: 
  - `seasonReviewId`: 

### `Serie`

**Properties**
  - `id`: 
  - `title`: 
  - `photoSrc`: 
  - `photoSrcProd`: 
  - `trailerSrc`: 
  - `description`: 
  - `dateAired`: 
  - `ratingImdb`: 

### `UpvoteSerieReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `serieId`: 
  - `serieReviewId`: 

### `DownvoteSerieReview`

**Properties**
  - `id`: 
  - `userId`: 
  - `serieId`: 
  - `serieReviewId`: 

### `SerieReview`

**Properties**
  - `id`: 
  - `content`: 
  - `rating`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `userId`: 
  - `serieId`: 

### `SerieGenre`

**Properties**
  - `id`: 
  - `serieId`: 
  - `genreId`: 

### `CastSerie`

**Properties**
  - `id`: 
  - `serieId`: 
  - `actorId`: 

### `CrewSerie`

**Properties**
  - `id`: 
  - `serieId`: 
  - `crewId`: 

### `User`

**Properties**
  - `id`: 
  - `userName`: 
  - `email`: 
  - `password`: 
  - `role`: 
  - `bio`: 
  - `age`: 
  - `birthday`: 
  - `gender`: 
  - `phone`: 
  - `countryFrom`: 
  - `active`: 
  - `canResetPassword`: 
  - `subscribed`: 

### `Avatar`

**Properties**
  - `id`: 
  - `photoSrc`: 
  - `userId`: 

### `UserFollow`

**Properties**
  - `id`: 
  - `state`: 
  - `followerId`: 
  - `followingId`: 

### `ForumUserStats`

**Properties**
  - `id`: 
  - `userId`: 
  - `topicCount`: 
  - `postCount`: 
  - `replyCount`: 
  - `upvotesReceived`: 
  - `reputation`: 
  - `lastPostAt`: 

### `UserListStats`

**Properties**
  - `id`: 
  - `userId`: 
  - `totalLists`: 
  - `totalItems`: 
  - `sharedLists`: 
  - `lastListAt`: 

### `UserMovieFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `movieId`: 

### `UserGenreFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `genreId`: 

### `UserSerieFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `serieId`: 

### `UserEpisodeFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `episodeId`: 

### `UserSeasonFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `seasonId`: 

### `UserActorFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `actorId`: 

### `UserCrewFavorite`

**Properties**
  - `id`: 
  - `userId`: 
  - `crewId`: 

### `UserMovieRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `movieId`: 

### `UserSerieRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `serieId`: 

### `UserSeasonRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `seasonId`: 

### `UserEpisodeRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `episodeId`: 

### `UserActorRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `actorId`: 

### `UserCrewRating`

**Properties**
  - `id`: 
  - `rating`: 
  - `userId`: 
  - `crewId`: 

### `_ForumTagToForumTopic`
Pair relationship table between [ForumTag](#ForumTag) and [ForumTopic](#ForumTopic)

**Properties**
  - `A`: 
  - `B`: 