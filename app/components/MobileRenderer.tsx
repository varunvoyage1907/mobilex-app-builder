import React from 'react';
import { MobileComponent, MobileRenderer as MobileRendererType } from '../utils/liquidParser';
import { GoEyeMobileHeader } from './GoEyeMobileHeader';

// Mobile Renderer Component
// Converts Shopify sections to mobile-optimized React components

interface MobileRendererProps {
  component: MobileComponent;
  settings?: Record<string, any>;
  shopifyData?: {
    products: any[];
    collections: any[];
    shop: any;
  };
}

export function MobileRenderer({ component, settings = {}, shopifyData }: MobileRendererProps) {
  const { mobileRenderer, styling } = component;
  
  // Apply mobile-optimized styles
  const mobileStyles = {
    ...styling,
    ...mobileRenderer.styles,
    // Ensure mobile-first responsive design
    width: '100%',
    maxWidth: '100vw',
    overflow: 'hidden'
  };

  // Debug logging
  console.log('MobileRenderer - Component type:', mobileRenderer.component, 'Settings:', settings);

  // Render appropriate mobile component
  switch (mobileRenderer.component) {
    case 'StickyMobileHeader':
      return <StickyMobileHeader {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'GoEyeMobileHeader':
      return <GoEyeMobileHeader settings={settings} shopifyData={{ 
        cart: { item_count: 0 } 
      }} />;
    
    case 'TouchProductGrid':
      return <TouchProductGrid {...mobileRenderer.props} settings={settings} styles={mobileStyles} shopifyData={shopifyData} />;
    
    case 'SwipeableCollection':
      return <SwipeableCollection {...mobileRenderer.props} settings={settings} styles={mobileStyles} shopifyData={shopifyData} />;
    
    case 'MobileHeroBanner':
      return <MobileHeroBanner {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'TouchSlideshow':
      return <TouchSlideshow {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'MobileNewsletterSignup':
      return <MobileNewsletterSignup {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'CollapsibleMobileFooter':
      return <CollapsibleMobileFooter {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'MobileCartDrawer':
      return <MobileCartDrawer {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'MobileSearchOverlay':
      return <MobileSearchOverlay {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'MobileNavigation':
      return <MobileNavigation {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    case 'HamburgerMenu':
      return <HamburgerMenu {...mobileRenderer.props} settings={settings} styles={mobileStyles} />;
    
    default:
      return <MobileSection {...mobileRenderer.props} settings={settings} styles={mobileStyles} componentType={mobileRenderer.component} />;
  }
}

// Mobile-Optimized Components

function StickyMobileHeader({ settings, styles }: any) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: settings.background_color || '#ffffff',
      borderBottom: `1px solid ${settings.border_color || '#e1e3e5'}`,
      ...styles
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        minHeight: '56px'
      }}>
        {/* Logo/Brand */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.shop_name || 'Logo'} 
              style={{ 
                height: '32px', 
                maxWidth: '120px',
                objectFit: 'contain'
              }} 
            />
          ) : (
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px',
              fontWeight: '600',
              color: settings.text_color || '#1f2937'
            }}>
              {settings.shop_name || 'Shop'}
            </h1>
          )}
        </div>
        
        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            minWidth: '44px',
            minHeight: '44px'
          }}>
            🔍
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            minWidth: '44px',
            minHeight: '44px',
            position: 'relative'
          }}>
            🛒
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#ef4444',
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
              {settings.cart_count || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TouchProductGrid({ settings, styles, shopifyData }: any) {
  const products = shopifyData?.products || [];
  const columns = parseInt(settings.columns || '2');
  
  return (
    <div style={{
      padding: '16px',
      ...styles
    }}>
      {settings.heading && (
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: settings.heading_color || '#1f2937'
        }}>
          {settings.heading}
        </h2>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px',
        touchAction: 'pan-y' // Better touch performance
      }}>
        {products.slice(0, settings.products_to_show || 6).map((product: any) => (
          <ProductCard key={product.id} product={product} settings={settings} />
        ))}
      </div>
      
      {settings.show_view_all && (
        <button style={{
          width: '100%',
          marginTop: '24px',
          padding: '14px',
          background: settings.button_color || '#1f2937',
          color: settings.button_text_color || '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '44px'
        }}>
          View All Products
        </button>
      )}
    </div>
  );
}

