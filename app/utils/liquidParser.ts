// Liquid Parser for Shopify Theme Sections
// Converts .liquid files to mobile-optimized components

export interface LiquidSection {
  name: string;
  type: 'section' | 'snippet' | 'template';
  content: string;
  settings: SectionSetting[];
  blocks?: BlockDefinition[];
  presets?: SectionPreset[];
  styling: ThemeStyling;
  mobileOptimized?: boolean;
}

export interface SectionSetting {
  type: string;
  id: string;
  label: string;
  default?: any;
  options?: Array<{ label: string; value: string }>;
  info?: string;
  placeholder?: string;
}

export interface BlockDefinition {
  type: string;
  name: string;
  settings: SectionSetting[];
  limit?: number;
}

export interface SectionPreset {
  name: string;
  blocks?: Array<{
    type: string;
    settings?: Record<string, any>;
  }>;
  settings?: Record<string, any>;
}

export interface ThemeStyling {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
  customCSS?: string;
}

export class LiquidParser {
  
  /**
   * Parse a .liquid file and extract section information
   */
  static parseLiquidFile(filename: string, content: string): LiquidSection | null {
    try {
      const section: LiquidSection = {
        name: filename.replace('.liquid', ''),
        type: this.detectFileType(filename),
        content: content,
        settings: [],
        styling: {
          colors: {},
          fonts: {},
          spacing: {},
          breakpoints: {}
        }
      };

      // Extract schema from liquid file
      const schemaMatch = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
      if (schemaMatch) {
        const schema = this.parseSchema(schemaMatch[1]);
        section.settings = schema.settings || [];
        section.blocks = schema.blocks || [];
        section.presets = schema.presets || [];
      }

      // Extract styling information
      section.styling = this.extractStyling(content);

      // Mark common sections that need mobile optimization
      section.mobileOptimized = this.needsMobileOptimization(section.name);

      return section;
    } catch (error) {
      console.error(`Error parsing liquid file ${filename}:`, error);
      return null;
    }
  }

  /**
   * Detect if file is section, snippet, or template
   */
  private static detectFileType(filename: string): 'section' | 'snippet' | 'template' {
    if (filename.includes('sections/')) return 'section';
    if (filename.includes('snippets/')) return 'snippet';
    if (filename.includes('templates/')) return 'template';
    
    // Default based on common patterns
    const commonSections = ['header', 'footer', 'product', 'collection', 'cart', 'hero'];
    const commonSnippets = ['product-card', 'cart-item', 'icon', 'loading'];
    
    const basename = filename.replace('.liquid', '').toLowerCase();
    
    if (commonSections.some(s => basename.includes(s))) return 'section';
    if (commonSnippets.some(s => basename.includes(s))) return 'snippet';
    
    return 'section'; // Default
  }

  /**
   * Parse JSON schema from liquid files
   */
  private static parseSchema(schemaContent: string): any {
    try {
      // Clean up the schema content
      const cleanSchema = schemaContent.trim().replace(/^-\s*/, '');
      return JSON.parse(cleanSchema);
    } catch (error) {
      console.error('Error parsing schema:', error);
      return {};
    }
  }

  /**
   * Extract styling information from liquid content
   */
  private static extractStyling(content: string): ThemeStyling {
    const styling: ThemeStyling = {
      colors: {},
      fonts: {},
      spacing: {},
      breakpoints: {}
    };

    // Extract CSS custom properties
    const cssVarMatches = content.match(/--[\w-]+:\s*[^;]+/g);
    if (cssVarMatches) {
      cssVarMatches.forEach(match => {
        const [property, value] = match.split(':').map(s => s.trim());
        if (property.includes('color')) {
          styling.colors[property] = value;
        } else if (property.includes('font')) {
          styling.fonts[property] = value;
        } else if (property.includes('space') || property.includes('margin') || property.includes('padding')) {
          styling.spacing[property] = value;
        }
      });
    }

    // Extract Shopify theme settings references
    const settingMatches = content.match(/settings\.[\w-]+/g);
    if (settingMatches) {
      settingMatches.forEach(match => {
        const setting = match.replace('settings.', '');
        if (setting.includes('color')) {
          styling.colors[setting] = `{{ settings.${setting} }}`;
        } else if (setting.includes('font')) {
          styling.fonts[setting] = `{{ settings.${setting} }}`;
        }
      });
    }

    return styling;
  }

