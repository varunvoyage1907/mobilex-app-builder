import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import React, { useState, useRef, useEffect } from "react";

// Section and Block Type Definitions
interface BlockSchema {
  type: string;
  name: string;
  settings: SettingSchema[];
}

interface SectionSchema {
  name: string;
  tag: string;
  class?: string;
  settings: SettingSchema[];
  blocks?: BlockSchema[];
  presets?: Array<{
    name: string;
    settings?: Record<string, any>;
    blocks?: Array<{
      type: string;
      settings?: Record<string, any>;
    }>;
  }>;
  max_blocks?: number;
  enabled_on?: {
    templates?: string[];
  };
}

interface SettingSchema {
  type: 'text' | 'textarea' | 'richtext' | 'image_picker' | 'color' | 'checkbox' | 'radio' | 'select' | 'range' | 'number' | 'url' | 'font_picker';
  id: string;
  label: string;
  default?: any;
  info?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

interface BlockInstance {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface SectionInstance {
  id: string;
  type: string;
  settings: Record<string, any>;
  blocks: BlockInstance[];
}

interface ThemeData {
  sections: SectionInstance[];
  global_settings: Record<string, any>;
}

// Mobile App Section Schemas
const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  mobile_header: {
    name: "Mobile Header",
    tag: "section",
    class: "mobile-header-section",
    settings: [
      {
        type: "image_picker",
        id: "logo",
        label: "Logo Image"
      },
      {
        type: "color",
        id: "background_color", 
        label: "Background Color",
        default: "#4A5568"
      },
      {
        type: "checkbox",
        id: "show_search",
        label: "Show Search Bar",
        default: true
      },
      {
        type: "checkbox",
        id: "sticky_header",
        label: "Sticky Header",
        default: true
      }
    ],
    blocks: [
      {
        type: "promo_button",
        name: "Promotional Button",
        settings: [
          {
            type: "text",
            id: "text",
            label: "Button Text",
            default: "50% OFF"
          },
          {
            type: "url",
            id: "link",
            label: "Button Link"
          },
          {
            type: "color",
            id: "background_color",
            label: "Background Color",
            default: "#FF6B6B"
          }
        ]
      },
      {
        type: "nav_tab",
        name: "Navigation Tab",
        settings: [
          {
            type: "text",
            id: "title",
            label: "Tab Title",
            default: "All"
          },
          {
            type: "url",
            id: "link",
            label: "Tab Link"
          },
          {
            type: "checkbox",
            id: "is_active",
            label: "Active Tab",
            default: false
          }
        ]
      }
    ],
    max_blocks: 6,
    presets: [
      {
        name: "Default Mobile Header",
        settings: {
          background_color: "#4A5568",
          show_search: true,
          sticky_header: true
        },
        blocks: [
          {
            type: "promo_button",
            settings: {
              text: "🎁 50% OFF",
              background_color: "#FF6B6B"
            }
          },
          {
            type: "nav_tab",
            settings: {
              title: "All",
              is_active: true
            }
          },
          {
            type: "nav_tab", 
            settings: {
              title: "New"
            }
          },
          {
            type: "nav_tab",
            settings: {
              title: "Sale"
            }
          }
        ]
      }
    ]
  },
  
