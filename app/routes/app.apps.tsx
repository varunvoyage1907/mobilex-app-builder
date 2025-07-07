import React, { useState } from "react";
import {
  Page,
  Card,
  Layout,
  Button,
  ButtonGroup,
  Badge,
  Banner,
  LegacyStack as Stack,
  Text,
  Divider,
  TextField,
  Modal,
  FormLayout,
  Icon,
  ResourceList,
  ResourceItem,
  Avatar,
  Box,
  InlineStack,
  BlockStack
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { 
  EditIcon,
  ViewIcon,
  DuplicateIcon,
  DeleteIcon,
  PlusIcon,
  MobileIcon,
  SearchIcon
} from '@shopify/polaris-icons';
import db from "../db.server";

interface App {
  id: string;
  name: string;
  version: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  
  try {
    const apps = await db.app.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        version: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return json({ apps });
  } catch (error) {
    console.error('Error loading apps:', error);
    return json({ apps: [] });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const action = formData.get("action") as string;
  
  try {
    switch (action) {
      case "delete": {
        const appId = formData.get("appId") as string;
        
        await db.app.delete({
          where: { id: appId },
        });
        
        return json({ success: true });
      }
      
      case "duplicate": {
        const appId = formData.get("appId") as string;
        const newName = formData.get("newName") as string;
        
        const originalApp = await db.app.findUnique({
          where: { id: appId },
        });
        
        if (originalApp) {
          await db.app.create({
            data: {
              name: newName,
              data: originalApp.data,
              templateId: originalApp.templateId,
              version: "1.0.0"
            },
          });
        }
        
        return json({ success: true });
      }
      
      case "publish": {
        const appId = formData.get("appId") as string;
        
        await db.app.update({
          where: { id: appId },
          data: { isPublished: true }
        });
        
        return json({ success: true });
      }
      
      case "unpublish": {
        const appId = formData.get("appId") as string;
        
        await db.app.update({
          where: { id: appId },
          data: { isPublished: false }
        });
        
        return json({ success: true });
      }
      
      default:
        return json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling app action:', error);
    return json({ error: "Failed to perform action" }, { status: 500 });
  }
};

export default function AppsPage() {
  const { apps } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter apps based on search
  const filteredApps = apps.filter((app: App) => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicateApp = (appId: string, originalName: string) => {
    const newName = prompt(`Duplicate "${originalName}" as:`, `${originalName} Copy`);
    if (!newName) return;
    
    const formData = new FormData();
    formData.append("action", "duplicate");
    formData.append("appId", appId);
    formData.append("newName", newName);
    
    submit(formData, { method: "post" });
  };

  const handleDeleteApp = (appId: string, appName: string) => {
    if (!confirm(`Are you sure you want to delete "${appName}"?`)) return;
    
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("appId", appId);
    
    submit(formData, { method: "post" });
  };

  const handlePublishToggle = (appId: string, isPublished: boolean) => {
    const formData = new FormData();
    formData.append("action", isPublished ? "unpublish" : "publish");
    formData.append("appId", appId);
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Your Mobile Apps"
      subtitle="Manage and publish your mobile shopping apps"
      primaryAction={{
        content: "Create new app",
        icon: PlusIcon,
        url: "/app/builder",
      }}
    >
      <Banner>
        <Text variant="bodySm" as="p">
          <strong>Apps vs Templates:</strong> Apps are your final mobile shopping experiences ready for customers. 
          Templates are reusable designs that help you build apps faster.
        </Text>
      </Banner>
      
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">Your Apps</Text>
                <TextField
                  label="Search"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  clearButton
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                />
              </InlineStack>
              
              {filteredApps.length === 0 ? (
                <Box padding="600">
                  <BlockStack gap="300" inlineAlign="center">
                    <Icon source={MobileIcon} />
                    <Text variant="bodyLg" alignment="center" as="p">
                      {searchQuery ? 'No apps found' : 'No apps created yet'}
                    </Text>
                    <Text variant="bodySm" tone="subdued" alignment="center" as="p">
                      {searchQuery 
                        ? 'Try adjusting your search terms'
                        : 'Create your first mobile app to get started'
                      }
                    </Text>
                    {!searchQuery && (
                      <Button
                        variant="primary"
                        url="/app/builder"
                      >
                        Create your first app
                      </Button>
                    )}
                  </BlockStack>
                </Box>
              ) : (
                <ResourceList
                  items={filteredApps}
                  renderItem={(app) => (
                    <ResourceItem
                      id={app.id}
                      media={
                        <Avatar
                          initials={app.name.substring(0, 2).toUpperCase()}
                        />
                      }
                      accessibilityLabel={`App ${app.name}`}
                      onClick={() => {}}
                    >
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="100">
                          <InlineStack gap="200" blockAlign="center">
                            <Text variant="bodyMd" fontWeight="semibold" as="p">
                              {app.name}
                            </Text>
                            <Badge tone={app.isPublished ? "success" : "attention"}>
                              {`${app.isPublished ? "Published" : "Draft"} v${app.version}`}
                            </Badge>
                          </InlineStack>
                          <Text variant="bodySm" tone="subdued" as="p">
                            Last updated: {new Date(app.updatedAt).toLocaleDateString()}
                          </Text>
                        </BlockStack>
                        
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            size="micro"
                            icon={EditIcon}
                            url={`/app/builder?app=${app.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="micro"
                            icon={ViewIcon}
                            url={`/app/preview?app=${app.id}`}
                          >
                            Preview
                          </Button>
                          <Button
                            size="micro"
                            tone={app.isPublished ? "critical" : "success"}
                            onClick={() => handlePublishToggle(app.id, app.isPublished)}
                          >
                            {app.isPublished ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            size="micro"
                            icon={DuplicateIcon}
                            onClick={() => handleDuplicateApp(app.id, app.name)}
                          >
                            Duplicate
                          </Button>
                          <Button
                            size="micro"
                            icon={DeleteIcon}
                            tone="critical"
                            onClick={() => handleDeleteApp(app.id, app.name)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </InlineStack>
                    </ResourceItem>
                  )}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 