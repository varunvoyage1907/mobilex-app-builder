import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { loader as shopifyDataLoader } from "./api.shopify-data";
import { pdpStatus } from "./api.pdp.status";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // Try to authenticate, but don't require it for preview purposes
  let admin = null;
  let products = [];
  let collections = [];
  
  try {
    admin = await authenticate.admin(request);
    // Get the product data from Shopify if authenticated
    const shopifyData = await shopifyDataLoader({ request, params, context: {} });
    products = (shopifyData as any).products || [];
    collections = (shopifyData as any).collections || [];
  } catch (error) {
    console.log("PDP route: No admin session, using mock data for preview");
    // Parse query params for mock data
    console.log("Request URL:", request.url);
    const url = new URL(request.url);
    const title = url.searchParams.get("title") || "Sample Product";
    const image = url.searchParams.get("image") || "https://via.placeholder.com/400x400?text=Product+Image";
    const price = url.searchParams.get("price") || "29.99";
    const description = url.searchParams.get("description") || "This is a sample product for preview purposes.";
    const handle = params.handle || "sample-product";
    console.log("Mock PDP product:", { title, image, price, description, handle });
    products = [
      {
        id: "gid://shopify/Product/123456789",
        title,
        description,
        inventory: 10,
        image,
        images: [image],
        price,
        handle
      }
    ];
    collections = [
      {
        id: "gid://shopify/Collection/123456789",
        title: "Sample Collection",
        image: "https://via.placeholder.com/400x200?text=Collection+Image",
        products: products
      }
    ];
  }
  
  return json({
    product: products[0],
    products: products,
    collections: collections,
    pdpConfig: {
      active: pdpStatus.active,
      designData: pdpStatus.designData
    }
  });
};

