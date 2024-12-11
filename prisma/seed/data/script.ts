// #region "Custom script for writting in file and generating stuff"
// const seasons: Season[] = [];
// const episodes: Episode[] = [];

// // function formatDate(date) {
// //     const day = (`0${date.getDate()}`).slice(-2);
// //     const month = (`0${date.getMonth() + 1}`).slice(-2);
// //     const year = date.getFullYear();
// //     return `${day}/${month}/${year}`;
// // }

// function replaceImageUrl(url: string) {
//     const urlObj = new URL(url);
//     return `${urlObj.origin}/images/placeholder.jpg`;
// }

// series.forEach((serie) => {
//     const numSeasons = Math.max(1, Math.floor(Math.random() * 2) + 1);

//     for (let seasonNumber = 1; seasonNumber <= numSeasons; seasonNumber++) {
//         const season = {
//             id: seasons.length + 1,
//             title: `Season ${seasonNumber}`,
//             photoSrc: replaceImageUrl(serie.photoSrc),
//             photoSrcProd: replaceImageUrl(serie.photoSrcProd),
//             description: `Description for Season ${seasonNumber} in ${serie.title}.`,
//             trailerSrc: "https://www.youtube.com/embed/D8La5G1DzCM",
//             dateAired: "01/01/2000",
//             ratingImdb: parseFloat((5.0 + Math.random() * 1.5).toFixed(1)),
//             serieId: serie.id,
//         };

//         seasons.push(season);

//         const numEpisodes = Math.max(1, Math.floor(Math.random() * 2) + 1);

//         for (let episodeNumber = 1; episodeNumber <= numEpisodes; episodeNumber++) {
//             const episode = {
//                 id: episodes.length + 1,
//                 title: `Episode ${episodeNumber}`,
//                 photoSrc: replaceImageUrl(serie.photoSrc),
//                 photoSrcProd: replaceImageUrl(serie.photoSrcProd),
//                 trailerSrc: "https://www.youtube.com/embed/D8La5G1DzCM",
//                 duration: Math.max(15, Math.floor(Math.random() * 45) + 1),
//                 description: `Description for Episode ${episodeNumber} of Season ${seasonNumber} in ${serie.title}.`,
//                 dateAired: "01/01/2000",
//                 ratingImdb: parseFloat((5.0 + Math.random() * 1.5).toFixed(1)),
//                 seasonId: season.id,
//             };

//             episodes.push(episode);
//         }
//     }
// });

// const fileContent = `
// export const seasons = ${JSON.stringify(seasons, null, 2).replace(/"([^"]+)":/g, "$1:")};
// export const episodes = ${JSON.stringify(episodes, null, 2).replace(/"([^"]+)":/g, "$1:")};
// `;

// fs.writeFile("data.ts", fileContent, (err) => {
//     if (err) {
//         console.error("Error writing to data.ts file:", err);
//     } else {
//         console.log("data.ts file has been written successfully.");
//     }
// });
// #endregion