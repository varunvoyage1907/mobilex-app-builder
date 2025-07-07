import React, { useState, useEffect } from "react";
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
  Select,
  TextField,
  Modal,
  Form,
  FormLayout,
  Icon,
  Thumbnail,
  ResourceList,
  ResourceItem,
  Avatar,
  Box,
  InlineStack,
  BlockStack
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, Form as RemixForm } from "@remix-run/react";
import { 
  HomeIcon, 
  ProductIcon, 
  CollectionIcon, 
  CartIcon, 
  SearchIcon,
  PageIcon,
  BlogIcon,
  PersonIcon,
  GiftCardIcon,
  SettingsIcon,
  EditIcon,
  ViewIcon,
  DuplicateIcon,
  DeleteIcon,
  PlusIcon
} from '@shopify/polaris-icons';
import db from "../db.server";

// Template Types Configuration
const TEMPLATE_TYPES = [
  {
    id: 'homepage',
    name: 'Home page',
    description: 'Main landing page of your store',
    icon: HomeIcon,
    category: 'Store pages',
    isRequired: true,
  },
  {
    id: 'product',
    name: 'Products',
    description: 'Individual product pages',
    icon: ProductIcon,
    category: 'Store pages',
    isRequired: true,
  },
  {
    id: 'collection',
    name: 'Collections',
    description: 'Product collection pages',
    icon: CollectionIcon,
    category: 'Store pages',
    isRequired: true,
  },
  {
    id: 'collection-list',
    name: 'Collections list',
    description: 'List of all collections',
    icon: CollectionIcon,
    category: 'Store pages',
    isRequired: false,
  },
  {
    id: 'cart',
    name: 'Cart',
    description: 'Shopping cart page',
    icon: CartIcon,
    category: 'Store pages',
    isRequired: true,
  },
  {
    id: 'search',
    name: 'Search',
    description: 'Search results page',
    icon: SearchIcon,
    category: 'Store pages',
    isRequired: false,
  },
  {
    id: 'gift-card',
    name: 'Gift card',
    description: 'Gift card display page',
    icon: GiftCardIcon,
    category: 'Store pages',
    isRequired: false,
  },
  {
    id: 'checkout',
    name: 'Checkout and customer accounts',
    description: 'Checkout and customer account pages',
    icon: PersonIcon,
    category: 'Customer pages',
    isRequired: true,
  },
  {
    id: 'customer-account',
    name: 'Legacy customer accounts',
    description: 'Legacy customer account templates',
    icon: PersonIcon,
    category: 'Customer pages',
    isRequired: false,
  },
  {
    id: 'page',
    name: 'Pages',
    description: 'Static content pages',
    icon: PageIcon,
    category: 'Content pages',
    isRequired: false,
  },
  {
    id: 'blog',
    name: 'Blogs',
    description: 'Blog listing pages',
    icon: BlogIcon,
    category: 'Content pages',
    isRequired: false,
  },
  {
    id: 'blog-post',
    name: 'Blog posts',
    description: 'Individual blog post pages',
    icon: BlogIcon,
    category: 'Content pages',
    isRequired: false,
  },
  {
    id: 'password',
    name: 'Password',
    description: 'Password protection page',
    icon: SettingsIcon,
    category: 'System pages',
    isRequired: false,
  },
  {
    id: '404',
    name: '404 page',
    description: 'Page not found error page',
    icon: SettingsIcon,
    category: 'System pages',
    isRequired: false,
  },
];

const TEMPLATE_CATEGORIES = [
  'Store pages',
  'Customer pages',
  'Content pages',
  'System pages'
];

