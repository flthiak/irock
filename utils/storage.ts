import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RockItem {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  properties: Array<{ name: string; value: string }>;
  date: string;
  notes?: string;
  location?: string;
  classification?: string;
  physicalProperties?: any;
}

const COLLECTION_KEY = 'rock_collection';

// Save a rock to the collection
export async function saveToCollection(rock: RockItem): Promise<void> {
  try {
    // Get existing collection
    const collection = await getCollection();
    
    // Add new rock to collection
    collection.unshift(rock); // Add to beginning of array
    
    // Save updated collection
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Error saving rock to collection:', error);
    throw error;
  }
}

// Get all rocks from the collection
export async function getCollection(): Promise<RockItem[]> {
  try {
    const collectionJson = await AsyncStorage.getItem(COLLECTION_KEY);
    if (collectionJson) {
      return JSON.parse(collectionJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting collection:', error);
    return [];
  }
}

// Remove a rock from the collection
export async function removeFromCollection(id: string): Promise<void> {
  try {
    // Get existing collection
    const collection = await getCollection();
    
    // Filter out the rock with the specified id
    const updatedCollection = collection.filter(rock => rock.id !== id);
    
    // Save updated collection
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
  } catch (error) {
    console.error('Error removing rock from collection:', error);
    throw error;
  }
}

// Get a specific rock by id
export async function getRockById(id: string): Promise<RockItem | null> {
  try {
    const collection = await getCollection();
    return collection.find(rock => rock.id === id) || null;
  } catch (error) {
    console.error('Error getting rock by id:', error);
    return null;
  }
}