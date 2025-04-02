import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResultCard from './SearchResultCard';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme/theme';

import { useParams } from 'next/navigation';

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, sizes, style, priority }: any) => (
    <img
      src={src}
      alt={alt}
      data-testid="search-result-image"
      data-fill={fill}
      data-sizes={sizes}
      style={style}
      data-priority={priority}
    />
  )
}));

vi.mock('next/navigation', () => ({
  useParams: vi.fn().mockReturnValue({})
}));

// Sample test data
const movieData = {
  id: 1,
  title: 'Test Movie',
  description: 'This is a test movie description',
  photoSrcProd: '/test-movie.jpg',
  dateAired: new Date('2023-01-01')
};

const serieData = {
  id: 2,
  title: 'Test Serie',
  description: 'This is a test serie description',
  photoSrcProd: '/test-serie.jpg',
  dateAired: new Date('2022-05-15')
};

const actorData = {
  id: 3,
  fullname: 'Test Actor',
  debut: '2010',
  description: 'This is a test actor description',
  photoSrcProd: '/test-actor.jpg'
};

const crewData = {
  id: 4,
  fullname: 'Test Crew',
  debut: '2005',
  description: 'This is a test crew description',
  photoSrcProd: '/test-crew.jpg'
};

const userData = {
  id: 5,
  userName: 'testuser',
  bio: 'This is a test user bio',
  photoSrcProd: '/test-user.jpg'
};

const seasonData = {
  id: 6,
  title: 'Test Season',
  description: 'This is a test season description',
  photoSrcProd: '/test-season.jpg',
  dateAired: new Date('2022-06-20')
};

const episodeData = {
  id: 7,
  title: 'Test Episode',
  description: 'This is a test episode description',
  photoSrcProd: '/test-episode.jpg',
  dateAired: new Date('2022-07-10')
};

const mockOnResultClick = vi.fn();

const renderSearchResultCard = (
  data: any,
  type: "movie" | "serie" | "season" | "episode" | "actor" | "crew" | "user",
  path?: "movies" | "actors" | "crew" | null
) => {
  return render(
    <ThemeProvider theme={theme}>
      <SearchResultCard
        data={data}
        type={type}
        path={path}
        onResultClick={mockOnResultClick}
      />
    </ThemeProvider>
  );
};

describe('SearchResultCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({});
  });

  it('renders a movie card correctly', () => {
    renderSearchResultCard(movieData, 'movie');

    // Check image
    const image = screen.getByTestId('search-result-image');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('/test-movie.jpg');

    // Check title with year
    expect(screen.getByText('Test Movie (2023)')).toBeDefined();

    // Check description
    expect(screen.getByText('This is a test movie description')).toBeDefined();

    // Check link
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/movies/1/Test-Movie');
  });

  it('renders a serie card correctly', () => {
    renderSearchResultCard(serieData, 'serie');

    // Check title with year
    expect(screen.getByText('Test Serie (2022)')).toBeDefined();

    // Check link
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/series/2/Test-Serie');
  });

  it('renders an actor card correctly', () => {
    renderSearchResultCard(actorData, 'actor', 'actors');

    // Check name with debut year
    expect(screen.getByText('Test Actor (2010)')).toBeDefined();

    // Check link
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/actors/3/Test-Actor');
  });

  it('renders a crew card correctly', () => {
    renderSearchResultCard(crewData, 'crew', 'crew');

    // Check name with debut year
    expect(screen.getByText('Test Crew (2005)')).toBeDefined();

    // Check link
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/crew/4/Test-Crew');
  });

  it('renders a user card correctly', () => {
    renderSearchResultCard(userData, 'user');

    // Check username
    expect(screen.getByText('testuser')).toBeDefined();

    // Check bio instead of description
    expect(screen.getByText('This is a test user bio')).toBeDefined();

    // Check link
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/users/5/testuser');
  });

  it('renders a season card correctly with route params', () => {
    vi.mocked(useParams).mockReturnValue({
      serieId: '10',
      serieTitle: 'Parent Serie'
    });

    renderSearchResultCard(seasonData, 'season');

    // Check title with year
    expect(screen.getByText('Test Season (2022)')).toBeDefined();

    // Check link with nested route
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/series/10/Parent-Serie/seasons/6/Test-Season');
  });

  it('renders an episode card correctly with route params', () => {
    vi.mocked(useParams).mockReturnValue({
      serieId: '10',
      serieTitle: 'Parent Serie',
      seasonId: '20',
      seasonTitle: 'Season One'
    });

    renderSearchResultCard(episodeData, 'episode');

    // Check title with year
    expect(screen.getByText('Test Episode (2022)')).toBeDefined();

    // Check link with deeply nested route
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/series/10/Parent-Serie/seasons/20/Season-One/episodes/7/Test-Episode');
  });

  it('handles missing image by using placeholder', () => {
    const dataWithoutImage = { ...movieData, photoSrcProd: undefined };
    renderSearchResultCard(dataWithoutImage, 'movie');

    const image = screen.getByTestId('search-result-image');
    expect(image.getAttribute('src')).toBe('/images/placeholder.jpg');
  });

  it('handles missing description', () => {
    const dataWithoutDescription = { ...movieData, description: undefined };
    renderSearchResultCard(dataWithoutDescription, 'movie');

    expect(screen.queryByText('This is a test movie description')).toBeNull();
  });

  it('handles missing date for media types', () => {
    const dataWithoutDate = { ...movieData, dateAired: null };
    renderSearchResultCard(dataWithoutDate, 'movie');

    // Should show title without year
    expect(screen.getByText('Test Movie')).toBeDefined();
    expect(screen.queryByText('Test Movie (2023)')).toBeNull();
  });

  it('handles missing debut for person types', () => {
    const dataWithoutDebut = { ...actorData, debut: '' };
    renderSearchResultCard(dataWithoutDebut, 'actor', 'actors');

    // Should show name without debut year
    expect(screen.getByText('Test Actor')).toBeDefined();
    expect(screen.queryByText('Test Actor (2010)')).toBeNull();
  });

  it('calls onResultClick when clicked', () => {
    renderSearchResultCard(movieData, 'movie');

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(mockOnResultClick).toHaveBeenCalledTimes(1);
  });

  it('handles different path types for actor cards', () => {
    // Test with movies path
    renderSearchResultCard(actorData, 'actor', 'movies');
    let link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/movies/3/Test-Actor');

    // Cleanup and re-render with actors path
    link.parentElement?.remove();
    renderSearchResultCard(actorData, 'actor', 'actors');
    link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/actors/3/Test-Actor');

    // Cleanup and re-render with null path (should default to series)
    link.parentElement?.remove();
    renderSearchResultCard(actorData, 'actor', null);
    link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/series/3/Test-Actor');
  });

  it('handles different path types for crew cards', () => {
    // Test with movies path
    renderSearchResultCard(crewData, 'crew', 'movies');
    let link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/movies/4/Test-Crew');

    // Cleanup and re-render with crew path
    link.parentElement?.remove();
    renderSearchResultCard(crewData, 'crew', 'crew');
    link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/crew/4/Test-Crew');

    // Cleanup and re-render with null path (should default to series)
    link.parentElement?.remove();
    renderSearchResultCard(crewData, 'crew', null);
    link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/series/4/Test-Crew');
  });
});
