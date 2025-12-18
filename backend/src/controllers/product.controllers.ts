import { Request, Response } from "express";
import Product from "../models/product.model";

// --- 1. SEED DATA 
const productsToSeed = [
  {
    id: 1,
    image: "/Hero/Product1.avif", // Renamed from 'img' to 'image' for DB consistency
    price: 2499,
    name: "Oversized Street Hoodie",
    slug: "oversized-street-hoodie",
    description: "The ultimate staple for your streetwear rotation. Crafted from heavyweight 400gsm French Terry cotton, this hoodie features a dropped shoulder design and a boxy fit that drapes perfectly. Pre-shrunk to maintain its shape wash after wash.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Grey"],
    stock: 50,
    category: "Hoodies"
  },
  {
    id: 2,
    image: "/Hero/Product2.avif",
    price: 1899,
    name: "Classic Beige Knit",
    slug: "classic-beige-knit",
    description: "Timeless elegance meets modern comfort. This knit is spun from a soft Merino wool blend that provides warmth without the itch. Features a ribbed crewneck and cuffs for a refined silhouette suitable for office or casual wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "Cream", "Taupe"],
    stock: 30,
    category: "Knits"
  },
  {
    id: 3,
    image: "/Hero/Product3.avif",
    price: 2100,
    name: "Urban Cargo Sweatshirt",
    slug: "urban-cargo-sweatshirt",
    description: "Utility meets comfort. This sweatshirt features tactical nylon pockets on the sleeve and chest, blending technical functionality with everyday fleece comfort. Perfect for the modern explorer.",
    sizes: ["M", "L", "XL"],
    colors: ["Olive", "Black", "Navy"],
    stock: 25,
    category: "Sweatshirts"
  },
  {
    id: 4,
    image: "/Hero/Product4.avif",
    price: 1599,
    name: "Signature Fleece Pullover",
    slug: "signature-fleece-pullover",
    description: "Our best-selling pullover. Made with our proprietary CloudSoft™ fleece lining, it offers unmatched coziness. Finished with minimal branding on the chest for a clean, understated look.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Heather Grey"],
    stock: 100,
    category: "Pullovers"
  },
  {
    id: 5,
    image: "/Hero/Product2.avif",
    price: 1299,
    name: "Essential Crewneck",
    slug: "essential-crewneck",
    description: "A wardrobe fundamental. This crewneck is cut from breathable loopback cotton, making it perfect for layering year-round. Features durable double-stitched seams and a relaxed fit.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "White", "Forest Green"],
    stock: 60,
    category: "Crewnecks"
  },
  {
    id: 6,
    image: "/Hero/Product1.avif",
    price: 2800,
    name: "Vintage Cable Knit",
    slug: "vintage-cable-knit",
    description: "Inspired by heritage patterns, this chunky cable knit brings retro charm to your winter wardrobe. Made from 100% thick-gauge wool for maximum insulation against the cold.",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Mustard", "Burgundy"],
    stock: 15,
    category: "Knits"
  },
  {
    id: 7,
    image: "/Hero/Product2.avif",
    price: 3200,
    name: "Striped Wool Cardigan",
    slug: "striped-wool-cardigan",
    description: "Elevate your layering game with this sophisticated cardigan. Features a bold stripe pattern and premium button closures. The wool-cashmere blend ensures a luxurious hand-feel.",
    sizes: ["M", "L", "XL"],
    colors: ["Navy/White", "Black/Grey"],
    stock: 20,
    category: "Cardigans"
  },
  {
    id: 8,
    image: "/Hero/Product3.avif",
    price: 1999,
    name: "Thermal Zip-Up Hoodie",
    slug: "thermal-zip-up-hoodie",
    description: "Built for the outdoors. This zip-up features a waffle-knit thermal lining that traps body heat. Equipped with a heavy-duty YKK zipper and reinforced elbows for durability.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Black", "Olive"],
    stock: 40,
    category: "Hoodies"
  },
  {
    id: 9,
    image: "/Hero/Product4.avif",
    price: 1450,
    name: "Soft Cotton Turtleneck",
    slug: "soft-cotton-turtleneck",
    description: "Sophistication made simple. A lightweight turtleneck ideal for wearing under blazers or coats. The high-stretch cotton fabric ensures a snug fit that never feels restrictive.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "White", "Beige"],
    stock: 35,
    category: "Tops"
  },
  {
    id: 10,
    image: "/Hero/Product2.avif",
    price: 2299,
    name: "Graphic Print Hoodie",
    slug: "graphic-print-hoodie",
    description: "Make a statement. Features high-density screen printing on the back and chest. The oversized fit and heavyweight fabric give it a premium streetwear feel.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    stock: 45,
    category: "Hoodies"
  },
  {
    id: 11,
    image: "/Hero/Product1.avif",
    price: 1799,
    name: "Monochrome Ribbed Sweater",
    slug: "monochrome-ribbed-sweater",
    description: "Modern minimalism. This sweater features a unique vertical rib texture that elongates the frame. The mock-neck collar adds a contemporary touch to a classic silhouette.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Grey", "Black", "Slate Blue"],
    stock: 25,
    category: "Sweaters"
  },
  {
    id: 12,
    image: "/Hero/Product2.avif",
    price: 3999,
    name: "Heavyweight Winter Parka",
    slug: "heavyweight-winter-parka",
    description: "Conquer the elements. Our heaviest jacket features a water-resistant shell and synthetic down insulation. Includes a faux-fur lined hood and multiple secure pockets.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Army Green"],
    stock: 10,
    category: "Jackets"
  },
  {
    id: 13,
    image: "/Hero/Product3.avif",
    price: 1650,
    name: "Casual V-Neck Pullover",
    slug: "casual-v-neck-pullover",
    description: "The perfect transition piece. This V-neck is lightweight enough for spring but warm enough for cool evenings. The relaxed neckline allows for easy layering over collared shirts.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Grey", "Burgundy"],
    stock: 55,
    category: "Pullovers"
  },
  {
    id: 14,
    image: "/Hero/Product4.avif",
    price: 1199,
    name: "Cropped Knit Top",
    slug: "cropped-knit-top",
    description: "Trendy and playful. This cropped knit pairs perfectly with high-waisted denim. The dropped shoulder and wide sleeves create a relaxed, effortless vibe.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pink", "White", "Mint"],
    stock: 30,
    category: "Tops"
  },
  {
    id: 15,
    image: "/Hero/Product2.avif",
    price: 2599,
    name: "Textured Fleece Jacket",
    slug: "textured-fleece-jacket",
    description: "Texture is everything. This high-pile fleece jacket offers incredible warmth and a distinct rugged look. Features contrasting nylon patches on the chest pocket.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Brown", "Black"],
    stock: 20,
    category: "Jackets"
  },
  {
    id: 16,
    image: "/Hero/Product1.avif",
    price: 2150,
    name: "Retro Colorblock Hoodie",
    slug: "retro-colorblock-hoodie",
    description: "90s nostalgia reimagined. This hoodie features bold color-blocking panels sewn together, not printed, for a high-quality finish. A standout piece for your casual rotation.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi-Color", "Blue/Red", "Green/Cream"],
    stock: 15,
    category: "Hoodies"
  },
  {
    id: 17,
    image: "/Hero/Product2.avif",
    price: 3499,
    name: "Premium Cashmere Blend",
    slug: "premium-cashmere-blend",
    description: "The ultimate luxury. Blending Grade-A cashmere with silk, this sweater offers an impossibly soft touch. Designed for those who appreciate the finer things in life.",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Charcoal", "Camel"],
    stock: 5,
    category: "Luxury"
  },
  {
    id: 18,
    image: "/Hero/Product3.avif",
    price: 1850,
    name: "Sporty Performance Zip",
    slug: "sporty-performance-zip",
    description: "Engineered for movement. Made from moisture-wicking technical fabric with 4-way stretch. Ideal for warm-ups, cool-downs, or active weekends.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Neon Green"],
    stock: 50,
    category: "Activewear"
  },
  {
    id: 19,
    image: "/Hero/Product4.avif",
    price: 1399,
    name: "Relaxed Fit Sweatshirt",
    slug: "relaxed-fit-sweatshirt",
    description: "Your weekend uniform. We garment-dyed this sweatshirt for a vintage, lived-in look and feel. The relaxed fit allows for maximum lounging comfort.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Faded Blue", "Washed Black", "Sage"],
    stock: 60,
    category: "Sweatshirts"
  },
  {
    id: 20,
    image: "/Hero/Product2.avif",
    price: 3100,
    name: "Chunky Hand-Knit Sweater",
    slug: "chunky-hand-knit-sweater",
    description: "Artisan quality. Each sweater is hand-finished to ensure a unique texture. The oversized chunky knit provides substantial warmth and a cozy, oversized aesthetic.",
    sizes: ["One Size"],
    colors: ["Cream", "Oatmeal"],
    stock: 8,
    category: "Knits"
  }
];

// --- 2. CONTROLLER LOGIC ---


// @route   POST /api/products/seed
export const seedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    await Product.deleteMany({}); // Safety: prevent duplicates
    const createdProducts = await Product.insertMany(productsToSeed);
    
    console.log(`Seeded ${createdProducts.length} products`);
    res.status(201).json({ 
        success: true, 
        message: "Database seeded successfully", 
        count: createdProducts.length 
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    res.status(500).json({ success: false, message: "Seed failed", error: error.message });
  }
};

//   Fetch all products
// @route   GET /api/products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Fetch single product by Slug (SEO Friendly)
// @route   GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a product manually (Admin)
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid product data", error: error.message });
    }
};
