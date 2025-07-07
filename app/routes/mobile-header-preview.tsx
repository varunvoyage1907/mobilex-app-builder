export default function MobileHeaderPreview() {
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
      {/* Mobile Header Component Preview */}
      <div style={{ 
        display: 'block', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: '#4A5568', 
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
              🎁 50% OFF
            </a>
          </div>
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <div style={{ 
              color: 'white', 
              fontSize: '18px', 
              fontWeight: 'bold' 
            }}>
              LOGO
            </div>
          </div>
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '16px' 
          }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
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
            </a>
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
            <a href="#" style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: '#60A5FA', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderBottom: '2px solid #60A5FA' 
            }}>
              All
            </a>
            <a href="#" style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderBottom: '2px solid transparent' 
            }}>
              Classic
            </a>
            <a href="#" style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderBottom: '2px solid transparent' 
            }}>
              Essentials
            </a>
            <a href="#" style={{ 
              padding: '12px 16px', 
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderBottom: '2px solid transparent' 
            }}>
              Pro
            </a>
          </div>
        </nav>
      </div>

      {/* Sample Content */}
      <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ color: '#333', marginBottom: '1rem' }}>📱 Mobile Header Preview</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            This is a live preview of your mobile header component. You can test all the interactions and see how it looks in a browser environment.
          </p>
          <div style={{ 
            background: '#e3f2fd', 
            padding: '1rem', 
            borderRadius: '4px', 
            border: '1px solid #bbdefb' 
          }}>
            <strong>✨ Mobile Header Features:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>✅ Hamburger menu button (☰)</li>
              <li>✅ 50% OFF promotional button</li>
              <li>✅ Centered logo/brand name</li>
              <li>✅ Action icons (wishlist, account, cart)</li>
              <li>✅ Search bar with icon</li>
              <li>✅ Navigation tabs (All, Classic, Essentials, Pro)</li>
              <li>✅ Sticky positioning</li>
              <li>✅ Mobile-first responsive design</li>
              <li>✅ Dark theme with white text</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>🧪 Testing Instructions</h2>
          <ol style={{ color: '#666', paddingLeft: '1.5rem' }}>
            <li><strong>Mobile Testing:</strong> Open this page on your mobile device or use browser dev tools (F12)</li>
            <li><strong>Responsive:</strong> Test the responsive behavior by resizing the browser window</li>
            <li><strong>Alignment:</strong> Verify all elements align properly in one line</li>
            <li><strong>Sticky Header:</strong> Check the sticky header behavior when scrolling down</li>
            <li><strong>Interactions:</strong> Test clicking on all buttons and the search bar</li>
            <li><strong>Navigation:</strong> Click through the navigation tabs to see the active state</li>
          </ol>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>🎨 Component Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
              <strong>Background:</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#666' }}>#4A5568 (Dark Gray)</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
              <strong>Text Color:</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#666' }}>White (#FFFFFF)</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
              <strong>Offer Button:</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#666' }}>Gradient Pink/Coral</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
              <strong>Position:</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#666' }}>Sticky Top</p>
            </div>
          </div>
        </div>

        {/* Extra content to test scrolling */}
        <div style={{ height: '100vh', background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>📜 Scroll Test Area</h2>
            <p style={{ color: '#666', maxWidth: '400px' }}>
              This extra content is here to test the sticky header behavior. 
              Scroll up and down to see how the mobile header stays fixed at the top of the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 