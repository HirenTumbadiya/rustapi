import { Environment, RequestCollection } from '../types/types';

// In a real application, we would use Tauri's fs API to store these
// For now, we'll use localStorage for simplicity

export const saveEnvironment = async (environment: Environment): Promise<void> => {
  try {
    const environments = await getEnvironments();
    const existingIndex = environments.findIndex(e => e.id === environment.id);
    
    if (existingIndex >= 0) {
      environments[existingIndex] = environment;
    } else {
      environments.push(environment);
    }
    
    localStorage.setItem('environments', JSON.stringify(environments));
  } catch (error) {
    console.error('Error saving environment:', error);
    throw error;
  }
};

export const getEnvironments = async (): Promise<Environment[]> => {
  try {
    const data = localStorage.getItem('environments');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting environments:', error);
    return [];
  }
};

export const getEnvironment = async (id: string): Promise<Environment | null> => {
  try {
    const environments = await getEnvironments();
    return environments.find(e => e.id === id) || null;
  } catch (error) {
    console.error('Error getting environment:', error);
    return null;
  }
};

export const deleteEnvironment = async (id: string): Promise<void> => {
  try {
    const environments = await getEnvironments();
    const newEnvironments = environments.filter(e => e.id !== id);
    localStorage.setItem('environments', JSON.stringify(newEnvironments));
  } catch (error) {
    console.error('Error deleting environment:', error);
    throw error;
  }
};

export const saveCollection = async (collection: RequestCollection): Promise<void> => {
  try {
    const collections = await getCollections();
    const existingIndex = collections.findIndex(c => c.id === collection.id);
    
    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }
    
    localStorage.setItem('collections', JSON.stringify(collections));
  } catch (error) {
    console.error('Error saving collection:', error);
    throw error;
  }
};

export const getCollections = async (): Promise<RequestCollection[]> => {
  try {
    const data = localStorage.getItem('collections');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};

export const getCollection = async (id: string): Promise<RequestCollection | null> => {
  try {
    const collections = await getCollections();
    return collections.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error getting collection:', error);
    return null;
  }
};

export const deleteCollection = async (id: string): Promise<void> => {
  try {
    const collections = await getCollections();
    const newCollections = collections.filter(c => c.id !== id);
    localStorage.setItem('collections', JSON.stringify(newCollections));
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

// Helper to replace environment variables in a string
export const replaceEnvVars = (
  text: string,
  variables: Record<string, string>
): string => {
  let result = text;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return result;
};