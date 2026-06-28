// Deprecated legacy handler.
// Kept only to avoid breaking existing routes; it does not read any secret env vars.

export default async () => {
  return new Response("Deprecated function", { status: 410 });
};

