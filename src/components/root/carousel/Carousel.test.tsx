import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Carousel from './Carousel';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme/theme';

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ src, alt, height, width, priority, style }: any) => (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      data-priority={priority}
      data-testid="carousel-image"
      style={style}
    />
  )
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  }
}));

// Mock Slider component from react-slick
vi.mock('react-slick', () => {
  return {
    default: ({ children, ...props }: any) => {
      // Extract the beforeChange function to call it with the first slide
      if (props.beforeChange) {
        props.beforeChange(0, 0);
      }
      
      return (
        <div data-testid="slider-mock">
          <div data-testid="slider-props" data-props={JSON.stringify(props)} />
          <div data-testid="slider-children">{children}</div>
        </div>
      );
    }
  };
});

// Sample test data
const mockCarouselData = [
  {
    id: 1,
    title: 'Test Movie',
    description: 'This is a test movie description',
    photoSrcProd: '/test-movie.jpg'
  },
  {
    id: 2,
    title: 'Another Movie',
    description: 'This is another test movie description',
    photoSrcProd: '/another-movie.jpg'
  },
  {
    id: 3,
    fullname: 'Test Actor',
    description: 'This is a test actor description',
    photoSrcProd: '/test-actor.jpg'
  }
];

const renderCarousel = (data = mockCarouselData, type = 'movies') => {
  return render(
    <ThemeProvider theme={theme}>
      <Carousel data={data} type={type} />
    </ThemeProvider>
  );
};

describe('Carousel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderCarousel();
    expect(screen.getByTestId('slider-mock')).toBeDefined();
  });

  it('renders with correct slider settings', () => {
    renderCarousel();
    const sliderProps = screen.getByTestId('slider-props');
    const props = JSON.parse(sliderProps.getAttribute('data-props') || '{}');
    
    expect(props.dots).toBe(true);
    expect(props.infinite).toBe(true);
    expect(props.speed).toBe(800);
    expect(props.slidesToShow).toBe(1);
    expect(props.autoplay).toBe(true);
    expect(props.fade).toBe(true);
  });

  it('renders all carousel items', () => {
    renderCarousel();
    const items = screen.getAllByTestId('carousel-image');
    expect(items.length).toBe(mockCarouselData.length);
  });

  it('displays correct title for movie type', () => {
    renderCarousel(mockCarouselData, 'movies');
    expect(screen.getByText('Test Movie')).toBeDefined();
    expect(screen.getByText('Another Movie')).toBeDefined();
  });

  it('displays correct name for actor type', () => {
    renderCarousel(mockCarouselData, 'actors');
    expect(screen.getByText('Test Actor')).toBeDefined();
  });

  it('displays item descriptions', () => {
    renderCarousel();
    expect(screen.getByText('This is a test movie description')).toBeDefined();
    expect(screen.getByText('This is another test movie description')).toBeDefined();
    expect(screen.getByText('This is a test actor description')).toBeDefined();
  });

  it('renders "See Details" buttons with correct links', () => {
    renderCarousel(mockCarouselData, 'movies');
    const buttons = screen.getAllByText('See Details');
    expect(buttons.length).toBe(mockCarouselData.length);
    
    // Check that the first button has the correct link
    const firstLink = buttons[0].closest('a');
    expect(firstLink).toBeDefined();
    expect(firstLink?.getAttribute('href')).toBe('/movies/1/Test-Movie');
  });

  it('handles empty data gracefully', () => {
    renderCarousel([]);
    const sliderMock = screen.getByTestId('slider-mock');
    expect(sliderMock).toBeDefined();
    // No images should be rendered
    expect(screen.queryAllByTestId('carousel-image').length).toBe(0);
  });

  it('generates correct links for different types', () => {
    // Test with movies
    const { unmount } = renderCarousel(mockCarouselData, 'movies');
    let buttons = screen.getAllByText('See Details');
    let firstLink = buttons[0].closest('a');
    expect(firstLink?.getAttribute('href')).toBe('/movies/1/Test-Movie');
    unmount();
    
    // Test with actors
    renderCarousel([mockCarouselData[2]], 'actors');
    buttons = screen.getAllByText('See Details');
    firstLink = buttons[0].closest('a');
    expect(firstLink?.getAttribute('href')).toBe('/actors/3/Test-Actor');
  });

  it('renders images with priority flag', () => {
    renderCarousel();
    const images = screen.getAllByTestId('carousel-image');
    images.forEach(img => {
      expect(img.getAttribute('data-priority')).toBe('true');
    });
  });

  it('renders motion components for animations', () => {
    renderCarousel();
    const motionDivs = screen.getAllByTestId('motion-div');
    expect(motionDivs.length).toBeGreaterThan(0);
  });
});
