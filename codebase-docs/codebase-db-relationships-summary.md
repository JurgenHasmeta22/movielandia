**1. Total Number of Database Tables (Prisma Models):**

We have a total of **35 database tables**.

**2. Total Number of Relationships:**

The total number of relationships is **59**.

**3. Number of Junction Tables (Relation Tables):**

Junction tables are used to implement Many-to-Many relationships.
The junction tables are:

1.  `CastMovie`
2.  `CrewMovie`
3.  `MovieGenre`
4.  `CastSerie`
5.  `CrewSerie`
6.  `SerieGenre`
7.  `UserInbox`

Therefore, the total number of junction tables is **7**.

**Actor Model (9 Relationships)**

1.  `Actor` to `CastMovie` (One-to-many): `starredMovies`
2.  `Actor` to `CastSerie` (One-to-many): `starredSeries`
3.  `Actor` to `ActorReview` (One-to-many): `reviews`
4.  `Actor` to `UserActorRating` (One-to-many): `usersWhoRatedIt`
5.  `Actor` to `UserActorFavorite` (One-to-many): `usersWhoBookmarkedIt`
6.  `Actor` to `UpvoteActorReview` (One-to-many): `upvoteActorReviews`
7.  `Actor` to `DownvoteActorReview` (One-to-many): `downvoteActorReviews`
8.  `ActorReview` to `UpvoteActorReview` (One-to-many): `upvotes`
9.  `ActorReview` to `DownvoteActorReview` (One-to-many): `downvotes`

**Auth Model (2 Relationships)**

1.  `Account` to `User` (Many-to-one): `user`
2.  `Session` to `User` (Many-to-one): `user`

**Crew Model (9 Relationships)**

1.  `Crew` to `CrewMovie` (One-to-many): `producedMovies`
2.  `Crew` to `CrewSerie` (One-to-many): `producedSeries`
3.  `Crew` to `CrewReview` (One-to-many): `reviews`
4.  `Crew` to `UserCrewRating` (One-to-many): `usersWhoRatedIt`
5.  `Crew` to `UserCrewFavorite` (One-to-many): `usersWhoBookmarkedIt`
6.  `Crew` to `UpvoteCrewReview` (One-to-many): `upvoteCrewReviews`
7.  `Crew` to `DownvoteCrewReview` (One-to-many): `downvoteCrewReviews`
8.  `CrewReview` to `UpvoteCrewReview` (One-to-many): `upvotes`
9.  `CrewReview` to `DownvoteCrewReview` (One-to-many): `downvotes`

**Episode Model (8 Relationships)**

1.  `Episode` to `Season` (Many-to-one): `season`
2.  `Episode` to `UserEpisodeFavorite` (One-to-many): `usersWhoBookmarkedIt`
3.  `Episode` to `UserEpisodeRating` (One-to-many): `usersWhoRatedIt`
4.  `Episode` to `EpisodeReview` (One-to-many): `reviews`
5.  `Episode` to `UpvoteEpisodeReview` (One-to-many): `upvoteEpisodeReviews`
6.  `Episode` to `DownvoteEpisodeReview` (One-to-many): `downvoteEpisodeReviews`
7.  `EpisodeReview` to `UpvoteEpisodeReview` (One-to-many): `upvotes`
8.  `EpisodeReview` to `DownvoteEpisodeReview` (One-to-many): `downvotes`

**Genre Model (3 Relationships)**

1.  `Genre` to `MovieGenre` (One-to-many): `movies`
2.  `Genre` to `SerieGenre` (One-to-many): `series`
3.  `Genre` to `UserGenreFavorite` (One-to-many): `usersWhoBookmarkedIt`

**Movie Model (10 Relationships)**

1.  `Movie` to `MovieGenre` (One-to-many): `genres`
2.  `Movie` to `CastMovie` (One-to-many): `cast`
3.  `Movie` to `CrewMovie` (One-to-many): `crew`
4.  `Movie` to `MovieReview` (One-to-many): `reviews`
5.  `Movie` to `UserMovieFavorite` (One-to-many): `usersWhoBookmarkedIt`
6.  `Movie` to `UserMovieRating` (One-to-many): `usersWhoRatedIt`
7.  `Movie` to `UpvoteMovieReview` (One-to-many): `upvoteMovieReviews`
8.  `Movie` to `DownvoteMovieReview` (One-to-many): `downvoteMovieReviews`
9.  `MovieReview` to `UpvoteMovieReview` (One-to-many): `upvotes`
10. `MovieReview` to `DownvoteMovieReview` (One-to-many): `downvotes`

**Season Model (9 Relationships)**

1.  `Season` to `Serie` (Many-to-one): `serie`
2.  `Season` to `Episode` (One-to-many): `episodes`
3.  `Season` to `UserSeasonFavorite` (One-to-many): `usersWhoBookmarkedIt`
4.  `Season` to `UserSeasonRating` (One-to-many): `usersWhoRatedIt`
5.  `Season` to `SeasonReview` (One-to-many): `reviews`
6.  `Season` to `UpvoteSeasonReview` (One-to-many): `UpvoteSeasonReview`
7.  `Season` to `DownvoteSeasonReview` (One-to-many): `DownvoteSeasonReview`
8.  `SeasonReview` to `UpvoteSeasonReview` (One-to-many): `upvotes`
9.  `SeasonReview` to `DownvoteSeasonReview` (One-to-many): `downvotes`

