**1. Actor Model Relationships**

- **Relationship 1**: `Actor` to `CastMovie` (One-to-many)

    - Type: One-to-many (Actor can star in many movies)
    - Name: `starredMovies` (implicitly named, as it's the field name in `Actor` model)
    - Related Models: `Actor` and `CastMovie`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `CastMovie.actorId` (Foreign Key, referencing `Actor.id`)
    - On Delete/Update: `Cascade` (on `CastMovie.actor` relation)
    - Explanation: An actor can have multiple entries in the `CastMovie` table, representing their roles in different movies. Deleting an actor will also delete their entries in `CastMovie`.

- **Relationship 2**: `Actor` to `CastSerie` (One-to-many)

    - Type: One-to-many (Actor can star in many series)
    - Name: `starredSeries` (implicitly named)
    - Related Models: `Actor` and `CastSerie`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `CastSerie.actorId` (Foreign Key, referencing `Actor.id`)
    - On Delete/Update: `Cascade` (on `CastSerie.actor` relation)
    - Explanation: Similar to movies, an actor can star in multiple series, represented by entries in `CastSerie`. Deleting an actor also deletes their entries in `CastSerie`.

- **Relationship 3**: `Actor` to `ActorReview` (One-to-many)

    - Type: One-to-many (Actor can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Actor` and `ActorReview`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `ActorReview.actorId` (Foreign Key, referencing `Actor.id`)
    - On Delete/Update: `Cascade` (on `ActorReview.actor` relation)
    - Explanation: Actors can be reviewed multiple times by different users, with each review stored in `ActorReview`. Deleting an actor will also delete all associated reviews.

- **Relationship 4**: `Actor` to `UserActorRating` (One-to-many)

    - Type: One-to-many (Actor can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Actor` and `UserActorRating`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `UserActorRating.actorId` (Foreign Key, referencing `Actor.id`)
    - Explanation: Many users can rate a single actor, with each rating stored in `UserActorRating`.

- **Relationship 5**: `Actor` to `UserActorFavorite` (One-to-many)

    - Type: One-to-many (Actor can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Actor` and `UserActorFavorite`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `UserActorFavorite.actorId` (Foreign Key, referencing `Actor.id`)
    - Explanation: Users can bookmark actors as favorites, creating entries in `UserActorFavorite`.

- **Relationship 6**: `Actor` to `UpvoteActorReview` (One-to-many)

    - Type: One-to-many (Actor can have many upvoted reviews)
    - Name: `upvoteActorReviews` (implicitly named)
    - Related Models: `Actor` and `UpvoteActorReview`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `UpvoteActorReview.actorId` (Foreign Key, referencing `Actor.id`)
    - On Delete: `Cascade` (on `UpvoteActorReview.actor` relation)
    - Explanation: Tracks upvotes for reviews of actors.

- **Relationship 7**: `Actor` to `DownvoteActorReview` (One-to-many)

    - Type: One-to-many (Actor can have many downvoted reviews)
    - Name: `downvoteActorReviews` (implicitly named)
    - Related Models: `Actor` and `DownvoteActorReview`
    - Fields & References:
        - `Actor.id` (Primary Key)
        - `DownvoteActorReview.actorId` (Foreign Key, referencing `Actor.id`)
    - On Delete: `Cascade` (on `DownvoteActorReview.actor` relation)
    - Explanation: Tracks downvotes for reviews of actors.

- **Relationship 8**: `ActorReview` to `UpvoteActorReview` (One-to-many)

    - Type: One-to-many (ActorReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `ActorReview` and `UpvoteActorReview`
    - Fields & References:
        - `ActorReview.id` (Primary Key)
        - `UpvoteActorReview.actorReviewId` (Foreign Key, referencing `ActorReview.id`)
    - On Delete: `Cascade` (on `UpvoteActorReview.actorReview` relation)
    - Explanation: Tracks upvotes for individual actor reviews.

- **Relationship 9**: `ActorReview` to `DownvoteActorReview` (One-to-many)
    - Type: One-to-many (ActorReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `ActorReview` and `DownvoteActorReview`
    - Fields & References:
        - `ActorReview.id` (Primary Key)
        - `DownvoteActorReview.actorReviewId` (Foreign Key, referencing `ActorReview.id`)
    - On Delete: `Cascade` (on `DownvoteActorReview.actorReview` relation)
    - Explanation: Tracks downvotes for individual actor reviews.

**2. Auth Model Relationships**

- **Relationship 1**: `Account` to `User` (Many-to-one)

    - Type: Many-to-one (Many accounts can belong to one user)
    - Name: `user` (implicitly named)
    - Related Models: `Account` and `User`
    - Fields & References:
        - `Account.userId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete: `Cascade` (on `Account.user` relation)
    - Explanation: Links user accounts (like Google login) to user profiles. Deleting a user will also delete associated accounts.

- **Relationship 2**: `Session` to `User` (Many-to-one)
    - Type: Many-to-one (Many sessions can belong to one user)
    - Name: `user` (implicitly named)
    - Related Models: `Session` and `User`
    - Fields & References:
        - `Session.userId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete: `Cascade` (on `Session.user` relation)
    - Explanation: Tracks user login sessions. Deleting a user will also invalidate their sessions.

**3. Crew Model Relationships**

- **Relationship 1**: `Crew` to `ProducedMovie` (One-to-many)

    - Type: One-to-many (Crew member can produce many movies)
    - Name: `producedMovies` (implicitly named)
    - Related Models: `Crew` and `CrewMovie`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `CrewMovie.crewId` (Foreign Key, referencing `Crew.id`)
    - On Delete/Update: `Cascade` (on `CrewMovie.crew` relation)
    - Explanation: Crew members can be producers for multiple movies. Deleting a crew member will also delete their entries in `CrewMovie`.

- **Relationship 2**: `Crew` to `ProducedSerie` (One-to-many)

    - Type: One-to-many (Crew member can produce many series)
    - Name: `producedSeries` (implicitly named)
    - Related Models: `Crew` and `CrewSerie`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `CrewSerie.crewId` (Foreign Key, referencing `Crew.id`)
    - On Delete/Update: `Cascade` (on `CrewSerie.crew` relation)
    - Explanation: Crew members can be producers for multiple series. Deleting a crew member will also delete their entries in `CrewSerie`.

- **Relationship 3**: `Crew` to `CrewReview` (One-to-many)

    - Type: One-to-many (Crew member can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Crew` and `CrewReview`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `CrewReview.crewId` (Foreign Key, referencing `Crew.id`)
    - On Delete/Update: `Cascade` (on `CrewReview.crew` relation)
    - Explanation: Crew members can be reviewed by multiple users. Deleting a crew member will also delete all associated reviews.

- **Relationship 4**: `Crew` to `UserCrewRating` (One-to-many)

    - Type: One-to-many (Crew member can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Crew` and `UserCrewRating`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `UserCrewRating.crewId` (Foreign Key, referencing `Crew.id`)
    - Explanation: Many users can rate a single crew member, with each rating stored in `UserCrewRating`.

- **Relationship 5**: `Crew` to `UserCrewFavorite` (One-to-many)

    - Type: One-to-many (Crew member can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Crew` and `UserCrewFavorite`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `UserCrewFavorite.crewId` (Foreign Key, referencing `Crew.id`)
    - Explanation: Users can bookmark crew members as favorites, creating entries in `UserCrewFavorite`.

- **Relationship 6**: `Crew` to `UpvoteCrewReview` (One-to-many)

    - Type: One-to-many (Crew can have many upvoted reviews)
    - Name: `upvoteCrewReviews` (implicitly named)
    - Related Models: `Crew` and `UpvoteCrewReview`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `UpvoteCrewReview.crewId` (Foreign Key, referencing `Crew.id`)
    - On Delete: `Cascade` (on `UpvoteCrewReview.crew` relation)
    - Explanation: Tracks upvotes for reviews of crew members.

- **Relationship 7**: `Crew` to `DownvoteCrewReview` (One-to-many)

    - Type: One-to-many (Crew can have many downvoted reviews)
    - Name: `downvoteCrewReviews` (implicitly named)
    - Related Models: `Crew` and `DownvoteCrewReview`
    - Fields & References:
        - `Crew.id` (Primary Key)
        - `DownvoteCrewReview.crewId` (Foreign Key, referencing `Crew.id`)
    - On Delete: `Cascade` (on `DownvoteCrewReview.crew` relation)
    - Explanation: Tracks downvotes for reviews of crew members.

- **Relationship 8**: `CrewReview` to `UpvoteCrewReview` (One-to-many)

    - Type: One-to-many (CrewReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `CrewReview` and `UpvoteCrewReview`
    - Fields & References:
        - `CrewReview.id` (Primary Key)
        - `UpvoteCrewReview.crewReviewId` (Foreign Key, referencing `CrewReview.id`)
    - On Delete: `Cascade` (on `UpvoteCrewReview.crewReview` relation)
    - Explanation: Tracks upvotes for individual crew reviews.

- **Relationship 9**: `CrewReview` to `DownvoteCrewReview` (One-to-many)
    - Type: One-to-many (CrewReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `CrewReview` and `DownvoteCrewReview`
    - Fields & References:
        - `CrewReview.id` (Primary Key)
        - `DownvoteCrewReview.crewReviewId` (Foreign Key, referencing `CrewReview.id`)
    - On Delete: `Cascade` (on `DownvoteCrewReview.crewReview` relation)
    - Explanation: Tracks downvotes for individual crew reviews.

**4. Episode Model Relationships**

- **Relationship 1**: `Episode` to `Season` (Many-to-one)

    - Type: Many-to-one (Many episodes belong to one season)
    - Name: `season` (implicitly named)
    - Related Models: `Episode` and `Season`
    - Fields & References:
        - `Episode.seasonId` (Foreign Key, referencing `Season.id`)
        - `Season.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `Episode.season` relation)
    - Explanation: Episodes are grouped under seasons. Deleting a season will also delete all its episodes.

- **Relationship 2**: `Episode` to `UserEpisodeFavorite` (One-to-many)

    - Type: One-to-many (Episode can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Episode` and `UserEpisodeFavorite`
    - Fields & References:
        - `Episode.id` (Primary Key)
        - `UserEpisodeFavorite.episodeId` (Foreign Key, referencing `Episode.id`)
    - Explanation: Users can bookmark episodes as favorites.

- **Relationship 3**: `Episode` to `UserEpisodeRating` (One-to-many)

    - Type: One-to-many (Episode can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Episode` and `UserEpisodeRating`
    - Fields & References:
        - `Episode.id` (Primary Key)
        - `UserEpisodeRating.episodeId` (Foreign Key, referencing `Episode.id`)
    - Explanation: Users can rate episodes.

- **Relationship 4**: `Episode` to `EpisodeReview` (One-to-many)

    - Type: One-to-many (Episode can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Episode` and `EpisodeReview`
    - Fields & References:
        - `Episode.id` (Primary Key)
        - `EpisodeReview.episodeId` (Foreign Key, referencing `Episode.id`)
    - On Delete/Update: `Cascade` (on `EpisodeReview.episode` relation)
    - Explanation: Episodes can be reviewed by users. Deleting an episode will also delete its reviews.

- **Relationship 5**: `Episode` to `UpvoteEpisodeReview` (One-to-many)

    - Type: One-to-many (Episode can have many upvoted reviews)
    - Name: `upvoteEpisodeReviews` (implicitly named)
    - Related Models: `Episode` and `UpvoteEpisodeReview`
    - Fields & References:
        - `Episode.id` (Primary Key)
        - `UpvoteEpisodeReview.episodeId` (Foreign Key, referencing `Episode.id`)
    - On Delete: `Cascade` (on `UpvoteEpisodeReview.episode` relation)
    - Explanation: Tracks upvotes for episode reviews.

- **Relationship 6**: `Episode` to `DownvoteEpisodeReview` (One-to-many)

    - Type: One-to-many (Episode can have many downvoted reviews)
    - Name: `downvoteEpisodeReviews` (implicitly named)
    - Related Models: `Episode` and `DownvoteEpisodeReview`
    - Fields & References:
        - `Episode.id` (Primary Key)
        - `DownvoteEpisodeReview.episodeId` (Foreign Key, referencing `Episode.id`)
    - On Delete: `Cascade` (on `DownvoteEpisodeReview.episode` relation)
    - Explanation: Tracks downvotes for episode reviews.

- **Relationship 7**: `EpisodeReview` to `UpvoteEpisodeReview` (One-to-many)

    - Type: One-to-many (EpisodeReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `EpisodeReview` and `UpvoteEpisodeReview`
    - Fields & References:
        - `EpisodeReview.id` (Primary Key)
        - `UpvoteEpisodeReview.episodeReviewId` (Foreign Key, referencing `EpisodeReview.id`)
    - On Delete: `Cascade` (on `UpvoteEpisodeReview.episodeReview` relation)
    - Explanation: Tracks upvotes for individual episode reviews.

- **Relationship 8**: `EpisodeReview` to `DownvoteEpisodeReview` (One-to-many)
    - Type: One-to-many (EpisodeReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `EpisodeReview` and `DownvoteEpisodeReview`
    - Fields & References:
        - `EpisodeReview.id` (Primary Key)
        - `DownvoteEpisodeReview.episodeReviewId` (Foreign Key, referencing `EpisodeReview.id`)
    - On Delete: `Cascade` (on `DownvoteEpisodeReview.episodeReview` relation)
    - Explanation: Tracks downvotes for individual episode reviews.

**5. Genre Model Relationships**

- **Relationship 1**: `Genre` to `MovieGenre` (One-to-many)

    - Type: One-to-many (Genre can be associated with many movies)
    - Name: `movies` (implicitly named)
    - Related Models: `Genre` and `MovieGenre`
    - Fields & References:
        - `Genre.id` (Primary Key)
        - `MovieGenre.genreId` (Foreign Key, referencing `Genre.id`)
    - On Delete/Update: `Cascade` (on `MovieGenre.genre` relation)
    - Explanation: Movies can belong to multiple genres, and genres can have multiple movies.

- **Relationship 2**: `Genre` to `SerieGenre` (One-to-many)

    - Type: One-to-many (Genre can be associated with many series)
    - Name: `series` (implicitly named)
    - Related Models: `Genre` and `SerieGenre`
    - Fields & References:
        - `Genre.id` (Primary Key)
        - `SerieGenre.genreId` (Foreign Key, referencing `Genre.id`)
    - On Delete/Update: `Cascade` (on `SerieGenre.genre` relation)
    - Explanation: Series can belong to multiple genres, and genres can have multiple series.

- **Relationship 3**: `Genre` to `UserGenreFavorite` (One-to-many)
    - Type: One-to-many (Genre can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Genre` and `UserGenreFavorite`
    - Fields & References:
        - `Genre.id` (Primary Key)
        - `UserGenreFavorite.genreId` (Foreign Key, referencing `Genre.id`)
    - Explanation: Users can bookmark genres as favorites.

**6. Movie Model Relationships**

- **Relationship 1**: `Movie` to `MovieGenre` (One-to-many)

    - Type: One-to-many (Movie can belong to many genres)
    - Name: `genres` (implicitly named)
    - Related Models: `Movie` and `MovieGenre`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `MovieGenre.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete/Update: `Cascade` (on `MovieGenre.movie` relation)
    - Explanation: Movies can be categorized under multiple genres.

- **Relationship 2**: `Movie` to `CastMovie` (One-to-many)

    - Type: One-to-many (Movie can have many cast members)
    - Name: `cast` (implicitly named)
    - Related Models: `Movie` and `CastMovie`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `CastMovie.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete/Update: `Cascade` (on `CastMovie.movie` relation)
    - Explanation: Movies can have multiple actors in their cast.

- **Relationship 3**: `Movie` to `CrewMovie` (One-to-many)

    - Type: One-to-many (Movie can have many crew members)
    - Name: `crew` (implicitly named)
    - Related Models: `Movie` and `CrewMovie`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `CrewMovie.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete/Update: `Cascade` (on `CrewMovie.movie` relation)
    - Explanation: Movies can have multiple crew members working on them.

- **Relationship 4**: `Movie` to `MovieReview` (One-to-many)

    - Type: One-to-many (Movie can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Movie` and `MovieReview`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `MovieReview.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete/Update: `Cascade` (on `MovieReview.movie` relation)
    - Explanation: Movies can be reviewed by multiple users. Deleting a movie will also delete its reviews.

- **Relationship 5**: `Movie` to `UserMovieFavorite` (One-to-many)

    - Type: One-to-many (Movie can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Movie` and `UserMovieFavorite`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `UserMovieFavorite.movieId` (Foreign Key, referencing `Movie.id`)
    - Explanation: Users can bookmark movies as favorites.

- **Relationship 6**: `Movie` to `UserMovieRating` (One-to-many)

    - Type: One-to-many (Movie can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Movie` and `UserMovieRating`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `UserMovieRating.movieId` (Foreign Key, referencing `Movie.id`)
    - Explanation: Users can rate movies.

- **Relationship 7**: `Movie` to `UpvoteMovieReview` (One-to-many)

    - Type: One-to-many (Movie can have many upvoted reviews)
    - Name: `upvoteMovieReviews` (implicitly named)
    - Related Models: `Movie` and `UpvoteMovieReview`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `UpvoteMovieReview.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete: `Cascade` (on `UpvoteMovieReview.movie` relation)
    - Explanation: Tracks upvotes for movie reviews.

- **Relationship 8**: `Movie` to `DownvoteMovieReview` (One-to-many)

    - Type: One-to-many (Movie can have many downvoted reviews)
    - Name: `downvoteMovieReviews` (implicitly named)
    - Related Models: `Movie` and `DownvoteMovieReview`
    - Fields & References:
        - `Movie.id` (Primary Key)
        - `DownvoteMovieReview.movieId` (Foreign Key, referencing `Movie.id`)
    - On Delete: `Cascade` (on `DownvoteMovieReview.movie` relation)
    - Explanation: Tracks downvotes for movie reviews.

- **Relationship 9**: `MovieReview` to `UpvoteMovieReview` (One-to-many)

    - Type: One-to-many (MovieReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `MovieReview` and `UpvoteMovieReview`
    - Fields & References:
        - `MovieReview.id` (Primary Key)
        - `UpvoteMovieReview.movieReviewId` (Foreign Key, referencing `MovieReview.id`)
    - On Delete: `Cascade` (on `UpvoteMovieReview.movieReview` relation)
    - Explanation: Tracks upvotes for individual movie reviews.

- **Relationship 10**: `MovieReview` to `DownvoteMovieReview` (One-to-many)
    - Type: One-to-many (MovieReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `MovieReview` and `DownvoteMovieReview`
    - Fields & References:
        - `MovieReview.id` (Primary Key)
        - `DownvoteMovieReview.movieReviewId` (Foreign Key, referencing `MovieReview.id`)
    - On Delete: `Cascade` (on `DownvoteMovieReview.movieReview` relation)
    - Explanation: Tracks downvotes for individual movie reviews.

**7. Season Model Relationships**

- **Relationship 1**: `Season` to `Serie` (Many-to-one)

    - Type: Many-to-one (Many seasons belong to one serie)
    - Name: `serie` (implicitly named)
    - Related Models: `Season` and `Serie`
    - Fields & References:
        - `Season.serieId` (Foreign Key, referencing `Serie.id`)
        - `Serie.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `Season.serie` relation)
    - Explanation: Seasons are grouped under series. Deleting a serie will also delete all its seasons.

- **Relationship 2**: `Season` to `Episode` (One-to-many)

    - Type: One-to-many (Season can have many episodes)
    - Name: `episodes` (implicitly named)
    - Related Models: `Season` and `Episode`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `Episode.seasonId` (Foreign Key, referencing `Season.id`)
    - On Delete/Update: `Cascade` (on `Episode.season` relation)
    - Explanation: Seasons contain multiple episodes. Deleting a season will delete all its episodes.

- **Relationship 3**: `Season` to `UserSeasonFavorite` (One-to-many)

    - Type: One-to-many (Season can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Season` and `UserSeasonFavorite`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `UserSeasonFavorite.seasonId` (Foreign Key, referencing `Season.id`)
    - Explanation: Users can bookmark seasons as favorites.

- **Relationship 4**: `Season` to `UserSeasonRating` (One-to-many)

    - Type: One-to-many (Season can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Season` and `UserSeasonRating`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `UserSeasonRating.seasonId` (Foreign Key, referencing `Season.id`)
    - Explanation: Users can rate seasons.

- **Relationship 5**: `Season` to `SeasonReview` (One-to-many)

    - Type: One-to-many (Season can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Season` and `SeasonReview`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `SeasonReview.seasonId` (Foreign Key, referencing `Season.id`)
    - On Delete/Update: `Cascade` (on `SeasonReview.season` relation)
    - Explanation: Seasons can be reviewed by multiple users. Deleting a season will also delete its reviews.

- **Relationship 6**: `Season` to `UpvoteSeasonReview` (One-to-many)

    - Type: One-to-many (Season can have many upvoted reviews)
    - Name: `UpvoteSeasonReview` (implicitly named, note the typo in schema name, should be `upvoteSeasonReviews`)
    - Related Models: `Season` and `UpvoteSeasonReview`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `UpvoteSeasonReview.seasonId` (Foreign Key, referencing `Season.id`)
    - On Delete: `Cascade` (on `UpvoteSeasonReview.season` relation)
    - Explanation: Tracks upvotes for season reviews.

- **Relationship 7**: `Season` to `DownvoteSeasonReview` (One-to-many)

    - Type: One-to-many (Season can have many downvoted reviews)
    - Name: `DownvoteSeasonReview` (implicitly named, note the typo in schema name, should be `downvoteSeasonReviews`)
    - Related Models: `Season` and `DownvoteSeasonReview`
    - Fields & References:
        - `Season.id` (Primary Key)
        - `DownvoteSeasonReview.seasonId` (Foreign Key, referencing `Season.id`)
    - On Delete: `Cascade` (on `DownvoteSeasonReview.season` relation)
    - Explanation: Tracks downvotes for season reviews.

- **Relationship 8**: `SeasonReview` to `UpvoteSeasonReview` (One-to-many)

    - Type: One-to-many (SeasonReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `SeasonReview` and `UpvoteSeasonReview`
    - Fields & References:
        - `SeasonReview.id` (Primary Key)
        - `UpvoteSeasonReview.seasonReviewId` (Foreign Key, referencing `SeasonReview.id`)
    - On Delete: `Cascade` (on `UpvoteSeasonReview.seasonReview` relation)
    - Explanation: Tracks upvotes for individual season reviews.

- **Relationship 9**: `SeasonReview` to `DownvoteSeasonReview` (One-to-many)
    - Type: One-to-many (SeasonReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `SeasonReview` and `DownvoteSeasonReview`
    - Fields & References:
        - `SeasonReview.id` (Primary Key)
        - `DownvoteSeasonReview.seasonReviewId` (Foreign Key, referencing `SeasonReview.id`)
    - On Delete: `Cascade` (on `DownvoteSeasonReview.seasonReview` relation)
    - Explanation: Tracks downvotes for individual season reviews.

**8. Serie Model Relationships**

- **Relationship 1**: `Serie` to `SerieGenre` (One-to-many)

    - Type: One-to-many (Serie can belong to many genres)
    - Name: `genres` (implicitly named)
    - Related Models: `Serie` and `SerieGenre`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `SerieGenre.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete/Update: `Cascade` (on `SerieGenre.serie` relation)
    - Explanation: Series can be categorized under multiple genres.

- **Relationship 2**: `Serie` to `CastSerie` (One-to-many)

    - Type: One-to-many (Serie can have many cast members)
    - Name: `cast` (implicitly named)
    - Related Models: `Serie` and `CastSerie`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `CastSerie.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete/Update: `Cascade` (on `CastSerie.serie` relation)
    - Explanation: Series can have multiple actors in their cast.

- **Relationship 3**: `Serie` to `CrewSerie` (One-to-many)

    - Type: One-to-many (Serie can have many crew members)
    - Name: `crew` (implicitly named)
    - Related Models: `Serie` and `CrewSerie`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `CrewSerie.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete/Update: `Cascade` (on `CrewSerie.serie` relation)
    - Explanation: Series can have multiple crew members working on them.

- **Relationship 4**: `Serie` to `Season` (One-to-many)

    - Type: One-to-many (Serie can have many seasons)
    - Name: `seasons` (implicitly named)
    - Related Models: `Serie` and `Season`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `Season.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete/Update: `Cascade` (on `Season.serie` relation)
    - Explanation: Series are composed of multiple seasons. Deleting a serie will also delete all its seasons.

- **Relationship 5**: `Serie` to `SerieReview` (One-to-many)

    - Type: One-to-many (Serie can have many reviews)
    - Name: `reviews` (implicitly named)
    - Related Models: `Serie` and `SerieReview`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `SerieReview.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete/Update: `Cascade` (on `SerieReview.serie` relation)
    - Explanation: Series can be reviewed by multiple users. Deleting a serie will also delete its reviews.

- **Relationship 6**: `Serie` to `UserSerieFavorite` (One-to-many)

    - Type: One-to-many (Serie can be bookmarked by many users)
    - Name: `usersWhoBookmarkedIt` (implicitly named)
    - Related Models: `Serie` and `UserSerieFavorite`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `UserSerieFavorite.serieId` (Foreign Key, referencing `Serie.id`)
    - Explanation: Users can bookmark series as favorites.

- **Relationship 7**: `Serie` to `UserSerieRating` (One-to-many)

    - Type: One-to-many (Serie can be rated by many users)
    - Name: `usersWhoRatedIt` (implicitly named)
    - Related Models: `Serie` and `UserSerieRating`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `UserSerieRating.serieId` (Foreign Key, referencing `Serie.id`)
    - Explanation: Users can rate series.

- **Relationship 8**: `Serie` to `UpvoteSerieReview` (One-to-many)

    - Type: One-to-many (Serie can have many upvoted reviews)
    - Name: `upvoteSerieReviews` (implicitly named)
    - Related Models: `Serie` and `UpvoteSerieReview`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `UpvoteSerieReview.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete: `Cascade` (on `UpvoteSerieReview.serie` relation)
    - Explanation: Tracks upvotes for serie reviews.

- **Relationship 9**: `Serie` to `DownvoteSerieReview` (One-to-many)

    - Type: One-to-many (Serie can have many downvoted reviews)
    - Name: `downvoteSerieReviews` (implicitly named)
    - Related Models: `Serie` and `DownvoteSerieReview`
    - Fields & References:
        - `Serie.id` (Primary Key)
        - `DownvoteSerieReview.serieId` (Foreign Key, referencing `Serie.id`)
    - On Delete: `Cascade` (on `DownvoteSerieReview.serie` relation)
    - Explanation: Tracks downvotes for serie reviews.

- **Relationship 10**: `SerieReview` to `UpvoteSerieReview` (One-to-many)

    - Type: One-to-many (SerieReview can have many upvotes)
    - Name: `upvotes` (implicitly named)
    - Related Models: `SerieReview` and `UpvoteSerieReview`
    - Fields & References:
        - `SerieReview.id` (Primary Key)
        - `UpvoteSerieReview.serieReviewId` (Foreign Key, referencing `SerieReview.id`)
    - On Delete: `Cascade` (on `UpvoteSerieReview.serieReview` relation)
    - Explanation: Tracks upvotes for individual serie reviews.

- **Relationship 11**: `SerieReview` to `DownvoteSerieReview` (One-to-many)
    - Type: One-to-many (SerieReview can have many downvotes)
    - Name: `downvotes` (implicitly named)
    - Related Models: `SerieReview` and `DownvoteSerieReview`
    - Fields & References:
        - `SerieReview.id` (Primary Key)
        - `DownvoteSerieReview.serieReviewId` (Foreign Key, referencing `SerieReview.id`)
    - On Delete: `Cascade` (on `DownvoteSerieReview.serieReview` relation)
    - Explanation: Tracks downvotes for individual serie reviews.

**9. User Model Relationships**

- **Relationship 1**: `User` to `ActivateToken` (One-to-many)

    - Type: One-to-many (User can have many activation tokens)
    - Name: `activateTokens` (implicitly named)
    - Related Models: `User` and `ActivateToken`
    - Fields & References:
        - `User.id` (Primary Key)
        - `ActivateToken.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `ActivateToken.user` relation)
    - Explanation: Used for email verification during registration. Deleting a user will also delete their activation tokens.

- **Relationship 2**: `User` to `ResetPasswordToken` (One-to-many)

    - Type: One-to-many (User can have many reset password tokens)
    - Name: `resetPassowrdTokens` (implicitly named, note the typo in schema name, should be `resetPasswordTokens`)
    - Related Models: `User` and `ResetPasswordToken`
    - Fields & References:
        - `User.id` (Primary Key)
        - `ResetPasswordToken.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `ResetPasswordToken.user` relation)
    - Explanation: Used for password reset functionality. Deleting a user will also delete their password reset tokens.

- **Relationship 3**: `User` to `UserMovieFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many movies)
    - Name: `favMovies` (implicitly named)
    - Related Models: `User` and `UserMovieFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserMovieFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserMovieFavorite.user` relation)
    - Explanation: Users can have many bookmarked movies. Deleting a user will also delete their movie bookmarks.

- **Relationship 4**: `User` to `UserSerieFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many series)
    - Name: `favSeries` (implicitly named)
    - Related Models: `User` and `UserSerieFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserSerieFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserSerieFavorite.user` relation)
    - Explanation: Users can have many bookmarked series. Deleting a user will also delete their series bookmarks.

- **Relationship 5**: `User` to `UserGenreFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many genres)
    - Name: `favGenres` (implicitly named)
    - Related Models: `User` and `UserGenreFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserGenreFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserGenreFavorite.user` relation)
    - Explanation: Users can have many bookmarked genres. Deleting a user will also delete their genre bookmarks.

- **Relationship 6**: `User` to `UserSeasonFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many seasons)
    - Name: `favSeasons` (implicitly named)
    - Related Models: `User` and `UserSeasonFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserSeasonFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserSeasonFavorite.user` relation)
    - Explanation: Users can have many bookmarked seasons. Deleting a user will also delete their season bookmarks.

- **Relationship 7**: `User` to `UserEpisodeFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many episodes)
    - Name: `favEpisodes` (implicitly named)
    - Related Models: `User` and `UserEpisodeFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserEpisodeFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserEpisodeFavorite.user` relation)
    - Explanation: Users can have many bookmarked episodes. Deleting a user will also delete their episode bookmarks.

- **Relationship 8**: `User` to `UserActorFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many actors)
    - Name: `favActors` (implicitly named)
    - Related Models: `User` and `UserActorFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserActorFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserActorFavorite.user` relation)
    - Explanation: Users can have many bookmarked actors. Deleting a user will also delete their actor bookmarks.

- **Relationship 9**: `User` to `UserCrewFavorite` (One-to-many)

    - Type: One-to-many (User can bookmark many crew members)
    - Name: `favCrew` (implicitly named)
    - Related Models: `User` and `UserCrewFavorite`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserCrewFavorite.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserCrewFavorite.user` relation)
    - Explanation: Users can have many bookmarked crew members. Deleting a user will also delete their crew bookmarks.

- **Relationship 10**: `User` to `UserMovieRating` (One-to-many)

    - Type: One-to-many (User can rate many movies)
    - Name: `ratingsInMovie` (implicitly named)
    - Related Models: `User` and `UserMovieRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserMovieRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserMovieRating.user` relation)
    - Explanation: Users can rate multiple movies. Deleting a user will also delete their movie ratings.

- **Relationship 11**: `User` to `UserSerieRating` (One-to-many)

    - Type: One-to-many (User can rate many series)
    - Name: `ratingsInSerie` (implicitly named)
    - Related Models: `User` and `UserSerieRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserSerieRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserSerieRating.user` relation)
    - Explanation: Users can rate multiple series. Deleting a user will also delete their series ratings.

- **Relationship 12**: `User` to `UserSeasonRating` (One-to-many)

    - Type: One-to-many (User can rate many seasons)
    - Name: `ratingsInSeason` (implicitly named)
    - Related Models: `User` and `UserSeasonRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserSeasonRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserSeasonRating.user` relation)
    - Explanation: Users can rate multiple seasons. Deleting a user will also delete their season ratings.

- **Relationship 13**: `User` to `UserEpisodeRating` (One-to-many)

    - Type: One-to-many (User can rate many episodes)
    - Name: `ratingsInEpisode` (implicitly named)
    - Related Models: `User` and `UserEpisodeRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserEpisodeRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserEpisodeRating.user` relation)
    - Explanation: Users can rate multiple episodes. Deleting a user will also delete their episode ratings.

- **Relationship 14**: `User` to `UserActorRating` (One-to-many)

    - Type: One-to-many (User can rate many actors)
    - Name: `ratingsInActor` (implicitly named)
    - Related Models: `User` and `UserActorRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserActorRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserActorRating.user` relation)
    - Explanation: Users can rate multiple actors. Deleting a user will also delete their actor ratings.

