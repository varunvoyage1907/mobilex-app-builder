import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Card,
  Layout,
  Button,
  ButtonGroup,
  Badge,
  Banner,
  Text,
  Divider,
  Select,
  TextField,
  Checkbox,
  Icon,
  Tabs,
  Modal,
  FormLayout,
  InlineStack,
  BlockStack,
  Box
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData, useNavigation } from "@remix-run/react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { loader as shopifyDataLoader } from "./api.shopify-data";
import {
  MobileIcon,
  ViewIcon,
  EditIcon,
  SaveIcon,
  DeleteIcon,
  DragHandleIcon,
  SearchIcon,
  PlusIcon,
  HomeIcon,
  ProductIcon,
  CollectionIcon,
  CartIcon,
  PageIcon,
  BlogIcon,
  SettingsIcon
} from '@shopify/polaris-icons';
import { MobileRenderer } from '../components/MobileRenderer';
import db from "../db.server";

// Page Types Configuration
const PAGE_TYPES = [
  {
    id: 'homepage',
    name: 'Home',
    icon: HomeIcon,
    description: 'Main landing page',
    isRequired: true,
  },
  {
    id: 'product',
    name: 'Product',
    icon: ProductIcon,
    description: 'Product detail pages',
    isRequired: true,
  },
  {
    id: 'collection',
    name: 'Collection',
    icon: CollectionIcon,
    description: 'Product collection pages',
    isRequired: true,
  },
  {
    id: 'cart',
    name: 'Cart',
    icon: CartIcon,
    description: 'Shopping cart page',
    isRequired: true,
  },
  {
    id: 'search',
    name: 'Search',
    icon: SearchIcon,
    description: 'Search results page',
    isRequired: false,
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: BlogIcon,
    description: 'Blog listing page',
    isRequired: false,
  },
  {
    id: 'page',
    name: 'Page',
    icon: PageIcon,
    description: 'Static content page',
    isRequired: false,
  },
  {
    id: '404',
    name: '404',
    icon: SettingsIcon,
    description: 'Error page',
    isRequired: false,
  },
];

// Mobile App Components (same as before)
const MOBILE_COMPONENTS = [
  // Layout Components
  { 
    category: "Layout", 
    type: "AppHeader", 
    label: "App Header", 
    icon: "📱",
    description: "Top navigation bar with logo and actions"
  },
  { 
    category: "Layout", 
    type: "StickyMobileHeader", 
    label: "Sticky Mobile Header", 
    icon: "📋",
    description: "Advanced sticky header with drawer menu, search, trending slider and navigation tabs"
  },
  { 
    category: "Layout", 
    type: "GoEyeMobileHeader", 
    label: "GoEye Mobile Header", 
    icon: "👁️",
    description: "Complete GoEye header with menu drawer, search, nav tabs, trending slider, and cart functionality"
  },
  { 
    category: "Layout", 
    type: "TabNavigation", 
    label: "Tab Navigation", 
    icon: "📋",
    description: "Bottom tab navigation for main sections"
  },
  { 
    category: "Layout", 
    type: "DrawerMenu", 
    label: "Drawer Menu", 
    icon: "☰",
    description: "Side navigation drawer menu"
  },
  
  // Content Components
  { 
    category: "Content", 
    type: "HeroSection", 
    label: "Hero Section", 
    icon: "🖼️",
    description: "Full-width hero with call-to-action"
  },
  { 
    category: "Content", 
    type: "ProductGrid", 
    label: "Product Grid", 
    icon: "🏪",
    description: "Responsive product grid layout"
  },
  { 
    category: "Content", 
    type: "ProductCard", 
    label: "Product Card", 
    icon: "📦",
    description: "Individual product display card"
  },
  { 
    category: "Content", 
    type: "CategoryTabs", 
    label: "Category Tabs", 
    icon: "🗂️",
    description: "Horizontal scrolling category tabs"
  },
  { 
    category: "Content", 
    type: "SearchBar", 
    label: "Search Bar", 
    icon: "🔍",
    description: "Product search with filters"
  },
  { 
    category: "Content", 
    type: "FeaturedCollections", 
    label: "Featured Collections", 
    icon: "⭐",
    description: "Highlighted collection showcase"
  },
  
  // Interactive Components
  { 
    category: "Interactive", 
    type: "AddToCartButton", 
    label: "Add to Cart", 
    icon: "🛒",
    description: "Mobile-optimized add to cart button"
  },
  { 
    category: "Interactive", 
    type: "QuickView", 
    label: "Quick View", 
    icon: "👁️",
    description: "Modal product quick view"
  },
  { 
    category: "Interactive", 
    type: "WishlistButton", 
    label: "Wishlist", 
    icon: "💝",
    description: "Save to wishlist functionality"
  },
  { 
    category: "Interactive", 
    type: "ShareButton", 
    label: "Share Button", 
    icon: "📤",
    description: "Native share functionality"
  },
  { 
    category: "Interactive", 
    type: "FilterDrawer", 
    label: "Filter Drawer", 
    icon: "🎛️",
    description: "Mobile product filters"
  },
  
  // UI Elements
  { 
    category: "UI Elements", 
    type: "LoadingSpinner", 
    label: "Loading Spinner", 
    icon: "⏳",
    description: "Mobile loading indicators"
  },
  { 
    category: "UI Elements", 
    type: "PullToRefresh", 
    label: "Pull to Refresh", 
    icon: "🔄",
    description: "Native pull-to-refresh gesture"
  },
  { 
    category: "UI Elements", 
    type: "ToastMessage", 
    label: "Toast Message", 
    icon: "💬",
    description: "Mobile notification toasts"
  },
  { 
    category: "UI Elements", 
    type: "Spacer", 
    label: "Spacer", 
    icon: "📏",
    description: "Flexible spacing element"
  },
];

