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

// 3. Separate First Names and Last Initials to create massive combinations
export const firstNames = [
  "Sarah", "David", "Emily", "Michael", "Jessica", "Chris", "Amanda", 
  "Matthew", "Ashley", "Josh", "Megan", "Andrew", "Rachel", "Daniel", 
  "Lauren", "Justin", "Nicole", "Kevin", "Brittany", "Brian"
];
export const lastInitials = ["A.", "B.", "C.", "D.", "F.", "G.", "H.", "K.", "L.", "M.", "P.", "R.", "S.", "T.", "W."];

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
  let seed = getStringSeed(productHandle);
  const safeTitle = productTitle || "product";

  // HELPER FUNCTION: Generates a consistent random name based on a seed
  const generateName = (nameSeed) => {
    const first = firstNames[nameSeed % firstNames.length];
    const last = lastInitials[(nameSeed * 2) % lastInitials.length];
    return `${first} ${last}`;
  };

  // Step 1: Check for hand-written reviews
  if (specificReviews[productHandle] && specificReviews[productHandle].length > 0) {
    return specificReviews[productHandle].map((review, index) => {
      return {
        ...review,
        // If the review doesn't have a name, generate one using the product seed + review index
        name: review.name ? review.name : generateName(seed + index)
      };
    });
  }

  // Step 2: Generate random fallback reviews for new products
  const generatedReviews = [];

  for (let i = 0; i < 3; i++) {
    const templateIndex = (seed * i + i) % fallbackReviewTemplates.length;
    
    let reviewText = fallbackReviewTemplates[templateIndex];
    reviewText = reviewText.replace(/\[PRODUCT_NAME\]/g, safeTitle.toLowerCase());

    generatedReviews.push({
      // Dynamically generate a name using the combinatorics function
      name: generateName(seed + i),
      text: reviewText,
      rating: ((seed + i) % 5 === 0) ? 4 : 5 
    });
  }

  return generatedReviews;
}