  hero_banner: {
    name: "Hero Banner",
    tag: "section",
    settings: [
      {
        type: "image_picker",
        id: "background_image",
        label: "Background Image"
      },
      {
        type: "range",
        id: "height",
        label: "Section Height",
        min: 200,
        max: 600,
        step: 50,
        unit: "px",
        default: 300
      },
      {
        type: "select",
        id: "content_alignment",
        label: "Content Alignment",
        default: "center",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" }
        ]
      }
    ],
    blocks: [
      {
        type: "heading",
        name: "Heading",
        settings: [
          {
            type: "text",
            id: "text",
            label: "Heading Text",
            default: "Welcome to Our Store"
          },
          {
            type: "select",
            id: "size",
            label: "Heading Size",
            default: "h1",
            options: [
              { value: "h1", label: "Large" },
              { value: "h2", label: "Medium" },
              { value: "h3", label: "Small" }
            ]
          },
          {
            type: "color",
            id: "color",
            label: "Text Color",
            default: "#FFFFFF"
          }
        ]
      },
      {
        type: "text",
        name: "Text Block",
        settings: [
          {
            type: "textarea",
            id: "text",
            label: "Text Content",
            default: "Discover amazing products"
          },
          {
            type: "color",
            id: "color",
            label: "Text Color", 
            default: "#FFFFFF"
          }
        ]
      },
      {
        type: "button",
        name: "Button",
        settings: [
          {
            type: "text",
            id: "text",
            label: "Button Text",
            default: "Shop Now"
          },
          {
            type: "url",
            id: "link",
            label: "Button Link"
          },
          {
            type: "select",
            id: "style",
            label: "Button Style",
            default: "primary",
            options: [
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" }
            ]
          }
        ]
      }
    ],
    max_blocks: 5,
    presets: [
      {
        name: "Hero with Text and Button",
        settings: {
          height: 400,
          content_alignment: "center"
        },
        blocks: [
          {
            type: "heading",
            settings: {
              text: "Welcome to Our Store",
              size: "h1"
            }
          },
          {
            type: "text",
            settings: {
              text: "Discover amazing products at unbeatable prices"
            }
          },
          {
            type: "button",
            settings: {
              text: "Shop Now",
              style: "primary"
            }
          }
        ]
      }
    ]
  },

  product_grid: {
    name: "Product Grid",
    tag: "section",
    settings: [
      {
        type: "text",
        id: "heading",
        label: "Section Heading",
        default: "Featured Products"
      },
      {
        type: "select",
        id: "collection",
        label: "Product Collection",
        default: "all",
        options: [
          { value: "all", label: "All Products" },
          { value: "featured", label: "Featured Products" },
          { value: "new", label: "New Arrivals" },
          { value: "sale", label: "Sale Items" }
        ]
      },
      {
        type: "range",
        id: "products_to_show",
        label: "Products to Show",
        min: 2,
        max: 12,
        step: 1,
        default: 6
      },
      {
        type: "select",
        id: "grid_style",
        label: "Grid Style",
        default: "grid",
        options: [
          { value: "grid", label: "Grid View" },
          { value: "carousel", label: "Carousel" },
          { value: "list", label: "List View" }
        ]
      },
      {
        type: "checkbox",
        id: "show_vendor",
        label: "Show Product Vendor",
        default: false
      },
      {
        type: "checkbox",
        id: "show_price",
        label: "Show Product Price",
        default: true
      }
    ],
    presets: [
      {
        name: "Featured Products Grid",
        settings: {
          heading: "Featured Products",
          collection: "featured",
          products_to_show: 6,
          grid_style: "grid"
        }
      }
    ]
  },

  announcement_bar: {
    name: "Announcement Bar",
    tag: "section",
    settings: [
      {
        type: "text",
        id: "text",
        label: "Announcement Text",
        default: "🎉 Free shipping on orders over $50!"
      },
      {
        type: "color",
        id: "background_color",
        label: "Background Color",
        default: "#000000"
      },
      {
        type: "color",
        id: "text_color",
        label: "Text Color",
        default: "#FFFFFF"
      },
      {
        type: "url",
        id: "link",
        label: "Link URL"
      },
      {
        type: "checkbox",
        id: "show_icon",
        label: "Show Icon",
        default: true
      }
    ],
    presets: [
      {
        name: "Free Shipping Banner",
        settings: {
          text: "🎉 Free shipping on orders over $50!",
          background_color: "#000000",
          text_color: "#FFFFFF"
        }
      }
    ]
  },

  spacer: {
    name: "Spacer",
    tag: "section",
    settings: [
      {
        type: "range",
        id: "height",
        label: "Spacer Height",
        min: 10,
        max: 200,
        step: 10,
        unit: "px",
        default: 40
      },
      {
        type: "color",
        id: "background_color",
        label: "Background Color",
        default: "transparent"
      }
    ],
    presets: [
      {
        name: "Medium Spacer",
        settings: {
          height: 40
        }
      }
    ]
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return {
    sections: SECTION_SCHEMAS
  };
};

export default function ThemeCustomizer() {
  const { sections } = useLoaderData<typeof loader>();
  const [themeData, setThemeData] = useState<ThemeData>({
    sections: [],
    global_settings: {}
  });
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);

