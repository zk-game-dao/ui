# @zk-game-dao/ui: UI Component Library for Internet Computer dApps

The UI library serves as the foundational design system and component library for all zk-game-dao projects on the Internet Computer Protocol (ICP). This unified solution ensures visual consistency, accelerates development, and establishes a cohesive brand identity across our ecosystem of dApps. By centralizing UI components, theming, and styling utilities, the library enables teams to focus on business logic while delivering polished, professional interfaces that provide users with a familiar experience across all zk-game-dao applications

## 🌟 Features

- **React Components**: Collection of reusable UI components designed for crypto and gaming applications
- **Theme System**: Support for multiple themes with consistent design language
- **Tailwind Integration**: Pre-configured Tailwind CSS setup with custom utilities and components
- **Context Providers**: React context providers for theming, configuration, and modal management
- **Responsive Design**: Mobile-friendly components that work across different screen sizes
- **Custom Hooks**: Utility hooks for common UI interactions and state management

## 🏗️ Architecture Overview

The library uses a modular architecture designed for flexibility, customization, and ease of integration:

### Core Components

- **UI Components**: Reusable interface elements built with React and Tailwind
- **Context Providers**: State management for theming and application configuration
- **Hooks & Utilities**: Helper functions and React hooks for common UI operations
- **Styling System**: Custom Tailwind configuration with extended utilities

## 🛠️ Technical Components

### UI Library Structure

```
@zk-game-dao/ui
├── src/
│   ├── components/   # UI components
│   ├── context/      # React context providers 
│   ├── data/         # Data models and constants
│   ├── env/          # Environment configuration
│   ├── hooks/        # React hooks
│   ├── utils/        # Utility functions
├── assets/           # Static assets 
├── styles.css        # Core CSS styles
├── tailwind.config.ts # Tailwind configuration
```

## 📋 Prerequisites

- Node.js (version 18 or later)
- React (version 19 or later)
- Internet Computer SDK (dfx version 0.24.2 or later)
- Tailwind CSS (version 4.0.5 or later)

## 🚀 Getting Started

### Installation

```bash
npm install @zk-game-dao/ui
```

### Basic Usage

1. Import and wrap your application with the UI context provider:

```jsx
import { ProvideUI } from '@zk-game-dao/ui';

function App() {
  return (
    <ProvideUI>
      <YourApplication />
    </ProvideUI>
  );
}
```

2. Setup Tailwind CSS in your project:

Create a `tailwind.config.ts` file:

```typescript
// tailwind.config.ts
import { BuildConfig } from "@zk-game-dao/ui/tailwind.config.ts";

export default BuildConfig();
```

Create a CSS file that imports the UI library styles:

```css
/* styles.css */
@config './tailwind.config.ts';

@import "@zk-game-dao/ui/styles.css";
```

3. Use UI components in your application:

```jsx
import { Button, Card } from '@zk-game-dao/ui';

function MyComponent() {
  return (
    <Card>
      <h2 className="type-title">Welcome!</h2>
      <p className="type-body">This is a sample component using the UI library.</p>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

### Theme System

The UI library supports multiple themes that can be configured and switched at runtime:

```jsx
import { useTheme } from '@zk-game-dao/ui';

function ThemeSwitcher() {
  const { setTheme, currentTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(currentTheme === 'zkpoker' ? 'purepoker' : 'zkpoker')}>
      Toggle Theme
    </button>
  );
}
```

### Typography

The library includes predefined typography classes:

```jsx
<p className="type-display">Display text</p>
<p className="type-header">Header text</p>
<p className="type-title">Title text</p>
<p className="type-body">Body text</p>
<p className="type-callout">Callout text</p>
<p className="type-footnote">Footnote text</p>
```


## 💻 Core Components

### UI Components

The library provides various UI components:

- Buttons
- Cards
- Modals
- Form inputs
- Navigation elements
- Layout components

### Context Providers

```jsx
// Theme provider
<ProvideTheme isDark>
  {children}
</ProvideTheme>

// Modal stack provider
<ProvideModalStack>
  {children}
</ProvideModalStack>

// Config provider
<ProvideConfig>
  {children}
</ProvideConfig>

// All-in-one UI provider
<ProvideUI>
  {children}
</ProvideUI>
```

### Environment Utilities

```typescript
import { environment, IsDev, SelectEnv } from '@zk-game-dao/ui';

// Check if running in development mode
if (IsDev) {
  console.log('Running in development');
}

// Environment-specific configuration
const apiEndpoint = SelectEnv({
  development: 'http://localhost:4943',
  staging: 'https://staging.example.com',
  production: 'https://production.example.com'
});
```

## 📁 Library Structure

```
.
├── package.json               # Package configuration
├── assets/                    # Static assets 
├── styles.css                 # Core CSS styles
├── tailwind.config.ts         # Tailwind configuration
├── src/                       # Source code
│   ├── components/            # UI components
│   │   ├── buttons/           # Button components
│   │   ├── cards/             # Card components
│   │   ├── forms/             # Form components
│   │   └── ...                # Other component categories
│   ├── context/               # React context providers
│   │   ├── theme.context.tsx  # Theme context
│   │   ├── modal-stack.context.tsx # Modal stack context
│   │   └── ...                # Other contexts
│   ├── data/                  # Data models and constants
│   ├── env/                   # Environment configuration
│   ├── hooks/                 # React hooks
│   └── utils/                 # Utility functions
```

## 🔄 Usage Examples

### Using UI Components

```jsx
import { Button, Card, TextField } from '@zk-game-dao/ui';

function LoginForm() {
  return (
    <Card className="p-6">
      <h2 className="type-header mb-4">Login</h2>
      <TextField 
        label="Username" 
        placeholder="Enter your username"
        className="mb-4"
      />
      <TextField 
        label="Password" 
        type="password"
        placeholder="Enter your password"
        className="mb-6"
      />
      <Button variant="primary" fullWidth>
        Sign In
      </Button>
    </Card>
  );
}
```

### Working with Themes

```jsx
import { useTheme } from '@zk-game-dao/ui';

function ThemeAwareComponent() {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`${currentTheme === 'zkpoker' ? 'bg-purple-500' : 'bg-orange-500'} p-4 rounded-lg`}>
      <p>This component adapts to the current theme: {currentTheme}</p>
    </div>
  );
}
```

## 🛣️ Roadmap

- [ ] Add more component variations
- [ ] Add accessibility features
- [ ] Create comprehensive documentation website
- [ ] Add visual regression testing

## 🤝 Contributing

Contributions are welcome! Please read our Contributing Guide for details on our code of conduct and the process for submitting pull requests.
