export const testimonials = [
  ...Array.from({ length: 100 }).map((_, i) => {
    const cities = ["Austin, TX", "Seattle, WA", "Miami, FL", "Denver, CO", "Portland, OR", "Chicago, IL", "New York, NY", "Los Angeles, CA", "San Diego, CA", "Dallas, TX", "Atlanta, GA", "Boston, MA", "Phoenix, AZ", "Houston, TX", "San Francisco, CA"];
    const names = ["Sarah", "Michael", "Emma", "James", "Olivia", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Charlotte", "Alexander", "Amelia", "Jack", "Evelyn", "Daniel", "Abigail", "Matthew"];
    const lastInitials = ["M.", "K.", "L.", "R.", "S.", "T.", "P.", "D.", "W.", "C.", "B.", "G.", "H."];
    const pets = ["Dog mom to Max", "Cat dad to Mochi", "Pet parent of Bella", "Dog dad to Charlie", "Cat mom to Luna", "Pet parent of Daisy", "Dog mom to Cooper", "Cat dad to Oliver"];
    const avatars = ["👩", "👨", "👱‍♀️", "👱‍♂️", "👵", "👴", "👩‍🦰", "👨‍🦱", "👩‍🦳", "👨‍🦳"];

    const templates = [
      "My {petType} had terrible joint pain. After 3 weeks on the Hip & Joint chews, they're back to running around! I can't believe the difference.",
      "My {petType} is incredibly picky, but absolutely loves this. Their coat has never looked shinier.",
      "The calming product has been a game-changer. Our anxious {petType} used to hide — now they just sleep through the storm. Completely transformed our home.",
      "Fantastic quality! I've tried so many brands for my {petType}, but Peteora is by far the best.",
      "Fast shipping to {city} and the product is exactly as described. My {petType} is so happy!",
      "I was skeptical at first, but the results speak for themselves. Highly recommend for any {petType} owner.",
      "Great customer service and amazing products. My {petType} refuses to eat anything else now.",
      "A must-have for your {petType}. I've noticed such a positive change in their energy levels.",
      "Absolutely love the ingredients. It feels good knowing I'm giving my {petType} the best.",
      "Five stars! My {petType} is obsessed, and I'm thrilled with the fast delivery."
    ];

    // Use modulo for deterministic pseudo-randomness based on index i so we get a consistent 100 items
    const name = names[i % names.length];
    const initial = lastInitials[i % lastInitials.length];
    const city = cities[i % cities.length];
    const pet = pets[i % pets.length];
    const avatar = avatars[i % avatars.length];
    const template = templates[i % templates.length];
    
    const isDog = pet.toLowerCase().includes("dog");
    const petType = isDog ? "dog" : "cat";
    
    const text = template.replace("{petType}", petType).replace("{city}", city);

    return {
      id: i + 1,
      stars: "★★★★★",
      text,
      avatar,
      name: `${name} ${initial}`,
      pet: `${pet} - ${city}`
    };
  })
];