- **Relationship 15**: `User` to `UserCrewRating` (One-to-many)

    - Type: One-to-many (User can rate many crew members)
    - Name: `ratingsInCrew` (implicitly named)
    - Related Models: `User` and `UserCrewRating`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserCrewRating.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserCrewRating.user` relation)
    - Explanation: Users can rate multiple crew members. Deleting a user will also delete their crew ratings.

- **Relationship 16**: `User` to `MovieReview` (One-to-many)

    - Type: One-to-many (User can write many movie reviews)
    - Name: `movieReviews` (implicitly named)
    - Related Models: `User` and `MovieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `MovieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `MovieReview.user` relation)
    - Explanation: Users can write multiple reviews for movies. Deleting a user will also delete their movie reviews.

- **Relationship 17**: `User` to `SerieReview` (One-to-many)

    - Type: One-to-many (User can write many serie reviews)
    - Name: `serieReviews` (implicitly named)
    - Related Models: `User` and `SerieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `SerieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `SerieReview.user` relation)
    - Explanation: Users can write multiple reviews for series. Deleting a user will also delete their serie reviews.

- **Relationship 18**: `User` to `SeasonReview` (One-to-many)

    - Type: One-to-many (User can write many season reviews)
    - Name: `seasonReviews` (implicitly named)
    - Related Models: `User` and `SeasonReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `SeasonReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `SeasonReview.user` relation)
    - Explanation: Users can write multiple reviews for seasons. Deleting a user will also delete their season reviews.

- **Relationship 19**: `User` to `EpisodeReview` (One-to-many)

    - Type: One-to-many (User can write many episode reviews)
    - Name: `episodeReviews` (implicitly named)
    - Related Models: `User` and `EpisodeReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `EpisodeReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `EpisodeReview.user` relation)
    - Explanation: Users can write multiple reviews for episodes. Deleting a user will also delete their episode reviews.

- **Relationship 20**: `User` to `ActorReview` (One-to-many)

    - Type: One-to-many (User can write many actor reviews)
    - Name: `actorReviews` (implicitly named)
    - Related Models: `User` and `ActorReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `ActorReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `ActorReview.user` relation)
    - Explanation: Users can write multiple reviews for actors. Deleting a user will also delete their actor reviews.

- **Relationship 21**: `User` to `CrewReview` (One-to-many)

    - Type: One-to-many (User can write many crew reviews)
    - Name: `crewReviews` (implicitly named)
    - Related Models: `User` and `CrewReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `CrewReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `CrewReview.user` relation)
    - Explanation: Users can write multiple reviews for crew members. Deleting a user will also delete their crew reviews.

- **Relationship 22**: `User` to `UpvoteMovieReview` (One-to-many)

    - Type: One-to-many (User can upvote many movie reviews)
    - Name: `movieReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteMovieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteMovieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteMovieReview.user` relation)
    - Explanation: Users can upvote multiple movie reviews.

- **Relationship 23**: `User` to `DownvoteMovieReview` (One-to-many)

    - Type: One-to-many (User can downvote many movie reviews)
    - Name: `movieReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteMovieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteMovieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteMovieReview.user` relation)
    - Explanation: Users can downvote multiple movie reviews.

- **Relationship 24**: `User` to `UpvoteSerieReview` (One-to-many)

    - Type: One-to-many (User can upvote many serie reviews)
    - Name: `serieReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteSerieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteSerieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteSerieReview.user` relation)
    - Explanation: Users can upvote multiple serie reviews.

- **Relationship 25**: `User` to `DownvoteSerieReview` (One-to-many)

    - Type: One-to-many (User can downvote many serie reviews)
    - Name: `serieReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteSerieReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteSerieReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteSerieReview.user` relation)
    - Explanation: Users can downvote multiple serie reviews.

- **Relationship 26**: `User` to `UpvoteSeasonReview` (One-to-many)

    - Type: One-to-many (User can upvote many season reviews)
    - Name: `seasonReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteSeasonReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteSeasonReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteSeasonReview.user` relation)
    - Explanation: Users can upvote multiple season reviews.

- **Relationship 27**: `User` to `DownvoteSeasonReview` (One-to-many)

    - Type: One-to-many (User can downvote many season reviews)
    - Name: `seasonReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteSeasonReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteSeasonReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteSeasonReview.user` relation)
    - Explanation: Users can downvote multiple season reviews.

- **Relationship 28**: `User` to `UpvoteEpisodeReview` (One-to-many)

    - Type: One-to-many (User can upvote many episode reviews)
    - Name: `episodeReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteEpisodeReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteEpisodeReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteEpisodeReview.user` relation)
    - Explanation: Users can upvote multiple episode reviews.

- **Relationship 29**: `User` to `DownvoteEpisodeReview` (One-to-many)

    - Type: One-to-many (User can downvote many episode reviews)
    - Name: `episodeReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteEpisodeReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteEpisodeReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteEpisodeReview.user` relation)
    - Explanation: Users can downvote multiple episode reviews.

- **Relationship 30**: `User` to `UpvoteActorReview` (One-to-many)

    - Type: One-to-many (User can upvote many actor reviews)
    - Name: `actorReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteActorReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteActorReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteActorReview.user` relation)
    - Explanation: Users can upvote multiple actor reviews.

- **Relationship 31**: `User` to `DownvoteActorReview` (One-to-many)

    - Type: One-to-many (User can downvote many actor reviews)
    - Name: `actorReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteActorReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteActorReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteActorReview.user` relation)
    - Explanation: Users can downvote multiple actor reviews.

- **Relationship 32**: `User` to `UpvoteCrewReview` (One-to-many)

    - Type: One-to-many (User can upvote many crew reviews)
    - Name: `crewReviewsUpvoted` (implicitly named)
    - Related Models: `User` and `UpvoteCrewReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UpvoteCrewReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `UpvoteCrewReview.user` relation)
    - Explanation: Users can upvote multiple crew reviews.