function ProductCard({ product, settings }: any) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease'
    }}>
      {/* Product Image */}
      <div style={{
        position: 'relative',
        paddingBottom: '100%', // 1:1 aspect ratio
        overflow: 'hidden'
      }}>
        <img 
          src={product.image || '/placeholder-product.jpg'} 
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Wishlist Button */}
        <button style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          🤍
        </button>
      </div>
      
      {/* Product Info */}
      <div style={{ padding: '12px' }}>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '500',
          color: '#1f2937',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {product.title}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: settings.price_color || '#1f2937'
          }}>
            ${product.price}
          </span>
          
          {product.compare_at_price && (
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              textDecoration: 'line-through'
            }}>
              ${product.compare_at_price}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button style={{
          width: '100%',
          padding: '8px',
          background: settings.add_to_cart_color || '#1f2937',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '36px'
        }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function SwipeableCollection({ settings, styles, shopifyData }: any) {
  const collections = shopifyData?.collections || [];
  
  return (
    <div style={{
      padding: '16px 0',
      ...styles
    }}>
      {settings.heading && (
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: settings.heading_color || '#1f2937',
          paddingLeft: '16px'
        }}>
          {settings.heading}
        </h2>
      )}
      
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingLeft: '16px',
        paddingRight: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {collections.map((collection: any) => (
          <div key={collection.id} style={{
            flex: '0 0 auto',
            width: '280px',
            background: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              height: '160px',
              background: `linear-gradient(135deg, ${collection.color || '#6366f1'} 0%, ${collection.color || '#8b5cf6'} 100%)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {collection.image ? (
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{
                  fontSize: '32px',
                  color: 'white'
                }}>
                  📦
                </span>
              )}
            </div>
            
            <div style={{ padding: '16px' }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {collection.title}
              </h3>
              
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#6b7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {collection.description || `${collection.products_count || 0} products`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileHeroBanner({ settings, styles }: any) {
  return (
    <div style={{
      position: 'relative',
      height: settings.height || '400px',
      background: settings.background_color || '#1f2937',
      backgroundImage: settings.background_image ? `url(${settings.background_image})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: settings.text_color || '#ffffff',
      ...styles
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `rgba(0,0,0,${settings.overlay_opacity || 0.4})`
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        padding: '32px 16px',
        maxWidth: '600px',
        zIndex: 1
      }}>
        {settings.heading && (
          <h1 style={{
            margin: '0 0 16px 0',
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            {settings.heading}
          </h1>
        )}
        
        {settings.text && (
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '16px',
            lineHeight: '1.5',
            opacity: 0.9
          }}>
            {settings.text}
          </p>
        )}
        
        {settings.button_text && (
          <button style={{
            padding: '14px 32px',
            background: settings.button_color || '#ffffff',
            color: settings.button_text_color || '#1f2937',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            minHeight: '44px',
            minWidth: '120px'
          }}>
            {settings.button_text}
          </button>
        )}
      </div>
    </div>
  );
}

function TouchSlideshow({ settings, styles }: any) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = settings.slides || [];
  
  React.useEffect(() => {
    if (settings.autoplay && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, settings.autoplay_speed || 5000);
      
      return () => clearInterval(interval);
    }
  }, [settings.autoplay, slides.length, settings.autoplay_speed]);
  
  return (
    <div style={{
      position: 'relative',
      height: settings.height || '300px',
      overflow: 'hidden',
      ...styles
    }}>
      {slides.map((slide: any, index: number) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: slide.background_color || '#1f2937',
            backgroundImage: slide.image ? `url(${slide.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: slide.text_color || '#ffffff',
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: 'transform 0.5s ease'
          }}
        >
          <div style={{
            padding: '32px 16px',
            maxWidth: '600px'
          }}>
            {slide.heading && (
              <h2 style={{
                margin: '0 0 16px 0',
                fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: '700'
              }}>
                {slide.heading}
              </h2>
            )}
            
            {slide.text && (
              <p style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                {slide.text}
              </p>
            )}
            
            {slide.button_text && (
              <button style={{
                padding: '12px 24px',
                background: slide.button_color || '#ffffff',
                color: slide.button_text_color || '#1f2937',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px'
              }}>
                {slide.button_text}
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Additional mobile components...
function MobileNewsletterSignup({ settings, styles }: any) {
  return (
    <div style={{
      padding: '32px 16px',
      background: settings.background_color || '#f9fafb',
      textAlign: 'center',
      ...styles
    }}>
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: settings.heading_color || '#1f2937'
      }}>
        {settings.heading || 'Stay in the loop'}
      </h3>
      
      <p style={{
        margin: '0 0 24px 0',
        fontSize: '14px',
        color: settings.text_color || '#6b7280'
      }}>
        {settings.text || 'Subscribe to get special offers and updates'}
      </p>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <input
          type="email"
          placeholder={settings.placeholder || 'Enter your email'}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button style={{
          padding: '12px 24px',
          background: settings.button_color || '#1f2937',
          color: settings.button_text_color || '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '44px'
        }}>
          {settings.button_text || 'Subscribe'}
        </button>
      </div>
    </div>
  );
}

function CollapsibleMobileFooter({ settings, styles }: any) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  return (
    <div style={{
      background: settings.background_color || '#1f2937',
      color: settings.text_color || '#ffffff',
      padding: '32px 16px',
      ...styles
    }}>
      {settings.sections?.map((section: any) => (
        <div key={section.id} style={{ marginBottom: '16px' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onClick={() => toggleSection(section.id)}
          >
            {section.title}
            <span style={{
              transform: expandedSections.includes(section.id) ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </button>
          
          {expandedSections.includes(section.id) && (
            <div style={{
              paddingLeft: '0',
              paddingBottom: '16px'
            }}>
              {section.links?.map((link: any) => (
                <a
                  key={link.id}
                  href={link.url}
                  style={{
                    display: 'block',
                    padding: '8px 0',
                    color: 'inherit',
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.8
                  }}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Copyright */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '16px',
        marginTop: '32px',
        textAlign: 'center',
        fontSize: '14px',
        opacity: 0.7
      }}>
        {settings.copyright || `© ${new Date().getFullYear()} Your Store. All rights reserved.`}
      </div>
    </div>
  );
}

// Default mobile section for unknown components
function MobileSection({ settings, styles, componentType }: any) {
  return (
    <div style={{
      padding: '16px',
      background: '#f9fafb',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      textAlign: 'center',
      ...styles
    }}>
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#6b7280'
      }}>
        {componentType || 'Mobile Section Component'}
      </p>
      {settings && Object.keys(settings).length > 0 && (
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Settings: {Object.keys(settings).join(', ')}
        </p>
      )}
    </div>
  );
}

// Additional placeholder components for other mobile renderers
function MobileCartDrawer({ settings, styles }: any) {
  return <MobileSection settings={settings} styles={styles} componentType="MobileCartDrawer" />;
}

function MobileSearchOverlay({ settings, styles }: any) {
  return <MobileSection settings={settings} styles={styles} componentType="MobileSearchOverlay" />;
}

function MobileNavigation({ settings, styles }: any) {
  return <MobileSection settings={settings} styles={styles} componentType="MobileNavigation" />;
}

function HamburgerMenu({ settings, styles }: any) {
  return <MobileSection settings={settings} styles={styles} componentType="HamburgerMenu" />;
} 