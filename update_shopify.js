const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'utils', 'shopify.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Map variant image
content = content.replace(
  /sku: v\.sku \|\| ""\n\s*\};\n\s*\}\);/,
  'sku: v.sku || "",\n      image: v.image?.url || null\n    };\n  });'
);

// 2. Add @inContext(country: US) to queries
content = content.replace(/query\s+(\w+)\s*\{/g, 'query $1 @inContext(country: US) {');
content = content.replace(/query\s+(\w+)\(([^)]+)\)\s*\{/g, 'query $1($2) @inContext(country: US) {');

// 3. Add image { url } to variants
content = content.replace(
  /availableForSale\n\s*sku\n\s*\}/g,
  'availableForSale\n                  sku\n                  image {\n                    url\n                  }\n                }'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('shopify.js updated successfully!');
