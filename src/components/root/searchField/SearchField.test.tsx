import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchField from './SearchField';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/utils/theme/theme';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { showToast } from '@/utils/helpers/toast';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

vi.mock('nuqs', () => ({
  useQueryState: vi.fn()
}));

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn()
}));

vi.mock('@/utils/helpers/toast', () => ({
  showToast: vi.fn()
}));

vi.mock('./SearchAutocomplete', () => ({
  default: (props: any) => {
    const {
      loading,
      selectedFilters,
    onFilterChange,
    searchTerm,
    onShowMore,
    onClose,
    onResultClick,
    showInitialState,
    isMobile
    } = props;
    return (
    <div data-testid="search-autocomplete-mock">
      <div data-testid="search-autocomplete-props" data-props={JSON.stringify({
        loading,
        searchTerm,
        selectedFilters,
        showInitialState,
        isMobile
      })} />
      <button data-testid="filter-change-btn" onClick={() => onFilterChange('movies')}>Change Filter</button>
      <button data-testid="show-more-btn" onClick={onShowMore}>Show More</button>
      <button data-testid="close-btn" onClick={onClose}>Close</button>
      <button data-testid="result-click-btn" onClick={onResultClick}>Result Click</button>
    </div>
  );}
}));

// Mock fetch
global.fetch = vi.fn();

// Setup mock implementations
const mockRouter = {
  push: vi.fn()
};

const mockSetTerm = vi.fn();
const mockSetFiltersSearch = vi.fn();

const setupMocks = (initialTerm = '', initialFilters = 'all') => {
  vi.mocked(useRouter).mockReturnValue(mockRouter as any);

  vi.mocked(useQueryState).mockImplementation((key) => {
    if (key === 'term') {
      return [initialTerm, mockSetTerm] as any;
    }
    if (key === 'filters') {
      return [initialFilters, mockSetFiltersSearch] as any;
    }
    return ['', vi.fn()] as any;
  });

  vi.mocked(useDebounce).mockImplementation((value) => value);

  vi.mocked(global.fetch).mockResolvedValue({
    ok: true,
    json: async () => ({
      movies: { items: [], total: 0 },
      series: { items: [], total: 0 },
      actors: { items: [], total: 0 },
      crews: { items: [], total: 0 },
      seasons: { items: [], total: 0 },
      episodes: { items: [], total: 0 },
      users: { items: [], total: 0 }
    })
  } as Response);
};

const renderSearchField = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <SearchField {...props} />
    </ThemeProvider>
  );
};

