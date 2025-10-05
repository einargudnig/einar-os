export default async function Fetcher(url: string) {
  try {
    const response = await fetch(url);

    // Special handling for 204 status (No Content)
    if (response.status === 204) {
      return { data: null, status: 204 };
    }

    // Try to parse as JSON
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      // Return error for non-JSON responses
      return {
        error: `Failed to parse response as JSON from ${url}`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return {
      error: `Request failed for ${url}`,
      status: 500,
    };
  }
}