  /**
   * Check if section needs mobile optimization
   */
  private static needsMobileOptimization(sectionName: string): boolean {
    const mobileOptimizationNeeded = [
      'header', 'navigation', 'menu', 'search', 'cart', 'product-grid', 
      'collection', 'filter', 'hero', 'banner', 'slideshow', 'testimonials',
      'newsletter', 'footer', 'contact', 'blog', 'article'
    ];

    return mobileOptimizationNeeded.some(keyword => 
      sectionName.toLowerCase().includes(keyword)
    );
  }

  /**
   * Check if section should be included in mobile app
   */
  static shouldIncludeInMobileApp(sectionName: string, sectionType: 'section' | 'snippet' | 'template'): boolean {
    // Only include main sections, not snippets or templates
    if (sectionType !== 'section') {
      return false;
    }

    // Core mobile sections that should always be included
    const coreMobileSections = [
      'header', 'navigation', 'menu', 'hero', 'banner', 'slideshow',
      'product-grid', 'products', 'collection', 'featured', 'popular',
      'newsletter', 'footer', 'testimonials', 'reviews', 'about',
      'contact', 'search', 'cart'
    ];

    // Exclude utility sections that don't make sense in mobile
    const excludedSections = [
      'breadcrumbs', 'pagination', 'sidebar', 'filters-desktop',
      'cookie', 'popup', 'modal', 'announcement', 'promo-bar',
      'instagram', 'social-media', 'blog-sidebar', 'search-results',
      'account', 'login', 'register', 'checkout', 'thank-you'
    ];

    const lowerSectionName = sectionName.toLowerCase();
    
    // Exclude if in excluded list
    if (excludedSections.some(excluded => lowerSectionName.includes(excluded))) {
      return false;
    }

    // Include if in core mobile sections
    if (coreMobileSections.some(core => lowerSectionName.includes(core))) {
      return true;
    }

    // For other sections, be more selective
    // Only include if it's clearly a main content section
    const contentPatterns = [
      'main-', 'featured-', 'showcase-', 'gallery-', 'text-', 'image-',
      'video-', 'story-', 'brand-', 'service-', 'benefit-'
    ];

    return contentPatterns.some(pattern => lowerSectionName.includes(pattern));
  }

  /**
   * Convert liquid section to mobile-optimized component
   */
  static convertToMobileComponent(section: LiquidSection): MobileComponent {
    const mobileComponent: MobileComponent = {
      id: section.name,
      name: this.generateMobileName(section.name),
      type: 'section',
      originalSection: section.name,
      settings: section.settings,
      mobileRenderer: this.generateMobileRenderer(section),
      styling: this.optimizeStylingForMobile(section.styling),
      responsive: true,
      touchOptimized: true
    };

    return mobileComponent;
  }

