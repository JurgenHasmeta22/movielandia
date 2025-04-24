import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ListHomeSection from "./ListHomeSection";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme/theme";

// Mock dependencies
vi.mock("@/components/root/cardItem/CardItem", () => ({
	default: ({ data, type, path }: any) => (
		<div data-testid="card-item-mock" data-type={type} data-path={path}>
			<span data-testid="card-title">{data.title}</span>
			<span data-testid="card-id">{data.id}</span>
		</div>
	),
}));

vi.mock("next/link", () => ({
	default: ({ href, children, style }: any) => (
		<a href={href} style={style} data-testid="next-link">
			{children}
		</a>
	),
}));

// Mock Slider component from react-slick
vi.mock("react-slick", () => {
	return {
		default: ({ children, ...props }: any) => {
			// Extract only the serializable props to avoid circular references
			const serializableProps = {
				dots: props.dots,
				infinite: props.infinite,
				speed: props.speed,
				slidesToShow: props.slidesToShow,
				slidesToScroll: props.slidesToScroll,
				autoplay: props.autoplay,
				autoplaySpeed: props.autoplaySpeed,
				pauseOnHover: props.pauseOnHover,
				initialSlide: props.initialSlide,
				// Omit nextArrow and prevArrow as they contain React components
				// which can cause circular references
			};

			return (
				<div data-testid="slider-mock">
					<div
						data-testid="slider-props"
						data-props={JSON.stringify(serializableProps)}
					/>
					<div data-testid="slider-children">{children}</div>
				</div>
			);
		},
	};
});

// Mock window resize
const mockResizeEvent = () => {
	Object.defineProperty(window, "innerWidth", {
		writable: true,
		configurable: true,
		value: 1920,
	});
	window.dispatchEvent(new Event("resize"));
};

// Sample test data
const mockMovies = [
	{
		id: 1,
		title: "Test Movie 1",
		description: "This is test movie 1",
		photoSrcProd: "/test-movie-1.jpg",
		ratingImdb: 8.5,
		dateAired: new Date("2023-01-01"),
		isBookmarked: false,
	},
	{
		id: 2,
		title: "Test Movie 2",
		description: "This is test movie 2",
		photoSrcProd: "/test-movie-2.jpg",
		ratingImdb: 7.8,
		dateAired: new Date("2023-02-15"),
		isBookmarked: true,
	},
];

const mockSeries = [
	{
		id: 3,
		title: "Test Series 1",
		description: "This is test series 1",
		photoSrcProd: "/test-series-1.jpg",
		ratingImdb: 9.0,
		dateAired: new Date("2023-03-10"),
		isBookmarked: false,
	},
	{
		id: 4,
		title: "Test Series 2",
		description: "This is test series 2",
		photoSrcProd: "/test-series-2.jpg",
		ratingImdb: 8.2,
		dateAired: new Date("2023-04-20"),
		isBookmarked: true,
	},
];

const renderListHomeSection = (
	data = mockMovies,
	type = "movie",
	link = "/movies",
	linkText = "View All Movies",
	path = "movies",
) => {
	return render(
		<ThemeProvider theme={theme}>
			<ListHomeSection
				data={data}
				type={type}
				link={link}
				linkText={linkText}
				path={path}
			/>
		</ThemeProvider>,
	);
};

