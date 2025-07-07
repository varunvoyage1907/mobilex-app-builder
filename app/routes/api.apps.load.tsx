import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return json({ error: "App ID is required" }, { status: 400 });
    }

    const app = await db.app.findUnique({
      where: { id },
      include: {
        pages: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!app) {
      return json({ error: "App not found" }, { status: 404 });
    }

    return json(app);
  } catch (error) {
    console.error("Error loading app:", error);
    return json({ error: "Failed to load app" }, { status: 500 });
  }
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);

  try {
    const apps = await db.app.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        pages: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return json({ apps });
  } catch (error) {
    console.error("Error loading apps:", error);
    return json({ apps: [] });
  }
}; 