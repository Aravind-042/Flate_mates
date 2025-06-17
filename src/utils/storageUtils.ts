
// Utility functions for managing localStorage data with size limits

import type { FlatListing } from "@/types/flat";
import { getTotalImagesSize } from "./imageUtils";

const MAX_STORAGE_SIZE_MB = 4; // Leave some buffer for other data

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

export const getStorageUsage = (): { used: number; available: number } => {
  try {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    const usedMB = used / (1024 * 1024);
    return { used: usedMB, available: MAX_STORAGE_SIZE_MB - usedMB };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, available: MAX_STORAGE_SIZE_MB };
  }
};

export const savePendingListingData = (listingData: FlatListing): { success: boolean; error?: string } => {
  try {
    // Check image sizes
    const imagesSizeMB = getTotalImagesSize(listingData.images);
    console.log(`Images total size: ${imagesSizeMB.toFixed(2)}MB`);

    if (imagesSizeMB > MAX_STORAGE_SIZE_MB) {
      return {
        success: false,
        error: `Images are too large (${imagesSizeMB.toFixed(1)}MB). Please reduce image sizes or number of images.`
      };
    }

    // Create a copy without images first to check basic data size
    const listingWithoutImages = { ...listingData, images: [] };
    const basicDataString = JSON.stringify(listingWithoutImages);
    
    // Check if basic data fits
    const basicDataSizeMB = new Blob([basicDataString]).size / (1024 * 1024);
    if (basicDataSizeMB > 1) {
      return {
        success: false,
        error: 'Listing data is too large. Please reduce the description length or other text fields.'
      };
    }

    // Try to save the full data
    const fullDataString = JSON.stringify(listingData);
    const totalSizeMB = new Blob([fullDataString]).size / (1024 * 1024);
    
    if (totalSizeMB > MAX_STORAGE_SIZE_MB) {
      return {
        success: false,
        error: `Total data size (${totalSizeMB.toFixed(1)}MB) exceeds storage limit. Please reduce image sizes.`
      };
    }

    localStorage.setItem('pendingListingData', fullDataString);
    console.log(`Successfully saved listing data (${totalSizeMB.toFixed(2)}MB)`);
    return { success: true };

  } catch (error: any) {
    console.error('Error saving pending listing data:', error);
    
    if (error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: 'Storage quota exceeded. Please reduce image sizes or remove some images.'
      };
    }
    
    return {
      success: false,
      error: 'Failed to save listing data. Please try reducing image sizes.'
    };
  }
};

export const getPendingListingData = (): FlatListing | null => {
  try {
    const data = localStorage.getItem('pendingListingData');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving pending listing data:', error);
    clearPendingListingData(); // Clear corrupted data
    return null;
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
