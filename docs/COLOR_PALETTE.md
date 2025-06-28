# FlatMates Color Palette & Design System

## 🎨 Primary Brand Colors

### Core Brand Identity
- **Primary Blue**: `#4A90E2` (HSL: 213 94% 68%)
  - Used for: Primary buttons, links, main CTAs
  - Variants: Hover `#3A7BD5`, Active `#2A6BC7`

- **Secondary Orange**: `#FF6B35` (HSL: 24 95% 53%)
  - Used for: Secondary buttons, accents, highlights
  - Variants: Hover `#FF5722`, Active `#E64A19`

- **Accent Emerald**: `#10B981` (HSL: 160 84% 39%)
  - Used for: Success states, positive actions, badges
  - Variants: Hover `#059669`, Active `#047857`

## 🌈 Extended Color System

### Neutral Palette
- **Neutral 50**: `#F8FAFC` - Lightest background
- **Neutral 100**: `#F1F5F9` - Light background
- **Neutral 200**: `#E2E8F0` - Border light
- **Neutral 300**: `#CBD5E1` - Border medium
- **Neutral 400**: `#94A3B8` - Text muted
- **Neutral 500**: `#64748B` - Text secondary
- **Neutral 600**: `#475569` - Text primary
- **Neutral 700**: `#334155` - Text dark
- **Neutral 800**: `#1E293B` - Text darker
- **Neutral 900**: `#0F172A` - Text darkest

### Semantic Colors
- **Success**: `#10B981` - Green for positive actions
- **Warning**: `#F59E0B` - Amber for warnings
- **Error**: `#EF4444` - Red for errors and destructive actions
- **Info**: `#3B82F6` - Blue for informational content

### Surface Colors
- **Primary Surface**: `#FFFFFF` - Main background
- **Secondary Surface**: `#F8FAFC` - Card backgrounds
- **Tertiary Surface**: `#F1F5F9` - Section backgrounds

## 🎯 Usage Guidelines

### Primary Actions
```css
.btn-primary {
  background: linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%);
  color: white;
}
```

### Secondary Actions
```css
.btn-secondary {
  background: linear-gradient(135deg, #FF6B35 0%, #EC4899 100%);
  color: white;
}
```

### Cards & Surfaces
```css
.card-primary {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🏗️ Component Design Tokens

### Typography Scale
- **Display**: 4xl-6xl (36px-60px) - Hero headings
- **Heading 1**: 3xl-4xl (30px-36px) - Page titles
- **Heading 2**: 2xl-3xl (24px-30px) - Section titles
- **Heading 3**: xl-2xl (20px-24px) - Component titles
- **Body Large**: lg (18px) - Important body text
- **Body**: base (16px) - Default body text
- **Body Small**: sm (14px) - Secondary text
- **Caption**: xs (12px) - Labels and captions

### Spacing System (8px base)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px
- **4xl**: 96px

### Border Radius
- **sm**: 8px - Small elements
- **md**: 12px - Medium elements
- **lg**: 16px - Large elements
- **xl**: 24px - Cards
- **2xl**: 32px - Hero sections
- **3xl**: 48px - Special containers
- **full**: 9999px - Pills and circles

### Shadows
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`
- **2xl**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`

## 🎨 Gradient Combinations

### Primary Gradients
- **Hero**: `linear-gradient(135deg, #4A90E2 0%, #8B5CF6 50%, #EC4899 100%)`
- **Button Primary**: `linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)`
- **Button Secondary**: `linear-gradient(135deg, #FF6B35 0%, #EC4899 100%)`

### Background Gradients
- **Page Background**: `linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #FFF7ED 100%)`
- **Section Background**: `linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 100%)`

## 🌟 Interactive States

### Hover States
- **Primary**: Increase brightness by 10%
- **Secondary**: Increase saturation by 5%
- **Scale**: Transform scale(1.02)
- **Shadow**: Increase shadow depth

### Focus States
- **Ring**: 2px solid primary color with 20% opacity
- **Offset**: 2px from element edge

### Active States
- **Primary**: Decrease brightness by 10%
- **Scale**: Transform scale(0.98)

## 📱 Responsive Considerations

### Mobile (< 768px)
- Reduce padding by 25%
- Smaller font sizes
- Simplified gradients for performance

### Tablet (768px - 1024px)
- Standard spacing
- Full gradient effects
- Hover states enabled

### Desktop (> 1024px)
- Full spacing system
- All interactive effects
- Advanced animations

## ♿ Accessibility

### Color Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

### Color Blind Considerations
- Never rely solely on color for information
- Use icons and text labels
- Test with color blind simulators

## 🔧 Implementation

### CSS Custom Properties
```css
:root {
  --color-primary: 213 94% 68%;
  --color-secondary: 24 95% 53%;
  --color-accent: 160 84% 39%;
  /* ... */
}
```

### Tailwind Configuration
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        secondary: 'hsl(var(--color-secondary))',
        accent: 'hsl(var(--color-accent))',
      }
    }
  }
}
```

This color palette ensures consistency across all pages while maintaining visual hierarchy and accessibility standards.