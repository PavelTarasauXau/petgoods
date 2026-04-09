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
      "Comfortable and secure carrier for safe travel with your pet.",
    extendedDescription:
      "This carrier meets major airline cabin rules when used as directed. Mesh panels keep air flowing, and the padded floor helps your pet stay calm. Interior leash clip and reinforced seams add safety on the move.",
    highlights: [
      "Dimensions: 18 x 11 x 11 inches",
      "Material: Polyester with Mesh Panels",
      "Weight Limit: Up to 15 lbs",
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
    category: "Toys",
    price: 15.99,
    rating: 5,
    reviews: 5,
    image: product2,
    description: "Durable toy that keeps your dog active and entertained.",
    extendedDescription:
      "Made from non-toxic rubber with a textured surface that helps clean teeth while chewing. Bounces unpredictably to keep fetch games exciting. Rinse with water and let dry between uses.",
    highlights: [
      "Material: 100% Non-Toxic Rubber",
      "Diameter: 3.5 inches",
      "Suitable for: All dog sizes",
    ],
    specs: [
      { label: "Material", value: "Non-Toxic Rubber" },
      { label: "Diameter", value: "3.5 inches" },
      { label: "Suitable For", value: "All dog sizes" },
      { label: "Feature", value: "Teeth-cleaning texture" },
      { label: "Care", value: "Rinse with water" },
    ],
    relatedIds: [3, 5],
  },
  {
    id: 3,
    title: "Multi-Level Cat Scratching Post",
    category: "Cat Furniture",
    price: 89.99,
    rating: 4,
    reviews: 4,
    image: product3,
    description: "A stylish scratching post and play area for cats.",
    extendedDescription:
      "Multiple tiers and sisal-wrapped posts encourage climbing and scratching away from furniture. Stable wide base reduces tipping. Soft perches give cats a place to rest after play.",
    highlights: [
      "Height: 32 inches",
      "Material: Sisal & Plush",
      "Levels: 3 platforms",
    ],
    specs: [
      { label: "Height", value: "32 inches" },
      { label: "Material", value: "Sisal & Plush" },
      { label: "Platforms", value: "3 levels" },
      { label: "Base", value: "Wide anti-tip base" },
      { label: "Assembly", value: "Easy tool-free" },
    ],
    relatedIds: [2, 4],
  },
  {
    id: 4,
    title: "Orthopedic Memory Foam Pet Bed",
    category: "Beds & Rest",
    price: 24.99,
    rating: 4,
    reviews: 3.5,
    image: product4,
    description: "Soft orthopedic bed for better comfort and support.",
    extendedDescription:
      "Memory foam supports joints and helps older pets rest more comfortably. Removable cover is machine washable on a gentle cycle. Non-slip bottom keeps the bed in place on hard floors.",
    highlights: [
      "Size: 30 x 20 inches",
      "Fill: Memory Foam",
      "Cover: Removable & Washable",
    ],
    specs: [
      { label: "Size", value: "30 x 20 inches" },
      { label: "Fill", value: "Memory Foam" },
      { label: "Cover", value: "Removable & Machine Washable" },
      { label: "Base", value: "Non-slip bottom" },
      { label: "Suitable For", value: "Dogs & Cats" },
    ],
    relatedIds: [1, 5],
  },
  {
    id: 5,
    title: "Premium Stainless Steel Dog Bowl",
    category: "Feeding",
    price: 24.99,
    rating: 5,
    reviews: 5,
    image: product5,
    description: "Premium quality bowl for daily feeding and water.",
    extendedDescription:
      "Rust-resistant stainless steel is easy to clean and does not hold odors. Wide shallow shape suits many breeds. Dishwasher safe for quick daily maintenance.",
    highlights: [
      "Capacity: 4 cups",
      "Material: Food-Grade Stainless Steel",
      "Dishwasher Safe",
    ],
    specs: [
      { label: "Capacity", value: "4 cups" },
      { label: "Material", value: "Food-Grade Stainless Steel" },
      { label: "Dishwasher Safe", value: "Yes" },
      { label: "Diameter", value: "7 inches" },
      { label: "Base", value: "Non-slip rubber ring" },
    ],
    relatedIds: [2, 4],
  },
  {
    id: 6,
    title: "Reflective Nylon Dog Leash & Collar Set",
    category: "Walking Gear",
    price: 18.99,
    rating: 4,
    reviews: 4,
    image: product6,
    description: "Reflective set for safe evening walks.",
    extendedDescription:
      "Reflective stitching improves visibility in low light. Adjustable collar and padded handle on the leash add comfort for both you and your dog. Check fit regularly as your pet grows.",
    highlights: [
      "Leash Length: 6 feet",
      "Material: Nylon with Reflective Stitching",
      "Collar: Adjustable 12–20 inches",
    ],
    specs: [
      { label: "Leash Length", value: "6 feet" },
      { label: "Material", value: "Nylon with Reflective Stitching" },
      { label: "Collar Size", value: "Adjustable 12–20 inches" },
      { label: "Hardware", value: "Rust-proof metal clips" },
      { label: "Visibility", value: "Reflective in low light" },
    ],
    relatedIds: [1, 4],
  },
];