**Serie Model (11 Relationships)**

1.  `Serie` to `SerieGenre` (One-to-many): `genres`
2.  `Serie` to `CastSerie` (One-to-many): `cast`
3.  `Serie` to `CrewSerie` (One-to-many): `crew`
4.  `Serie` to `Season` (One-to-many): `seasons`
5.  `Serie` to `SerieReview` (One-to-many): `reviews`
6.  `Serie` to `UserSerieFavorite` (One-to-many): `usersWhoBookmarkedIt`
7.  `Serie` to `UserSerieRating` (One-to-many): `usersWhoRatedIt`
8.  `Serie` to `UpvoteSerieReview` (One-to-many): `upvoteSerieReviews`
9.  `Serie` to `DownvoteSerieReview` (One-to-many): `downvoteSerieReviews`
10. `SerieReview` to `UpvoteSerieReview` (One-to-many): `upvotes`
11. `SerieReview` to `DownvoteSerieReview` (One-to-many): `downvotes`

**User Model (43 Relationships)**

1.  `User` to `ActivateToken` (One-to-many): `activateTokens`
2.  `User` to `ResetPasswordToken` (One-to-many): `resetPassowrdTokens`
3.  `User` to `UserMovieFavorite` (One-to-many): `favMovies`
4.  `User` to `UserSerieFavorite` (One-to-many): `favSeries`
5.  `User` to `UserGenreFavorite` (One-to-many): `favGenres`
6.  `User` to `UserSeasonFavorite` (One-to-many): `favSeasons`
7.  `User` to `UserEpisodeFavorite` (One-to-many): `favEpisodes`
8.  `User` to `UserActorFavorite` (One-to-many): `favActors`
9.  `User` to `UserCrewFavorite` (One-to-many): `favCrew`
10. `User` to `UserMovieRating` (One-to-many): `ratingsInMovie`
11. `User` to `UserSerieRating` (One-to-many): `ratingsInSerie`
12. `User` to `UserSeasonRating` (One-to-many): `ratingsInSeason`
13. `User` to `UserEpisodeRating` (One-to-many): `ratingsInEpisode`
14. `User` to `UserActorRating` (One-to-many): `ratingsInActor`
15. `User` to `UserCrewRating` (One-to-many): `ratingsInCrew`
16. `User` to `MovieReview` (One-to-many): `movieReviews`
17. `User` to `SerieReview` (One-to-many): `serieReviews`
18. `User` to `SeasonReview` (One-to-many): `seasonReviews`
19. `User` to `EpisodeReview` (One-to-many): `episodeReviews`
20. `User` to `ActorReview` (One-to-many): `actorReviews`
21. `User` to `CrewReview` (One-to-many): `crewReviews`
22. `User` to `UpvoteMovieReview` (One-to-many): `movieReviewsUpvoted`
23. `User` to `DownvoteMovieReview` (One-to-many): `movieReviewsDownvoted`
24. `User` to `UpvoteSerieReview` (One-to-many): `serieReviewsUpvoted`
25. `User` to `DownvoteSerieReview` (One-to-many): `serieReviewsDownvoted`
26. `User` to `UpvoteSeasonReview` (One-to-many): `seasonReviewsUpvoted`
27. `User` to `DownvoteSeasonReview` (One-to-many): `seasonReviewsDownvoted`
28. `User` to `UpvoteEpisodeReview` (One-to-many): `episodeReviewsUpvoted`
29. `User` to `DownvoteEpisodeReview` (One-to-many): `episodeReviewsDownvoted`
30. `User` to `UpvoteActorReview` (One-to-many): `actorReviewsUpvoted`
31. `User` to `DownvoteActorReview` (One-to-many): `actorReviewsDownvoted`
32. `User` to `UpvoteCrewReview` (One-to-many): `crewReviewsUpvoted`
33. `User` to `DownvoteCrewReview` (One-to-many): `crewReviewsDownvoted`
34. `User` to `Avatar` (One-to-one): `avatar`
35. `User` to `UserFollow` (One-to-many - Followers): `followers`
36. `User` to `UserFollow` (One-to-many - Following): `following`
37. `User` to `UserInbox` (One-to-many): `inboxs`
38. `User` to `Message` (One-to-many - Sent Messages): `messagesSent`
39. `User` to `Message` (One-to-many - Received Messages): `messagesReceived`
40. `User` to `Account` (One-to-many): `accounts`
41. `User` to `Session` (One-to-many): `sessions`
42. `User` to `Notification` (One-to-many - Notification Receiver): `notificationsReceived`
43. `User` to `Notification` (One-to-many - Notification Sender): `notificationsSent`

**UserFollow Model (2 Relationships)**

1.  `UserFollow` to `User` (Many-to-one - Follower): `follower`
2.  `UserFollow` to `User` (Many-to-one - Following): `following`

**UserInbox Model (2 Relationships)**

1.  `UserInbox` to `User` (Many-to-one): `user`
2.  `UserInbox` to `Inbox` (Many-to-one): `inbox`

**Inbox Model (2 Relationships)**

1.  `Inbox` to `UserInbox` (One-to-many): `participants`
2.  `Inbox` to `Message` (One-to-many): `messages`

**Message Model (3 Relationships)**

1.  `Message` to `User` (Many-to-one - Sender): `sender`
2.  `Message` to `User` (Many-to-one - Receiver): `receiver`
3.  `Message` to `Inbox` (Many-to-one): `inbox`
