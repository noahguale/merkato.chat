# Simple Command Menu

A simplified, reusable command menu component extracted from the original command-menu.tsx, keeping all the beautiful styling while removing project-specific functionality.

## Features

- ✨ **Beautiful Design**: Retains all the original styling and visual design
- 🔍 **Search Functionality**: Built-in search/filter capabilities
- ⌨️ **Keyboard Navigation**: Full keyboard support with ⌘K/Ctrl+K shortcuts
- 📱 **Responsive**: Works on desktop and mobile
- 🎨 **Customizable**: Easy to customize with props
- 🚀 **Simple API**: Clean, straightforward interface

## Usage

### Basic Usage

```tsx
import { SimpleCommandMenu } from '@/components/simple-command-menu'
import { MessageSquarePlus, Settings } from 'lucide-react'

const items = [
  {
    id: 'new-chat',
    label: 'New Chat',
    icon: <MessageSquarePlus className="size-4" />,
    action: () => window.location.href = '/chat',
    keywords: ['chat', 'new', 'conversation']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="size-4" />,
    action: () => window.location.href = '/settings',
    keywords: ['settings', 'config']
  }
]

function MyComponent() {
  return (
    <SimpleCommandMenu
      placeholder="Search commands..."
      triggerText="Search..."
      items={items}
      onItemSelect={(item) => console.log('Selected:', item)}
    />
  )
}
```

### Advanced Usage

```tsx
function AdvancedExample() {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleItemSelect = (item: CommandMenuItemData) => {
    // Custom logic when item is selected
    console.log('Selected item:', item)
    
    // Close menu if needed
    setIsOpen(false)
  }

  return (
    <SimpleCommandMenu
      open={isOpen}
      onOpenChange={setIsOpen}
      placeholder="Type to search..."
      triggerText="Open command palette..."
      triggerClassName="max-w-md bg-gray-100"
      items={complexItems}
      onItemSelect={handleItemSelect}
    />
  )
}
```

## Props

### SimpleCommandMenuProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `"Search..."` | Placeholder text for search input |
| `items` | `CommandMenuItemData[]` | `[]` | Array of menu items |
| `onItemSelect` | `(item: CommandMenuItemData) => void` | - | Callback when item is selected |
| `triggerClassName` | `string` | - | Additional CSS classes for trigger button |
| `triggerText` | `string` | `"Search..."` | Text displayed on trigger button |
| `...props` | `DialogProps` | - | All other props passed to Dialog |

### CommandMenuItemData

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the item |
| `label` | `string` | ✅ | Display text for the item |
| `icon` | `React.ReactNode` | - | Icon to display before label |
| `action` | `() => void` | - | Function to execute when selected |
| `keywords` | `string[]` | - | Additional search keywords |

## Keyboard Shortcuts

- **⌘K / Ctrl+K**: Open command menu
- **Escape**: Close menu
- **↑/↓**: Navigate items
- **Enter**: Select highlighted item
- **Type**: Filter items by search

## Styling

The component uses the same styling classes as the original:

- Modern, clean design with rounded corners
- Subtle shadows and borders
- Dark mode support
- Smooth animations
- Responsive layout

### Custom Styling

You can customize the appearance using the `triggerClassName` prop:

```tsx
<SimpleCommandMenu
  triggerClassName="bg-blue-100 text-blue-900 border-blue-200"
  // ... other props
/>
```

## Examples

### Navigation Menu

```tsx
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="size-4" />,
    action: () => router.push('/dashboard'),
    keywords: ['home', 'main']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart className="size-4" />,
    action: () => router.push('/analytics'),
    keywords: ['stats', 'data', 'metrics']
  }
]
```

### Quick Actions

```tsx
const quickActions = [
  {
    id: 'export-data',
    label: 'Export Data',
    icon: <Download className="size-4" />,
    action: () => exportData(),
    keywords: ['export', 'download', 'save']
  },
  {
    id: 'import-data',
    label: 'Import Data',
    icon: <Upload className="size-4" />,
    action: () => openImportDialog(),
    keywords: ['import', 'upload', 'load']
  }
]
```

## Migration from Original

If you're migrating from the original command-menu.tsx:

1. **Remove complex props**: No more `tree`, `colors`, `blocks`
2. **Simplify items**: Use the new `CommandMenuItemData` structure
3. **Update callbacks**: Use `onItemSelect` instead of router logic
4. **Remove external deps**: No more `useConfig`, etc.

### Before (Original)
```tsx
<CommandMenu
  tree={pageTree}
  colors={colorPalette}
  blocks={componentBlocks}
/>
```

### After (Simplified)
```tsx
<SimpleCommandMenu
  items={myItems}
  onItemSelect={handleSelection}
  placeholder="Search..."
/>
```

## Dependencies

- `@radix-ui/react-dialog`
- `cmdk`
- `lucide-react`
- Your existing UI components (`Button`, `Command`, etc.)

## Notes

- The component maintains the exact same visual styling as the original
- Search functionality is built-in and works with item labels and keywords
- Keyboard navigation follows standard command palette patterns
- The component is fully accessible with proper ARIA attributes