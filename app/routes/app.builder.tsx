import React, { useState, useEffect, useRef } from "react";
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
  Checkbox,
  Icon
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {
  MobileIcon,
  ViewIcon,
  DesktopIcon,
  EditIcon,
  SaveIcon,
  DeleteIcon,
  DragHandleIcon,
  SearchIcon
} from '@shopify/polaris-icons';
import { MobileRenderer } from '../components/MobileRenderer';
import { LiquidParser, type MobileComponent as LiquidMobileComponent } from '../utils/liquidParser';

// Mobile App Specific Components
const MOBILE_COMPONENTS = [
  // Screen Layout Components
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
  { 
    category: "Layout", 
    type: "StatusBar", 
    label: "Status Bar", 
    icon: "📶",
    description: "Mobile status bar simulation"
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
    type: "ActionSheet", 
    label: "Action Sheet", 
    icon: "📋",
    description: "Mobile action sheet modal"
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

// Component Categories for better organization
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
        <Stack vertical spacing="tight">
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
        </Stack>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <Stack vertical spacing="tight">
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
                <Stack alignment="center" spacing="tight">
                  <div style={{ fontSize: '20px' }}>{component.icon}</div>
                  <Stack vertical spacing="extraTight">
                    <Text variant="bodyMd" fontWeight="semibold">{component.label}</Text>
                    <Text variant="bodySm" color="subdued">{component.description}</Text>
                  </Stack>
                </Stack>
              </div>
            </Card>
          ))}
        </Stack>
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
          <Stack alignment="center" spacing="tight">
            <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
              <Icon source={DragHandleIcon} />
      </div>
            <div style={{ fontSize: '18px' }}>{component?.icon || '📱'}</div>
            <Stack vertical spacing="extraTight">
              <Text variant="bodyMd" fontWeight="semibold">{component?.label || type}</Text>
              <Badge size="small">#{index + 1}</Badge>
            </Stack>
          </Stack>
        </div>
      </Card>
    </div>
  );
}

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
        <Stack vertical spacing="tight">
          <Icon source={EditIcon} />
          <Text variant="bodyMd">Select a component to edit its properties</Text>
        </Stack>
      </div>
    );
  }

  const { type, props = {} } = item;
  const component = MOBILE_COMPONENTS?.find(c => c.type === type);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...props, image: ev.target?.result });
    };
    reader.readAsDataURL(file);
  };

      return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
        <Stack vertical spacing="tight">
          <Stack alignment="center" spacing="tight">
            <div style={{ fontSize: '20px' }}>{component?.icon || '📱'}</div>
            <Text variant="headingMd" as="h3">{component?.label || type}</Text>
          </Stack>
          <Text variant="bodySm" color="subdued">{component?.description}</Text>
        </Stack>
        </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <Stack vertical spacing="loose">
          {/* Render property editors based on component type */}
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
              <Checkbox
                label="Show search icon"
                checked={props.showSearch || true}
                onChange={(checked) => onChange({ ...props, showSearch: checked })}
              />
              <Checkbox
                label="Show cart icon"
                checked={props.showCart || true}
                onChange={(checked) => onChange({ ...props, showCart: checked })}
              />
            </>
          )}

          {type === "StickyMobileHeader" && (
            <>
              <TextField
                label="Trending Title"
                value={props.trendingTitle || "#Trending On"}
                onChange={(value) => onChange({ ...props, trendingTitle: value })}
                autoComplete="off"
              />
              <TextField
                label="Trending Subtitle"
                value={props.trendingSubtitle || "Your App"}
                onChange={(value) => onChange({ ...props, trendingSubtitle: value })}
                autoComplete="off"
              />
              <TextField
                label="Logo URL"
                value={props.logoUrl || ""}
                onChange={(value) => onChange({ ...props, logoUrl: value })}
                placeholder="https://example.com/logo.png"
                autoComplete="off"
              />
              <TextField
                label="Offer Button Text"
                value={props.offerButtonText || "50% OFF"}
                onChange={(value) => onChange({ ...props, offerButtonText: value })}
                autoComplete="off"
              />
              <TextField
                label="Offer Button Link"
                value={props.offerButtonLink || "/collections/sale"}
                onChange={(value) => onChange({ ...props, offerButtonLink: value })}
                autoComplete="off"
              />
              <Checkbox
                label="Show Menu Icon"
                checked={props.showMenu !== false}
                onChange={(checked) => onChange({ ...props, showMenu: checked })}
              />
              <Checkbox
                label="Show Offer Button"
                checked={props.showOfferButton !== false}
                onChange={(checked) => onChange({ ...props, showOfferButton: checked })}
              />
              <Checkbox
                label="Show Wishlist Icon"
                checked={props.showWishlist !== false}
                onChange={(checked) => onChange({ ...props, showWishlist: checked })}
              />
              <Checkbox
                label="Show Account Icon"
                checked={props.showAccount !== false}
                onChange={(checked) => onChange({ ...props, showAccount: checked })}
              />
              <Checkbox
                label="Show Cart Icon"
                checked={props.showCart !== false}
                onChange={(checked) => onChange({ ...props, showCart: checked })}
              />
              <Checkbox
                label="Pulse Effect on Offer Button"
                checked={props.pulseEffect || false}
                onChange={(checked) => onChange({ ...props, pulseEffect: checked })}
              />
            </>
          )}

          {type === "GoEyeMobileHeader" && (
            <>
              <TextField
                label="Logo URL"
                value={props.logoUrl || ""}
                onChange={(value) => onChange({ ...props, logoUrl: value })}
                placeholder="https://example.com/logo.png"
                autoComplete="off"
              />
              <TextField
                label="Trending Title"
                value={props.trendingTitle || "#Trending On"}
                onChange={(value) => onChange({ ...props, trendingTitle: value })}
                autoComplete="off"
              />
              <TextField
                label="Trending Subtitle"
                value={props.trendingSubtitle || "GoEye"}
                onChange={(value) => onChange({ ...props, trendingSubtitle: value })}
                autoComplete="off"
              />
              <TextField
                label="Offer Button Text"
                value={props.offerButtonText || "50% OFF"}
                onChange={(value) => onChange({ ...props, offerButtonText: value })}
                autoComplete="off"
              />
              <TextField
                label="Offer Button Link"
                value={props.offerButtonLink || "/collections/sale"}
                onChange={(value) => onChange({ ...props, offerButtonLink: value })}
                autoComplete="off"
              />
              <TextField
                label="Header Background Color"
                value={props.headerBackgroundColor || "#ffffff"}
                onChange={(value) => onChange({ ...props, headerBackgroundColor: value })}
                autoComplete="off"
              />
              <TextField
                label="Nav Active Color"
                value={props.navActiveColor || "#1E1B4B"}
                onChange={(value) => onChange({ ...props, navActiveColor: value })}
                autoComplete="off"
              />
              <TextField
                label="Offer Button Color"
                value={props.offerButtonColor || "#FF6B6B"}
                onChange={(value) => onChange({ ...props, offerButtonColor: value })}
                autoComplete="off"
              />
              <Checkbox
                label="Enable Menu Drawer"
                checked={props.enableMenuDrawer !== false}
                onChange={(checked) => onChange({ ...props, enableMenuDrawer: checked })}
              />
              <Checkbox
                label="Enable Offer Button"
                checked={props.enableOfferButton !== false}
                onChange={(checked) => onChange({ ...props, enableOfferButton: checked })}
              />
              <Checkbox
                label="Enable Pulse Effect"
                checked={props.enablePulseEffect !== false}
                onChange={(checked) => onChange({ ...props, enablePulseEffect: checked })}
              />
              <Checkbox
                label="Show Wishlist Icon"
                checked={props.enableWishlistIcon !== false}
                onChange={(checked) => onChange({ ...props, enableWishlistIcon: checked })}
              />
              <Checkbox
                label="Show Account Icon"
                checked={props.enableAccountIcon !== false}
                onChange={(checked) => onChange({ ...props, enableAccountIcon: checked })}
              />
              <Checkbox
                label="Show Cart Icon"
                checked={props.enableCartIcon !== false}
                onChange={(checked) => onChange({ ...props, enableCartIcon: checked })}
              />
            </>
          )}
          
          {type === "ProductGrid" && (
            <>
              <Select
                label="Collection"
                options={collections.map(c => ({ label: c.title, value: c.id }))}
            value={props.collectionId || collections[0]?.id || ""}
                onChange={(value) => onChange({ ...props, collectionId: value })}
              />
              <Select
                label="Grid Columns"
                options={[
                  { label: "1 Column", value: "1" },
                  { label: "2 Columns", value: "2" },
                  { label: "3 Columns", value: "3" },
                ]}
                value={props.columns || "2"}
                onChange={(value) => onChange({ ...props, columns: value })}
              />
              <Checkbox
                label="Show prices"
                checked={props.showPrices !== false}
                onChange={(checked) => onChange({ ...props, showPrices: checked })}
          />
              <Checkbox
                label="Show add to cart"
                checked={props.showAddToCart !== false}
                onChange={(checked) => onChange({ ...props, showAddToCart: checked })}
              />
            </>
          )}
          
          {type === "HeroSection" && (
            <>
              <TextField
                label="Heading"
                value={props.heading || "Welcome to our app"}
                onChange={(value) => onChange({ ...props, heading: value })}
              />
              <TextField
                label="Subheading"
                value={props.subheading || "Discover amazing products"}
                onChange={(value) => onChange({ ...props, subheading: value })}
                multiline={3}
              />
              <TextField
                label="Button Text"
                value={props.buttonText || "Shop Now"}
                onChange={(value) => onChange({ ...props, buttonText: value })}
          />
              <TextField
                label="Button Link"
                value={props.buttonLink || "/collections/all"}
                onChange={(value) => onChange({ ...props, buttonLink: value })}
          />
        <div>
                <Text variant="bodyMd" as="p">Background Image</Text>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
          {props.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={props.image} alt="Hero" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </div>
          )}
        </div>
            </>
          )}
          
          {type === "SearchBar" && (
            <>
              <TextField
                label="Placeholder Text"
                value={props.placeholder || "Search products..."}
                onChange={(value) => onChange({ ...props, placeholder: value })}
              />
              <Checkbox
                label="Show filter button"
                checked={props.showFilter !== false}
                onChange={(checked) => onChange({ ...props, showFilter: checked })}
          />
              <Checkbox
                label="Show voice search"
                checked={props.showVoice || false}
                onChange={(checked) => onChange({ ...props, showVoice: checked })}
              />
            </>
          )}
          
          {/* Add more component-specific property editors */}
          {type === "Spacer" && (
            <Select
              label="Spacer Size"
              options={[
                { label: "Small (8px)", value: "8" },
                { label: "Medium (16px)", value: "16" },
                { label: "Large (32px)", value: "32" },
                { label: "Extra Large (64px)", value: "64" },
              ]}
              value={props.size || "16"}
              onChange={(value) => onChange({ ...props, size: value })}
            />
          )}
        </Stack>
        </div>
        </div>
      );
}