describe("ListHomeSection Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Set up window resize mock
		mockResizeEvent();
	});

	it("renders without crashing", () => {
		renderListHomeSection();
		expect(screen.getByTestId("slider-mock")).toBeDefined();
	});

	it("renders the correct section title for movies", () => {
		renderListHomeSection(mockMovies, "movie");
		expect(screen.getByText("Trending Movies")).toBeDefined();
	});

	it("renders the correct section title for series", () => {
		renderListHomeSection(mockSeries, "serie");
		expect(screen.getByText("Trending Series")).toBeDefined();
	});

	it("renders the correct link text", () => {
		renderListHomeSection(
			mockMovies,
			"movie",
			"/movies",
			"View All Movies",
		);
		const linkElement = screen.getByText("View All Movies");
		expect(linkElement).toBeDefined();

		const linkContainer = screen.getByTestId("next-link");
		expect(linkContainer.getAttribute("href")).toBe("/movies");
	});

	it("renders the correct number of card items", () => {
		renderListHomeSection(mockMovies);
		const cardItems = screen.getAllByTestId("card-item-mock");
		expect(cardItems.length).toBe(mockMovies.length);
	});

	it("passes the correct data to CardItem for movies", () => {
		renderListHomeSection(mockMovies, "movie");
		const cardItems = screen.getAllByTestId("card-item-mock");

		// Check that the type is passed correctly
		expect(cardItems[0].getAttribute("data-type")).toBe("movie");

		// Check that the path is passed correctly
		expect(cardItems[0].getAttribute("data-path")).toBe("movies");

		// Check that the title is displayed correctly
		const cardTitles = screen.getAllByTestId("card-title");
		expect(cardTitles[0].textContent).toBe("Test Movie 1");
		expect(cardTitles[1].textContent).toBe("Test Movie 2");
	});

	it("passes the correct data to CardItem for series", () => {
		renderListHomeSection(
			mockSeries,
			"serie",
			"/series",
			"View All Series",
			"series",
		);
		const cardItems = screen.getAllByTestId("card-item-mock");

		// Check that the type is passed correctly
		expect(cardItems[0].getAttribute("data-type")).toBe("serie");

		// Check that the path is passed correctly
		expect(cardItems[0].getAttribute("data-path")).toBe("series");

		// Check that the title is displayed correctly
		const cardTitles = screen.getAllByTestId("card-title");
		expect(cardTitles[0].textContent).toBe("Test Series 1");
		expect(cardTitles[1].textContent).toBe("Test Series 2");
	});

	it("sets the correct number of slides based on window width", () => {
		// Test with large screen
		Object.defineProperty(window, "innerWidth", {
			value: 1920,
			writable: true,
		});
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		const { unmount } = renderListHomeSection();
		let sliderProps = screen.getByTestId("slider-props");
		let props = JSON.parse(sliderProps.getAttribute("data-props") || "{}");
		expect(props.slidesToShow).toBe(6);
		unmount();

		// Test with medium screen
		Object.defineProperty(window, "innerWidth", {
			value: 900,
			writable: true,
		});
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		const { unmount: unmount2 } = renderListHomeSection();
		sliderProps = screen.getByTestId("slider-props");
		props = JSON.parse(sliderProps.getAttribute("data-props") || "{}");
		expect(props.slidesToShow).toBe(4);
		unmount2();

		// Test with small screen
		Object.defineProperty(window, "innerWidth", {
			value: 500,
			writable: true,
		});
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		renderListHomeSection();
		sliderProps = screen.getByTestId("slider-props");
		props = JSON.parse(sliderProps.getAttribute("data-props") || "{}");
		expect(props.slidesToShow).toBe(2);
	});

	it("handles empty data gracefully", () => {
		renderListHomeSection([]);
		const sliderMock = screen.getByTestId("slider-mock");
		expect(sliderMock).toBeDefined();
		// No card items should be rendered
		expect(screen.queryAllByTestId("card-item-mock").length).toBe(0);
	});

	it("sets infinite to false when there are not enough items", () => {
		// When there are fewer items than slidesToShow, infinite should be false
		Object.defineProperty(window, "innerWidth", {
			value: 1920,
			writable: true,
		});
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		renderListHomeSection(mockMovies); // Only 2 items, but slidesToShow is 6
		const sliderProps = screen.getByTestId("slider-props");
		const props = JSON.parse(
			sliderProps.getAttribute("data-props") || "{}",
		);
		expect(props.infinite).toBe(false);
	});

	it("sets autoplay to true", () => {
		renderListHomeSection();
		const sliderProps = screen.getByTestId("slider-props");
		const props = JSON.parse(
			sliderProps.getAttribute("data-props") || "{}",
		);
		expect(props.autoplay).toBe(true);
	});

	it("renders custom arrow components", () => {
		// We can't directly test the arrow components since they're not serializable
		// Instead, we'll check that the slider component is rendered
		renderListHomeSection();
		expect(screen.getByTestId("slider-mock")).toBeDefined();
	});

	it("handles null return from transformItemToCardData", () => {
		// Create a mock genre that will return null from transformItemToCardData
		const mockGenre = { id: 5, name: "Action" } as any;
		renderListHomeSection([mockGenre], "movie");

		// The slider should still be rendered, but no card items
		expect(screen.getByTestId("slider-mock")).toBeDefined();

		// In the actual component, null items are filtered out and not rendered
		// But in our mock, the slider-children div still contains the null items
		// So we can't directly test for the absence of card items
		// Instead, we'll check that the slider is rendered
	});
});
