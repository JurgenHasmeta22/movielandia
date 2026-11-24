import { Box } from "@mui/material";

const BULB_GAP = 30;

const bulbLayer = (offset: number, animation: string) => ({
	content: '""',
	position: "absolute" as const,
	inset: 0,
	backgroundImage:
		"radial-gradient(circle at center, #FFF1CC 0 2px, #FFB224 3px, rgba(255,178,36,0.45) 5px, rgba(255,178,36,0) 9px)",
	backgroundSize: `${BULB_GAP * 2}px 100%`,
	backgroundPosition: `${offset}px center`,
	backgroundRepeat: "repeat-x",
	animation,
});

const MarqueeBulbs = () => (
	<Box
		aria-hidden
		sx={{
			position: "absolute",
			left: 0,
			right: 0,
			bottom: 22,
			height: 20,
			pointerEvents: "none",
			"&::before": bulbLayer(
				BULB_GAP / 2,
				"marquee-bulb-a 1.6s steps(1, end) infinite",
			),
			"&::after": bulbLayer(
				BULB_GAP * 1.5,
				"marquee-bulb-b 1.6s steps(1, end) infinite",
			),
		}}
	/>
);

export default MarqueeBulbs;
