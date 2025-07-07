import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

interface PageInput {
  pageType: string;
  name: string;
  data: any[];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { name, data, templateId, version, pages } = await request.json();

    if (!name) {
      return json({ error: "Name is required" }, { status: 400 });
    }

    // Check if app with this name already exists
    const existingApp = await db.app.findFirst({
      where: { name },
      include: { pages: true }
    });

    let app;
    if (existingApp) {
      // Update existing app
      app = await db.app.update({
        where: { id: existingApp.id },
        data: {
          name,
          data: data || existingApp.data,
          templateId,
          version: version || existingApp.version,
          updatedAt: new Date()
        },
        include: { pages: true }
      });
    } else {
      // Create new app with default homepage if no pages provided
      app = await db.app.create({
        data: {
          name,
          data: data || null,
          templateId,
          version: version || "1.0.0",
          pages: pages ? {
            create: (pages as PageInput[]).map((page, index) => ({
              pageType: page.pageType,
              name: page.name,
              data: page.data || [],
              order: index,
              isActive: true
            }))
          } : {
            create: {
              pageType: "homepage",
              name: "Home",
              data: [],
              order: 0,
              isActive: true
            }
          }
        },
        include: { pages: true }
      });
    }

    return json({ 
      success: true, 
      app: {
        id: app.id,
        name: app.name,
        version: app.version,
        isPublished: app.isPublished,
        pages: app.pages.map((page: any) => ({
          id: page.id,
          pageType: page.pageType,
          name: page.name,
          order: page.order,
          isActive: page.isActive
        }))
      }
    });
  } catch (error) {
    console.error("Error saving app:", error);
    return json({ error: "Failed to save app" }, { status: 500 });
  }
}; 