interface ComponentType {
  category: string;
  type: string;
  label: string;
  icon: string;
  description: string;
}

interface CanvasItem {
  id: string;
  type: string;
  props?: Record<string, any>;
}

interface AppPage {
  id: string;
  pageType: string;
  name: string;
  data: CanvasItem[];
  isActive: boolean;
  order: number;
}

interface MultiPageApp {
  id: string;
  name: string;
  pages: AppPage[];
  version: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description?: string;
  inventory?: number;
  image: string | null;
  images?: string[];
  price: string | null;
  handle: string;
  variants?: { id: string; title: string }[];
}

interface ShopifyCollection {
  id: string;
  title: string;
  image: string | null;
  products?: ShopifyProduct[];
}

const componentCategories = ["Layout", "Content", "Interactive", "UI Elements"];

function ComponentPalette({ onAddComponent }: { onAddComponent: (component: ComponentType) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Layout");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = MOBILE_COMPONENTS.filter(component => {
    const matchesCategory = component.category === selectedCategory;
    const matchesSearch = component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h2">Components</Text>
          <TextField
            label="Search components"
            placeholder="Search components..."
            value={searchQuery}
            onChange={setSearchQuery}
            clearButton
            prefix={<Icon source={SearchIcon} />}
            autoComplete="off"
          />
          <Select
            label="Category"
            options={componentCategories.map(cat => ({ label: cat, value: cat }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </BlockStack>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <BlockStack gap="200">
          {filteredComponents.map((component) => (
            <Card key={component.type}>
              <div
                style={{
                  padding: '12px',
                  cursor: 'grab',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("component", JSON.stringify(component));
                }}
                onClick={() => onAddComponent(component)}
              >
                <InlineStack align="start" gap="300">
                  <div style={{ fontSize: '20px' }}>{component.icon}</div>
                  <BlockStack gap="100">
                    <Text variant="bodyMd" fontWeight="semibold">{component.label}</Text>
                    <Text variant="bodySm" tone="subdued">{component.description}</Text>
                  </BlockStack>
                </InlineStack>
              </div>
            </Card>
          ))}
        </BlockStack>
      </div>
    </div>
  );
}

function SortableItem({ id, type, index, onSelect, isSelected }: {
  id: string;
  type: string;
  index: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const component = MOBILE_COMPONENTS?.find(c => c.type === type);

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <div
          style={{
            padding: '12px',
            background: isSelected ? '#f6f6f7' : 'transparent',
            border: isSelected ? '2px solid #008060' : '2px solid transparent',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={onSelect}
        >
          <InlineStack align="start" gap="300">
            <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
              <Icon source={DragHandleIcon} />
            </div>
            <div style={{ fontSize: '18px' }}>{component?.icon || '📱'}</div>
            <BlockStack gap="100">
              <Text variant="bodyMd" fontWeight="semibold">{component?.label || type}</Text>
              <Badge size="small">#{index + 1}</Badge>
            </BlockStack>
          </InlineStack>
        </div>
      </Card>
    </div>
  );
}

// Basic property editor (simplified for now)
function PropertyEditor({
  item,
  products,
  collections,
  onChange,
}: {
  item: CanvasItem | null;
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
  onChange: (props: Record<string, any>) => void;
}) {
  if (!item) {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <BlockStack gap="300">
          <Icon source={EditIcon} />
          <Text variant="bodyMd">Select a component to edit its properties</Text>
        </BlockStack>
      </div>
    );
  }

  const { type, props = {} } = item;
  const component = MOBILE_COMPONENTS?.find(c => c.type === type);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
        <BlockStack gap="200">
          <InlineStack align="start" gap="300">
            <div style={{ fontSize: '20px' }}>{component?.icon || '📱'}</div>
            <Text variant="headingMd" as="h3">{component?.label || type}</Text>
          </InlineStack>
          <Text variant="bodySm" tone="subdued">{component?.description}</Text>
        </BlockStack>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <BlockStack gap="400">
          {/* Basic property editors */}
          {type === "AppHeader" && (
            <>
              <TextField
                label="App Title"
                value={props.title || "My App"}
                onChange={(value) => onChange({ ...props, title: value })}
                autoComplete="off"
              />
              <TextField
                label="Logo URL"
                value={props.logoUrl || ""}
                onChange={(value) => onChange({ ...props, logoUrl: value })}
                placeholder="https://example.com/logo.png"
                autoComplete="off"
              />
              <Checkbox
                label="Show back button"
                checked={props.showBack || false}
                onChange={(checked) => onChange({ ...props, showBack: checked })}
              />
            </>
          )}
          
          {type === "HeroSection" && (
            <>
              <TextField
                label="Hero Title"
                value={props.title || "Welcome"}
                onChange={(value) => onChange({ ...props, title: value })}
                autoComplete="off"
              />
              <TextField
                label="Hero Subtitle"
                value={props.subtitle || "Discover amazing products"}
                onChange={(value) => onChange({ ...props, subtitle: value })}
                autoComplete="off"
              />
              <TextField
                label="Button Text"
                value={props.buttonText || "Shop Now"}
                onChange={(value) => onChange({ ...props, buttonText: value })}
                autoComplete="off"
              />
            </>
          )}
          
          {/* Add more property editors as needed */}
        </BlockStack>
      </div>
    </div>
  );
}

// Basic mobile preview component
function MobilePreview({
  items, 
  products, 
  collections,
  pageType,
}: { 
  items: CanvasItem[]; 
  products: ShopifyProduct[]; 
  collections: ShopifyCollection[];
  pageType: string;
}) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text variant="headingMd" as="h3">Preview</Text>
            <Text variant="bodySm" tone="subdued">
              {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
            </Text>
          </BlockStack>
          <Icon source={MobileIcon} />
        </InlineStack>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{
          width: '320px',
          height: '568px',
          border: '2px solid #000',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#fff',
          margin: '0 auto',
        }}>
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div style={{ 
                padding: '32px',
                textAlign: 'center',
                color: '#666',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ fontSize: '32px' }}>📱</div>
                <Text variant="bodyMd">Add components to see preview</Text>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  <div style={{
                    padding: '16px',
                    background: '#f6f6f7',
                    borderRadius: '8px',
                    margin: '8px 16px',
                    textAlign: 'center',
                  }}>
                    <Text variant="bodySm">
                      {MOBILE_COMPONENTS?.find(c => c.type === item.type)?.label || item.type}
                    </Text>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  
  const url = new URL(request.url);
  const appId = url.searchParams.get('app');
  
  let app: MultiPageApp | null = null;
  
  if (appId) {
    try {
      const appData = await db.app.findUnique({
        where: { id: appId },
        include: {
          pages: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (appData) {
        app = {
          id: appData.id,
          name: appData.name,
          pages: appData.pages.map(page => ({
            id: page.id,
            pageType: page.pageType,
            name: page.name,
            data: page.data as CanvasItem[],
            isActive: page.isActive,
            order: page.order,
          })),
          version: appData.version,
          isPublished: appData.isPublished,
          createdAt: appData.createdAt.toISOString(),
          updatedAt: appData.updatedAt.toISOString(),
        };
      }
    } catch (error) {
      console.error('Error loading app:', error);
    }
  }
  
  const shopifyData = await shopifyDataLoader({ request, params: {}, context: {} });
  
  return json({
    ...shopifyData,
    app
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const action = formData.get("action") as string;
  
  try {
    switch (action) {
      case "create_app": {
        const appName = formData.get("appName") as string;
        console.log("Server: Creating app with name:", appName);
        
        if (!appName.trim()) {
          console.log("Server: App name is empty");
          return json({ error: "App name is required" }, { status: 400 });
        }
        
        try {
          console.log("Server: Creating app in database...");
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
          
          console.log("Server: App created successfully:", app.id);
          console.log("Server: Redirecting to:", `/app/multi-builder?app=${app.id}`);
          
          return redirect(`/app/multi-builder?app=${app.id}`);
        } catch (dbError) {
          console.error("Server: Database error:", dbError);
          return json({ error: "Failed to create app in database" }, { status: 500 });
        }
      }
      
      case "add_page": {
        const appId = formData.get("appId") as string;
        const pageType = formData.get("pageType") as string;
        const pageName = formData.get("pageName") as string;
        
        const pageConfig = PAGE_TYPES.find(p => p.id === pageType);
        if (!pageConfig) {
          return json({ error: "Invalid page type" }, { status: 400 });
        }
        
        const existingPagesCount = await db.page.count({
          where: { appId }
        });
        
        await db.page.create({
          data: {
            appId,
            pageType,
            name: pageName || pageConfig.name,
            data: [],
            order: existingPagesCount,
          }
        });
        
        return json({ success: true });
      }
      
      case "save_page": {
        const pageId = formData.get("pageId") as string;
        const data = formData.get("data") as string;
        
        await db.page.update({
          where: { id: pageId },
          data: { data: JSON.parse(data) }
        });
        
        return json({ success: true });
      }
      
      case "delete_page": {
        const pageId = formData.get("pageId") as string;
        
        await db.page.delete({
          where: { id: pageId }
        });
        
        return json({ success: true });
      }
      
      case "publish_app": {
        const appId = formData.get("appId") as string;
        
        await db.app.update({
          where: { id: appId },
          data: { isPublished: true }
        });
        
        return json({ success: true });
      }
      
      default:
        return json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling action:', error);
    return json({ error: "Failed to perform action" }, { status: 500 });
  }
};

export default function MultiPageMobileAppBuilder() {
  const { products, collections, app } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  // State management
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [currentPageItems, setCurrentPageItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Modal states
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [selectedPageType, setSelectedPageType] = useState('homepage');
  const [pageName, setPageName] = useState('');
  const [appName, setAppName] = useState('');
  
  // Set current page when app loads
  useEffect(() => {
    if (app && app.pages.length > 0) {
      const firstPage = app.pages[0];
      setCurrentPageId(firstPage.id);
      setCurrentPageItems(firstPage.data);
    }
  }, [app]);

  // Handle action responses
  useEffect(() => {
    if (actionData?.error) {
      setSaveStatus(actionData.error);
    }
  }, [actionData]);
  
  // Handle page switching
  const handlePageSwitch = (pageId: string) => {
    if (!app) return;
    
    const page = app.pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPageId(pageId);
      setCurrentPageItems(page.data);
      setSelectedId(null);
      setSaveStatus(null);
    }
  };
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddComponent = (component: ComponentType) => {
    const newItem: CanvasItem = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      props: {},
    };
    setCurrentPageItems(prev => [...prev, newItem]);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCurrentPageItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handlePropsChange = (newProps: Record<string, any>) => {
    if (!selectedId) return;
    setCurrentPageItems(items => items.map(item => 
      item.id === selectedId ? { ...item, props: newProps } : item
    ));
  };

  const handleSavePage = async () => {
    if (!currentPageId) return;
    
    try {
      const formData = new FormData();
      formData.append("action", "save_page");
      formData.append("pageId", currentPageId);
      formData.append("data", JSON.stringify(currentPageItems));
      
      submit(formData, { method: "post" });
      setSaveStatus("Page saved successfully!");
    } catch (error) {
      setSaveStatus("Failed to save page");
    }
  };

  const handleCreateApp = () => {
    console.log("Creating app with name:", appName);
    
    if (!appName.trim()) {
      setSaveStatus("App name is required");
      return;
    }
    
    try {
      setSaveStatus("Creating app...");
      
      const formData = new FormData();
      formData.append("action", "create_app");
      formData.append("appName", appName);
      
      console.log("Submitting form data using Remix submit...");
      
      // Use Remix submit which works properly in Shopify embedded apps
      submit(formData, { method: "post" });
      
      // Close modal and reset form
      setShowCreateAppModal(false);
      setAppName('');
      
    } catch (error) {
      console.error("Error creating app:", error);
      setSaveStatus("Failed to create app");
    }
  };

  const handleAddPage = () => {
    if (!app || !selectedPageType || !pageName.trim()) return;
    
    const formData = new FormData();
    formData.append("action", "add_page");
    formData.append("appId", app.id);
    formData.append("pageType", selectedPageType);
    formData.append("pageName", pageName);
    
    submit(formData, { method: "post" });
    setShowAddPageModal(false);
    setPageName('');
  };

  const selectedItem = selectedId ? currentPageItems.find(item => item.id === selectedId) : null;
  const currentPage = app?.pages.find(p => p.id === currentPageId);

  // Show create app modal if no app is loaded
  if (!app) {
    return (
      <Page title="Create Multi-Page Mobile App">
        {saveStatus && (
          <Banner
            tone={saveStatus.includes('successfully') || saveStatus.includes('Creating') ? 'success' : 'critical'}
            onDismiss={() => setSaveStatus(null)}
          >
            {saveStatus}
          </Banner>
        )}
        
        <div style={{ padding: '64px', textAlign: 'center' }}>
          <BlockStack gap="400">
            <div style={{ fontSize: '64px' }}>📱</div>
            <Text variant="headingLg" as="h2">Create Your Multi-Page Mobile App</Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              Build a complete mobile app with multiple pages: Home, Products, Collections, Cart, and more!
            </Text>
            <Button 
              variant="primary" 
              size="large"
              onClick={() => {
                console.log("Create New App button clicked");
                setShowCreateAppModal(true);
              }}
            >
              Create New App
            </Button>
          </BlockStack>
        </div>
        
        <Modal
          open={showCreateAppModal}
          onClose={() => {
            console.log("Modal closed");
            setShowCreateAppModal(false);
            setSaveStatus(null);
          }}
          title="Create New Multi-Page App"
          primaryAction={{
            content: "Create App",
            onAction: () => {
              console.log("Create App button clicked in modal");
              handleCreateApp();
            },
            disabled: !appName.trim(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => {
                console.log("Cancel button clicked");
                setShowCreateAppModal(false);
                setSaveStatus(null);
              },
            },
          ]}
        >
          <Modal.Section>
            <TextField
              label="App Name"
              value={appName}
              onChange={(value) => {
                console.log("App name changed to:", value);
                setAppName(value);
              }}
              placeholder="Enter your app name"
              autoComplete="off"
            />
          </Modal.Section>
        </Modal>
      </Page>
    );
  }

  // Main builder interface
  return (
    <Page
      title={`Building: ${app.name}`}
      subtitle="Multi-page mobile app builder"
      secondaryActions={[
        {
          content: 'Your Apps',
          url: '/app/apps',
        },
        {
          content: 'Templates',
          url: '/app/templates',
        },
      ]}
    >
      {/* Page Navigation Tabs */}
      <Card>
        <div style={{ padding: '16px' }}>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">Pages</Text>
              <Text variant="bodySm" tone="subdued">
                Switch between different pages of your app
              </Text>
            </BlockStack>
            <Button
              onClick={() => setShowAddPageModal(true)}
              icon={PlusIcon}
            >
              Add Page
            </Button>
          </InlineStack>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {app.pages.map((page) => {
                const pageConfig = PAGE_TYPES.find(p => p.id === page.pageType);
                return (
                  <button
                    key={page.id}
                    onClick={() => handlePageSwitch(page.id)}
                    style={{
                      padding: '12px 16px',
                      background: currentPageId === page.id ? '#008060' : '#f6f6f7',
                      color: currentPageId === page.id ? 'white' : '#202223',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: 'fit-content',
                    }}
                  >
                    {pageConfig && <Icon source={pageConfig.icon} />}
                    <Text variant="bodySm" fontWeight="medium">
                      {page.name}
                    </Text>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Save Status */}
      {saveStatus && (
        <Banner
          tone={saveStatus.includes('successfully') ? 'success' : 'critical'}
          onDismiss={() => setSaveStatus(null)}
        >
          {saveStatus}
        </Banner>
      )}

      {/* Current Page Info */}
      {currentPage && (
        <Card>
          <div style={{ padding: '16px' }}>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text variant="headingMd" as="h3">
                  Editing: {currentPage.name}
                </Text>
                <Text variant="bodySm" tone="subdued">
                  {PAGE_TYPES.find(p => p.id === currentPage.pageType)?.description}
                </Text>
              </BlockStack>
              <Button
                variant="primary"
                onClick={handleSavePage}
                icon={SaveIcon}
              >
                Save Page
              </Button>
            </InlineStack>
          </div>
        </Card>
      )}
      
      {/* Builder Layout */}
      <Layout>
        {/* Component Palette */}
        <Layout.Section variant="oneThird">
          <Card>
            <ComponentPalette onAddComponent={handleAddComponent} />
          </Card>
        </Layout.Section>
        
        {/* Page Structure */}
        <Layout.Section variant="oneThird">
          <Card>
            <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h2">Page Structure</Text>
                  <Text variant="bodySm" tone="subdued">
                    {currentPage?.name} components
                  </Text>
                </BlockStack>
              </InlineStack>
            </div>
            
            <div 
              style={{ 
                minHeight: '400px', 
                padding: '16px',
                background: '#fafbfb',
              }}
              onDrop={(e) => {
                e.preventDefault();
                const componentData = e.dataTransfer.getData("component");
                if (componentData) {
                  const component = JSON.parse(componentData);
                  handleAddComponent(component);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={currentPageItems} strategy={verticalListSortingStrategy}>
                  <BlockStack gap="200">
                    {currentPageItems.length === 0 ? (
                      <div style={{ 
                        padding: '32px',
                        textAlign: 'center',
                        color: '#666',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
                        <Text variant="bodyMd">Drag components here to build your page</Text>
                      </div>
                    ) : (
                      currentPageItems.map((item, index) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          type={item.type}
                          index={index}
                          onSelect={() => setSelectedId(item.id)}
                          isSelected={selectedId === item.id}
                        />
                      ))
                    )}
                  </BlockStack>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div style={{ padding: '8px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      {currentPageItems.find(item => item.id === activeId)?.type}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </Card>
        </Layout.Section>
        
        {/* Property Editor & Preview */}
        <Layout.Section variant="oneThird">
          <Layout>
            <Layout.Section>
              <Card>
                <PropertyEditor
                  item={selectedItem}
                  products={products}
                  collections={collections}
                  onChange={handlePropsChange}
                />
              </Card>
            </Layout.Section>
            
            <Layout.Section>
              <Card>
                <MobilePreview
                  items={currentPageItems}
                  products={products} 
                  collections={collections}
                  pageType={currentPage?.pageType || 'homepage'}
                />
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>

      {/* Add Page Modal */}
      <Modal
        open={showAddPageModal}
        onClose={() => setShowAddPageModal(false)}
        title="Add New Page"
        primaryAction={{
          content: "Add Page",
          onAction: handleAddPage,
          disabled: !pageName.trim(),
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowAddPageModal(false),
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <Select
              label="Page Type"
              options={PAGE_TYPES.map(type => ({
                label: type.name,
                value: type.id,
              }))}
              value={selectedPageType}
              onChange={(value) => {
                setSelectedPageType(value);
                const pageConfig = PAGE_TYPES.find(p => p.id === value);
                if (pageConfig) {
                  setPageName(pageConfig.name);
                }
              }}
            />
            
            <TextField
              label="Page Name"
              value={pageName}
              onChange={setPageName}
              placeholder="Enter page name"
              autoComplete="off"
            />
            
            {(() => {
              const pageConfig = PAGE_TYPES.find(p => p.id === selectedPageType);
              return pageConfig ? (
                <Banner>
                  <Text variant="bodySm" as="p">
                    {pageConfig.description}
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