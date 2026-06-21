const { getShopifyMenu } = require('./src/utils/shopify.js');

async function test() {
  const mainMenu = await getShopifyMenu('main-menu');
  const footerMenu = await getShopifyMenu('footer');
  console.log('Main menu:', JSON.stringify(mainMenu, null, 2));
  console.log('Footer menu:', JSON.stringify(footerMenu, null, 2));
}

test();