- **Relationship 33**: `User` to `DownvoteCrewReview` (One-to-many)

    - Type: One-to-many (User can downvote many crew reviews)
    - Name: `crewReviewsDownvoted` (implicitly named)
    - Related Models: `User` and `DownvoteCrewReview`
    - Fields & References:
        - `User.id` (Primary Key)
        - `DownvoteCrewReview.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `DownvoteCrewReview.user` relation)
    - Explanation: Users can downvote multiple crew reviews.

- **Relationship 34**: `User` to `Avatar` (One-to-one)

    - Type: One-to-one (User has one avatar)
    - Name: `avatar` (implicitly named)
    - Related Models: `User` and `Avatar`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Avatar.userId` (Foreign Key, referencing `User.id`, `@unique`)
    - On Delete/Update: `Cascade` (on `Avatar.user` relation)
    - Explanation: Each user can have one avatar. Deleting a user will also delete their avatar.

- **Relationship 35**: `User` to `UserFollow` (One-to-many - Followers)

    - Type: One-to-many (User can have many followers)
    - Name: `followers` (named relation: "UserFollowing")
    - Related Models: `User` and `UserFollow`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserFollow.followingId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserFollow.following` relation)
    - Explanation: Represents users who are following a particular user.

- **Relationship 36**: `User` to `UserFollow` (One-to-many - Following)

    - Type: One-to-many (User can follow many users)
    - Name: `following` (named relation: "UserFollowers")
    - Related Models: `User` and `UserFollow`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserFollow.followerId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserFollow.follower` relation)
    - Explanation: Represents users that a particular user is following.

