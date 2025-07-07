import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
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
      return json({ error: "Template ID is required" }, { status: 400 });
    }

    const template = await db.template.findUnique({
      where: { id }
    });

    if (!template) {
      return json({ error: "Template not found" }, { status: 404 });
    }

    return json(template);
  } catch (error) {
    console.error("Error loading template:", error);
    return json({ error: "Failed to load template" }, { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  try {
    const templates = await db.template.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        designType: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return json({ templates });
  } catch (error) {
    console.error("Error loading templates:", error);
    return json({ templates: [] });
  }
}; 