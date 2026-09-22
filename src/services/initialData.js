// ShopAI Comprehensive Synthetic Dataset (INR Pricing, Indian Names, Multi-vendor)

export const INITIAL_STORES = [
  {
    id: "STORE-1001",
    handle: "urbanthreads",
    name: "Urban Threads",
    category: "Fashion",
    tagline: "Contemporary Indian Streetwear & Minimalist Essentials",
    description: "Crafted in Bengaluru. Premium breathable cottons, oversized silhouettes, and ethically sourced modern everyday streetwear.",
    logo: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 342,
    productsCount: 6,
    owner: {
      name: "Aakash Varma",
      email: "aakash@urbanthreads.in",
      phone: "+91 98450 12345"
    },
    location: {
      address: "84, Indiranagar 100ft Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      country: "India"
    },
    status: "Active",
    createdAt: "2025-11-10",
    metrics: {
      totalSales: 486500,
      totalOrders: 142,
      totalCustomers: 118
    }
  },
  {
    id: "STORE-1002",
    handle: "techhub",
    name: "TechHub",
    category: "Electronics",
    tagline: "Custom Mechanical Keyboards, Audio & Desk Aesthetics",
    description: "Your one-stop boutique for hot-swappable mechanical keyboards, audiophile DACs, desk mats, and high-precision peripherals.",
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 289,
    productsCount: 5,
    owner: {
      name: "Siddharth Rao",
      email: "sid@techhubindia.com",
      phone: "+91 99887 65432"
    },
    location: {
      address: "Plot 12, HITEC City Phase 2",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
      country: "India"
    },
    status: "Active",
    createdAt: "2025-10-04",
    metrics: {
      totalSales: 792400,
      totalOrders: 98,
      totalCustomers: 84
    }
  },
  {
    id: "STORE-1003",
    handle: "homecraft",
    name: "HomeCraft",
    category: "Home",
    tagline: "Handcrafted Ceramics, Warm Ambient Lighting & Decor",
    description: "Bridging artisan pottery from Jaipur with Scandinavian minimalism. Sustainable terracotta, warm lamps, and curated living accents.",
    logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 198,
    productsCount: 5,
    owner: {
      name: "Pooja Singhania",
      email: "pooja@homecraftliving.in",
      phone: "+91 98112 33445"
    },
    location: {
      address: "24, C-Scheme",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India"
    },
    status: "Active",
    createdAt: "2025-12-15",
    metrics: {
      totalSales: 312000,
      totalOrders: 64,
      totalCustomers: 59
    }
  },
  {
    id: "STORE-1004",
    handle: "fitzone",
    name: "FitZone",
    category: "Sports",
    tagline: "Engineered High-Performance Athletic Gear & Hydration",
    description: "Technical sportswear engineered for intense workouts, marathon running, and moisture-wicking comfort under humid climates.",
    logo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 215,
    productsCount: 5,
    owner: {
      name: "Vikram Chauhan",
      email: "vikram@fitzonelabs.com",
      phone: "+91 97110 54321"
    },
    location: {
      address: "Building B, Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      country: "India"
    },
    status: "Active",
    createdAt: "2026-01-08",
    metrics: {
      totalSales: 418900,
      totalOrders: 82,
      totalCustomers: 71
    }
  },
  {
    id: "STORE-1005",
    handle: "glowandco",
    name: "Glow & Co.",
    category: "Beauty",
    tagline: "Clean Ayurvedic Botanicals & Science-Backed Skincare",
    description: "Cruelty-free, toxin-free restorative formulations infused with saffron, niacinamide, cold-pressed almond oil, and peptides.",
    logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 412,
    productsCount: 5,
    owner: {
      name: "Meera Sen",
      email: "meera@glowandco.in",
      phone: "+91 98200 88776"
    },
    location: {
      address: "18, Defense Colony Market",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
      country: "India"
    },
    status: "Active",
    createdAt: "2025-09-18",
    metrics: {
      totalSales: 549000,
      totalOrders: 165,
      totalCustomers: 140
    }
  }
];