export default function ProductPage() {
  const { product, products, collections, pdpConfig } = useLoaderData<typeof loader>();
  
  console.log("Product page loaded:", { 
    productTitle: product?.title, 
    pdpActive: pdpConfig.active, 
    designDataLength: pdpConfig.designData?.length 
  });
  
  // Check if we're in preview mode (using mock data)
  const isPreviewMode = product?.title === "Sample Product";
  
  if (!product) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h1>Product not found</h1>
        <p>The requested product could not be found.</p>
      </div>
    );
  }
  
  // If PDP is not active, show a simple default view
  if (!pdpConfig.active || !pdpConfig.designData || pdpConfig.designData.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Product Image */}
          <div>
            <div style={{ 
              background: '#f5f5f5', 
              height: 400, 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 20
            }}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: 8 }} 
                />
              ) : (
                <span style={{ color: '#999' }}>Product Image</span>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 600 }}>{product.title}</h1>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#1976d2' }}>
                ${product.price || '0.00'}
              </span>
            </div>
            {product.description && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Description</h3>
                <p style={{ lineHeight: 1.6, color: '#666' }}>{product.description}</p>
              </div>
            )}
            <button style={{ 
              width: '100%', 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              padding: '16px 24px', 
              borderRadius: 8, 
              fontSize: 16, 
              fontWeight: 600, 
              cursor: 'pointer',
              marginBottom: 12
            }}>
              Add to Cart
            </button>
            <button style={{ 
              width: '100%', 
              background: '#fff', 
              color: '#1976d2', 
              border: '2px solid #1976d2', 
              padding: '16px 24px', 
              borderRadius: 8, 
              fontSize: 16, 
              fontWeight: 600, 
              cursor: 'pointer'
            }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the custom PDP design
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      {/* Debug indicator */}
      <div style={{ 
        background: isPreviewMode ? '#ff9800' : '#4caf50', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '4px', 
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        {isPreviewMode ? '🔄 Preview Mode - Mock Data' : '✅ Custom PDP Design Active - Template: PDP1'}
      </div>
      
      <CustomProductPage 
        product={product} 
        products={products} 
        collections={collections} 
        designData={pdpConfig.designData} 
      />
    </div>
  );
}

// Component to render the custom PDP design
function CustomProductPage({ 
  product, 
  products, 
  collections, 
  designData 
}: { 
  product: any; 
  products: any[]; 
  collections: any[]; 
  designData: any[]; 
}) {
  const renderComponent = (item: any, index: number) => {
    const props = item.props || {};
    
    switch (item.type) {
      case 'MobileHeader':
        return (
          <div key={item.id} style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 20, 
            background: props.backgroundColor || '#ffffff', 
            padding: '1rem',
            borderBottom: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gridColumn: '1 / -1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {props.showMenu !== false && (
                  <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                )}
                {props.offerText && (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)', 
                    color: 'white', 
                    padding: '5px 12px', 
                    borderRadius: '50px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}>
                    {props.offerText}
                  </span>
                )}
              </div>
              
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {props.logoUrl ? (
                  <img src={props.logoUrl} alt="Logo" style={{ maxHeight: '40px', maxWidth: '100px' }} />
                ) : (
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>LOGO</div>
                )}
              </div>
              
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <div style={{ position: 'relative' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    background: '#f5f5f5',
                    boxSizing: 'border-box'
                  }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <nav style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', minWidth: 'max-content' }}>
                {['All', 'New', 'Sale', 'Men', 'Women', 'Accessories'].map((tab, i) => (
                  <span key={i} style={{ 
                    padding: '12px 16px', 
                    color: i === 0 ? '#1976d2' : '#6B7280', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    borderBottom: i === 0 ? '2px solid #1976d2' : '2px solid transparent',
                    cursor: 'pointer'
                  }}>
                    {tab}
                  </span>
                ))}
              </div>
            </nav>
            
            <div style={{ 
              fontSize: '11px', 
              color: '#666', 
              textAlign: 'center', 
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              📱 Mobile Only (hidden on desktop)
            </div>
          </div>
        );
      case 'ProductImageGallery':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <div style={{ 
              background: '#f5f5f5', 
              height: 400, 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'cover',
                    borderRadius: 8 
                  }} 
                />
              ) : (
                <span style={{ color: '#999' }}>Product Image Gallery</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8 }}>
              Gallery Style: {props.galleryStyle || 'grid'}
            </div>
          </div>
        );
        
      case 'ProductInfo':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <h1 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 600, color: '#333' }}>
              {product.title}
            </h1>
            {props.showPrice !== false && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: '#1976d2' }}>
                  ${product.price || '0.00'}
                </span>
              </div>
            )}
            {props.showSku !== false && (
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                SKU: {product.id}
              </div>
            )}
          </div>
        );
        
      case 'ProductVariants':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Product Variants</h3>
            <div style={{ 
              padding: '16px', 
              background: '#f9f9f9', 
              borderRadius: 8,
              fontSize: 14,
              color: '#666'
            }}>
              Variant Display: {props.variantDisplay || 'dropdown'}
            </div>
          </div>
        );
        
      case 'ProductDescription':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Product Description</h3>
            {product.description && (
              <p style={{ 
                margin: '0 0 16px', 
                color: '#666', 
                lineHeight: 1.6,
                fontSize: 16
              }}>
                {props.showFullDescription !== false ? product.description : product.description.substring(0, 200) + '...'}
              </p>
            )}
          </div>
        );
        
      case 'AddToCart':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              {props.showQuantity !== false && (
                <>
                  <label style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>Quantity:</label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1px solid #ddd', 
                    borderRadius: 6,
                    overflow: 'hidden'
                  }}>
                    <button style={{ padding: '12px 16px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '12px 16px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>1</span>
                    <button style={{ padding: '12px 16px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>+</button>
                  </div>
                </>
              )}
            </div>
            <button 
              style={{ 
                width: '100%', 
                padding: '16px 24px', 
                background: props.buttonStyle === 'outline' ? 'transparent' : '#1976d2', 
                color: props.buttonStyle === 'outline' ? '#1976d2' : '#fff', 
                border: props.buttonStyle === 'outline' ? '2px solid #1976d2' : 'none', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 12
              }}
            >
              Add to Cart
            </button>
            <button style={{ 
              width: '100%', 
              background: '#fff', 
              color: '#1976d2', 
              border: '2px solid #1976d2', 
              padding: '16px 24px', 
              borderRadius: 8, 
              fontSize: 16, 
              fontWeight: 600, 
              cursor: 'pointer'
            }}>
              Buy Now
            </button>
          </div>
        );
        
      case 'ProductReviews':
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>Product Reviews</h3>
            <div style={{ 
              padding: '16px', 
              background: '#f9f9f9', 
              borderRadius: 8,
              fontSize: 14,
              color: '#666'
            }}>
              {props.showRating !== false && <div style={{ marginBottom: 8 }}>⭐ ⭐ ⭐ ⭐ ⭐ (4.5)</div>}
              {props.showReviewCount !== false && <div>Based on 24 reviews</div>}
            </div>
          </div>
        );
        
      case 'RelatedProducts': {
        const collection = collections.find(c => c.id === props.collectionId) || collections[0];
        const relatedProducts = collection?.products?.length ? collection.products : products.slice(0, props.productCount || 4);
        return (
          <div key={item.id} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Related Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {relatedProducts.map((relatedProduct: any) => (
                <div key={relatedProduct.id} style={{ cursor: 'pointer' }}>
                  <div style={{ background: '#f5f5f5', height: 200, borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {relatedProduct.image ? (
                      <img src={relatedProduct.image} alt={relatedProduct.title} style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8 }} />
                    ) : (
                      <span style={{ color: '#999' }}>Image</span>
                    )}
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>{relatedProduct.title}</h4>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
        
      case 'Spacer':
        return <div key={item.id} style={{ height: props.height || 40 }} />;
        
      case 'BannerCTA':
        return (
          <div key={item.id} style={{ margin: '24px 0', padding: '32px', background: '#f5f5f5', borderRadius: 12, textAlign: 'center' }}>
            {props.image && (
              <img src={props.image} alt="Banner" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 16 }} />
            )}
            <h3 style={{ margin: '0 0 12px', fontSize: 24 }}>{props.heading || 'Special Offer'}</h3>
            <div style={{ margin: '0 0 20px', color: '#666' }}>
              <span dangerouslySetInnerHTML={{ __html: props.subtext || 'Get 20% off your first order!' }} />
            </div>
            <button style={{ 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 32px', 
              borderRadius: 8, 
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600
            }}>
              {props.button || 'Shop Now'}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
      {/* Full width components at top */}
      <div style={{ gridColumn: '1 / -1' }}>
        {designData
          .filter(item => ['MobileHeader', 'RelatedProducts', 'BannerCTA'].includes(item.type))
          .map(renderComponent)}
      </div>
      
      {/* Left column for image gallery */}
      <div>
        {designData
          .filter(item => item.type === 'ProductImageGallery')
          .map(renderComponent)}
      </div>
      
      {/* Right column for product info and actions */}
      <div>
        {designData
          .filter(item => !['MobileHeader', 'ProductImageGallery', 'RelatedProducts', 'BannerCTA'].includes(item.type))
          .map(renderComponent)}
      </div>
    </div>
  );
} 