  // Add a new section
  const addSection = (sectionType: string, preset?: any) => {
    const schema = sections[sectionType];
    if (!schema) return;

    const newSection: SectionInstance = {
      id: `section_${Date.now()}`,
      type: sectionType,
      settings: preset?.settings || {},
      blocks: preset?.blocks?.map((block: any, index: number) => ({
        id: `block_${Date.now()}_${index}`,
        type: block.type,
        settings: block.settings || {}
      })) || []
    };

    setThemeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSection(newSection.id);
    setShowSectionLibrary(false);
  };

  // Add block to section
  const addBlock = (sectionId: string, blockType: string) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const newBlock: BlockInstance = {
            id: `block_${Date.now()}`,
            type: blockType,
            settings: {}
          };
          return {
            ...section,
            blocks: [...section.blocks, newBlock]
          };
        }
        return section;
      })
    }));
  };

  // Update section settings
  const updateSectionSettings = (sectionId: string, settings: Record<string, any>) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, settings: { ...section.settings, ...settings } }
          : section
      )
    }));
  };

  // Update block settings
  const updateBlockSettings = (sectionId: string, blockId: string, settings: Record<string, any>) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            blocks: section.blocks.map(block =>
              block.id === blockId
                ? { ...block, settings: { ...block.settings, ...settings } }
                : block
            )
          };
        }
        return section;
      })
    }));
  };

  // Remove section
  const removeSection = (sectionId: string) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  // Remove block
  const removeBlock = (sectionId: string, blockId: string) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            blocks: section.blocks.filter(block => block.id !== blockId)
          };
        }
        return section;
      })
    }));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  };

  // Render setting input
  const renderSettingInput = (setting: SettingSchema, value: any, onChange: (value: any) => void) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || setting.default || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || setting.default || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value || setting.default || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value !== undefined ? value : setting.default}
            onChange={(e) => onChange(e.target.checked)}
            style={{ transform: 'scale(1.2)' }}
          />
        );

      case 'select':
        return (
          <select
            value={value || setting.default || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'range':
        return (
          <div>
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={value || setting.default || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
              {value || setting.default || 0}{setting.unit}
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            min={setting.min}
            max={setting.max}
            step={setting.step}
            value={value || setting.default || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value || setting.default || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder || 'https://example.com'}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );

      case 'image_picker':
        return (
          <div>
            <input
              type="url"
              value={value || setting.default || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Image URL"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }}
            />
            {(value || setting.default) && (
              <img
                src={value || setting.default}
                alt="Preview"
                style={{ maxWidth: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || setting.default || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );
    }
  };

  const selectedSectionData = themeData.sections.find(s => s.id === selectedSection);
  const selectedSectionSchema = selectedSectionData ? sections[selectedSectionData.type] : null;
  const selectedBlockData = selectedSectionData?.blocks.find(b => b.id === selectedBlock);
  const selectedBlockSchema = selectedBlockData && selectedSectionSchema 
    ? selectedSectionSchema.blocks?.find(b => b.type === selectedBlockData.type)
    : null;

  return (
    <Page>
      <style>{`
        .theme-customizer {
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          height: 100vh;
          gap: 0;
          background: #f6f6f7;
        }
        .sections-panel {
          background: #fff;
          border-right: 1px solid #e1e3e5;
          overflow-y: auto;
        }
        .preview-panel {
          background: #f6f6f7;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .settings-panel {
          background: #fff;
          border-left: 1px solid #e1e3e5;
          overflow-y: auto;
        }
        .panel-header {
          padding: 16px;
          border-bottom: 1px solid #e1e3e5;
          font-weight: 600;
          font-size: 14px;
          color: #202223;
        }
        .section-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f2f4;
          cursor: pointer;
          transition: background 0.2s;
        }
        .section-item:hover {
          background: #f6f6f7;
        }
        .section-item.selected {
          background: #e0f7fa;
          border-left: 3px solid #1976d2;
        }
        .block-item {
          padding: 8px 16px;
          margin-left: 20px;
          border-bottom: 1px solid #f6f6f7;
          cursor: pointer;
          font-size: 13px;
          color: #6c7b7f;
        }
        .block-item:hover {
          background: #f9f9f9;
        }
        .block-item.selected {
          background: #e3f2fd;
          color: #1976d2;
        }
        .mobile-preview {
          width: 375px;
          height: 667px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 8px solid #333;
        }
        .setting-group {
          padding: 16px;
          border-bottom: 1px solid #f1f2f4;
        }
        .setting-item {
          margin-bottom: 16px;
        }
        .setting-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #202223;
          margin-bottom: 6px;
        }
        .add-section-btn {
          width: 100%;
          padding: 12px;
          background: #1976d2;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .add-section-btn:hover {
          background: #1565c0;
        }
        .section-library {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .section-library-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }
        .section-card {
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .section-card:hover {
          border-color: #1976d2;
        }
      `}</style>
      
      <div className="theme-customizer">
        {/* Sections Panel */}
        <div className="sections-panel">
          <div className="panel-header">
            Theme Sections
            <button 
              onClick={() => setShowSectionLibrary(true)}
              className="add-section-btn"
              style={{ marginTop: '8px' }}
            >
              ＋ Add Section
            </button>
          </div>
          
          {themeData.sections.map((section) => (
            <div key={section.id}>
              <div 
                className={`section-item ${selectedSection === section.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSection(section.id);
                  setSelectedBlock(null);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{sections[section.type]?.name || section.type}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(section.id);
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Blocks */}
              {section.blocks.map((block) => (
                <div 
                  key={block.id}
                  className={`block-item ${selectedBlock === block.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setSelectedBlock(block.id);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{sections[section.type]?.blocks?.find(b => b.type === block.type)?.name || block.type}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(section.id, block.id);
                      }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add Block Button */}
              {selectedSection === section.id && sections[section.type]?.blocks && (
                <div style={{ padding: '8px 16px', marginLeft: '20px' }}>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        addBlock(section.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                  >
                    <option value="">+ Add Block</option>
                    {sections[section.type].blocks!.map(blockSchema => (
                      <option key={blockSchema.type} value={blockSchema.type}>
                        {blockSchema.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="mobile-preview">
            {/* Mobile Status Bar */}
            <div style={{ 
              height: '32px', 
              background: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              color: '#888'
            }}>
              9:41 AM • 100% 🔋
            </div>
            
            {/* Rendered Sections */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {themeData.sections.length === 0 ? (
                <div style={{ 
                  padding: '40px 20px', 
                  textAlign: 'center', 
                  color: '#999',
                  fontSize: '14px'
                }}>
                  <p>No sections added yet</p>
                  <p>Click "Add Section" to get started</p>
                </div>
              ) : (
                themeData.sections.map((section) => (
                  <div 
                    key={section.id}
                    style={{ 
                      border: selectedSection === section.id ? '2px solid #1976d2' : '2px solid transparent',
                      position: 'relative'
                    }}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    {/* Render section based on type */}
                    {section.type === 'mobile_header' && (
                      <div style={{ 
                        background: section.settings.background_color || '#4A5568',
                        color: 'white',
                        padding: '1rem'
                      }}>
                        {/* Header content would be rendered here */}
                        <div style={{ textAlign: 'center', fontSize: '14px' }}>
                          Mobile Header Section
                        </div>
                      </div>
                    )}
                    {section.type === 'hero_banner' && (
                      <div style={{ 
                        height: section.settings.height || 300,
                        background: section.settings.background_image ? `url(${section.settings.background_image})` : '#f0f0f0',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: section.settings.content_alignment || 'center',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '20px'
                      }}>
                        {section.blocks.map(block => (
                          <div key={block.id}>
                            {block.type === 'heading' && (
                              <h1 style={{ 
                                color: block.settings.color || '#FFFFFF',
                                fontSize: block.settings.size === 'h1' ? '24px' : block.settings.size === 'h2' ? '20px' : '16px',
                                margin: 0
                              }}>
                                {block.settings.text || 'Heading'}
                              </h1>
                            )}
                            {block.type === 'text' && (
                              <p style={{ 
                                color: block.settings.color || '#FFFFFF',
                                margin: 0
                              }}>
                                {block.settings.text || 'Text content'}
                              </p>
                            )}
                            {block.type === 'button' && (
                              <button style={{ 
                                background: block.settings.style === 'primary' ? '#1976d2' : block.settings.style === 'secondary' ? '#666' : 'transparent',
                                color: 'white',
                                border: block.settings.style === 'outline' ? '2px solid white' : 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}>
                                {block.settings.text || 'Button'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {section.type === 'announcement_bar' && (
                      <div style={{ 
                        background: section.settings.background_color || '#000000',
                        color: section.settings.text_color || '#FFFFFF',
                        padding: '8px 16px',
                        textAlign: 'center',
                        fontSize: '13px'
                      }}>
                        {section.settings.text || 'Announcement text'}
                      </div>
                    )}
                    {section.type === 'product_grid' && (
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>
                          {section.settings.heading || 'Products'}
                        </h3>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: '12px' 
                        }}>
                          {Array.from({ length: section.settings.products_to_show || 4 }).map((_, i) => (
                            <div key={i} style={{ 
                              background: '#f5f5f5', 
                              aspectRatio: '1', 
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: '#999'
                            }}>
                              Product {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.type === 'spacer' && (
                      <div style={{ 
                        height: section.settings.height || 40,
                        background: section.settings.background_color || 'transparent'
                      }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="settings-panel">
          <div className="panel-header">
            {selectedBlock ? 'Block Settings' : selectedSection ? 'Section Settings' : 'Theme Settings'}
          </div>
          
          {selectedBlock && selectedBlockSchema ? (
            <div className="setting-group">
              <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>
                {selectedBlockSchema.name}
              </h4>
              {selectedBlockSchema.settings.map(setting => (
                <div key={setting.id} className="setting-item">
                  <label className="setting-label">
                    {setting.label}
                    {setting.info && (
                      <span style={{ fontSize: '11px', color: '#666', display: 'block', fontWeight: 'normal' }}>
                        {setting.info}
                      </span>
                    )}
                  </label>
                  {renderSettingInput(
                    setting,
                    selectedBlockData?.settings[setting.id],
                    (value) => updateBlockSettings(selectedSection!, selectedBlock, { [setting.id]: value })
                  )}
                </div>
              ))}
            </div>
          ) : selectedSection && selectedSectionSchema ? (
            <div className="setting-group">
              <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>
                {selectedSectionSchema.name}
              </h4>
              {selectedSectionSchema.settings.map(setting => (
                <div key={setting.id} className="setting-item">
                  <label className="setting-label">
                    {setting.label}
                    {setting.info && (
                      <span style={{ fontSize: '11px', color: '#666', display: 'block', fontWeight: 'normal' }}>
                        {setting.info}
                      </span>
                    )}
                  </label>
                  {renderSettingInput(
                    setting,
                    selectedSectionData?.settings[setting.id],
                    (value) => updateSectionSettings(selectedSection, { [setting.id]: value })
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="setting-group">
              <p style={{ color: '#666', fontSize: '13px' }}>
                Select a section or block to edit its settings
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section Library Modal */}
      {showSectionLibrary && (
        <div className="section-library">
          <div className="section-library-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Add Section</h3>
              <button 
                onClick={() => setShowSectionLibrary(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            {Object.entries(sections).map(([key, schema]) => (
              <div key={key} className="section-card">
                <h4 style={{ margin: '0 0 8px' }}>{schema.name}</h4>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#666' }}>
                  {key === 'mobile_header' && 'Sticky navigation header for mobile apps'}
                  {key === 'hero_banner' && 'Large banner with text and call-to-action buttons'}
                  {key === 'product_grid' && 'Display products in a grid or carousel layout'}
                  {key === 'announcement_bar' && 'Promotional banner for announcements'}
                  {key === 'spacer' && 'Add vertical spacing between sections'}
                </p>
                {schema.presets?.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addSection(key, preset)}
                    style={{ 
                      marginRight: '8px',
                      marginBottom: '8px',
                      padding: '6px 12px',
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
} 