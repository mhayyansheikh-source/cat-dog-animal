// 1. Hand-written reviews for specific, high-priority products
export const specificReviews = {
  "pets-spray-hair-comb": [
    { name: "Sarah M.", text: "This comb removed so much loose hair! Best grooming tool ever.", rating: 5 },
    { name: "David T.", text: "The spray feature is genius. My cat doesn't run away anymore.", rating: 5 },
    { name: "Emily R.", text: "Good quality, but shipping took a week.", rating: 4 }
  ],
  "dog-car-seat": [
    { name: "Mike L.", text: "Fits perfectly in my SUV. Buster sleeps the whole ride now.", rating: 5 },
    { name: "Jessica W.", text: "Very secure and safe. Highly recommend.", rating: 5 },
    { name: "Tom H.", text: "A bit bulky but does the job well.", rating: 4 }
  ]
};

// 2. A massive pool of generic, but believable reviews
export const fallbackReviewTemplates = [
  "I was skeptical, but the quality of the [PRODUCT_NAME] blew me away.",
  "Shipping was surprisingly fast. The product works exactly as advertised.",
  "My pet is obsessed with this! Best purchase I've made all year.",
  "Customer service was great and the item is very sturdy.",
  "I bought this on a whim and I'm so glad I did. Highly recommend for any pet owner.",
  "It's exactly what I needed. The [PRODUCT_NAME] is super high quality.",
  "Great value for the price. Would buy again.",
  "My dog loves the [PRODUCT_NAME] so much. Fast delivery too!",
  "Works perfectly. No complaints here.",
  "Five stars! The [PRODUCT_NAME] exceeded my expectations."
];

// 3. A pool of believable reviewer names
export const fallbackNames = ["Jessica W.", "Amanda B.", "Chris P.", "Mark D.", "Lisa K.", "Tom H.", "Ryan C.", "Samantha T.", "Kevin J.", "Michelle L."];

// A simple function that turns a string (like a product handle) into a consistent number
export function getStringSeed(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getProductReviews(productHandle, productTitle) {
  // Step 1: Check if you have hand-written reviews for this product
  if (specificReviews[productHandle] && specificReviews[productHandle].length > 0) {
    return specificReviews[productHandle];
  }

  // Step 2: If no specific reviews exist, generate consistent random ones
  const generatedReviews = [];
  
  // Use the product handle to create a fixed "seed" number
  let seed = getStringSeed(productHandle);
  
  // Fallback title if undefined
  const safeTitle = productTitle || "product";

  // Generate exactly 3 reviews
  for (let i = 0; i < 3; i++) {
    const nameIndex = (seed + i) % fallbackNames.length;
    const templateIndex = (seed * i + i) % fallbackReviewTemplates.length;
    
    let reviewText = fallbackReviewTemplates[templateIndex];
    reviewText = reviewText.replace(/\[PRODUCT_NAME\]/g, safeTitle.toLowerCase());

    generatedReviews.push({
      name: fallbackNames[nameIndex],
      text: reviewText,
      rating: ((seed + i) % 5 === 0) ? 4 : 5 
    });
  }

  return generatedReviews;
}
