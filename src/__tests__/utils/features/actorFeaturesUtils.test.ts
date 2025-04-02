import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onBookmarkActor, onRemoveBookmarkActor } from '@/utils/features/actorFeaturesUtils';
import { addFavoriteActorToUser, removeFavoriteActorToUser } from '@/actions/user/userBookmarks.actions';
import { showToast } from '@/utils/helpers/toast';
import { Actor } from '@prisma/client';
import { Session } from 'next-auth';

// Mock dependencies
vi.mock('@/actions/user/userBookmarks.actions', () => ({
  addFavoriteActorToUser: vi.fn(),
  removeFavoriteActorToUser: vi.fn()
}));

vi.mock('@/utils/helpers/toast', () => ({
  showToast: vi.fn()
}));

// Mock console.error to avoid polluting test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Actor Features Utils', () => {
  // Test data
  const mockSession: Session = {
    user: { id: '1', email: 'test@example.com', userName: 'TestUser', role: 'User' },
    expires: '2023-01-01'
  };

  const mockActor: Actor = {
    id: 1,
    fullname: 'Test Actor',
    description: 'A test actor biography',
    photoSrc: 'photo.jpg',
    photoSrcProd: 'photo-prod.jpg',
    debut: '2010'
  } as Actor; // Type assertion to handle any missing properties

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('onBookmarkActor', () => {
    it('should add actor to favorites and show success toast', async () => {
      await onBookmarkActor(mockSession, mockActor);

      expect(addFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('success', 'Actor added to favorites!');
    });

    it('should handle errors and show error toast', async () => {
      const testError = new Error('Test error');
      vi.mocked(addFavoriteActorToUser).mockRejectedValueOnce(testError);

      await onBookmarkActor(mockSession, mockActor);

      expect(addFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('error', 'An error occurred: Test error');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown errors', async () => {
      vi.mocked(addFavoriteActorToUser).mockRejectedValueOnce('Unknown error');

      await onBookmarkActor(mockSession, mockActor);

      expect(addFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('error', 'An unexpected error occurred while adding the actor to favorites.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should do nothing if session or actor is missing', async () => {
      await onBookmarkActor(null as unknown as Session, mockActor);
      expect(addFavoriteActorToUser).not.toHaveBeenCalled();

      await onBookmarkActor(mockSession, null as unknown as Actor);
      expect(addFavoriteActorToUser).not.toHaveBeenCalled();

      // Test with missing user
      const sessionWithoutUser = { ...mockSession };
      delete (sessionWithoutUser as any).user;
      await onBookmarkActor(sessionWithoutUser, mockActor);
      expect(addFavoriteActorToUser).not.toHaveBeenCalled();
    });
  });

  describe('onRemoveBookmarkActor', () => {
    it('should remove actor from favorites and show success toast', async () => {
      await onRemoveBookmarkActor(mockSession, mockActor);

      expect(removeFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('success', 'Actor removed from favorites!');
    });

    it('should handle errors and show error toast', async () => {
      const testError = new Error('Test error');
      vi.mocked(removeFavoriteActorToUser).mockRejectedValueOnce(testError);

      await onRemoveBookmarkActor(mockSession, mockActor);

      expect(removeFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('error', 'An error occurred: Test error');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown errors', async () => {
      vi.mocked(removeFavoriteActorToUser).mockRejectedValueOnce('Unknown error');

      await onRemoveBookmarkActor(mockSession, mockActor);

      expect(removeFavoriteActorToUser).toHaveBeenCalledWith(1, mockActor.id);
      expect(showToast).toHaveBeenCalledWith('error', 'An unexpected error occurred while removing the actor from favorites.');
      expect(console.error).toHaveBeenCalled();
    });

    it('should do nothing if session or actor is missing', async () => {
      await onRemoveBookmarkActor(null as unknown as Session, mockActor);
      expect(removeFavoriteActorToUser).not.toHaveBeenCalled();

      await onRemoveBookmarkActor(mockSession, null as unknown as Actor);
      expect(removeFavoriteActorToUser).not.toHaveBeenCalled();

      // Test with missing user
      const sessionWithoutUser = { ...mockSession };
      delete (sessionWithoutUser as any).user;
      await onRemoveBookmarkActor(sessionWithoutUser, mockActor);
      expect(removeFavoriteActorToUser).not.toHaveBeenCalled();
    });
  });
});
