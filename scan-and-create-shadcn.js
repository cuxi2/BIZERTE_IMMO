#!/usr/bin/env node

/**
 * Scan your Next.js project for missing shadcn/ui components
 * and auto-generate simple placeholders for them.
 *
 * Usage:
 *   node scan-and-create-shadcn.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const srcPath = path.join(projectRoot, 'src');
const componentsDir = path.join(srcPath, 'components', 'ui');

// List of shadcn components you expect to use
const expectedComponents = [
  'badge',
  'button',
  'card',
  'input',
  'select',
  'alert',
  'dialog',
  'form',
  'label',
  'textarea',
  'tabs',
  'table',
  'checkbox',
  'switch',
  'popover',
  'calendar',
  'skeleton',
  'separator',
  'navigation-menu',
  'sonner',
  'toast'
  // add more if needed
];

// Boilerplate template for each missing component
function getComponentTemplate(name) {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  return `import * as React from "react"

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {}

export function ${componentName}({ className, ...props }: ${componentName}Props) {
  return (
    <div className={\`inline-flex items-center px-2 py-1 rounded text-sm font-medium border border-gray-300 \${className}\`} {...props}>
      ${componentName}
    </div>
  )
}
`;
}

// Ensure the components/ui directory exists
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
  console.log(`Created directory: ${componentsDir}`);
}

let created = 0;
for (const comp of expectedComponents) {
  const filePath = path.join(componentsDir, `${comp}.tsx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, getComponentTemplate(comp), 'utf8');
    console.log(`Created missing component: ${filePath}`);
    created++;
  }
}

if (created === 0) {
  console.log('No missing components found. All expected Shadcn components already exist.');
} else {
  console.log(`Generated ${created} missing component(s) in ${componentsDir}`);
}