  /**
   * Generate mobile-friendly name for section
   */
  private static generateMobileName(sectionName: string): string {
    const mobileNames: Record<string, string> = {
      'header': 'Mobile Header',
      'product-grid': 'Mobile Product Grid',
      'collection': 'Mobile Collection',
      'hero': 'Mobile Hero Banner',
      'slideshow': 'Mobile Slideshow',
      'newsletter': 'Mobile Newsletter',
      'footer': 'Mobile Footer',
      'cart': 'Mobile Cart',
      'search': 'Mobile Search',
      'navigation': 'Mobile Navigation',
      'menu': 'Mobile Menu'
    };

    return mobileNames[sectionName] || 
           sectionName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Mobile)';
  }

  /**
   * Generate mobile renderer for section
   */
  private static generateMobileRenderer(section: LiquidSection): MobileRenderer {
    const renderer: MobileRenderer = {
      component: this.detectMobileComponentType(section.name),
      props: this.extractPropsFromSettings(section.settings),
      styles: this.generateMobileStyles(section.styling),
      interactions: this.generateMobileInteractions(section.name),
      accessibility: this.generateAccessibilityProps(section.name)
    };

    return renderer;
  }

  /**
   * Detect appropriate mobile component type
   */
  private static detectMobileComponentType(sectionName: string): string {
    const componentMap: Record<string, string> = {
      'header': 'StickyMobileHeader',
      'product-grid': 'TouchProductGrid',
      'collection': 'SwipeableCollection',
      'hero': 'MobileHeroBanner',
      'slideshow': 'TouchSlideshow',
      'newsletter': 'MobileNewsletterSignup',
      'footer': 'CollapsibleMobileFooter',
      'cart': 'MobileCartDrawer',
      'search': 'MobileSearchOverlay',
      'navigation': 'MobileNavigation',
      'menu': 'HamburgerMenu'
    };

    return componentMap[sectionName] || 'MobileSection';
  }

  /**
   * Extract props from section settings
   */
  private static extractPropsFromSettings(settings: SectionSetting[]): Record<string, any> {
    const props: Record<string, any> = {};
    
    settings.forEach(setting => {
      props[setting.id] = {
        type: setting.type,
        label: setting.label,
        default: setting.default,
        options: setting.options
      };
    });

    return props;
  }

  /**
   * Generate mobile-optimized styles
   */
  private static generateMobileStyles(styling: ThemeStyling): Record<string, any> {
    return {
      ...styling,
      // Add mobile-specific optimizations
      touchTarget: '44px', // Minimum touch target size
      fontSize: 'clamp(14px, 4vw, 18px)', // Responsive font size
      lineHeight: '1.5', // Better readability
      padding: '12px 16px', // Touch-friendly padding
      borderRadius: '8px', // Modern mobile styling
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' // Subtle depth
    };
  }

  /**
   * Generate mobile interactions
   */
  private static generateMobileInteractions(sectionName: string): Record<string, any> {
    const interactions: Record<string, any> = {
      swipeable: false,
      draggable: false,
      pullToRefresh: false,
      infiniteScroll: false
    };

    // Add specific interactions based on section type
    if (sectionName.includes('product-grid') || sectionName.includes('collection')) {
      interactions.swipeable = true;
      interactions.infiniteScroll = true;
    }

    if (sectionName.includes('slideshow') || sectionName.includes('hero')) {
      interactions.swipeable = true;
      interactions.draggable = true;
    }

    if (sectionName.includes('cart') || sectionName.includes('menu')) {
      interactions.pullToRefresh = true;
    }

    return interactions;
  }

  /**
   * Generate accessibility props
   */
  private static generateAccessibilityProps(sectionName: string): Record<string, any> {
    return {
      role: this.getAriaRole(sectionName),
      label: this.getAriaLabel(sectionName),
      keyboardNavigation: true,
      screenReaderOptimized: true,
      highContrastSupport: true
    };
  }

  private static getAriaRole(sectionName: string): string {
    const roleMap: Record<string, string> = {
      'header': 'banner',
      'navigation': 'navigation',
      'menu': 'menu',
      'search': 'search',
      'product-grid': 'grid',
      'footer': 'contentinfo',
      'hero': 'banner',
      'slideshow': 'region'
    };

    return roleMap[sectionName] || 'region';
  }

  private static getAriaLabel(sectionName: string): string {
    const labelMap: Record<string, string> = {
      'header': 'Site header',
      'navigation': 'Main navigation',
      'menu': 'Navigation menu',
      'search': 'Product search',
      'product-grid': 'Product grid',
      'footer': 'Site footer',
      'hero': 'Hero banner',
      'slideshow': 'Image slideshow'
    };

    return labelMap[sectionName] || `${sectionName} section`;
  }

  /**
   * Optimize styling for mobile
   */
  private static optimizeStylingForMobile(styling: ThemeStyling): ThemeStyling {
    return {
      ...styling,
      // Add mobile-specific breakpoints
      breakpoints: {
        ...styling.breakpoints,
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px'
      },
      // Optimize spacing for mobile
      spacing: {
        ...styling.spacing,
        'mobile-padding': '16px',
        'mobile-margin': '8px',
        'touch-target': '44px'
      }
    };
  }
}