- **Relationship 37**: `User` to `UserInbox` (One-to-many)

    - Type: One-to-many (User can participate in many inboxes)
    - Name: `inboxs` (implicitly named, note the typo in schema name, should be `inboxes`)
    - Related Models: `User` and `UserInbox`
    - Fields & References:
        - `User.id` (Primary Key)
        - `UserInbox.userId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `UserInbox.user` relation)
    - Explanation: Connects users to inboxes for messaging.

- **Relationship 38**: `User` to `Message` (One-to-many - Sent Messages)

    - Type: One-to-many (User can send many messages)
    - Name: `messagesSent` (named relation: "Sender")
    - Related Models: `User` and `Message`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Message.senderId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `Message.sender` relation)
    - Explanation: Messages sent by a user.

- **Relationship 39**: `User` to `Message` (One-to-many - Received Messages)

    - Type: One-to-many (User can receive many messages)
    - Name: `messagesReceived` (named relation: "Reciever", note typo in schema name, should be `Receiver`)
    - Related Models: `User` and `Message`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Message.receiverId` (Foreign Key, referencing `User.id`)
    - On Delete/Update: `Cascade` (on `Message.receiver` relation)
    - Explanation: Messages received by a user.

- **Relationship 40**: `User` to `Account` (One-to-many)

    - Type: One-to-many (User can have many accounts, e.g., Google, Credentials)
    - Name: `accounts` (implicitly named)
    - Related Models: `User` and `Account`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Account.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `Account.user` relation)
    - Explanation: Links user profiles to different authentication accounts. Deleting a user will also delete their accounts.

