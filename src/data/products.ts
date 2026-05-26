/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const products: Product[] = [
  {
    id: "betel-leaves",
    name: "Pure Betel Leaves",
    scientificName: "Piper Betle",
    price: 2100,
    description: "Revered for millennia in Asian wellness rituals, our betel leaves are hand-plucked at dawn to preserve their potent essential oils and pungent, peppery essence.",
    shortDescription: "Time-honored botanical wisdom for digestive health and oral hygiene.",
    flavorProfile: "Pungent, peppery, with a lingering, slightly bitter botanical finish.",
    tags: ["Time-Honored Wisdom", "Digestive Aid"],
    category: "Digestion",
    heroImage: "https://images.unsplash.com/photo-1596273690994-f8d14802e85a?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Digestive Catalyst",
        description: "Stimulates the secretion of saliva and gastric enzymes, effectively jump-starting your metabolism.",
        icon: "auto_awesome",
      },
      {
        title: "Antiseptic Ritual",
        description: "Natural antimicrobial properties help maintain oral hygiene and freshen breath naturally.",
        icon: "health_and_safety",
      },
      {
        title: "Breath Support",
        description: "Traditionally used to relieve chest congestion and provide soothing respiratory comfort.",
        icon: "air",
      },
    ],
    contraindications: [
      "Pregnant or Nursing mothers",
      "Those with Acid Reflux or Ulcers",
      "Individuals with Bleeding Disorders",
    ],
    brewingRitual: [
      {
        step: "01",
        title: "Prepare",
        description: "Tear 1-2 fresh betel leaves into small pieces to release the volatile oils.",
      },
      {
        step: "02",
        title: "Steep",
        description: "Pour 8oz of near-boiling water (190°F) over the leaves. Cover to trap steam.",
      },
      {
        step: "03",
        title: "Infuse",
        description: "Allow to steep for 5-7 minutes. Strain and enjoy plain or with honey.",
      },
    ],
  },
  {
    id: "moringa-leaves",
    name: "Pure Moringa Leaves",
    scientificName: "Moringa Oleifera",
    price: 2400,
    description: "The 'Miracle Tree' of ancient times, harvested at peak potency to restore your natural rhythm and vitality.",
    shortDescription: "Nutrient-dense superfood for energy, immunity, and bone health.",
    flavorProfile: "Bitter, peppery, grassy.",
    tags: ["The Miracle Tree", "Nutrient Powerhouse"],
    category: "Immunity",
    heroImage: "https://images.unsplash.com/photo-1563483783225-fd5326296629?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Energy & Vitality",
        description: "Sustained energy release without the caffeine crash, supporting mental clarity.",
        icon: "energy_savings_leaf",
      },
      {
        title: "Nutrient Powerhouse",
        description: "Packed with vitamins A, C, calcium, iron, and protein for overall nutrition.",
        icon: "medical_services",
      },
      {
        title: "Systemic Support",
        description: "Aids in blood sugar control and provide anti-inflammatory benefits.",
        icon: "blood_pressure",
      },
    ],
    contraindications: [
      "Pregnant Women (may cause uterine contractions)",
      "Low Blood Pressure Patients",
      "Thyroid Disorders",
    ],
    brewingRitual: [
      {
        step: "01",
        title: "Warm",
        description: "Heat water to 80°C (176°F). Avoid boiling to preserve delicate enzymes.",
      },
      {
        step: "02",
        title: "Steep",
        description: "Add 1 tsp of Moringa. Steep for 3-5 minutes until the infusion turns bright lime green.",
      },
      {
        step: "03",
        title: "Sip",
        description: "Sip mindfully. For a smoother finish, add a drop of wild honey or lemon.",
      },
    ],
  },
  {
    id: "tulasi-leaves",
    name: "Tulasi (Holy Basil)",
    scientificName: "Ocimum Sanctum",
    price: 2000,
    description: "Known as the 'Queen of Herbs,' Tulasi is a sacred botanical treasure celebrated for centuries for its adaptogenic properties.",
    shortDescription: "Sacred herb for stress relief, immunity, and respiratory health.",
    flavorProfile: "Sweet, slightly spicy, highly aromatic.",
    tags: ["Adaptogen", "Pure Leaf"],
    category: "Immunity",
    heroImage: "https://images.unsplash.com/photo-1601614272186-b4b6ba3e5362?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1627931652702-edf49bf847b2?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Stress Relief",
        description: "Powerful adaptogen to lower cortisol and balance the spirit.",
        icon: "psychology",
      },
      {
        title: "Respiratory Health",
        description: "Eases coughs, colds, and congestion, supporting clear breathing.",
        icon: "respiratory_rate",
      },
      {
        title: "Boosts Immunity",
        description: "Strengthens immune defense and helps fight infections.",
        icon: "shield",
      },
    ],
    contraindications: [
      "Pregnant Women (may affect hormone levels)",
      "Bleeding Disorders",
      "Low Blood Pressure Patients",
    ],
    brewingRitual: [
      {
        step: "01",
        title: "Preparation",
        description: "Warm your ceramic vessel. Add 1-2 teaspoons of dried Tulasi leaves per 8oz of water.",
      },
      {
        step: "02",
        title: "Infusion",
        description: "Pour water just off the boil. Steep for 5-7 minutes as it turns golden amber.",
      },
      {
        step: "03",
        title: "Presence",
        description: "Sip slowly. Feel the warmth move from your throat to your chest.",
      },
    ],
  },
  {
    id: "avarampoo",
    name: "Avarampoo",
    scientificName: "Senna Auriculata",
    price: 2000,
    originalPrice: 2600,
    description: "Sourced from the heart of Southern India, Avarampoo is known as 'The Golden Flower' of traditional botanicals for its cooling effect.",
    shortDescription: "Refreshing infusion for blood sugar, skin health, and liver detox.",
    flavorProfile: "Mildly sweet, floral notes with a honey-like finish.",
    tags: ["Time-Honored Blend", "Pure Botanical"],
    category: "Skin",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJQ1_8FW2e8EpI0uf6FCZUDpEpui_rV4jrLf4NY_xAt6UDZh3YgoTC-srCYW6aRglZ6o524Vbtpnj-LJhUhI5aIf6uDhZciLAC_dpnCRBW8KYAqujqrVDnYW8J292jNsxGxl83RiNv1TXBo5lg3-6BezoGYgW5L4C-GfKzkgXWx9SRhDjRKbq5uvbkrwIjBLEBm3qgQPH-m8grnDlX_YeeOb07-XZ8M7JsZG6G9ajAV2ItK3fa4E0KhTZBnhQmh6GJGyMV-rpQlycw",
    secondaryImage: "https://images.unsplash.com/photo-1464979681340-1261d42908a3?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Blood Sugar",
        description: "Naturally helps regulate glucose levels through traditional wisdom.",
        icon: "bloodtype",
      },
      {
        title: "Skin Health",
        description: "Rich in antioxidants that combat oxidative stress for a natural glow.",
        icon: "auto_awesome",
      },
      {
        title: "Liver & Urinary",
        description: "A natural detoxifier that supports liver function and urinary tract health.",
        icon: "shield_with_heart",
      },
    ],
    contraindications: [
      "Pregnant Women",
      "People on medication for blood sugar",
      "Chronic Constipation (overuse)",
    ],
    brewingRitual: [
      {
        step: "01",
        title: "Warm",
        description: "Bring fresh, filtered water to a gentle boil (approx. 90°C).",
      },
      {
        step: "02",
        title: "Steep",
        description: "Place 1 tsp of dried flowers into your infuser. Steep for 5-7 minutes.",
      },
      {
        step: "03",
        title: "Invoke",
        description: "Observe the water turn golden amber. Savor the floral aroma.",
      },
    ],
  },
  {
    id: "horse-gram",
    name: "Horse Gram (Kollu) Blend",
    scientificName: "Macrotyloma Uniflorum",
    price: 599,
    description: "A powerful legume-based blend designed for metabolic support and detoxification.",
    shortDescription: "Aids weight loss, fat metabolism, and flushes out toxins.",
    flavorProfile: "Earthy, nutty.",
    tags: ["Metabolism Boost", "Natural Detox"],
    category: "Weight",
    heroImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Weight Management",
        description: "Aids fat loss and boosts metabolism naturally.",
        icon: "fitness_center",
      },
      {
        title: "Detox Support",
        description: "Flushes out toxins and promotes kidney health.",
        icon: "eco",
      },
      {
        title: "Protein Rich",
        description: "Builds muscle strength and combats fatigue.",
        icon: "bolt",
      },
    ],
    contraindications: [
      "Pregnant Women",
      "Kidney Stone Patients (high oxalate)",
      "Gastritis or Ulcers",
    ],
    brewingRitual: [
      { step: "01", title: "Heat", description: "Heat water to rolling boil." },
      { step: "02", title: "Infuse", description: "Add 1 tsp and steep for 8-10 minutes." },
      { step: "03", title: "Enjoy", description: "Drink warm for best results." },
    ],
  },
  {
    id: "jamun-leaves",
    name: "Jamun Leaves",
    scientificName: "Syzygium Cumini",
    price: 1800,
    description: "Contains jamboline and alkaloids that help regulate glucose levels, making it beneficial for Type-2 diabetes patients.",
    shortDescription: "Traditional blood sugar control and cardiovascular support.",
    flavorProfile: "Mildly bitter, earthy.",
    tags: ["Blood Sugar Control", "Heart Health"],
    category: "Digestion",
    heroImage: "https://images.unsplash.com/photo-1512429234300-1cbb479ef9bf?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1555448049-816dab461049?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Blood Sugar Control",
        description: "Contains jamboline which helps regulate glucose levels.",
        icon: "monitor_heart",
      },
      {
        title: "Digestive Aid",
        description: "Improves liver function, prevents bloating, and supports gut health.",
        icon: "spa",
      },
      {
        title: "Immunity Boost",
        description: "Flavonoids and polyphenols protect cells from oxidative stress.",
        icon: "shield",
      },
    ],
    contraindications: [
      "Diabetics on Medication (may cause hypoglycemia)",
      "Pregnant & Nursing Women",
      "Kidney Patients",
    ],
    brewingRitual: [
      { step: "01", title: "Rinse", description: "Clean thoroughly and bruise the leaves slightly." },
      { step: "02", title: "Boil", description: "Boil in 10oz of water until it reduces slightly." },
      { step: "03", title: "Drink", description: "Strain and consume twice daily for best results." },
    ],
  },
  {
    id: "curry-leaves",
    name: "Curry Leaves",
    scientificName: "Murraya Koenigii",
    price: 449,
    description: "Stimulates digestive enzymes and reduces bloating while protecting cells from oxidative stress.",
    shortDescription: "Aromatic leaves for digestion, hair health, and blood sugar.",
    flavorProfile: "Smoky, citrus-like, nutty.",
    tags: ["Hair Health", "Digestion"],
    category: "Digestion",
    heroImage: "https://images.unsplash.com/photo-1594911774802-8822a707c93e?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Aids Digestion",
        description: "Stimulates digestive enzymes and reduces bloating.",
        icon: "restaurant",
      },
      {
        title: "Hair & Skin Health",
        description: "Strengthens hair roots and reduces dandruff.",
        icon: "brush",
      },
      {
        title: "Heart Health",
        description: "Contains carbazole alkaloids that help lower cholesterol.",
        icon: "heart",
      },
    ],
    contraindications: [
      "Pregnant Women (use in moderation)",
      "Patients on Blood Thinners",
    ],
    brewingRitual: [
      { step: "01", title: "Select", description: "Choose fresh dark green leaves." },
      { step: "02", title: "Infuse", description: "Infuse in hot water or add to your regular tea." },
      { step: "03", title: "Refresh", description: "Enjoy the smoky citrus aroma." },
    ],
  },
  {
    id: "guava-leaves",
    name: "Guava Leaves",
    scientificName: "Psidium Guajava",
    price: 499,
    description: "Helps lower blood glucose levels and supports insulin function. Reduces diarrhea and promotes gut balance.",
    shortDescription: "Botanical infusion for blood sugar control and digestive health.",
    flavorProfile: "Mildly bitter, herbal.",
    tags: ["Blood Sugar Control", "Digestive Health"],
    category: "Digestion",
    heroImage: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1515252585461-04db1eb84625?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Blood Sugar Control",
        description: "Helps lower blood glucose levels and supports insulin function.",
        icon: "monitor_heart",
      },
      {
        title: "Digestive Health",
        description: "Reduces diarrhea, bloating, and promotes gut balance.",
        icon: "spa",
      },
      {
        title: "Weight Loss Aid",
        description: "Boosts metabolism and helps burn fat naturally.",
        icon: "fitness_center",
      },
    ],
    contraindications: [
      "Pregnant Women (use with caution)",
      "Chronic Constipation (overuse can worsen symptoms)",
    ],
    brewingRitual: [
      { step: "01", title: "Brew", description: "Place the whole-leaf infusion pouch in your favorite ceramic mug." },
      { step: "02", title: "Infuse", description: "Pour 200ml of boiling water and steep for 5 minutes." },
      { step: "03", title: "Restore", description: "Enjoy warm to aid digestion." },
    ],
  },
  {
    id: "black-nightshade",
    name: "Black Nightshade Leaves",
    scientificName: "Solanum Nigrum",
    price: 1600,
    description: "Reduces joint pain and swelling; used traditionally for arthritis and liver support.",
    shortDescription: "Anti-inflammatory botanical infusion for liver and ulcer relief.",
    flavorProfile: "Savory, musky undertones.",
    tags: ["Anti-Inflammatory", "Liver Support"],
    category: "Detox",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=800",
    benefits: [
      {
        title: "Anti-Inflammatory",
        description: "Reduces joint pain and swelling; used for arthritis.",
        icon: "healing",
      },
      {
        title: "Liver Support",
        description: "Helps detoxify and protect the liver from toxins.",
        icon: "shield",
      },
      {
        title: "Ulcer Relief",
        description: "Soothes skin conditions and helps heal gastric ulcers.",
        icon: "spa",
      },
    ],
    contraindications: [
      "Pregnant Women (may cause uterine contractions)",
      "Young Children (unripe berries are toxic)",
      "Kidney Patients",
    ],
    brewingRitual: [
      { step: "01", title: "Steep", description: "Place the mature whole-leaf pouch in near-boiling water." },
      { step: "02", title: "Wait", description: "Allow 6-8 minutes for full savory extraction." },
      { step: "03", title: "Sip", description: "Enjoy the musky undertones for internal healing." },
    ],
  },
];