function MobilePreview({
  items, 
  products, 
  collections,
}: { 
  items: CanvasItem[]; 
  products: ShopifyProduct[]; 
  collections: ShopifyCollection[];
}) {
      return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
        <Stack alignment="center" spacing="tight">
          <Icon source={MobileIcon} />
          <Text variant="headingMd" as="h3">Mobile Preview</Text>
          <Badge>Live Preview</Badge>
        </Stack>
        </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '16px', background: '#f6f6f7' }}>
        {/* Mobile Frame */}
        <div style={{
          width: '375px',
          height: '667px',
          background: '#000',
          borderRadius: '25px',
          padding: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          {/* Mobile Screen */}
          <div style={{
            width: '100%',
            height: '100%',
        background: '#fff',
            borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
          }}>
            {/* Status Bar */}
            <div style={{
              height: '24px',
              background: '#000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 12px',
                              fontSize: '12px', 
              color: '#fff',
                            }}>
              <span>9:41</span>
              <span>100% 📶</span>
        </div>
                        
            {/* App Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ 
                  height: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                  flexDirection: 'column',
                  padding: '32px',
                  textAlign: 'center',
                  color: '#666',
                            }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
                  <Text variant="bodyLg">Drag components here to build your mobile app</Text>
        </div>
              ) : (
                items.map((item, index) => (
                  <MobileComponent
                    key={item.id}
                    item={item}
                    products={products}
                    collections={collections}
                    index={index}
                  />
                ))
              )}
        </div>
                      </div>
                          </div>
                        </div>
        </div>
      );
}

function MobileComponent({
  item,
  products, 
  collections,
  index,
}: { 
  item: CanvasItem;
  products: ShopifyProduct[]; 
  collections: ShopifyCollection[];
  index: number;
}) {
  const { type, props = {} } = item;

  // Check if this is a liquid-based component
  const isLiquidComponent = [
    'StickyMobileHeader', 'TouchProductGrid', 'SwipeableCollection', 
    'MobileHeroBanner', 'TouchSlideshow', 'MobileNewsletterSignup', 
    'CollapsibleMobileFooter', 'MobileCartDrawer', 'MobileSearchOverlay',
    'MobileNavigation', 'HamburgerMenu', 'MobileSection', 'GoEyeMobileHeader'
  ].includes(type);
  
  if (isLiquidComponent) {
    // Create a mobile component for the renderer
    const liquidComponent: LiquidMobileComponent = {
      id: item.id,
      name: type,
      type: 'section',
      originalSection: type,
      settings: [],
      mobileRenderer: {
        component: type,
        props: props,
        styles: {},
        interactions: {},
        accessibility: {}
      },
      styling: {
        colors: {},
        fonts: {},
        spacing: {},
        breakpoints: {}
      },
      responsive: true,
      touchOptimized: true
    };
    
    return (
      <MobileRenderer 
        component={liquidComponent} 
        settings={props} 
        shopifyData={{ products, collections, shop: {} }} 
      />
    );
  }

  // Fallback to original switch statement for legacy components
  switch (type) {
    case "AppHeader":
  return (
        <div style={{ 
          height: '56px',
        background: '#fff',
          borderBottom: '1px solid #e1e3e5',
        display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {props.showBack && <span>←</span>}
            {props.logoUrl ? (
              <img src={props.logoUrl} alt="Logo" style={{ height: '32px' }} />
            ) : (
              <Text variant="headingMd">{props.title || "My App"}</Text>
            )}
      </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {props.showSearch && <span>🔍</span>}
            {props.showCart && <span>🛒</span>}
            </div>
                    </div>
                  );

    case "StickyMobileHeader":
                  return (
        <div style={{ width: '100%', background: '#fff' }}>
          {/* Header Top Section */}
          <div style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e1e3e5'
          }}>
            {/* Left Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {props.showMenu !== false && <span style={{ fontSize: '20px' }}>☰</span>}
              {props.showOfferButton !== false && (
                <div style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                              color: 'white', 
                              fontSize: '12px', 
                  fontWeight: '600',
                  animation: props.pulseEffect ? 'pulse 2s infinite' : 'none'
                            }}>
                  {props.offerButtonText || "50% OFF"}
                </div>
                          )}
                        </div>
                        
            {/* Center - Logo */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                          {props.logoUrl ? (
                <img src={props.logoUrl} alt="Logo" style={{ height: '40px', maxWidth: '120px' }} />
                          ) : (
                <Text variant="headingMd">Logo</Text>
                          )}
                        </div>
                        
            {/* Right Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {props.showWishlist !== false && <span style={{ fontSize: '20px' }}>💝</span>}
              {props.showAccount !== false && <span style={{ fontSize: '20px' }}>👤</span>}
              {props.showCart !== false && (
                          <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: '20px' }}>🛒</span>
                  <div style={{
                              position: 'absolute', 
                              top: '-8px', 
                              right: '-8px', 
                              background: '#EF4444', 
                              color: 'white', 
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                    fontSize: '10px',
                    fontWeight: '600'
                            }}>
                    3
                          </div>
                </div>
              )}
                        </div>
                      </div>
                      
          {/* Search Bar */}
          <div style={{ padding: '16px' }}>
                          <div style={{ 
              position: 'relative',
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '10px 40px 10px 16px',
              border: '1px solid #ddd'
            }}>
              <span style={{
                color: '#666',
                fontSize: '14px'
              }}>
                Search products...
              </span>
              <span style={{
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                transform: 'translateY(-50%)',
                fontSize: '18px'
              }}>
                🔍
              </span>
                        </div>
                      </div>
                      
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '0',
            overflowX: 'auto',
            borderBottom: '1px solid #e1e3e5',
            padding: '0 16px'
          }}>
            {['All', 'Classic', 'Premium', 'New'].map((tab, idx) => (
              <div key={tab} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 16px',
                color: idx === 0 ? '#1E1B4B' : '#6B7280',
                              fontSize: '12px', 
                fontWeight: '600',
                borderBottom: idx === 0 ? '2px solid #1E1B4B' : 'none',
                whiteSpace: 'nowrap',
                              cursor: 'pointer'
                            }}>
                <span style={{ fontSize: '16px' }}>
                  {idx === 0 ? '⚡' : idx === 1 ? '⭐' : idx === 2 ? '🔒' : '✨'}
                            </span>
                {tab}
              </div>
                          ))}
                        </div>

          {/* Trending Section */}
          <div style={{ background: '#f8f9fa', paddingBottom: '16px' }}>
            <div style={{ padding: '16px' }}>
              <Text variant="headingMd" fontWeight="semibold">
                {props.trendingTitle || "#Trending On"} <span style={{ color: '#1E1B4B' }}>
                  {props.trendingSubtitle || "Your App"}
                </span>
              </Text>
            </div>

            {/* Trending Items Slider */}
                      <div style={{ 
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '0 16px',
              scrollbarWidth: 'none'
            }}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} style={{
                  flex: '0 0 auto',
                  width: '200px',
                  height: '250px',
                  borderRadius: '12px',
                  background: `linear-gradient(45deg, 
                    ${item === 1 ? '#FF6B6B, #FF8E8E' : 
                      item === 2 ? '#4ECDC4, #44A08D' : 
                      item === 3 ? '#45B7D1, #96C93D' : '#FFA07A, #FF7F50'})`,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Trending Item {item}
                      </div>
              ))}
                    </div>
                    </div>
                    </div>
                  );
      
    case "HeroSection":
                  return (
        <div style={{
          minHeight: '200px',
          background: props.image ? `url(${props.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '32px 16px',
        }}>
          <div>
            <Text variant="headingLg" as="h2">{props.heading || "Welcome to our app"}</Text>
            <Text variant="bodyMd" as="p" style={{ marginTop: '8px', marginBottom: '16px' }}>
              {props.subheading || "Discover amazing products"}
            </Text>
            <button style={{
              background: '#fff',
              color: '#333',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '24px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              {props.buttonText || "Shop Now"}
                        </button>
                      </div>
                    </div>
      );
      
    case "ProductGrid":
      const collection = collections?.find(c => c.id === props.collectionId);
      const gridProducts = collection?.products?.slice(0, 6) || products?.slice(0, 6) || [];
      const columns = parseInt(props.columns || "2");
      
      return (
        <div style={{ padding: '16px' }}>
                      <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '12px',
          }}>
            {gridProducts.map((product) => (
              <div key={product.id} style={{
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}>
                {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.title} 
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                          />
                )}
                <div style={{ padding: '8px' }}>
                  <Text variant="bodySm" truncate>{product.title}</Text>
                  {props.showPrices && product.price && (
                    <Text variant="bodyMd" fontWeight="semibold">${product.price}</Text>
                  )}
                  {props.showAddToCart && (
                    <button style={{
                      width: '100%',
                      background: '#008060',
                      color: '#fff',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginTop: '4px',
                    }}>
                      Add to Cart
                    </button>
                      )}
                    </div>
                      </div>
            ))}
                    </div>
                    </div>
      );
      
    case "SearchBar":
      return (
        <div style={{ padding: '16px' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
            background: '#f6f6f7',
            borderRadius: '24px',
            padding: '8px 16px',
            gap: '8px',
          }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder={props.placeholder || "Search products..."}
                          style={{ 
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
              }}
            />
            {props.showVoice && <span>🎤</span>}
            {props.showFilter && <span>🎛️</span>}
                      </div>
                    </div>
                  );
      
    case "Spacer":
      const size = parseInt(props.size || "16");
      return <div style={{ height: `${size}px` }} />;
      
                default:
      return (
        <div style={{
          padding: '16px',
          margin: '8px 16px',
          background: '#f6f6f7',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px dashed #ddd',
        }}>
          <Text variant="bodySm" color="subdued">
            {MOBILE_COMPONENTS?.find(c => c.type === type)?.label || type} Component
          </Text>
    </div>
  );
}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  
  const url = new URL(request.url);
  const templateId = url.searchParams.get('template');
  const appId = url.searchParams.get('app');
  
  let template = null;
  let app = null;
  
  // Load template if templateId is provided
  if (templateId) {
    try {
      const response = await fetch(`${url.origin}/api/templates/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: templateId })
      });
      
      if (response.ok) {
        template = await response.json();
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }
  
  // Load app if appId is provided
  if (appId) {
    try {
      const response = await fetch(`${url.origin}/api/apps/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      
      if (response.ok) {
        app = await response.json();
      }
    } catch (error) {
      console.error('Error loading app:', error);
    }
  }
  
  // Load all templates for dropdown
  let templates = [];
  try {
    const templatesResponse = await fetch(`${url.origin}/api/templates/load`);
    if (templatesResponse.ok) {
      const templatesData = await templatesResponse.json();
      templates = templatesData.templates || [];
    }
  } catch (error) {
    console.error('Error loading templates:', error);
  }
  
  const shopifyData = await shopifyDataLoader({ request, params: {}, context: {} });
  
  return {
    ...shopifyData,
    template,
    app,
    templates
  };
};

export default function MobileAppBuilder() {
  const { products, collections, template, app, templates } = useLoaderData<typeof loader>();
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [appName, setAppName] = useState<string>('');
  const nameRef = useRef<HTMLInputElement>(null);
  
  // Load template or app data if provided
  React.useEffect(() => {
    if (app && app.data && Array.isArray(app.data)) {
      setItems(app.data);
      setAppName(app.name);
      setSaveStatus(`Loaded app: ${app.name}`);
    } else if (template && template.data && Array.isArray(template.data)) {
      setItems(template.data);
      setSaveStatus(`Loaded template: ${template.name}`);
    } else {
      // Check for demo template in sessionStorage
      const url = new URL(window.location.href);
      const templateId = url.searchParams.get('template');
      const demo = url.searchParams.get('demo');
      
      // Handle GoEye header demo
      if (demo === 'goeye-header') {
        const goeyeHeaderComponent = {
          id: 'goeye-header-demo',
          type: 'GoEyeMobileHeader',
          props: {
            logoUrl: '',
            trendingTitle: '#Trending On',
            trendingSubtitle: 'GoEye',
            offerButtonText: '50% OFF',
            offerButtonLink: '/collections/sale',
            headerBackgroundColor: '#313652',
            navActiveColor: '#1E1B4B',
            offerButtonColor: '#FF6B6B',
            enableMenuDrawer: true,
            enableOfferButton: true,
            enablePulseEffect: true,
            enableWishlistIcon: true,
            enableAccountIcon: true,
            enableCartIcon: true
          }
        };
        setItems([goeyeHeaderComponent]);
        setSaveStatus('Loaded GoEye Header Demo - ready to customize!');
      } else if (templateId && templateId.startsWith('demo-')) {
        const storedTemplate = sessionStorage.getItem(`theme-${templateId}`);
        if (storedTemplate) {
          try {
            const parsedTemplate = JSON.parse(storedTemplate);
            if (parsedTemplate.data && Array.isArray(parsedTemplate.data)) {
              setItems(parsedTemplate.data);
              setSaveStatus(`Loaded imported theme: ${parsedTemplate.name}`);
            }
          } catch (error) {
            console.error('Error loading demo template:', error);
          }
        }
      }
    }
  }, [template, app]);
  
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
    setItems(prev => [...prev, newItem]);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");
    if (componentData) {
      const component = JSON.parse(componentData);
      handleAddComponent(component);
    }
  };

  const handlePropsChange = (newProps: Record<string, any>) => {
    if (!selectedId) return;
    setItems(items => items.map(item => 
      item.id === selectedId ? { ...item, props: newProps } : item
    ));
  };

  const handleSave = async () => {
    const name = appName.trim() || nameRef.current?.value?.trim() || "Untitled App";
    
    if (items.length === 0) {
      setSaveStatus("Cannot save empty app. Add some components first.");
      return;
    }
    
    setSaveStatus(null);
    try {
      const res = await fetch("/api/apps/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          data: items, 
          templateId: selectedTemplateId || template?.id || null,
          version: "1.0.0"
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus(`App "${name}" saved successfully!`);
        setAppName(name);
      } else {
        setSaveStatus(data.error || "Failed to save app");
      }
    } catch (err) {
      setSaveStatus("Failed to save app");
    }
  };

  const handleLoadTemplate = async (templateId: string) => {
    if (!templateId) {
      setItems([]);
      setSaveStatus("Cleared canvas");
      return;
    }
    
    try {
      const res = await fetch("/api/templates/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: templateId }),
      });
      
      if (res.ok) {
        const templateData = await res.json();
        if (templateData.data && Array.isArray(templateData.data)) {
          setItems(templateData.data);
          setSelectedTemplateId(templateId);
          setSaveStatus(`Loaded template: ${templateData.name}`);
        }
      } else {
        setSaveStatus("Failed to load template");
      }
    } catch (err) {
      setSaveStatus("Failed to load template");
    }
  };

  const selectedItem = selectedId ? items.find(item => item.id === selectedId) : null;

  return (
    <Page
      title="Mobile App Builder"
      subtitle="Build your complete mobile shopping app using templates and custom components"
      secondaryActions={[
        {
          content: 'Templates',
          url: '/app/templates',
          icon: ViewIcon,
        },
        {
          content: 'Preview',
          icon: ViewIcon,
        },
        {
          content: 'Export',
          icon: DesktopIcon,
        },
      ]}
    >
      {/* Template Navigation Header */}
      <Card>
        <div style={{ padding: '16px' }}>
          <Stack alignment="center" distribution="equalSpacing">
            <Stack alignment="center" spacing="tight">
              <Text variant="headingMd" as="h3">
                {app ? `Editing App: ${app.name}` : template ? `Using Template: ${template.name}` : 'Mobile App Builder'}
              </Text>
              {(template || app) && (
                <Stack spacing="tight">
                  {template && <Badge tone="info">{template.designType}</Badge>}
                  {app && <Badge tone="success">App v{app.version}</Badge>}
                  <Text variant="bodySm" tone="subdued" as="p">
                    {template ? `Working with ${template.designType.replace('-', ' ')} template` : 'Building your mobile app'}
                  </Text>
                </Stack>
              )}
            </Stack>
            <Stack spacing="tight">
              <Button url="/app/templates" icon={ViewIcon}>
                Switch Page Type
              </Button>
              <Button url="/app/apps" icon={MobileIcon}>
                Your Apps
              </Button>
              {template && (
                <Button 
                  url={`/app/preview?template=${template.id}`} 
                  icon={ViewIcon}
                  variant="primary"
                >
                  Preview
                </Button>
              )}
            </Stack>
          </Stack>
        </div>
      </Card>

      {/* App Configuration */}
      <Card>
        <div style={{ padding: '16px' }}>
          <Stack alignment="center" distribution="equalSpacing">
            <Stack spacing="normal">
              <TextField
                label="App Name"
                value={appName}
                onChange={setAppName}
                placeholder="Enter your app name"
                autoComplete="off"
              />
              <Select
                label="Load Template"
                options={[
                  { label: 'Start from scratch', value: '' },
                  ...templates.map(tmpl => ({
                    label: `${tmpl.name} (${tmpl.designType})`,
                    value: tmpl.id
                  }))
                ]}
                value={selectedTemplateId}
                onChange={handleLoadTemplate}
              />
            </Stack>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={SaveIcon}
              disabled={!appName.trim()}
            >
              Save App
            </Button>
          </Stack>
        </div>
      </Card>

      {saveStatus && (
        <Banner
          status={saveStatus.includes('successfully') ? 'success' : 'critical'}
          onDismiss={() => setSaveStatus(null)}
        >
          {saveStatus}
        </Banner>
      )}
      
      <Layout>
        <Layout.Section oneThird>
          <Card>
            <ComponentPalette onAddComponent={handleAddComponent} />
          </Card>
        </Layout.Section>
        
        <Layout.Section oneThird>
          <Card>
            <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
              <Stack alignment="center" distribution="equalSpacing">
                <Stack alignment="center" spacing="tight">
                  <Icon source={EditIcon} />
                  <Text variant="headingMd" as="h2">App Structure</Text>
                </Stack>
                <TextField
                  placeholder="App name"
                  value=""
                  onChange={() => {}}
                  connectedRight={
                    <Button primary onClick={handleSave}>Save</Button>
                  }
                />
              </Stack>
            </div>
            
            <div 
            style={{ 
                minHeight: '400px', 
                padding: '16px',
                background: '#fafbfb',
              }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <Stack vertical spacing="tight">
                    {items.length === 0 ? (
                <div style={{ 
                        padding: '32px',
                        textAlign: 'center',
                        color: '#666',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
                        <Text variant="bodyMd">Drag components here to build your app</Text>
              </div>
            ) : (
                      items.map((item, index) => (
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
                  </Stack>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div style={{ padding: '8px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      {items.find(item => item.id === activeId)?.type}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </Card>
        </Layout.Section>
        
        <Layout.Section oneThird>
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
                  items={items}
                products={products} 
                collections={collections} 
              />
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
      
      <input ref={nameRef} type="hidden" />
    </Page>
  );
} 