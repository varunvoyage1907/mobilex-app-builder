import React, { useState, useEffect, useRef } from 'react';

interface GoEyeMobileHeaderProps {
  settings?: {
    // Logo settings
    logoUrl?: string;
    logoWidth?: number;
    logoHeight?: number;
    
    // Trending section
    trendingTitle?: string;
    trendingSubtitle?: string;
    trendingBackground?: string;
    
    // Colors
    headerBackgroundColor?: string;
    navBackgroundColor?: string;
    navTextColor?: string;
    navActiveColor?: string;
    navHoverColor?: string;
    navIndicatorColor?: string;
    iconColor?: string;
    iconHoverColor?: string;
    
    // Icons
    enableMenuDrawer?: boolean;
    enableWishlistIcon?: boolean;
    enableAccountIcon?: boolean;
    enableCartIcon?: boolean;
    
    // Offer button
    enableOfferButton?: boolean;
    offerButtonText?: string;
    offerButtonLink?: string;
    enablePulseEffect?: boolean;
    offerButtonColor?: string;
    offerButtonColorEnd?: string;
    
    // Drawer settings
    drawerBackgroundColor?: string;
    drawerTextColor?: string;
    drawerBorderColor?: string;
    cartCountBackground?: string;
    
    // Navigation tabs
    navigationTabs?: Array<{
      title: string;
      link: string;
      showIndicator?: boolean;
    }>;
    
    // Trending slides
    trendingSlides?: Array<{
      title: string;
      image: string;
      link?: string;
      mediaType?: 'image' | 'video';
      video?: string;
    }>;
    
    // Menu items
    menuItems?: Array<{
      title: string;
      link: string;
      icon: string;
    }>;
    
    // Drawer offers
    drawerOffers?: Array<{
      title: string;
      subtitle: string;
      image: string;
      link?: string;
    }>;
  };
  shopifyData?: {
    cart?: {
      item_count: number;
    };
  };
}

