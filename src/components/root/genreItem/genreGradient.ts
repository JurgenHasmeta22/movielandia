const genreGradients = [
	["#7A3FD1", "#24103F"],
	["#D6294A", "#3F0C19"],
	["#E58F00", "#452600"],
	["#1E8E6A", "#072F24"],
	["#4B5BD6", "#12184A"],
	["#C2185B", "#380921"],
	["#2A8CBB", "#0A2C3E"],
	["#8E5BD9", "#2A1450"],
];

export const getGenreGradient = (genreId: number) => {
	const [from, to] = genreGradients[genreId % genreGradients.length];

	return {
		from,
		to,
		background: `linear-gradient(145deg, ${from} 0%, ${to} 85%)`,
	};
};
