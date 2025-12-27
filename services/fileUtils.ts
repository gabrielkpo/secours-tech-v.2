/**
 * Fetches a file from the public folder and converts it to Base64
 * Used for the pre-loaded documents.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    // Construct a full URL to avoid relative path issues in production
    // If 'url' starts with '/', it will be relative to the domain root.
    const fullUrl = new URL(url, window.location.origin).toString();
    console.log(`Attempting to fetch document from: ${fullUrl}`);

    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Document not found (404): ${url}. Please check filename case sensitivity.`);
      }
      throw new Error(`Failed to fetch document: ${url} (Status: ${response.status})`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
           // Remove "data:application/pdf;base64," prefix
           const base64 = reader.result.split(',')[1];
           resolve(base64);
        } else {
           reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading document:", error);
    throw error;
  }
};