export function GoEyeMobileHeader({ settings = {}, shopifyData }: GoEyeMobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState('men');
  const [activeTab, setActiveTab] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const trendingRef = useRef<HTMLDivElement>(null);

  // Default settings
  const config = {
    logoUrl: settings.logoUrl || 'https://cdn.shopify.com/s/files/1/0583/8831/6208/files/goeye_logo.png',
    logoWidth: settings.logoWidth || 120,
    logoHeight: settings.logoHeight || 40,
    trendingTitle: settings.trendingTitle || '#Trending On',
    trendingSubtitle: settings.trendingSubtitle || 'GoEye',
    trendingBackground: settings.trendingBackground || '#f8f9fa',
    headerBackgroundColor: settings.headerBackgroundColor || '#313652',
    navBackgroundColor: settings.navBackgroundColor || '#313652',
    navTextColor: settings.navTextColor || '#ffffff',
    navActiveColor: settings.navActiveColor || '#ffffff',
    navHoverColor: settings.navHoverColor || '#ffffff',
    navIndicatorColor: settings.navIndicatorColor || '#F97316',
    iconColor: settings.iconColor || '#ffffff',
    iconHoverColor: settings.iconHoverColor || '#ffffff',
    enableMenuDrawer: settings.enableMenuDrawer !== false,
    enableWishlistIcon: settings.enableWishlistIcon !== false,
    enableAccountIcon: settings.enableAccountIcon !== false,
    enableCartIcon: settings.enableCartIcon !== false,
    enableOfferButton: settings.enableOfferButton !== false,
    offerButtonText: settings.offerButtonText || '50% OFF',
    offerButtonLink: settings.offerButtonLink || '/collections/sale',
    enablePulseEffect: settings.enablePulseEffect !== false,
    offerButtonColor: settings.offerButtonColor || '#FF6B6B',
    offerButtonColorEnd: settings.offerButtonColorEnd || '#FF8E8E',
    drawerBackgroundColor: settings.drawerBackgroundColor || '#ffffff',
    drawerTextColor: settings.drawerTextColor || '#1f2937',
    drawerBorderColor: settings.drawerBorderColor || '#e5e7eb',
    cartCountBackground: settings.cartCountBackground || '#EF4444',
    
    navigationTabs: settings.navigationTabs || [
      { title: 'All', link: '/collections/all', showIndicator: false },
      { title: 'Classic', link: '/collections/classic', showIndicator: true },
      { title: 'Essentials', link: '/collections/essentials', showIndicator: false },
      { title: 'Pro', link: '/collections/pro', showIndicator: false }
    ],
    
    trendingSlides: settings.trendingSlides || [
      { title: 'Trending Item 1', image: 'https://via.placeholder.com/220x270/FF6B6B/FFFFFF?text=Trending+1', link: '/products/trending-1' },
      { title: 'Trending Item 2', image: 'https://via.placeholder.com/220x270/4ECDC4/FFFFFF?text=Trending+2', link: '/products/trending-2' },
      { title: 'Trending Item 3', image: 'https://via.placeholder.com/220x270/45B7D1/FFFFFF?text=Trending+3', link: '/products/trending-3' },
      { title: 'Trending Item 4', image: 'https://via.placeholder.com/220x270/FFA07A/FFFFFF?text=Trending+4', link: '/products/trending-4' }
    ],
    
    menuItems: settings.menuItems || [
      { title: 'Men', link: '/collections/men', icon: '👨' },
      { title: 'Women', link: '/collections/women', icon: '👩' },
      { title: 'Kids', link: '/collections/kids', icon: '👶' },
      { title: 'Accessories', link: '/collections/accessories', icon: '👓' },
      { title: 'Sale', link: '/collections/sale', icon: '🔥' }
    ],
    
    drawerOffers: settings.drawerOffers || [
      { title: 'Special Offer', subtitle: 'Up to 50% off', image: 'https://via.placeholder.com/280x120/FF6B6B/FFFFFF?text=Offer+1' },
      { title: 'New Collection', subtitle: 'Latest arrivals', image: 'https://via.placeholder.com/280x120/4ECDC4/FFFFFF?text=Offer+2' }
    ]
  };

  const cartCount = shopifyData?.cart?.item_count || 0;

  // Auto-slide trending items
  useEffect(() => {
    const interval = setInterval(() => {
      if (config.trendingSlides.length > 1) {
        setCurrentSlide(prev => (prev + 1) % config.trendingSlides.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [config.trendingSlides.length]);

  // Handle trending item scroll
  useEffect(() => {
    if (trendingRef.current) {
      const scrollLeft = currentSlide * 232; // 220px width + 12px gap
      trendingRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const getTabIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'all':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'classic':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'essentials':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'pro':
      case 'premium':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 20, 
      width: '100%', 
      background: config.headerBackgroundColor,
      overflow: 'visible'
    }}>
      {/* Menu Drawer */}
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={closeMenu}
        />
      )}
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '85%',
        maxWidth: '360px',
        height: '100vh',
        background: config.drawerBackgroundColor,
        zIndex: 1000,
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${config.drawerBorderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: config.drawerTextColor,
            margin: 0
          }}>Menu</h2>
          <button
            onClick={closeMenu}
            style={{
              background: 'none',
              border: 'none',
              padding: '5px',
              color: config.drawerTextColor,
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Gender Selector */}
        <div style={{
          display: 'flex',
          padding: '12px 16px',
          gap: '1px',
          background: config.drawerBorderColor
        }}>
          {['men', 'women'].map(gender => (
            <button
              key={gender}
              onClick={() => setActiveGender(gender)}
              style={{
                flex: 1,
                padding: '12px 8px',
                textAlign: 'center',
                background: activeGender === gender ? config.drawerTextColor : config.drawerBackgroundColor,
                border: 'none',
                color: activeGender === gender ? 'white' : config.drawerTextColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: gender === 'men' ? '6px 0 0 6px' : '0 6px 6px 0'
              }}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>

        {/* Drawer Offers */}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: config.drawerTextColor,
            margin: '0 0 12px 0'
          }}>Special Offers</h3>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: '8px'
          }}>
            {config.drawerOffers.map((offer, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 auto',
                  width: '280px',
                  height: '120px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  scrollSnapAlign: 'start',
                  position: 'relative'
                }}
              >
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  color: 'white'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: 0
                  }}>{offer.title}</h4>
                  <p style={{
                    fontSize: '12px',
                    opacity: 0.9,
                    margin: '4px 0 0 0'
                  }}>{offer.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '16px' }}>
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {config.menuItems.map((item, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                <a
                  href={item.link}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    color: config.drawerTextColor,
                    textDecoration: 'none',
                    fontSize: '16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    marginRight: '12px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </span>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ padding: '1rem', marginBottom: '-16px' }}>
        {/* Header Top */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          {/* Left Section */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {config.enableMenuDrawer && (
              <button
                onClick={toggleMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: config.iconColor,
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            {config.enableOfferButton && (
              <a
                href={config.offerButtonLink}
                style={{
                  background: `linear-gradient(135deg, ${config.offerButtonColor} 0%, ${config.offerButtonColorEnd} 100%)`,
                  border: 'none',
                  borderRadius: '50px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px',
                  animation: config.enablePulseEffect ? 'pulse 2s infinite' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>{config.offerButtonText}</span>
              </a>
            )}
          </div>

          {/* Center - Logo */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {config.logoUrl ? (
              <img 
                src={config.logoUrl} 
                alt="Logo"
                style={{
                  height: 'auto',
                  maxHeight: `${config.logoHeight}px`,
                  width: 'auto',
                  maxWidth: `${config.logoWidth}px`,
                  margin: '0 auto'
                }}
              />
            ) : (
              <h1 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: config.iconColor
              }}>
                GoEye
              </h1>
            )}
          </div>

          {/* Right Section */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            {config.enableWishlistIcon && (
              <a href="/pages/wishlist" style={{ color: config.iconColor, textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </a>
            )}

            {config.enableAccountIcon && (
              <a href="/account" style={{ color: config.iconColor, textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            )}

            {config.enableCartIcon && (
              <a href="/cart" style={{ color: config.iconColor, textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: config.cartCountBackground,
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1,
                    transformOrigin: 'center',
                    animation: 'cartBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 1
                  }}>
                    {cartCount < 100 ? cartCount : '99+'}
                  </span>
                )}
              </a>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          width: '100%',
          position: 'relative',
          marginBottom: '1px'
        }}>
          <form action="/search" method="get" style={{ position: 'relative' }}>
            <input
              type="text"
              name="q"
              placeholder=""
              style={{
                width: '100%',
                padding: '10px 2.5rem 10px 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                background: '#f5f5f5',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#666',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}>
              Free Cash on Delivery
            </div>
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#666',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          <ul style={{
            display: 'flex',
            gap: 0,
            margin: 0,
            listStyle: 'none',
            whiteSpace: 'nowrap',
            background: config.navBackgroundColor,
            padding: 0
          }}>
            {config.navigationTabs.map((tab, index) => (
              <li key={index} style={{ display: 'inline-block', position: 'relative' }}>
                <a
                  href={tab.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(index);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 16px',
                    textDecoration: 'none',
                    color: activeTab === index ? config.navActiveColor : config.navTextColor,
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: 'transparent',
                    border: 'none',
                    position: 'relative'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getTabIcon(tab.title)}
                  </span>
                  {tab.title}
                </a>
                {activeTab === index && (
                  <span style={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: config.navActiveColor,
                    borderRadius: '2px 2px 0 0'
                  }} />
                )}
                {tab.showIndicator && (
                  <span style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    backgroundColor: config.navIndicatorColor,
                    borderRadius: '50%',
                    top: '8px',
                    right: '8px'
                  }} />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Trending Section */}
      <div style={{
        background: config.trendingBackground,
        paddingBottom: '16px',
        marginTop: '-16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1E1B4B',
            margin: 0
          }}>
            {config.trendingTitle} <span style={{ color: config.navActiveColor }}>{config.trendingSubtitle}</span>
          </h2>
        </div>
        
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            ref={trendingRef}
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              padding: '0 16px',
              marginLeft: '15px'
            }}
          >
            {config.trendingSlides.map((slide, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 auto',
                  width: '220px',
                  height: '270px',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {slide.link && (
                  <a href={slide.link} style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1
                  }} />
                )}
                <h3 style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  zIndex: 2
                }}>
                  {slide.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes cartBounce {
            0% { transform: scale(0); }
            80% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
} 