- **Relationship 41**: `User` to `Session` (One-to-many)

    - Type: One-to-many (User can have many sessions)
    - Name: `sessions` (implicitly named)
    - Related Models: `User` and `Session`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Session.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `Session.user` relation)
    - Explanation: Tracks user login sessions. Deleting a user will also delete their sessions.

- **Relationship 42**: `User` to `Notification` (One-to-many - Notification Receiver)

    - Type: One-to-many (User can receive many notifications)
    - Name: `notificationsReceived` (named relation: "NotificationReceiver")
    - Related Models: `User` and `Notification`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Notification.userId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `Notification.user` relation)
    - Explanation: Notifications directed to a user.

- **Relationship 43**: `User` to `Notification` (One-to-many - Notification Sender)
    - Type: One-to-many (User can send many notifications)
    - Name: `notificationsSent` (named relation: "NotificationSender")
    - Related Models: `User` and `Notification`
    - Fields & References:
        - `User.id` (Primary Key)
        - `Notification.senderId` (Foreign Key, referencing `User.id`)
    - On Delete: `Cascade` (on `Notification.sender` relation)
    - Explanation: Notifications sent by a user (e.g., follow requests).

**10. UserFollow Model Relationships**

- **Relationship 1**: `UserFollow` to `User` (Many-to-one - Follower)

    - Type: Many-to-one (Many UserFollow entries can have one follower User)
    - Name: `follower` (named relation: "UserFollowers")
    - Related Models: `UserFollow` and `User`
    - Fields & References:
        - `UserFollow.followerId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `UserFollow.follower` relation)
    - Explanation: Defines the follower in a follow relationship.

- **Relationship 2**: `UserFollow` to `User` (Many-to-one - Following)
    - Type: Many-to-one (Many UserFollow entries can have one following User)
    - Name: `following` (named relation: "UserFollowing")
    - Related Models: `UserFollow` and `User`
    - Fields & References:
        - `UserFollow.followingId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `UserFollow.following` relation)
    - Explanation: Defines the user being followed in a follow relationship.

