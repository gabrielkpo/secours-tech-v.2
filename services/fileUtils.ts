/**
 * Fetches a file from the public folder and converts it to Base64
 * Used for the pre-loaded documents.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch document: ${url}`);
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