export const INITIAL_PRODUCTS = [
  // Urban Threads (Fashion)
  {
    id: "PROD-101",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Vintage Washed Oversized Hoodie",
    category: "Fashion",
    price: 2499,
    originalPrice: 3499,
    discount: "28% OFF",
    rating: 4.8,
    reviewsCount: 124,
    stock: 24,
    status: "In Stock",
    sales: 110,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    description: "420 GSM heavy French Terry cotton hoodie with dropped shoulders, raw wash finish, and brushed thermal interior. Built for effortless layering.",
    features: ["100% Loopback Cotton", "Pre-shrunk fabric", "Hidden side seam pockets", "Ribbed cuffs and hem"]
  },
  {
    id: "PROD-102",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Relaxed Fit Utility Cargo Pants",
    category: "Fashion",
    price: 2999,
    originalPrice: 3999,
    discount: "25% OFF",
    rating: 4.7,
    reviewsCount: 88,
    stock: 14,
    status: "In Stock",
    sales: 74,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    description: "Ripstop cotton cargo trousers featuring 6 functional tactical pockets, adjustable ankle toggles, and reinforced knee panelling.",
    features: ["Heavyweight cotton ripstop", "Adjustable drawstring cuffs", "Ergonomic gusseted crotch", "YKK zippers"]
  },
  {
    id: "PROD-103",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Classic Heavyweight Boxy Tee",
    category: "Fashion",
    price: 1199,
    originalPrice: 1599,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 210,
    stock: 50,
    status: "In Stock",
    sales: 240,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "260 GSM combed compact cotton t-shirt with tight 1.25 inch collar ribbing and signature boxy drape.",
    features: ["100% Combed Cotton", "Double stitched collar", "Fade-resistant dye", "Anti-pilling weave"]
  },
  {
    id: "PROD-104",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Water-Resistant Commuter Jacket",
    category: "Fashion",
    price: 4499,
    originalPrice: 5999,
    discount: "25% OFF",
    rating: 4.6,
    reviewsCount: 45,
    stock: 6,
    status: "Low Stock",
    sales: 38,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
    description: "Minimalist windbreaker equipped with breathable mesh vents, taped water-resistant seams, and packable hood.",
    features: ["DWR coated shell", "Reflective safety accents", "Storm flap closure", "Packable into chest pocket"]
  },
  {
    id: "PROD-105",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Full Grain Leather Heritage Backpack",
    category: "Accessories",
    price: 6499,
    originalPrice: 8999,
    discount: "27% OFF",
    rating: 4.9,
    reviewsCount: 67,
    stock: 8,
    status: "Low Stock",
    sales: 52,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    description: "Vegetable-tanned oil-pull leather backpack with padded 16-inch laptop compartment, brass hardware, and breathable lumbar cushion.",
    features: ["Full grain aniline leather", "Dedicated 16'' laptop sleeve", "Solid brass buckles", "Luggage strap pass-through"]
  },
  {
    id: "PROD-106",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    name: "Air Cushion Modern High-Top Sneakers",
    category: "Fashion",
    price: 5499,
    originalPrice: 7499,
    discount: "26% OFF",
    rating: 4.8,
    reviewsCount: 172,
    stock: 15,
    status: "In Stock",
    sales: 98,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
    description: "Sculpted platform streetwear sneakers with transparent air cushion sole, suede trims, and perforated breathable toe box.",
    features: ["Full length air cushioning", "Premium suede & leather accents", "Anti-odor cushioned insole", "Extra laces set included"]
  },

  // TechHub (Electronics)
  {
    id: "PROD-201",
    storeId: "STORE-1002",
    storeName: "TechHub",
    name: "Keychron K2 Pro Wireless Mechanical Keyboard",
    category: "Electronics",
    price: 8499,
    originalPrice: 10999,
    discount: "22% OFF",
    rating: 4.9,
    reviewsCount: 156,
    stock: 18,
    status: "In Stock",
    sales: 92,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    description: "QMK/VIA wireless mechanical keyboard featuring hot-swappable Gateron Jupiter Brown switches, sound-dampening foam, and south-facing RGB.",
    features: ["Bluetooth 5.1 & Type-C wired", "Mac & Windows layouts", "PBT double-shot keycaps", "4000mAh long battery"]
  },
  {
    id: "PROD-202",
    storeId: "STORE-1002",
    storeName: "TechHub",
    name: "Studio Hi-Res Active Noise Cancelling Headphones",
    category: "Electronics",
    price: 12999,
    originalPrice: 16999,
    discount: "23% OFF",
    rating: 4.8,
    reviewsCount: 112,
    stock: 11,
    status: "In Stock",
    sales: 64,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    description: "Flagship hybrid ANC with 40mm titanium diaphragm drivers, 45-hour battery life, and LDAC high-resolution wireless streaming.",
    features: ["45dB Hybrid ANC", "Multi-point device pairing", "Memory foam ear cushions", "Ultra-low latency gaming mode"]
  },
  {
    id: "PROD-203",
    storeId: "STORE-1002",
    storeName: "TechHub",
    name: "Minimalist Felt & Cork Desk Mat (900x400mm)",
    category: "Accessories",
    price: 1499,
    originalPrice: 2199,
    discount: "31% OFF",
    rating: 4.7,
    reviewsCount: 78,
    stock: 35,
    status: "In Stock",
    sales: 145,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    description: "Dual-sided natural Portuguese cork and vegan merino felt surface. Smooth mouse tracking, spill-resistant, and desk-protecting.",
    features: ["Eco-friendly Portuguese cork", "Anti-fray perimeter stitching", "Water-repellent coating", "Smooth mouse glide"]
  },
  {
    id: "PROD-204",
    storeId: "STORE-1002",
    storeName: "TechHub",
    name: "CNC Anodized Aluminum Laptop Riser",
    category: "Electronics",
    price: 2199,
    originalPrice: 2899,
    discount: "24% OFF",
    rating: 4.6,
    reviewsCount: 42,
    stock: 20,
    status: "In Stock",
    sales: 58,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    description: "Ergonomic 15-degree elevated laptop stand machined from sandblasted space gray aluminum with silicone anti-scratch pads.",
    features: ["Aircraft-grade aluminum", "Open airflow ventilation", "Supports up to 17'' laptops", "Integrated cable routing channel"]
  },
  {
    id: "PROD-205",
    storeId: "STORE-1002",
    storeName: "TechHub",
    name: "Wireless Charging Pad with Walnut Wood Base",
    category: "Electronics",
    price: 2499,
    originalPrice: 3299,
    discount: "24% OFF",
    rating: 4.6,
    reviewsCount: 55,
    stock: 28,
    status: "In Stock",
    sales: 89,
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80",
    description: "Fast 15W Qi-certified wireless charging pad crafted from sustainable North American walnut and brushed aluminum.",
    features: ["15W Fast Charge standard", "Hand-oiled solid walnut top", "Overheat and surge protection", "Braided nylon USB-C cord included"]
  },

  // HomeCraft (Home)
  {
    id: "PROD-301",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    name: "Aura Warm Amber LED Minimal Desk Lamp",
    category: "Home",
    price: 3499,
    originalPrice: 4699,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 94,
    stock: 15,
    status: "In Stock",
    sales: 82,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "Touch-dimmable architectural lamp with warm 2700K sunset hue, frosted blown-glass globe, and solid spun brass stem.",
    features: ["Stepless touch dimming", "Eye-friendly flicker-free LED", "Weighted anti-tip brass base", "Braided cord with switch"]
  },
  {
    id: "PROD-302",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    name: "Handmade Speckled Ceramic Coffee Mug (Set of 2)",
    category: "Home",
    price: 1299,
    originalPrice: 1799,
    discount: "27% OFF",
    rating: 4.8,
    reviewsCount: 142,
    stock: 22,
    status: "In Stock",
    sales: 119,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    description: "320ml artisanal stoneware clay mugs hand-thrown in Khurja. Matte speckled reactive glaze with comfortable thumb rest.",
    features: ["Microwave & dishwasher safe", "Lead-free food-safe glaze", "Natural raw clay base", "Ergonomic handle grip"]
  },
  {
    id: "PROD-303",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    name: "Nordic Geometric Terracotta Planter",
    category: "Home",
    price: 999,
    originalPrice: 1399,
    discount: "28% OFF",
    rating: 4.7,
    reviewsCount: 63,
    stock: 4,
    status: "Low Stock",
    sales: 50,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
    description: "Porous unglazed terracotta planter with drainage hole and detachable saucer. Ideal for succulents, monsteras, and indoor herbs.",
    features: ["Breathable terracotta walls", "Includes catch saucer", "Hand-finished matte texture", "Indoor/outdoor durability"]
  },
  {
    id: "PROD-304",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    name: "Woven Jute & Cotton Bohemian Throw Rug",
    category: "Home",
    price: 2799,
    originalPrice: 3899,
    discount: "28% OFF",
    rating: 4.8,
    reviewsCount: 51,
    stock: 12,
    status: "In Stock",
    sales: 39,
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80",
    description: "Reversible 4x6 ft floor rug woven by master weavers in Bhadohi using unbleached organic cotton and golden natural jute.",
    features: ["Eco-friendly natural fibers", "Reversible dual-tone pattern", "Hand-knotted fringe edges", "High foot-traffic resilience"]
  },
  {
    id: "PROD-305",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    name: "Pure Brass Incense Burner & Aromatherapy Bowl",
    category: "Home",
    price: 1599,
    originalPrice: 2199,
    discount: "27% OFF",
    rating: 4.9,
    reviewsCount: 77,
    stock: 19,
    status: "In Stock",
    sales: 64,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    description: "Hand-lathed solid brass chalice for bakhoor, organic dhoop sticks, and botanical resins. Naturally anti-tarnish polished.",
    features: ["Solid heavy brass casting", "Heat-insulating wooden base ring", "Handcrafted in Moradabad", "Aesthetic table centerpiece"]
  },

  // FitZone (Sports)
  {
    id: "PROD-401",
    storeId: "STORE-1004",
    storeName: "FitZone",
    name: "Apex Aero Responsive Running Shoes",
    category: "Sports",
    price: 4999,
    originalPrice: 6999,
    discount: "28% OFF",
    rating: 4.7,
    reviewsCount: 138,
    stock: 19,
    status: "In Stock",
    sales: 95,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    description: "Featherweight marathon trainers equipped with energy-returning supercritical foam, carbon plate propulsion, and engineered breathable mesh.",
    features: ["Supercritical rebound midsole", "Carbon composite rocker plate", "Vibram high-traction rubber outsole", "Under 210 grams weight"]
  },
  {
    id: "PROD-402",
    storeId: "STORE-1004",
    storeName: "FitZone",
    name: "Vacuum Insulated Stainless Steel Sports Flask (1000ml)",
    category: "Sports",
    price: 1299,
    originalPrice: 1799,
    discount: "27% OFF",
    rating: 4.9,
    reviewsCount: 167,
    stock: 45,
    status: "In Stock",
    sales: 210,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    description: "Triple-walled 18/8 food grade steel bottle keeping beverages iced for 36 hours or steaming hot for 18 hours. Leakproof chug cap.",
    features: ["36-hour ice retention", "Powder-coated non-slip grip", "100% BPA & toxin free", "Wide mouth for ice cubes"]
  },
  {
    id: "PROD-403",
    storeId: "STORE-1004",
    storeName: "FitZone",
    name: "Natural Tree Rubber Non-Slip Yoga Mat (6mm)",
    category: "Sports",
    price: 2299,
    originalPrice: 3199,
    discount: "28% OFF",
    rating: 4.8,
    reviewsCount: 84,
    stock: 16,
    status: "In Stock",
    sales: 72,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80",
    description: "High-density polyurethane top layer with natural tree rubber base for uncompromising grip even during sweaty hot yoga sessions.",
    features: ["Laser-etched body alignment lines", "6mm joint cushioning", "Non-toxic biodegradable rubber", "Complimentary carrying strap"]
  },
  {
    id: "PROD-404",
    storeId: "STORE-1004",
    storeName: "FitZone",
    name: "Seamless Compression Training Shorts",
    category: "Sports",
    price: 1499,
    originalPrice: 1999,
    discount: "25% OFF",
    rating: 4.6,
    reviewsCount: 65,
    stock: 2,
    status: "Low Stock",
    sales: 58,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80",
    description: "Four-way stretch quick-dry active shorts featuring built-in compression liner, bounce-free phone pocket, and towel loop.",
    features: ["Anti-chafing flatlock seams", "Concealed phone holster", "Reflective night visibility", "Breathable mesh panels"]
  },
  {
    id: "PROD-405",
    storeId: "STORE-1004",
    storeName: "FitZone",
    name: "Adjustable Dial Quick-Change Dumbbells (20kg Pair)",
    category: "Sports",
    price: 14999,
    originalPrice: 19999,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 91,
    stock: 5,
    status: "Low Stock",
    sales: 46,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
    description: "Selectorized dumbbell system replacing 10 weight pairs. Seamlessly turn the dial from 2.5kg to 20kg in 2.5kg increments.",
    features: ["Replaces 10 individual dumbbells", "Molded steel plates with durable coating", "Safety locking gear mechanism", "Includes storage cradles"]
  },

  // Glow & Co. (Beauty)
  {
    id: "PROD-501",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    name: "Radiance 10% Niacinamide & Saffron Glow Serum",
    category: "Beauty",
    price: 1199,
    originalPrice: 1699,
    discount: "29% OFF",
    rating: 4.9,
    reviewsCount: 284,
    stock: 38,
    status: "In Stock",
    sales: 310,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    description: "Formulated with pure Kashmiri Kumkumadi saffron, 10% clinical-grade niacinamide, and hyaluronic acid to even skin tone and fade blemishes.",
    features: ["Dermatologically tested", "Paraben and fragrance-free", "Fades dark spots in 3 weeks", "Lightweight watery texture"]
  },
  {
    id: "PROD-502",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    name: "Barrier Repair Ceramide Moisturizing Creme",
    category: "Beauty",
    price: 999,
    originalPrice: 1399,
    discount: "28% OFF",
    rating: 4.8,
    reviewsCount: 190,
    stock: 25,
    status: "In Stock",
    sales: 180,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    description: "Deep moisture barrier support with 3 essential biomimetic ceramides, squalane, and soothing centella asiatica (Cica).",
    features: ["Non-comedogenic formula", "Soothes irritated dry skin", "72-hour sustained moisture", "Velvety non-greasy finish"]
  },
  {
    id: "PROD-503",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    name: "Ultra-Light Dewy Sunscreen Gel SPF 50+ PA++++",
    category: "Beauty",
    price: 799,
    originalPrice: 999,
    discount: "20% OFF",
    rating: 4.9,
    reviewsCount: 310,
    stock: 42,
    status: "In Stock",
    sales: 420,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    description: "Zero white-cast hybrid sunscreen with advanced UV filters, green tea antioxidants, and blue light defense. Absorbs in seconds.",
    features: ["Zero white cast on Indian skin", "Sweat and water resistant (80 mins)", "Infused with cooling aloe", "Reef-safe sunscreen"]
  },
  {
    id: "PROD-504",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    name: "Cold-Pressed Himalayan Rosehip Face Elixir",
    category: "Beauty",
    price: 1499,
    originalPrice: 1999,
    discount: "25% OFF",
    rating: 4.7,
    reviewsCount: 96,
    stock: 14,
    status: "In Stock",
    sales: 85,
    image: "https://images.unsplash.com/photo-1608248597359-58d044238a0f?w=800&auto=format&fit=crop&q=80",
    description: "100% unrefined cold-pressed rosehip seed oil rich in vitamins A, C, and fatty acids to promote nighttime collagen synthesis.",
    features: ["Wild-harvested in Himachal", "Dark amber glass UV dropper", "Boosts elasticity & glow", "100% pure single ingredient"]
  },
  {
    id: "PROD-505",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    name: "Clarifying Green Tea & Salicylic Clay Mask",
    category: "Beauty",
    price: 899,
    originalPrice: 1199,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 148,
    stock: 20,
    status: "In Stock",
    sales: 175,
    image: "https://images.unsplash.com/photo-1567928805192-d35d641494be?w=800&auto=format&fit=crop&q=80",
    description: "Kaolin clay detox mask enriched with matcha green tea extract and 2% BHA to dissolve blackheads and gently exfoliate pores.",
    features: ["Purifies without drying skin", "With natural French kaolin", "Contains soothing chamomile", "10-minute rinse-off mask"]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-1",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@example.com",
    phone: "+91 98190 44321",
    ordersCount: 4,
    totalSpent: 34896,
    lastOrder: "2026-03-20",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    addresses: [
      {
        id: "ADDR-1",
        label: "Home",
        address: "Flat 402, Magnolia Enclave, 12th Main Road, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        phone: "+91 98190 44321",
        isDefault: true
      },
      {
        id: "ADDR-2",
        label: "Work",
        address: "Level 6, WeWork Galaxy, 43 Residency Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560025",
        phone: "+91 98190 44321",
        isDefault: false
      }
    ]
  },
  {
    id: "CUST-2",
    name: "Aarav Mehta",
    email: "aarav.m@gmail.com",
    phone: "+91 98201 12389",
    ordersCount: 3,
    totalSpent: 18450,
    lastOrder: "2026-03-12"
  },
  {
    id: "CUST-3",
    name: "Ishita Shah",
    email: "ishita.shah@outlook.com",
    phone: "+91 98334 77812",
    ordersCount: 5,
    totalSpent: 26390,
    lastOrder: "2026-03-16"
  },
  {
    id: "CUST-4",
    name: "Kabir Patel",
    email: "kabir.patel@rediffmail.com",
    phone: "+91 98980 66231",
    ordersCount: 2,
    totalSpent: 9998,
    lastOrder: "2026-03-05"
  },
  {
    id: "CUST-5",
    name: "Ananya Rao",
    email: "ananya.rao@yahoo.com",
    phone: "+91 99001 54312",
    ordersCount: 6,
    totalSpent: 42150,
    lastOrder: "2026-03-19"
  },
  {
    id: "CUST-6",
    name: "Devendra Sharma",
    email: "dev.sharma@gmail.com",
    phone: "+91 97112 88450",
    ordersCount: 2,
    totalSpent: 14200,
    lastOrder: "2026-02-28"
  },
  {
    id: "CUST-7",
    name: "Priyanka Nair",
    email: "priyanka.n@icloud.com",
    phone: "+91 98402 33412",
    ordersCount: 4,
    totalSpent: 22700,
    lastOrder: "2026-03-14"
  },
  {
    id: "CUST-8",
    name: "Aditya Verma",
    email: "aditya.v@live.com",
    phone: "+91 98711 99023",
    ordersCount: 3,
    totalSpent: 16800,
    lastOrder: "2026-03-10"
  },
  {
    id: "CUST-9",
    name: "Tanvi Kulkarni",
    email: "tanvi.kulkarni@gmail.com",
    phone: "+91 99221 44567",
    ordersCount: 5,
    totalSpent: 31200,
    lastOrder: "2026-03-17"
  },
  {
    id: "CUST-10",
    name: "Arjun Reddy",
    email: "arjun.reddy@techhub.in",
    phone: "+91 98490 11223",
    ordersCount: 1,
    totalSpent: 8499,
    lastOrder: "2026-03-08"
  },
  {
    id: "CUST-11",
    name: "Sneha Chatterjee",
    email: "sneha.c@gmail.com",
    phone: "+91 98300 55678",
    ordersCount: 4,
    totalSpent: 19800,
    lastOrder: "2026-03-15"
  },
  {
    id: "CUST-12",
    name: "Karan Malhotra",
    email: "karan.malhotra@zenith.com",
    phone: "+91 98110 33219",
    ordersCount: 3,
    totalSpent: 24900,
    lastOrder: "2026-03-11"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-10452",
    date: "2026-03-20",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    customerId: "CUST-1",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.kapoor@example.com",
    customerPhone: "+91 98190 44321",
    items: [
      {
        productId: "PROD-106",
        name: "Air Cushion Modern High-Top Sneakers",
        price: 5499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80"
      },
      {
        productId: "PROD-101",
        name: "Vintage Washed Oversized Hoodie",
        price: 2499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 7998,
    shippingFee: 0,
    totalAmount: 7998,
    paymentMethod: "UPI (Google Pay)",
    status: "Out for Delivery",
    shippingAddress: {
      address: "Flat 402, Magnolia Enclave, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    expectedDelivery: "Today by 6:00 PM",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-20 09:30 AM", completed: true },
      { stage: "Confirmed", date: "2026-03-20 10:15 AM", completed: true },
      { stage: "Packed", date: "2026-03-20 02:40 PM", completed: true },
      { stage: "Shipped", date: "2026-03-21 07:15 AM", completed: true },
      { stage: "Out for Delivery", date: "2026-03-22 09:00 AM", completed: true, current: true },
      { stage: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-10431",
    date: "2026-03-15",
    storeId: "STORE-1002",
    storeName: "TechHub",
    customerId: "CUST-1",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.kapoor@example.com",
    customerPhone: "+91 98190 44321",
    items: [
      {
        productId: "PROD-201",
        name: "Keychron K2 Pro Wireless Mechanical Keyboard",
        price: 8499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 8499,
    shippingFee: 0,
    totalAmount: 8499,
    paymentMethod: "Credit Card",
    status: "Delivered",
    shippingAddress: {
      address: "Flat 402, Magnolia Enclave, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    expectedDelivery: "Delivered on 18 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-15 11:20 AM", completed: true },
      { stage: "Confirmed", date: "2026-03-15 12:00 PM", completed: true },
      { stage: "Packed", date: "2026-03-16 10:00 AM", completed: true },
      { stage: "Shipped", date: "2026-03-16 06:00 PM", completed: true },
      { stage: "Out for Delivery", date: "2026-03-18 09:30 AM", completed: true },
      { stage: "Delivered", date: "2026-03-18 03:15 PM", completed: true, current: true }
    ]
  },
  {
    id: "ORD-10420",
    date: "2026-03-10",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    customerId: "CUST-1",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.kapoor@example.com",
    customerPhone: "+91 98190 44321",
    items: [
      {
        productId: "PROD-301",
        name: "Aura Warm Amber LED Minimal Desk Lamp",
        price: 3499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 3499,
    shippingFee: 0,
    totalAmount: 3499,
    paymentMethod: "UPI",
    status: "Delivered",
    shippingAddress: {
      address: "Flat 402, Magnolia Enclave, 12th Main Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    expectedDelivery: "Delivered on 14 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-10 02:10 PM", completed: true },
      { stage: "Confirmed", date: "2026-03-10 03:00 PM", completed: true },
      { stage: "Packed", date: "2026-03-11 11:30 AM", completed: true },
      { stage: "Shipped", date: "2026-03-12 04:20 PM", completed: true },
      { stage: "Out for Delivery", date: "2026-03-14 10:00 AM", completed: true },
      { stage: "Delivered", date: "2026-03-14 02:40 PM", completed: true, current: true }
    ]
  },
  {
    id: "ORD-10410",
    date: "2026-03-18",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    customerId: "CUST-2",
    customerName: "Aarav Mehta",
    customerEmail: "aarav.m@gmail.com",
    customerPhone: "+91 98201 12389",
    items: [
      {
        productId: "PROD-102",
        name: "Relaxed Fit Utility Cargo Pants",
        price: 2999,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 5998,
    shippingFee: 0,
    totalAmount: 5998,
    paymentMethod: "Credit Card",
    status: "Shipped",
    shippingAddress: {
      address: "12, Sea Breeze, Worli Seaface",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400030"
    },
    expectedDelivery: "24 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-18", completed: true },
      { stage: "Confirmed", date: "2026-03-18", completed: true },
      { stage: "Packed", date: "2026-03-19", completed: true },
      { stage: "Shipped", date: "2026-03-20", completed: true, current: true },
      { stage: "Out for Delivery", date: "Pending", completed: false },
      { stage: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-10398",
    date: "2026-03-16",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    customerId: "CUST-3",
    customerName: "Ishita Shah",
    customerEmail: "ishita.shah@outlook.com",
    customerPhone: "+91 98334 77812",
    items: [
      {
        productId: "PROD-501",
        name: "Radiance 10% Niacinamide & Saffron Glow Serum",
        price: 1199,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
      },
      {
        productId: "PROD-503",
        name: "Ultra-Light Dewy Sunscreen Gel SPF 50+",
        price: 799,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 3197,
    shippingFee: 0,
    totalAmount: 3197,
    paymentMethod: "UPI",
    status: "Delivered",
    shippingAddress: {
      address: "B-401, Harmony Heights, Satellite",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015"
    },
    expectedDelivery: "Delivered on 19 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-16", completed: true },
      { stage: "Confirmed", date: "2026-03-16", completed: true },
      { stage: "Packed", date: "2026-03-17", completed: true },
      { stage: "Shipped", date: "2026-03-18", completed: true },
      { stage: "Out for Delivery", date: "2026-03-19", completed: true },
      { stage: "Delivered", date: "2026-03-19", completed: true, current: true }
    ]
  },
  {
    id: "ORD-10385",
    date: "2026-03-14",
    storeId: "STORE-1004",
    storeName: "FitZone",
    customerId: "CUST-5",
    customerName: "Ananya Rao",
    customerEmail: "ananya.rao@yahoo.com",
    customerPhone: "+91 99001 54312",
    items: [
      {
        productId: "PROD-401",
        name: "Apex Aero Responsive Running Shoes",
        price: 4999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 4999,
    shippingFee: 0,
    totalAmount: 4999,
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    shippingAddress: {
      address: "7, Jubilee Hills Road No. 36",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033"
    },
    expectedDelivery: "Delivered on 17 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-14", completed: true },
      { stage: "Confirmed", date: "2026-03-14", completed: true },
      { stage: "Packed", date: "2026-03-15", completed: true },
      { stage: "Shipped", date: "2026-03-16", completed: true },
      { stage: "Out for Delivery", date: "2026-03-17", completed: true },
      { stage: "Delivered", date: "2026-03-17", completed: true, current: true }
    ]
  },
  {
    id: "ORD-10370",
    date: "2026-03-19",
    storeId: "STORE-1002",
    storeName: "TechHub",
    customerId: "CUST-4",
    customerName: "Kabir Patel",
    customerEmail: "kabir.patel@rediffmail.com",
    customerPhone: "+91 98980 66231",
    items: [
      {
        productId: "PROD-202",
        name: "Studio Hi-Res Active Noise Cancelling Headphones",
        price: 12999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 12999,
    shippingFee: 0,
    totalAmount: 12999,
    paymentMethod: "Credit Card",
    status: "Packed",
    shippingAddress: {
      address: "Flat 10, Alkapuri",
      city: "Vadodara",
      state: "Gujarat",
      pincode: "390007"
    },
    expectedDelivery: "25 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-19", completed: true },
      { stage: "Confirmed", date: "2026-03-19", completed: true },
      { stage: "Packed", date: "2026-03-20", completed: true, current: true },
      { stage: "Shipped", date: "Pending", completed: false },
      { stage: "Out for Delivery", date: "Pending", completed: false },
      { stage: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-10355",
    date: "2026-03-21",
    storeId: "STORE-1001",
    storeName: "Urban Threads",
    customerId: "CUST-7",
    customerName: "Priyanka Nair",
    customerEmail: "priyanka.n@icloud.com",
    customerPhone: "+91 98402 33412",
    items: [
      {
        productId: "PROD-103",
        name: "Classic Heavyweight Boxy Tee",
        price: 1199,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 2398,
    shippingFee: 0,
    totalAmount: 2398,
    paymentMethod: "UPI",
    status: "Confirmed",
    shippingAddress: {
      address: "44, Poes Garden",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600086"
    },
    expectedDelivery: "26 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-21", completed: true },
      { stage: "Confirmed", date: "2026-03-21", completed: true, current: true },
      { stage: "Packed", date: "Pending", completed: false },
      { stage: "Shipped", date: "Pending", completed: false },
      { stage: "Out for Delivery", date: "Pending", completed: false },
      { stage: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-10340",
    date: "2026-03-21",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    customerId: "CUST-9",
    customerName: "Tanvi Kulkarni",
    customerEmail: "tanvi.kulkarni@gmail.com",
    customerPhone: "+91 99221 44567",
    items: [
      {
        productId: "PROD-304",
        name: "Woven Jute & Cotton Bohemian Throw Rug",
        price: 2799,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80"
      }
    ],
    amount: 2799,
    shippingFee: 0,
    totalAmount: 2799,
    paymentMethod: "UPI",
    status: "Placed",
    shippingAddress: {
      address: "Plot 88, Model Colony",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411016"
    },
    expectedDelivery: "27 Mar 2026",
    trackingUpdates: [
      { stage: "Order Placed", date: "2026-03-21", completed: true, current: true },
      { stage: "Confirmed", date: "Pending", completed: false },
      { stage: "Packed", date: "Pending", completed: false },
      { stage: "Shipped", date: "Pending", completed: false },
      { stage: "Out for Delivery", date: "Pending", completed: false },
      { stage: "Delivered", date: "Pending", completed: false }
    ]
  }
];

export const INITIAL_RETURNS = [
  {
    id: "RET-2001",
    orderId: "ORD-10420",
    storeId: "STORE-1003",
    storeName: "HomeCraft",
    customerId: "CUST-1",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.kapoor@example.com",
    productId: "PROD-301",
    productName: "Aura Warm Amber LED Minimal Desk Lamp",
    productImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    amount: 3499,
    reason: "Damaged product",
    notes: "Minor scuff on the brass base upon unboxing.",
    status: "Approved",
    createdAt: "2026-03-16",
    updatedAt: "2026-03-17"
  },
  {
    id: "RET-2002",
    orderId: "ORD-10385",
    storeId: "STORE-1004",
    storeName: "FitZone",
    customerId: "CUST-5",
    customerName: "Ananya Rao",
    customerEmail: "ananya.rao@yahoo.com",
    productId: "PROD-401",
    productName: "Apex Aero Responsive Running Shoes",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    amount: 4999,
    reason: "Size issue",
    notes: "UK 8 runs slightly tighter than expected, need UK 9.",
    status: "Requested",
    createdAt: "2026-03-18",
    updatedAt: "2026-03-18"
  },
  {
    id: "RET-2003",
    orderId: "ORD-10431",
    storeId: "STORE-1002",
    storeName: "TechHub",
    customerId: "CUST-1",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.kapoor@example.com",
    productId: "PROD-201",
    productName: "Keychron K2 Pro Wireless Mechanical Keyboard",
    productImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    amount: 8499,
    reason: "Changed my mind",
    notes: "Prefer red linear switches instead of tactile brown.",
    status: "Pickup Scheduled",
    createdAt: "2026-03-19",
    updatedAt: "2026-03-20"
  },
  {
    id: "RET-2004",
    orderId: "ORD-10398",
    storeId: "STORE-1005",
    storeName: "Glow & Co.",
    customerId: "CUST-3",
    customerName: "Ishita Shah",
    customerEmail: "ishita.shah@outlook.com",
    productId: "PROD-501",
    productName: "Radiance 10% Niacinamide & Saffron Glow Serum",
    productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    amount: 1199,
    reason: "Product not as described",
    notes: "Dropper cap was slightly loose.",
    status: "Refunded",
    createdAt: "2026-03-20",
    updatedAt: "2026-03-21"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "REV-1",
    storeId: "STORE-1001",
    author: "Kabir Patel",
    rating: 5,
    date: "12 Mar 2026",
    comment: "The heavy loopback cotton quality on the hoodies is literally luxury tier. Sizing is spot on oversized."
  },
  {
    id: "REV-2",
    storeId: "STORE-1001",
    author: "Aarav Mehta",
    rating: 5,
    date: "18 Feb 2026",
    comment: "Fast shipping from Bengaluru. Packaging was zero-plastic and super clean."
  },
  {
    id: "REV-3",
    storeId: "STORE-1002",
    author: "Rohan Kapoor",
    rating: 5,
    date: "19 Mar 2026",
    comment: "Mechanical keyboard typing feel is divine. Factory lubed switches and great dampening."
  },
  {
    id: "REV-4",
    storeId: "STORE-1003",
    author: "Priyanka Nair",
    rating: 5,
    date: "05 Mar 2026",
    comment: "The warm amber desk lamp completely transformed my evening work setup. Beautiful brass craftsmanship."
  },
  {
    id: "REV-5",
    storeId: "STORE-1005",
    author: "Ishita Shah",
    rating: 5,
    date: "14 Mar 2026",
    comment: "The Kumkumadi saffron glow serum has quickly become a holy grail. Zero irritation on sensitive skin."
  }
];