**11. UserInbox Model Relationships**

- **Relationship 1**: `UserInbox` to `User` (Many-to-one)

    - Type: Many-to-one (Many UserInbox entries can belong to one user)
    - Name: `user` (implicitly named)
    - Related Models: `UserInbox` and `User`
    - Fields & References:
        - `UserInbox.userId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `UserInbox.user` relation)
    - Explanation: Links users to inboxes they participate in.

- **Relationship 2**: `UserInbox` to `Inbox` (Many-to-one)
    - Type: Many-to-one (Many UserInbox entries can belong to one inbox)
    - Name: `inbox` (implicitly named)
    - Related Models: `UserInbox` and `Inbox`
    - Fields & References:
        - `UserInbox.inboxId` (Foreign Key, referencing `Inbox.id`)
        - `Inbox.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `UserInbox.inbox` relation)
    - Explanation: Links user-inbox participation entries to specific inbox instances.

**12. Inbox Model Relationships**

- **Relationship 1**: `Inbox` to `UserInbox` (One-to-many)

    - Type: One-to-many (Inbox can have many user participants)
    - Name: `participants` (implicitly named)
    - Related Models: `Inbox` and `UserInbox`
    - Fields & References:
        - `Inbox.id` (Primary Key)
        - `UserInbox.inboxId` (Foreign Key, referencing `Inbox.id`)
    - On Delete/Update: `Cascade` (on `UserInbox.inbox` relation)
    - Explanation: Lists all users participating in a specific inbox.

