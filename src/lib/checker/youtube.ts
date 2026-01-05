// src/lib/checker/youtube.ts
export async function checkYouTube(username: string): Promise<boolean> {
  const handle = username.startsWith('@') ? username.slice(1) : username;
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/@${handle}&format=json`;

  try {
    const res = await fetch(oembedUrl);
    
    // 200 → channel exists → taken
    // 404/401 → not found → available
    return res.status === 404 || res.status === 401;
  } catch (err) {
    console.error('YouTube check failed:', err);
    return false;
  }
}