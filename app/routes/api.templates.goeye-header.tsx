import { json } from "@remix-run/node";

export async function loader() {
  // Create a pre-configured GoEye mobile header template
  const goeyeHeaderTemplate = {
    id: "goeye-header-template",
    name: "GoEye Mobile Header",
    designType: "mobile-app",
    data: [
      {
        id: 'goeye-header-1',
        type: 'GoEyeMobileHeader',
        props: {
          logoUrl: '',
          trendingTitle: '#Trending On',
          trendingSubtitle: 'GoEye',
          offerButtonText: '50% OFF',
          offerButtonLink: '/collections/sale',
          headerBackgroundColor: '#ffffff',
          navBackgroundColor: '#ffffff',
          navTextColor: '#6B7280',
          navActiveColor: '#1E1B4B',
          navHoverColor: '#1E1B4B',
          navIndicatorColor: '#F97316',
          iconColor: '#000000',
          iconHoverColor: '#1E1B4B',
          offerButtonColor: '#FF6B6B',
          offerButtonColorEnd: '#FF8E8E',
          drawerBackgroundColor: '#ffffff',
          drawerTextColor: '#1f2937',
          drawerBorderColor: '#e5e7eb',
          cartCountBackground: '#EF4444',
          enableMenuDrawer: true,
          enableOfferButton: true,
          enablePulseEffect: true,
          enableWishlistIcon: true,
          enableAccountIcon: true,
          enableCartIcon: true,
          navigationTabs: [
            { title: 'All', link: '/collections/all', showIndicator: false },
            { title: 'Classic', link: '/collections/classic', showIndicator: true },
            { title: 'Premium', link: '/collections/premium', showIndicator: false },
            { title: 'New', link: '/collections/new', showIndicator: false }
          ],
          trendingSlides: [
            { 
              title: 'Summer Collection', 
              image: 'https://via.placeholder.com/220x270/FF6B6B/FFFFFF?text=Summer+2024', 
              link: '/collections/summer' 
            },
            { 
              title: 'Classic Frames', 
              image: 'https://via.placeholder.com/220x270/4ECDC4/FFFFFF?text=Classic+Style', 
              link: '/collections/classic' 
            },
            { 
              title: 'Premium Range', 
              image: 'https://via.placeholder.com/220x270/45B7D1/FFFFFF?text=Premium+Quality', 
              link: '/collections/premium' 
            },
            { 
              title: 'New Arrivals', 
              image: 'https://via.placeholder.com/220x270/FFA07A/FFFFFF?text=New+Arrivals', 
              link: '/collections/new' 
            }
          ],
          menuItems: [
            { title: 'Men\'s Eyewear', link: '/collections/men', icon: '👨' },
            { title: 'Women\'s Eyewear', link: '/collections/women', icon: '👩' },
            { title: 'Kids Collection', link: '/collections/kids', icon: '👶' },
            { title: 'Sunglasses', link: '/collections/sunglasses', icon: '🕶️' },
            { title: 'Blue Light', link: '/collections/blue-light', icon: '💙' },
            { title: 'Sale', link: '/collections/sale', icon: '🔥' }
          ],
          drawerOffers: [
            { 
              title: 'Summer Sale', 
              subtitle: 'Up to 70% off', 
              image: 'https://via.placeholder.com/280x120/FF6B6B/FFFFFF?text=Summer+Sale' 
            },
            { 
              title: 'Buy 1 Get 1', 
              subtitle: 'On selected frames', 
              image: 'https://via.placeholder.com/280x120/4ECDC4/FFFFFF?text=BOGO+Offer' 
            }
          ]
        }
      }
    ],
    createdAt: new Date().toISOString(),
    originalTheme: "GoEye Theme"
  };

  return json(goeyeHeaderTemplate);
} 