// Mobile Component Interface
export interface MobileComponent {
  id: string;
  name: string;
  type: 'section' | 'snippet' | 'template';
  originalSection: string;
  settings: SectionSetting[];
  mobileRenderer: MobileRenderer;
  styling: ThemeStyling;
  responsive: boolean;
  touchOptimized: boolean;
}

// Mobile Renderer Interface
export interface MobileRenderer {
  component: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  interactions: Record<string, any>;
  accessibility: Record<string, any>;
}

// Theme Analysis Functions
export class ThemeAnalyzer {
  /**
   * Analyze entire theme structure
   */
  static analyzeTheme(themeFiles: { [filename: string]: string }): ThemeAnalysis {
    const analysis: ThemeAnalysis = {
      sections: [],
      snippets: [],
      templates: [],
      settings: {},
      styling: {
        colors: {},
        fonts: {},
        spacing: {},
        breakpoints: {}
      },
      mobileReadiness: 0
    };

    // Process each file
    Object.entries(themeFiles).forEach(([filename, content]) => {
      const section = LiquidParser.parseLiquidFile(filename, content);
      if (section) {
        switch (section.type) {
          case 'section':
            analysis.sections.push(section);
            break;
          case 'snippet':
            analysis.snippets.push(section);
            break;
          case 'template':
            analysis.templates.push(section);
            break;
        }

        // Merge styling
        analysis.styling = this.mergeStyling(analysis.styling, section.styling);
      }
    });

    // Calculate mobile readiness score
    analysis.mobileReadiness = this.calculateMobileReadiness(analysis);

    return analysis;
  }

  /**
   * Merge styling from multiple sections
   */
  private static mergeStyling(base: ThemeStyling, additional: ThemeStyling): ThemeStyling {
    return {
      colors: { ...base.colors, ...additional.colors },
      fonts: { ...base.fonts, ...additional.fonts },
      spacing: { ...base.spacing, ...additional.spacing },
      breakpoints: { ...base.breakpoints, ...additional.breakpoints },
      customCSS: [base.customCSS, additional.customCSS].filter(Boolean).join('\n')
    };
  }

  /**
   * Calculate mobile readiness score
   */
  private static calculateMobileReadiness(analysis: ThemeAnalysis): number {
    let score = 0;
    const maxScore = 100;

    // Check for mobile-optimized sections
    const mobileOptimizedSections = analysis.sections.filter(s => s.mobileOptimized).length;
    score += (mobileOptimizedSections / analysis.sections.length) * 40;

    // Check for responsive breakpoints
    const hasBreakpoints = Object.keys(analysis.styling.breakpoints).length > 0;
    score += hasBreakpoints ? 20 : 0;

    // Check for touch-friendly elements
    const hasTouchOptimization = analysis.sections.some(s => 
      s.content.includes('touch') || s.content.includes('mobile')
    );
    score += hasTouchOptimization ? 20 : 0;

    // Check for essential mobile sections
    const essentialMobileSections = ['header', 'navigation', 'product-grid', 'cart'];
    const hasEssentialSections = essentialMobileSections.every(essential =>
      analysis.sections.some(s => s.name.includes(essential))
    );
    score += hasEssentialSections ? 20 : 0;

    return Math.min(Math.round(score), maxScore);
  }
}

// Theme Analysis Result Interface
export interface ThemeAnalysis {
  sections: LiquidSection[];
  snippets: LiquidSection[];
  templates: LiquidSection[];
  settings: Record<string, any>;
  styling: ThemeStyling;
  mobileReadiness: number;
} 