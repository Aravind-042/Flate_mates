
// Utility functions for managing localStorage data

export const clearPendingListingData = () => {
  try {
    localStorage.removeItem('pendingListingData');
    console.log('Cleared pending listing data from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing pending listing data:', error);
    return false;
  }
};

export const hasPendingListingData = (): boolean => {
  try {
    const data = localStorage.getItem('pendingListingData');
    return data !== null;
  } catch (error) {
    console.error('Error checking pending listing data:', error);
    return false;
  }
};

export const clearAllAppData = () => {
  try {
    // Clear all app-related localStorage items
    const keysToRemove = [
      'pendingListingData',
      'draft-listing',
      'temp-listing-data'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Cleared all app data from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};
