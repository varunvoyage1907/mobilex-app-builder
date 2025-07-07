import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface CanvasItem {
  id: string;
  type: string;
  props?: Record<string, any>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const templateData = url.searchParams.get("data");
  const designType = url.searchParams.get("type") || "homepage";
  
  console.log("=== PREVIEW PAGE DEBUG ===");
  console.log("Full URL:", url.toString());
  console.log("Raw template data param:", templateData);
  console.log("Design type param:", designType);
  
  let items: CanvasItem[] = [];
  if (templateData) {
    try {
      console.log("Attempting to decode template data...");
      const decodedData = decodeURIComponent(templateData);
      console.log("Decoded data:", decodedData);
      items = JSON.parse(decodedData);
      console.log("Parsed items:", items);
      console.log("Items length:", items.length);
    } catch (err) {
      console.error("Error parsing template data:", err);
      console.error("Template data that failed:", templateData);
    }
  } else {
    console.log("No template data found in URL parameters");
  }
  
  console.log("Final items being returned:", items);
  return { items, designType };
};

export default function TemplatePreview() {
  const { items, designType } = useLoaderData<typeof loader>();

  const renderComponent = (item: CanvasItem) => {
    const props = item.props || {};
    
    switch (item.type) {
      case 'MobileHeader':
        return (
          <div key={item.id} style={{ 
            display: 'block', 
            position: 'sticky', 
            top: 0, 
            zIndex: 20, 
            background: props.backgroundColor || '#4A5568', 
            padding: '1rem', 
            color: 'white' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center' 
              }}>
                {props.showMenu !== false && (
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                )}
                <a href="#" style={{ 
                  background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)', 
                  color: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '50px', 
                  textDecoration: 'none', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  whiteSpace: 'nowrap' 
                }}>
                  {props.offerText || '🎁 50% OFF'}
                </a>
              </div>
              
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                {props.logoUrl ? (
                  <img src={props.logoUrl} alt="Logo" style={{ maxHeight: '40px', maxWidth: '100px' }} />
                ) : (
                  <div style={{ 
                    color: 'white', 
                    fontSize: '18px', 
                    fontWeight: 'bold' 
                  }}>
                    LOGO
                  </div>
                )}
              </div>
              
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '16px' 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div style={{ position: 'relative' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span style={{ 
                    position: 'absolute', 
                    top: '-8px', 
                    right: '-8px', 
                    background: '#EF4444', 
                    color: 'white', 
                    fontSize: '10px', 
                    minWidth: '16px', 
                    height: '16px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 600 
                  }}>
                    2
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  style={{ 
                    width: '100%', 
                    padding: '10px 40px 10px 15px', 
                    border: '1px solid #6B7280', 
                    borderRadius: '8px', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    boxSizing: 'border-box'
                  }} 
                />
                <button style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  color: 'white',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <nav style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ 
                display: 'flex', 
                gap: 0, 
                whiteSpace: 'nowrap', 
                minWidth: 'max-content' 
              }}>
                {['All', 'Classic', 'Essentials', 'Pro'].map((tab, i) => (
                  <a key={i} href="#" style={{ 
                    padding: '12px 16px', 
                    textDecoration: 'none', 
                    color: i === 0 ? '#60A5FA' : 'rgba(255,255,255,0.8)', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    borderBottom: i === 0 ? '2px solid #60A5FA' : '2px solid transparent' 
                  }}>
                    {tab}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        );

      case 'Header':
        return (
          <div key={item.id} style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#fff' }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#333' }}>
              {props.text || 'Your Store'}
            </h1>
          </div>
        );

      case 'AnnouncementBar':
        return (
          <div key={item.id} style={{ 
            padding: '8px 16px', 
            background: props.backgroundColor || '#000', 
            color: props.textColor || '#fff', 
            fontSize: 13, 
            textAlign: 'center' as const
          }}>
            <span dangerouslySetInnerHTML={{ __html: props.text || '🎉 Free shipping on orders over $50!' }} />
          </div>
        );

      case 'ImageSlider':
        return (
          <div key={item.id} style={{ 
            height: props.height || 200, 
            background: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!props.imageUrl && <p style={{ color: '#999' }}>Image Slider</p>}
          </div>
        );

      case 'FeaturedProduct':
        return (
          <div key={item.id} style={{ padding: 16, background: '#fff' }}>
            <div style={{ 
              background: '#f5f5f5', 
              height: 240, 
              borderRadius: 8, 
              marginBottom: 12, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <span style={{ color: '#999' }}>Featured Product</span>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>
              {props.title || 'Sample Product'}
            </h3>
            <p style={{ margin: '0 0 12px', color: '#666' }}>
              {props.description || 'Product description here'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20, fontWeight: 600 }}>
                ${props.price || '29.99'}
              </span>
              <button style={{ 
                background: '#1976d2', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: 6, 
                cursor: 'pointer' 
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        );

      case 'ProductCarousel':
        return (
          <div key={item.id} style={{ padding: '16px 0', background: '#fff' }}>
            <h3 style={{ margin: '0 16px 12px', fontSize: 16 }}>
              {props.title || 'Featured Products'}
            </h3>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 12, padding: '0 16px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ flex: '0 0 140px' }}>
                  <div style={{ 
                    background: '#f5f5f5', 
                    height: 140, 
                    borderRadius: 8, 
                    marginBottom: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <span style={{ color: '#999' }}>Product {i}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>Product {i}</h4>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>$19.99</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Text':
        return (
          <div key={item.id} style={{ 
            padding: 16, 
            background: '#fff',
            fontSize: props.fontSize || 16,
            color: props.color || '#333',
            textAlign: props.alignment || 'left' as const
          }}>
            <div dangerouslySetInnerHTML={{ __html: props.content || 'Sample text content' }} />
          </div>
        );

      case 'Button':
        return (
          <div key={item.id} style={{ 
            padding: 16, 
            background: '#fff',
            textAlign: props.alignment || 'center' as const 
          }}>
            <button style={{ 
              background: props.backgroundColor || '#1976d2', 
              color: props.textColor || '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: props.borderRadius || 6, 
              cursor: 'pointer',
              fontSize: props.fontSize || 16,
              fontWeight: 600
            }}>
              {props.text || 'Click Me'}
            </button>
          </div>
        );

      case 'Spacer':
        return (
          <div key={item.id} style={{ 
            height: props.height || 40,
            background: 'transparent'
          }} />
        );

      default:
        return (
          <div key={item.id} style={{ 
            padding: 16, 
            background: '#f8f9fa', 
            border: '1px dashed #dee2e6',
            textAlign: 'center' as const,
            color: '#6c757d'
          }}>
            <p>{item.type} Component</p>
            {props.text && <p>"{props.text}"</p>}
          </div>
        );
    }
  };

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', background: '#f8f9fa' }}>
      {/* Mobile Frame */}
      <div style={{
        maxWidth: 375,
        margin: '20px auto',
        background: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        border: '8px solid #333'
      }}>
        {/* Mobile Status Bar */}
        <div style={{ 
          height: 32, 
          background: '#f5f5f5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: 12, 
          color: '#888' 
        }}>
          9:41 AM • 100% 🔋
        </div>

        {/* Template Content */}
        <div style={{ 
          background: '#fff',
          minHeight: 'calc(100vh - 120px)',
          overflowY: 'auto'
        }}>
          {items.length === 0 ? (
            <div style={{ 
              padding: '60px 20px', 
              textAlign: 'center' as const, 
              color: '#999' 
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>📱 Template Preview</h2>
              <p style={{ margin: 0, fontSize: 14 }}>
                No components added yet.<br/>
                Add components in the page builder to see them here.
              </p>
            </div>
          ) : (
            <>
              {items.map(renderComponent)}
              
              {/* Template Info */}
              <div style={{ 
                padding: '20px', 
                background: '#f8f9fa', 
                borderTop: '1px solid #eee',
                textAlign: 'center' as const
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: 12, 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  🎨 {designType === 'homepage' ? 'Homepage' : 'Product Detail Page'} Preview • {items.length} Components
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        maxWidth: 600, 
        margin: '20px auto', 
        padding: '20px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, color: '#333' }}>📱 Template Preview</h2>
        <p style={{ margin: '0 0 12px', color: '#666', fontSize: 14 }}>
          This is a live preview of your complete template with all components. 
          Perfect for testing and sharing with clients.
        </p>
        <div style={{ 
          background: '#e3f2fd', 
          padding: '12px', 
          borderRadius: 6, 
          fontSize: 14 
        }}>
          <strong>💡 Pro Tip:</strong> Open this page on your mobile device for the most accurate preview experience!
        </div>
      </div>
    </div>
  );
} 