- **Relationship 2**: `Inbox` to `Message` (One-to-many)
    - Type: One-to-many (Inbox can have many messages)
    - Name: `messages` (implicitly named)
    - Related Models: `Inbox` and `Message`
    - Fields & References:
        - `Inbox.id` (Primary Key)
        - `Message.inboxId` (Foreign Key, referencing `Inbox.id`)
    - On Delete/Update: `Cascade` (on `Message.inbox` relation)
    - Explanation: Contains all messages within a specific inbox.

**13. Message Model Relationships**

- **Relationship 1**: `Message` to `User` (Many-to-one - Sender)

    - Type: Many-to-one (Many messages can be sent by one user)
    - Name: `sender` (named relation: "Sender")
    - Related Models: `Message` and `User`
    - Fields & References:
        - `Message.senderId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `Message.sender` relation)
    - Explanation: Defines the user who sent the message.

- **Relationship 2**: `Message` to `User` (Many-to-one - Receiver)

    - Type: Many-to-one (Many messages can be received by one user)
    - Name: `receiver` (named relation: "Reciever", note typo in schema name, should be `Receiver`)
    - Related Models: `Message` and `User`
    - Fields & References:
        - `Message.receiverId` (Foreign Key, referencing `User.id`)
        - `User.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `Message.receiver` relation)
    - Explanation: Defines the user who received the message.

