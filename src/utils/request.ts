export const request = async (endpoint: string, options: RequestInit = {}) => {
  const baseURL = 'https://norma.nomoreparties.space/api';
  const url = `${baseURL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};