describe('SearchField Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders in collapsed state initially', () => {
    renderSearchField();

    // Should show search icon button
    const searchIconButton = screen.getByRole('button');
    expect(searchIconButton).toBeDefined();

    // Should not show the expanded search field
    expect(screen.queryByPlaceholderText('Search...')).toBeNull();
  });

  it('expands when search icon is clicked', () => {
    renderSearchField();

    // Click the search icon
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Should now show the search field
    expect(screen.getByPlaceholderText('Search...')).toBeDefined();
  });

  it('handles input changes', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Should show the autocomplete component
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Check that the autocomplete received the correct props
    const autocompleteProps = JSON.parse(screen.getByTestId('search-autocomplete-props').getAttribute('data-props') || '{}');
    expect(autocompleteProps.searchTerm).toBe('test query');
  });

  it('fetches search results when input changes', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Should call fetch with the correct URL
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search/all?term=test%20query'),
        expect.anything()
      );
    });
  });

  it('handles form submission', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form!);

    // Should navigate to search page
    expect(mockRouter.push).toHaveBeenCalledWith('/search?term=test%20query&filters=all');
  });

  it('handles clear button click', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Click the clear button
    const clearButton = screen.getByLabelText('clear search');
    fireEvent.click(clearButton);

    // Input should be cleared
    expect((searchInput as HTMLInputElement).value).toBe('');

    // Should reset filters to 'all'
    expect(mockSetFiltersSearch).toHaveBeenCalledWith('all');
  });

  it('handles filter changes from SearchAutocomplete', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Wait for autocomplete to appear
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Click the filter change button in the mock
    const filterChangeBtn = screen.getByTestId('filter-change-btn');
    fireEvent.click(filterChangeBtn);

    // Should update selected filters
    await waitFor(() => {
      const autocompleteProps = JSON.parse(screen.getByTestId('search-autocomplete-props').getAttribute('data-props') || '{}');
      expect(autocompleteProps.selectedFilters).toContain('movies');
    });
  });

  it('handles "Show More" click from SearchAutocomplete', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Wait for autocomplete to appear
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Click the show more button in the mock
    const showMoreBtn = screen.getByTestId('show-more-btn');
    fireEvent.click(showMoreBtn);

    // Should navigate to search page
    expect(mockRouter.push).toHaveBeenCalledWith('/search?term=test%20query&filters=all');
  });

  it('handles close button click from SearchAutocomplete', async () => {
    const mockOnClose = vi.fn();
    renderSearchField({ onClose: mockOnClose });

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Wait for autocomplete to appear
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Click the close button in the mock
    const closeBtn = screen.getByTestId('close-btn');
    fireEvent.click(closeBtn);

    // Should call onClose prop
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles result click from SearchAutocomplete', async () => {
    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Wait for autocomplete to appear
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Click a result in the mock
    const resultClickBtn = screen.getByTestId('result-click-btn');
    fireEvent.click(resultClickBtn);

    // Input should be cleared
    expect((searchInput as HTMLInputElement).value).toBe('');
  });

  it('handles focus change', async () => {
    const mockOnFocusChange = vi.fn();
    renderSearchField({ onFocusChange: mockOnFocusChange });

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Focus the input
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.focus(searchInput);

    // Should call onFocusChange with true
    expect(mockOnFocusChange).toHaveBeenCalledWith(true);

    // Click away (handled by ClickAwayListener)
    // We can't directly test this, but we can test the close button which calls the same handler
    const closeBtn = screen.getByLabelText('collapse search');
    fireEvent.click(closeBtn);

    // Should call onFocusChange with false
    expect(mockOnFocusChange).toHaveBeenCalledWith(false);
  });

  it('handles API error gracefully', async () => {
    // Mock fetch to return an error
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Should show error toast
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('error', 'Failed to fetch search results');
    });
  });

  it('handles network error gracefully', async () => {
    // Mock fetch to throw an error
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Type in the search field
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Should show error toast
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('error', 'Failed to fetch search results. Please try again later.');
    });
  });

  it('renders with custom styles', () => {
    const customStyles = { width: '300px', margin: '10px' };
    renderSearchField({ customStyles });

    // The Box component should have the custom styles
    const box = screen.getByRole('button').closest('div');
    expect(box).toBeDefined();

    // We can't directly test the styles in JSDOM, but we can verify the component renders
    expect(box).toBeDefined();
  });

  it('renders in mobile mode', async () => {
    renderSearchField({ isMobile: true });

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Wait for autocomplete to appear
    await waitFor(() => {
      expect(screen.getByTestId('search-autocomplete-mock')).toBeDefined();
    });

    // Check that isMobile prop is passed to SearchAutocomplete
    const autocompleteProps = JSON.parse(screen.getByTestId('search-autocomplete-props').getAttribute('data-props') || '{}');
    expect(autocompleteProps.isMobile).toBe(true);
  });

  it('initializes with URL query parameters', () => {
    // Setup mocks with initial values
    setupMocks('initial query', 'movies,series');

    renderSearchField();

    // Expand the search field
    const searchIconButton = screen.getByRole('button');
    fireEvent.click(searchIconButton);

    // Input should have the initial value
    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(searchInput.value).toBe('initial query');

    // Selected filters should be initialized from URL
    const autocompleteProps = JSON.parse(screen.getByTestId('search-autocomplete-props').getAttribute('data-props') || '{}');
    expect(autocompleteProps.selectedFilters).toContain('movies');
    expect(autocompleteProps.selectedFilters).toContain('series');
  });
});