- **Relationship 3**: `Message` to `Inbox` (Many-to-one)
    - Type: Many-to-one (Many messages belong to one inbox)
    - Name: `inbox` (implicitly named)
    - Related Models: `Message` and `Inbox`
    - Fields & References:
        - `Message.inboxId` (Foreign Key, referencing `Inbox.id`)
        - `Inbox.id` (Primary Key)
    - On Delete/Update: `Cascade` (on `Message.inbox` relation)
    - Explanation: Associates each message with its inbox.

**14. MovieGenre, SerieGenre, CastMovie, CastSerie, CrewMovie, CrewSerie, UserMovieRating, UserSerieRating, UserSeasonRating, UserEpisodeRating, UserActorRating, UserCrewRating, UserMovieFavorite, UserGenreFavorite, UserSerieFavorite, UserEpisodeFavorite, UserSeasonFavorite, UserActorFavorite, UserCrewFavorite, Notification, UpvoteMovieReview, DownvoteMovieReview, UpvoteSerieReview, DownvoteSerieReview, UpvoteSeasonReview, DownvoteSeasonReview, UpvoteEpisodeReview, DownvoteEpisodeReview, UpvoteActorReview, DownvoteActorReview, UpvoteCrewReview, DownvoteCrewReview Models**

These models are primarily **Junction Tables** or **Relation Tables** for many-to-many relationships or specific user-content interactions (like ratings, favorites, upvotes, downvotes). They mainly have foreign keys to other models and often include additional fields like `rating` or `state`. Their relationships are mostly many-to-one back to the main entities (Movie, Serie, Genre, User, Actor, Crew, Season, Episode, Review).

**Summary of Relationship Types:**

- **One-to-Many:** Predominant type, used to link entities to collections of related data (e.g., a Movie has many Reviews).
- **Many-to-One:** Used for inverse relationships of One-to-Many, and to link entities to their parent or owner (e.g., a Review belongs to a User).
- **One-to-One:** Used for the `User` to `Avatar` relationship, ensuring each user has at most one avatar.
- **Many-to-Many (Implicit through Junction Tables):** Represented via models like `MovieGenre`, `CastMovie`, `CrewSerie`, etc., to handle many-to-many associations (e.g., a Movie can have many Genres).
