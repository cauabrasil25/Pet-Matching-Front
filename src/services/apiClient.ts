// Use /api for internal proxy routing. Next.js will rewrite this to the actual backend URL
const apiUrl = '/api';

function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('pm_token');
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    const responseText = await response.text();

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText) as { message?: string; erro?: string };
        errorMessage = parsed.message ?? parsed.erro ?? responseText;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
