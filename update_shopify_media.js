const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'utils', 'shopify.js');
let content = fs.readFileSync(filePath, 'utf8');

// The media query to insert
const mediaQuery = `
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      format
                      mimeType
                    }
                    previewImage { url }
                  }
                  ... on ExternalVideo {
                    embeddedUrl
                    previewImage { url }
                  }
                }
              }
            }`;

const mediaQuery2 = `
              media(first: 10) {
                edges {
                  node {
                    mediaContentType
                    ... on Video {
                      sources {
                        url
                        format
                        mimeType
                      }
                      previewImage { url }
                    }
                    ... on ExternalVideo {
                      embeddedUrl
                      previewImage { url }
                    }
                  }
                }
              }`;

const mediaQuery3 = `
        media(first: 10) {
          edges {
            node {
              mediaContentType
              ... on Video {
                sources {
                  url
                  format
                  mimeType
                }
                previewImage { url }
              }
              ... on ExternalVideo {
                embeddedUrl
                previewImage { url }
              }
            }
          }
        }`;

// Let's regex replace the images query and append media query right after it
content = content.replace(/images\(first: 10\) \{\s+edges \{\s+node \{\s+url\s+\}\s+\}\s+\}/g, (match) => {
  // Try to match the indentation of the "images" block
  const indentationMatch = match.match(/^(\s+)images/);
  const indent = indentationMatch ? indentationMatch[1] : "            ";
  
  const customMediaQuery = `
${indent}media(first: 10) {
${indent}  edges {
${indent}    node {
${indent}      mediaContentType
${indent}      ... on Video {
${indent}        sources {
${indent}          url
${indent}          format
${indent}          mimeType
${indent}        }
${indent}        previewImage { url }
${indent}      }
${indent}      ... on ExternalVideo {
${indent}        embeddedUrl
${indent}        previewImage { url }
${indent}      }
${indent}    }
${indent}  }
${indent}}`;
  return match + customMediaQuery;
});

// Update normalizeProduct
const normalizeFuncOld = `  const imagesMapped = (node.images?.edges || []).map(edge => edge.node.url);`;
const normalizeFuncNew = `  const imagesMapped = (node.images?.edges || []).map(edge => edge.node.url);
  const mediaMapped = (node.media?.edges || [])
    .map(edge => edge.node)
    .filter(node => node.mediaContentType === 'VIDEO' || node.mediaContentType === 'EXTERNAL_VIDEO');`;

content = content.replace(normalizeFuncOld, normalizeFuncNew);

const returnObjOld = `    images: imagesMapped,`;
const returnObjNew = `    images: imagesMapped,
    media: mediaMapped,`;

content = content.replace(returnObjOld, returnObjNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log("shopify.js updated with media/video queries");
