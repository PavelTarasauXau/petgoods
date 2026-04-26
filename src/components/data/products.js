import product1 from "../../assets/product-1.jpg";
import product2 from "../../assets/product-2.jpg";
import product3 from "../../assets/product-3.jpg";
import product4 from "../../assets/product-4.jpg";
import product5 from "../../assets/product-5.jpg";
import product6 from "../../assets/product-6.jpg";

export const products = [
  {
    id: 1,
    title: "Airline-Approved Pet Travel Carrier",
    category: "Travel & Carriers",
    price: 54.99,
    rating: 4,
    reviews: 3.5,
    image: product1,
    description:
      "Soft-sided pet carrier approved for airline cabin use. Features mesh panels for ventilation, padded shoulder strap, and collapsible design for easy storage. Interior fleece pad provides comfort. Meets TSA requirements for in-cabin pet travel.",
    extendedDescription:
      "This carrier meets major airline cabin rules when used as directed. Mesh panels keep air flowing, and the padded floor helps your pet stay calm. Interior leash clip and reinforced seams add safety on the move.",
    highlights: [
      "Dimensions: 18 x 11 x 11 inches",
      "Material: Polyester with Mesh Panels",
      "Weight limit: Up to 15 lbs",
      //"AIRLINE APPROVED: Yes (TSA Compilant)",
      //"FEATURES: Collapsible, Padded Strap",
    ],
    specs: [
      { label: "Dimensions", value: "18 x 11 x 11 inches" },
      { label: "Material", value: "Polyester with Mesh Panels" },
      { label: "Weight Limit", value: "Up to 15 lbs" },
      { label: "Airline Approved", value: "Yes (TSA Compliant)" },
      { label: "Features", value: "Collapsible, Padded Strap" },
    ],
    relatedIds: [2, 4],
  },
  {
    id: 2,
    title: "Interactive Rubber Chew Ball",
    category: "Toys & Scratchers",
    price: 15.99,
    rating: 5,
    reviews: 5,
    image: product2,
    description:
      "Durable rubber chew ball designed for aggressive chewers. Features textured surface for dental health and can be filled with treats for extended playtime. Bounces unpredictably for exciting fetch games. Non-toxic, BPA-free rubber material.",
    extendedDescription:
      "Made from non-toxic rubber with a textured surface that helps clean teeth while chewing. Bounces unpredictably to keep fetch games exciting. Rinse with water and let dry between uses.",
    highlights: [
      "Diameter: 3.5 inches",
      "Material: 100% Non-Toxic Rubber",
      "Treat Compartment: Yes",
    ],
    specs: [
      { label: "Diameter", value: "3.5 inches" },
      { label: "Material", value: "Natural Rubber" },
      { label: "Treat Compartment", value: "Yes" },
      { label: "Safety", value: "BPA-Free, Non - Toxic" },
      { label: "Suitable for", value: "All Dog Sizes" },
    ],
    relatedIds: [3, 5],
  },
  {
    id: 3,
    title: "Multi-Level Cat Scratching Post",
    category: "Toys & Scratchers",
    price: 89.99,
    rating: 4,
    reviews: 4,
    image: product3,
    description:
      "Three-tier cat scratching post with sisal rope wrapping and plush platforms. Provides multiple levels for climbing, scratching, and resting. Sturdy base ensures stability during active play. Natural jute fibers satisfy your cat's scratching instincts.",
    extendedDescription:
      "Multiple tiers and sisal-wrapped posts encourage climbing and scratching away from furniture. Stable wide base reduces tipping. Soft perches give cats a place to rest after play.",
    highlights: [
      "Height: 38 inches",
      "Base dimensions: 20 × 20",
      "Material: Sisal Rope & Plush Fabric",
    ],
    specs: [
      { label: "Height", value: "38 inches" },
      { label: "Base dimensions", value: "20 × 20" },
      { label: "Material", value: "Sisal Rope & Plush Fabric" },
      { label: "Platforms", value: "3 Levels" },
      { label: "Weight capacity", value: "Up to 25 lbs per platform" },
    ],
    relatedIds: [2, 4],
  },
  {
    id: 4,
    title: "Orthopedic Memory Foam Pet Bed",
    category: "Beds & Furniture",
    price: 69.99,
    rating: 4,
    reviews: 3.5,
    image: product4,
    description:
      "Luxurious memory foam pet bed with removable, machine-washable cover. Provides superior support for senior pets and those with joint issues. Water-resistant liner protects the foam core. Available in multiple sizes to fit all breeds.",
    extendedDescription:
      "Memory foam supports joints and helps older pets rest more comfortably. Removable cover is machine washable on a gentle cycle. Non-slip bottom keeps the bed in place on hard floors.",
    highlights: [
      "Size: Large (40 x 28 inches)",
      "Foam Thickness: 4 inches",
      "Cover Material: Microfiber",
    ],
    specs: [
      { label: "Size", value: "30 x 20 inches" },
      { label: "Foam thickness", value: "4 inches" },
      { label: "Cover material", value: "Microfiber" },
      { label: "Washing", value: "Mashine Washable Cover" },
      { label: "Weight", value: "8 lbs" },
    ],
    relatedIds: [1, 5],
  },
  {
    id: 5,
    title: "Premium Stainless Steel Dog Bowl",
    category: "Bowls & Feeders",
    price: 24.99,
    rating: 5,
    reviews: 5,
    image: product5,
    description:
      "Durable stainless steel dog bowl designed for medium to large breeds. Non-slip rubber base prevents sliding and spillage. Dishwasher safe and rust-resistant for long-lasting use. Perfect for both food and water.",
    extendedDescription:
      "Rust-resistant stainless steel is easy to clean and does not hold odors. Wide shallow shape suits many breeds. Dishwasher safe for quick daily maintenance.",
    highlights: [
      "Material: Stainless Steel",
      "Capacity: 64 oz (1.9 L)",
      "Diameter: 8.5 inches",
    ],
    specs: [
      { label: "Material", value: "Stainless Steel" },
      { label: "Capacity", value: "64 oz (1.9 L)" },
      { label: "Diameter", value: "8,5 inches" },
      { label: "Care", value: "Dishwasher Safe" },
      { label: "Weight", value: "1.2 lbs" },
    ],
    relatedIds: [2, 4],
  },
  {
    id: 6,
    title: "Reflective Nylon Dog Leash & Collar Set",
    category: "Leashers & Collars",
    price: 32.99,
    rating: 4,
    reviews: 4,
    image: product6,
    description:
      "High-visibility reflective dog leash and collar set perfect for evening walks. Durable nylon construction with reinforced stitching. Quick-release buckle and adjustable sizing for a perfect fit. Includes sturdy metal D-ring for tag attachment.",
    extendedDescription:
      "Reflective stitching improves visibility in low light. Adjustable collar and padded handle on the leash add comfort for both you and your dog. Check fit regularly as your pet grows.",
    highlights: [
      "Leash Length: 6 feet",
      "Material: Nylon with Reflective Stitching",
      "Collar Size: Adjustable 14–20 inches",
    ],
    specs: [
      { label: "Leash Length", value: "6 feet" },
      { label: "Material", value: "Nylon with Reflective Stitching" },
      { label: "Collar Size", value: "Adjustable 12–20 inches" },
      { label: "Hardware", value: "Metal D-ring & Clasp" },
      { label: "Suitable for", value: "Medium to Large Dogs" },
    ],
    relatedIds: [1, 4],
  },
];