interface Template {
  id: string;
  name: string;
  designType: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  
  try {
    const templates = await db.template.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    
    return json({ templates });
  } catch (error) {
    console.error('Error loading templates:', error);
    return json({ templates: [] });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const action = formData.get("action") as string;
  
  try {
    switch (action) {
      case "work_on_template": {
        const templateType = formData.get("templateType") as string;
        
        // Find existing template of this type
        const existingTemplate = await db.template.findFirst({
          where: { designType: templateType },
          orderBy: { updatedAt: 'desc' }
        });
        
        if (existingTemplate) {
          // Use existing template
          return redirect(`/app/builder?template=${existingTemplate.id}`);
        } else {
          // Create new template
          const typeConfig = TEMPLATE_TYPES.find(type => type.id === templateType);
          const templateName = typeConfig ? `${typeConfig.name} Template` : `${templateType} Template`;
          
          const template = await db.template.create({
            data: {
              name: templateName,
              designType: templateType,
              data: { components: [] },
            },
          });
          
          return redirect(`/app/builder?template=${template.id}`);
        }
      }
      
      case "create": {
        const templateType = formData.get("templateType") as string;
        const templateName = formData.get("templateName") as string;
        
        const template = await db.template.create({
          data: {
            name: templateName,
            designType: templateType,
            data: { components: [] },
          },
        });
        
        return redirect(`/app/builder?template=${template.id}`);
      }
      
      case "duplicate": {
        const templateId = formData.get("templateId") as string;
        const newName = formData.get("newName") as string;
        
        const originalTemplate = await db.template.findUnique({
          where: { id: templateId },
        });
        
        if (originalTemplate) {
          await db.template.create({
            data: {
              name: newName,
              designType: originalTemplate.designType,
              data: originalTemplate.data,
            },
          });
        }
        
        return json({ success: true });
      }
      
      case "delete": {
        const templateId = formData.get("templateId") as string;
        
        await db.template.delete({
          where: { id: templateId },
        });
        
        return json({ success: true });
      }
      
      default:
        return json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling template action:', error);
    return json({ error: "Failed to perform action" }, { status: 500 });
  }
};

export default function TemplatesPage() {
  const { templates } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState('homepage');
  const [templateName, setTemplateName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Store pages');
  const [searchQuery, setSearchQuery] = useState('');

  // Group templates by type
  const templatesByType = templates.reduce((acc: Record<string, Template[]>, template: Template) => {
    if (!acc[template.designType]) {
      acc[template.designType] = [];
    }
    acc[template.designType].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  // Filter template types based on search and category
  const filteredTemplateTypes = TEMPLATE_TYPES.filter(type => {
    const matchesCategory = type.category === selectedCategory;
    const matchesSearch = type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWorkOnTemplate = (templateType: string) => {
    const formData = new FormData();
    formData.append("action", "work_on_template");
    formData.append("templateType", templateType);
    
    submit(formData, { method: "post" });
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim()) return;
    
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("templateType", selectedTemplateType);
    formData.append("templateName", templateName);
    
    submit(formData, { method: "post" });
  };

  const handleDuplicateTemplate = (templateId: string, originalName: string) => {
    const newName = prompt(`Duplicate "${originalName}" as:`, `${originalName} Copy`);
    if (!newName) return;
    
    const formData = new FormData();
    formData.append("action", "duplicate");
    formData.append("templateId", templateId);
    formData.append("newName", newName);
    
    submit(formData, { method: "post" });
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"?`)) return;
    
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("templateId", templateId);
    
    submit(formData, { method: "post" });
  };

  const getTemplateTypeConfig = (designType: string) => {
    return TEMPLATE_TYPES.find(type => type.id === designType);
  };

  return (
    <Page
      title="Choose Page to Customize"
      subtitle="Select which page of your mobile app you want to work on"
      primaryAction={{
        content: "Create custom template",
        icon: PlusIcon,
        onAction: () => setShowCreateModal(true),
      }}
    >
      <Banner tone="info">
        <Text variant="bodySm" as="p">
          <strong>How it works:</strong> Click on any page type below to start customizing that part of your mobile app. 
          If you already have a template for that page, you'll edit it. If not, we'll create a new one for you.
        </Text>
      </Banner>
      
      {/* Quick Start Section */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">Quick Start</Text>
          <Text variant="bodySm" tone="subdued" as="p">
            Start with the most important pages for your mobile app
          </Text>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            {(() => {
              const quickStartTypes = ['homepage', 'product', 'collection', 'cart'];
              return quickStartTypes.map(typeId => {
                const templateType = TEMPLATE_TYPES.find(t => t.id === typeId);
                if (!templateType) return null;
                
                const existingTemplates = templatesByType[templateType.id] || [];
                const hasTemplates = existingTemplates.length > 0;
                
                return (
                  <Card key={templateType.id}>
                    <Box padding="300">
                      <button
                        onClick={() => handleWorkOnTemplate(templateType.id)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        <InlineStack gap="300" blockAlign="center">
                          <Box 
                            background={hasTemplates ? "bg-surface-success" : "bg-surface-brand"}
                            padding="200"
                            borderRadius="200"
                          >
                            <Icon source={templateType.icon} />
                          </Box>
                          <BlockStack gap="100">
                            <Text variant="bodyMd" fontWeight="semibold" as="p">
                              {templateType.name}
                            </Text>
                            <Text variant="bodySm" tone="subdued" as="p">
                              {hasTemplates ? 'Ready to edit' : 'Click to create'}
                            </Text>
                          </BlockStack>
                        </InlineStack>
                      </button>
                    </Box>
                  </Card>
                );
              });
            })()}
          </div>
        </BlockStack>
      </Card>
      
      <Layout>
        {/* Search and Filter Section */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h2">Select Page Type</Text>
                  <Text variant="bodySm" tone="subdued" as="p">
                    Click on any page type below to start customizing that part of your app
                  </Text>
                </BlockStack>
                
                <InlineStack gap="300">
                  <TextField
                    label="Search"
                    labelHidden
                    placeholder="Search page types..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    clearButton
                    prefix={<Icon source={SearchIcon} />}
                    autoComplete="off"
                  />
                  
                  <Select
                    label="Category"
                    labelHidden
                    options={TEMPLATE_CATEGORIES.map(cat => ({ label: cat, value: cat }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  />
                </InlineStack>
              </InlineStack>
              
              <Divider />
              
              {/* Grid Layout for Page Types */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '16px' 
              }}>
                {filteredTemplateTypes.map((templateType) => {
                  const existingTemplates = templatesByType[templateType.id] || [];
                  const hasTemplates = existingTemplates.length > 0;
                  
                  return (
                    <Card key={templateType.id}>
                      <Box padding="400">
                        <button
                          onClick={() => handleWorkOnTemplate(templateType.id)}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0
                          }}
                        >
                          <BlockStack gap="300">
                            <InlineStack align="space-between" blockAlign="start">
                              <InlineStack gap="300" blockAlign="center">
                                <Box 
                                  background={hasTemplates ? "bg-surface-success" : "bg-surface-warning"}
                                  padding="200"
                                  borderRadius="200"
                                >
                                  <Icon source={templateType.icon} />
                                </Box>
                                <BlockStack gap="100">
                                  <Text variant="bodyMd" fontWeight="semibold" as="p">
                                    {templateType.name}
                                  </Text>
                                  <Text variant="bodySm" tone="subdued" as="p">
                                    {templateType.category}
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                              
                              <InlineStack gap="200">
                                {templateType.isRequired && (
                                  <Badge tone="critical">Required</Badge>
                                )}
                                {hasTemplates ? (
                                  <Badge tone="success">Ready</Badge>
                                ) : (
                                  <Badge tone="attention">Create</Badge>
                                )}
                              </InlineStack>
                            </InlineStack>
                            
                            <Text variant="bodySm" as="p">
                              {hasTemplates 
                                ? `Click to edit your ${templateType.name.toLowerCase()}` 
                                : templateType.description
                              }
                            </Text>
                          </BlockStack>
                        </button>
                      </Box>
                    </Card>
                  );
                })}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Templates List Section */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Your Saved Templates</Text>
              <Text variant="bodySm" tone="subdued" as="p">
                Manage and organize your custom templates
              </Text>
              
              {templates.length === 0 ? (
                <Box padding="600">
                  <BlockStack gap="300" inlineAlign="center">
                    <Icon source={PageIcon} />
                    <Text variant="bodyLg" alignment="center" as="p">
                      No custom templates yet
                    </Text>
                    <Text variant="bodySm" tone="subdued" alignment="center" as="p">
                      Click on any page type to start customizing, or create a custom template
                    </Text>
                    <Button
                      variant="primary"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create your first template
                    </Button>
                  </BlockStack>
                </Box>
              ) : (
                <ResourceList
                  items={templates}
                  renderItem={(template) => {
                    const typeConfig = getTemplateTypeConfig(template.designType);
                    
                    return (
                      <ResourceItem
                        id={template.id}
                        media={
                          <Avatar
                            initials={template.name.substring(0, 2).toUpperCase()}
                          />
                        }
                        accessibilityLabel={`Template ${template.name}`}
                        onClick={() => {}}
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <InlineStack gap="200" blockAlign="center">
                              <Text variant="bodyMd" fontWeight="semibold" as="p">
                                {template.name}
                              </Text>
                              <Badge>{typeConfig?.name || template.designType}</Badge>
                            </InlineStack>
                            <Text variant="bodySm" tone="subdued" as="p">
                              Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                            </Text>
                          </BlockStack>
                          
                          <ButtonGroup>
                            <Button
                              variant="primary"
                              size="micro"
                              icon={EditIcon}
                              url={`/app/builder?template=${template.id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              size="micro"
                              icon={ViewIcon}
                              url={`/app/preview?template=${template.id}`}
                            >
                              Preview
                            </Button>
                            <Button
                              size="micro"
                              icon={DuplicateIcon}
                              onClick={() => handleDuplicateTemplate(template.id, template.name)}
                            >
                              Duplicate
                            </Button>
                            <Button
                              size="micro"
                              icon={DeleteIcon}
                              tone="critical"
                              onClick={() => handleDeleteTemplate(template.id, template.name)}
                            >
                              Delete
                            </Button>
                          </ButtonGroup>
                        </InlineStack>
                      </ResourceItem>
                    );
                  }}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Create Template Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create new template"
        primaryAction={{
          content: "Create template",
          onAction: handleCreateTemplate,
          disabled: !templateName.trim(),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowCreateModal(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <Select
              label="Template type"
              options={TEMPLATE_TYPES.map(type => ({
                label: type.name,
                value: type.id,
              }))}
              value={selectedTemplateType}
              onChange={(value) => {
                setSelectedTemplateType(value);
                const typeConfig = TEMPLATE_TYPES.find(type => type.id === value);
                if (typeConfig) {
                  setTemplateName(`${typeConfig.name} Template`);
                }
              }}
            />
            
            <TextField
              label="Template name"
              value={templateName}
              onChange={setTemplateName}
              placeholder="Enter template name"
              autoComplete="off"
            />
            
            {(() => {
              const typeConfig = TEMPLATE_TYPES.find(type => type.id === selectedTemplateType);
              return typeConfig ? (
                <Banner>
                  <Text variant="bodySm" as="p">
                    {typeConfig.description}
                  </Text>
                </Banner>
              ) : null;
            })()}
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
} 