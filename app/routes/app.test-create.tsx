import React from "react";
import { Page, Card, Button, TextField, Banner } from "@shopify/polaris";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const appName = formData.get("appName") as string;
  
  console.log("Test route: Creating app with name:", appName);
  
  if (!appName?.trim()) {
    return json({ error: "App name is required" }, { status: 400 });
  }
  
  try {
    const app = await db.app.create({
      data: {
        name: appName,
        version: "1.0.0",
        pages: {
          create: {
            pageType: "homepage",
            name: "Home",
            data: [],
            order: 0,
          }
        }
      },
      include: {
        pages: true
      }
    });
    
    console.log("Test route: App created successfully:", app.id);
    return redirect(`/app/multi-builder?app=${app.id}`);
    
  } catch (error) {
    console.error("Test route: Database error:", error);
    return json({ error: "Failed to create app" }, { status: 500 });
  }
};

export default function TestCreateApp() {
  const actionData = useActionData<typeof action>();
  
  return (
    <Page title="Test App Creation">
      {actionData?.error && (
        <Banner tone="critical">
          {actionData.error}
        </Banner>
      )}
      
      <Card>
        <Form method="post" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              label="App Name"
              name="appName"
              placeholder="Enter app name"
              autoComplete="off"
            />
          </div>
          <Button submit variant="primary">
            Create Test App
          </Button>
        </Form>
      </Card>
    </Page>
  );
} 