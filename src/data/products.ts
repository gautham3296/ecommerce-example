/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const products: Product[] = [
  {
    "id": "avarampoo",
    "name": "Avarampoo",
    "scientificName": "Senna Auriculata",
    "price": 2000,
    "originalPrice": 2600,
    "description": "Sourced from the heart of Southern India, Avarampoo is known as 'The Golden Flower' of traditional botanicals for its cooling effect.",
    "shortDescription": "Refreshing infusion for blood sugar, skin health, and liver detox.",
    "flavorProfile": "Mildly sweet, floral notes with a honey-like finish.",
    "tags": [
      "Time-Honored Blend",
      "Pure Botanical"
    ],
    "category": "Skin",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuBJQ1_8FW2e8EpI0uf6FCZUDpEpui_rV4jrLf4NY_xAt6UDZh3YgoTC-srCYW6aRglZ6o524Vbtpnj-LJhUhI5aIf6uDhZciLAC_dpnCRBW8KYAqujqrVDnYW8J292jNsxGxl83RiNv1TXBo5lg3-6BezoGYgW5L4C-GfKzkgXWx9SRhDjRKbq5uvbkrwIjBLEBm3qgQPH-m8grnDlX_YeeOb07-XZ8M7JsZG6G9ajAV2ItK3fa4E0KhTZBnhQmh6GJGyMV-rpQlycw",
    "secondaryImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCi_SlSBsLw9Ih6wM-7jfLq1YTj6X5ptlSKiIeXP_Rid4SADS_GzwE372ivTx68EKfVILpXEU2iKSXk1fa93IY2h_ywrJevEmZxtPol6S3msFo2gE6anoPD1GtEnvLX-zQquuKtdW1ZRkamXCCSxo007p1GABjfcDzHHCeKATTjLuNgXx9zqeLZwYWERQ5nLeSApDg9Vo1blWvRPIUS78SSzBKB7yNr40ifw_RaemvoNOdMfiriMEWnoDndHaCNFNZFcXB0i1n_Kctb",
    "benefits": [
      {
        "title": "Blood Sugar",
        "description": "Naturally helps regulate glucose levels through traditional wisdom.",
        "icon": "bloodtype"
      },
      {
        "title": "Skin Health",
        "description": "Rich in antioxidants that combat oxidative stress for a natural glow.",
        "icon": "auto_awesome"
      },
      {
        "title": "Liver & Urinary",
        "description": "A natural detoxifier that supports liver function and urinary tract health.",
        "icon": "shield_with_heart"
      }
    ],
    "contraindications": [
      "Pregnant Women",
      "People on medication for blood sugar",
      "Chronic Constipation (overuse)"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Warm",
        "description": "Bring fresh, filtered water to a gentle boil (approx. 90°C)."
      },
      {
        "step": "02",
        "title": "Steep",
        "description": "Place 1 tsp of dried flowers into your infuser. Steep for 5-7 minutes."
      },
      {
        "step": "03",
        "title": "Invoke",
        "description": "Observe the water turn golden amber. Savor the floral aroma."
      }
    ]
  },
  {
    "id": "betel-leaves",
    "name": "Pure Betel Leaves",
    "scientificName": "Piper Betle",
    "price": 2100,
    "description": "Revered for millennia in Asian wellness rituals, our betel leaves are hand-plucked at dawn to preserve their potent essential oils and pungent, peppery essence.",
    "shortDescription": "Time-honored botanical wisdom for digestive health and oral hygiene.",
    "flavorProfile": "Pungent, peppery, with a lingering, slightly bitter botanical finish.",
    "tags": [
      "Time-Honored Wisdom",
      "Digestive Aid"
    ],
    "category": "Digestion",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDbAvVTK5NVBd5Z2R8Smx2NEKqvf5AZ-80QKroS1EP9vJwFClLv6F9SAhdrpVLSntaW2YHSqEa0ANixwqks97YIlL9TYH0OohswUnZCSsPfp9DRKuVfJnCJIBlKRs_8mBHsRfU2Hvlv6PeD-gTFzNhBE2thxaKBtSlTtPlssTJPJ74qK6LvGZVo-7p0Juumq1uDN3LYx6HptxIGZ5jbk2u6CgUIbE3PB4iTjjS7XFkfPBNn9EUp1BCRdolVhrDue9rgbY32X4fuY_3E",
    "secondaryImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDsAMgXoKrDpCFq5eUo3Z2BjKay4dvFwA6qw3r-kOQhtFssmh_McmosNfeLkTuxnYeSXnX0dLaFTtXjxo2itzRJSqeHulIJGQ8FmjxhOlncUpG6_ylNnN40bYd3yMXyRHajC8GvORjBZs-7qFz4MEyy1BW9TKjMauMeA8rges_W_qOVLy1dwBkMNGGpxHxD18llViXXsHKDM9d_2LBlr1wTnzobZ4X3iV6U-XNu4tIriNOcE7wVPSWCUOdHWc0bwbVaKAmd0dyafzCp",
    "benefits": [
      {
        "title": "Digestive Catalyst",
        "description": "Stimulates the secretion of saliva and gastric enzymes, effectively jump-starting your metabolism.",
        "icon": "auto_awesome"
      },
      {
        "title": "Antiseptic Ritual",
        "description": "Natural antimicrobial properties help maintain oral hygiene and freshen breath naturally.",
        "icon": "health_and_safety"
      },
      {
        "title": "Breath Support",
        "description": "Traditionally used to relieve chest congestion and provide soothing respiratory comfort.",
        "icon": "air"
      }
    ],
    "contraindications": [
      "Pregnant or Nursing mothers",
      "Those with Acid Reflux or Ulcers",
      "Individuals with Bleeding Disorders"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Prepare",
        "description": "Tear 1-2 fresh betel leaves into small pieces to release the volatile oils."
      },
      {
        "step": "02",
        "title": "Steep",
        "description": "Pour 8oz of near-boiling water (190°F) over the leaves. Cover to trap steam."
      },
      {
        "step": "03",
        "title": "Infuse",
        "description": "Allow to steep for 5-7 minutes. Strain and enjoy plain or with honey."
      }
    ]
  },
  {
    "id": "black-nightshade",
    "name": "Black Nightshade Leaves",
    "scientificName": "Solanum Nigrum",
    "price": 1600,
    "description": "Reduces joint pain and swelling; used traditionally for arthritis and liver support.",
    "shortDescription": "Anti-inflammatory botanical dip for liver and ulcer relief.",
    "flavorProfile": "Savory, musky undertones.",
    "tags": [
      "Anti-Inflammatory",
      "Liver Support"
    ],
    "category": "Detox",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuD900JGIAUoB-4UIiPZZ-GOAnk-Z6moi7ju3mm_inw5DuE9SELhRxGmd6LHrP9C_T6gOAEqxwa4dyy4ujf9xE2lGHcnq7QaXckGtyf9qz80n2ig28zl0kzmtd_t_A8DTuylhsMgBoGjzXva34HjbX771vkfPrCyFT2hsEW9lyWWHXzJlqXIwWjkpU2QeLvGCXQR_BO_5emA4S0hyJurN8yoTR2kdZMUuLLdndlDp3qkLYWRjHaq28FNu7NrCF3kRwwc8lOmQ97W2lat",
    "benefits": [
      {
        "title": "Anti-Inflammatory",
        "description": "Reduces joint pain and swelling; used for arthritis.",
        "icon": "healing"
      },
      {
        "title": "Liver Support",
        "description": "Helps detoxify and protect the liver from toxins.",
        "icon": "shield"
      },
      {
        "title": "Ulcer Relief",
        "description": "Soothes skin conditions and helps heal gastric ulcers.",
        "icon": "spa"
      }
    ],
    "contraindications": [
      "Pregnant Women (may cause uterine contractions)",
      "Young Children (unripe berries are toxic)",
      "Kidney Patients"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Steep",
        "description": "Dip the mature leaf bag in near-boiling water."
      },
      {
        "step": "02",
        "title": "Wait",
        "description": "Allow 6-8 minutes for full savory extraction."
      },
      {
        "step": "03",
        "title": "Sip",
        "description": "Enjoy the musky undertones for internal healing."
      }
    ]
  },
  {
    "id": "curry-leaves",
    "name": "Curry Leaves",
    "scientificName": "Murraya Koenigii",
    "price": 449,
    "description": "Stimulates digestive enzymes and reduces bloating while protecting cells from oxidative stress.",
    "shortDescription": "Aromatic leaves for digestion, hair health, and blood sugar.",
    "flavorProfile": "Smoky, citrus-like, nutty.",
    "tags": [
      "Hair Health",
      "Digestion"
    ],
    "category": "Digestion",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuAe8v_2QiW56U-Ofb3VLs_v64I9WgQmyY19Zokbh6sNfXeLFIoO-7bkmplYKCucZ9nNloGoWxvKPJ1iAoK80-6P1tEw_wchuuej9OjS2BX3OJfHuEtwbqMomDXoq_WOUUU-GFtaC-BypJTll4U21b3K3pgq8KBodRYSLLk42k_k8r-HHTdKYqrB_U72OLI_PQ1hUcOjiHl4h6ReQ0xyG5Q1h-iqFPhChvhKnhSEI0YmX4STKwoIIfmcRuHTxusyNFez8CGP_GigZw2Z",
    "benefits": [
      {
        "title": "Aids Digestion",
        "description": "Stimulates digestive enzymes and reduces bloating.",
        "icon": "restaurant"
      },
      {
        "title": "Hair & Skin Health",
        "description": "Strengthens hair roots and reduces dandruff.",
        "icon": "brush"
      },
      {
        "title": "Heart Health",
        "description": "Contains carbazole alkaloids that help lower cholesterol.",
        "icon": "heart"
      }
    ],
    "contraindications": [
      "Pregnant Women (use in moderation)",
      "Patients on Blood Thinners"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Select",
        "description": "Choose fresh dark green leaves."
      },
      {
        "step": "02",
        "title": "Infuse",
        "description": "Infuse in hot water or add to your regular tea."
      },
      {
        "step": "03",
        "title": "Refresh",
        "description": "Enjoy the smoky citrus aroma."
      }
    ]
  },
  {
    "id": "guava-leaves",
    "name": "Guava Leaves",
    "scientificName": "Psidium Guajava",
    "price": 499,
    "description": "Helps lower blood glucose levels and supports insulin function. Reduces diarrhea and promotes gut balance.",
    "shortDescription": "Botanical dip for blood sugar control and digestive health.",
    "flavorProfile": "Mildly bitter, herbal.",
    "tags": [
      "Blood Sugar Control",
      "Digestive Health"
    ],
    "category": "Digestion",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuBR0ao10AtaSfsGhxGd85YD60Th8B6y7DKp6Fd4oTloFw3LNi0Kf5hmw1KjwaipWdVsFZz-BkO8LalD4Uhy1kT6bkEet3caqkXR_fLETF9CYPFJLNwu2JJi7hHsZTaqtin7sUxdZP7dlXLuwQPx2EWNLh0gUIhXZd1_wLSeU3P9u22-tAP9NPlYpdW0Z8sNqOBNPuS8RhTFPQZNx19DEHJwxa6c9wJ3gDcxAmquSWFOCG4OkSHcKVZxRWNoGb7WxQrFtj3v2-n3UiWp",
    "benefits": [
      {
        "title": "Blood Sugar Control",
        "description": "Helps lower blood glucose levels and supports insulin function.",
        "icon": "monitor_heart"
      },
      {
        "title": "Digestive Health",
        "description": "Reduces diarrhea, bloating, and promotes gut balance.",
        "icon": "spa"
      },
      {
        "title": "Weight Loss Aid",
        "description": "Boosts metabolism and helps burn fat naturally.",
        "icon": "fitness_center"
      }
    ],
    "contraindications": [
      "Pregnant Women (use with caution)",
      "Chronic Constipation (overuse can worsen symptoms)"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Dip",
        "description": "Place the leaf dip bag in your favorite ceramic mug."
      },
      {
        "step": "02",
        "title": "Infuse",
        "description": "Pour 200ml of boiling water and steep for 5 minutes."
      },
      {
        "step": "03",
        "title": "Restore",
        "description": "Enjoy warm to aid digestion."
      }
    ]
  },
  {
    "id": "horse-gram",
    "name": "Horse Gram (Kollu) Blend",
    "scientificName": "Macrotyloma Uniflorum",
    "price": 599,
    "description": "A powerful legume-based blend designed for metabolic support and detoxification.",
    "shortDescription": "Aids weight loss, fat metabolism, and flushes out toxins.",
    "flavorProfile": "Earthy, nutty.",
    "tags": [
      "Metabolism Boost",
      "Natural Detox"
    ],
    "category": "Weight",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuBR0ao10AtaSfsGhxGd85YD60Th8B6y7DKp6Fd4oTloFw3LNi0Kf5hmw1KjwaipWdVsFZz-BkO8LalD4Uhy1kT6bkEet3caqkXR_fLETF9CYPFJLNwu2JJi7hHsZTaqtin7sUxdZP7dlXLuwQPx2EWNLh0gUIhXZd1_wLSeU3P9u22-tAP9NPlYpdW0Z8sNqOBNPuS8RhTFPQZNx19DEHJwxa6c9wJ3gDcxAmquSWFOCG4OkSHcKVZxRWNoGb7WxQrFtj3v2-n3UiWp",
    "benefits": [
      {
        "title": "Weight Management",
        "description": "Aids fat loss and boosts metabolism naturally.",
        "icon": "fitness_center"
      },
      {
        "title": "Detox Support",
        "description": "Flushes out toxins and promotes kidney health.",
        "icon": "eco"
      },
      {
        "title": "Protein Rich",
        "description": "Builds muscle strength and combats fatigue.",
        "icon": "bolt"
      }
    ],
    "contraindications": [
      "Pregnant Women",
      "Kidney Stone Patients (high oxalate)",
      "Gastritis or Ulcers"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Heat",
        "description": "Heat water to rolling boil."
      },
      {
        "step": "02",
        "title": "Infuse",
        "description": "Add 1 tsp and steep for 8-10 minutes."
      },
      {
        "step": "03",
        "title": "Enjoy",
        "description": "Drink warm for best results."
      }
    ]
  },
  {
    "id": "jamun-leaves",
    "name": "Jamun Leaves",
    "scientificName": "Syzygium Cumini",
    "price": 1800,
    "description": "Contains jamboline and alkaloids that help regulate glucose levels, making it beneficial for Type-2 diabetes patients.",
    "shortDescription": "Traditional blood sugar control and cardiovascular support.",
    "flavorProfile": "Mildly bitter, earthy.",
    "tags": [
      "Blood Sugar Control",
      "Heart Health"
    ],
    "category": "Digestion",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDbAvVTK5NVBd5Z2R8Smx2NEKqvf5AZ-80QKroS1EP9vJwFClLv6F9SAhdrpVLSntaW2YHSqEa0ANixwqks97YIlL9TYH0OohswUnZCSsPfp9DRKuVfJnCJIBlKRs_8mBHsRfU2Hvlv6PeD-gTFzNhBE2thxaKBtSlTtPlssTJPJ74qK6LvGZVo-7p0Juumq1uDN3LYx6HptxIGZ5jbk2u6CgUIbE3PB4iTjjS7XFkfPBNn9EUp1BCRdolVhrDue9rgbY32X4fuY_3E",
    "benefits": [
      {
        "title": "Blood Sugar Control",
        "description": "Contains jamboline which helps regulate glucose levels.",
        "icon": "monitor_heart"
      },
      {
        "title": "Digestive Aid",
        "description": "Improves liver function, prevents bloating, and supports gut health.",
        "icon": "spa"
      },
      {
        "title": "Immunity Boost",
        "description": "Flavonoids and polyphenols protect cells from oxidative stress.",
        "icon": "shield"
      }
    ],
    "contraindications": [
      "Diabetics on Medication (may cause hypoglycemia)",
      "Pregnant & Nursing Women",
      "Kidney Patients"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Rinse",
        "description": "Clean thoroughly and bruise the leaves slightly."
      },
      {
        "step": "02",
        "title": "Boil",
        "description": "Boil in 10oz of water until it reduces slightly."
      },
      {
        "step": "03",
        "title": "Drink",
        "description": "Strain and consume twice daily for best results."
      }
    ]
  },
  {
    "id": "moringa-leaves",
    "name": "Pure Moringa Leaves",
    "scientificName": "Moringa Oleifera",
    "price": 2400,
    "description": "The 'Miracle Tree' of ancient times, harvested at peak potency to restore your natural rhythm and vitality.",
    "shortDescription": "Nutrient-dense superfood for energy, immunity, and bone health.",
    "flavorProfile": "Bitter, peppery, grassy.",
    "tags": [
      "The Miracle Tree",
      "Nutrient Powerhouse"
    ],
    "category": "Immunity",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuALM8wDkfFHeizppRDjSy8TF9y6VJP2ddsGdUUVv0OwdFbyCS6EapMjLZS_g9U1wD8cqu7W8lLBiLONeguaB2Rb57KQ_8Bj8G-YCpAKwCANaCM_TvuLksdCg7d7GmWO1Ff2pbdJbIXS--wR2_JCY50gPuuOGxKvBdvF6eFFC2Enrh0-kPE8KVRPZZI0GOMziLhI45F1fzaQFAOHqdDJkmbbccc0F42h5aJW6GA7o_nJa1myOcXqciBLXF-MUMf97r1oEgcAd7P1Gfru",
    "secondaryImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCECw40BCvd3La9qYIiHOb1mnOF1XR_0n1xIUnBqWVx5TO66-N0AadqGKJqbmoa5ylUjXcm9tV0JY1Rlk7RPjP_QkUSV6L-j9ci7ZAE0fQvsRYOZmLEDPZ9h7IBSRam1iYUwu2U1kBJPwIJddJwjq8rgQOEa0vQeUapkUu23ljYLk6C1a1D7A0ldpT8KQ5FxZHxIxUDuxmpieEGCM-w6IDKJsEhhMLRadNisaMX59VV6XyH2m91HyPKMZNCuKupI1WJikSBDHcPDtYO",
    "benefits": [
      {
        "title": "Energy & Vitality",
        "description": "Sustained energy release without the caffeine crash, supporting mental clarity.",
        "icon": "energy_savings_leaf"
      },
      {
        "title": "Nutrient Powerhouse",
        "description": "Packed with vitamins A, C, calcium, iron, and protein for overall nutrition.",
        "icon": "medical_services"
      },
      {
        "title": "Systemic Support",
        "description": "Aids in blood sugar control and provide anti-inflammatory benefits.",
        "icon": "blood_pressure"
      }
    ],
    "contraindications": [
      "Pregnant Women (may cause uterine contractions)",
      "Low Blood Pressure Patients",
      "Thyroid Disorders"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Warm",
        "description": "Heat water to 80°C (176°F). Avoid boiling to preserve delicate enzymes."
      },
      {
        "step": "02",
        "title": "Steep",
        "description": "Add 1 tsp of Moringa. Steep for 3-5 minutes until the infusion turns bright lime green."
      },
      {
        "step": "03",
        "title": "Sip",
        "description": "Sip mindfully. For a smoother finish, add a drop of wild honey or lemon."
      }
    ]
  },
  {
    "id": "tulasi-leaves",
    "name": "Tulasi (Holy Basil)",
    "scientificName": "Ocimum Sanctum",
    "price": 2000,
    "description": "Known as the 'Queen of Herbs,' Tulasi is a sacred botanical treasure celebrated for centuries for its adaptogenic properties.",
    "shortDescription": "Sacred herb for stress relief, immunity, and respiratory health.",
    "flavorProfile": "Sweet, slightly spicy, highly aromatic.",
    "tags": [
      "Adaptogen",
      "Pure Leaf"
    ],
    "category": "Immunity",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuD900JGIAUoB-4UIiPZZ-GOAnk-Z6moi7ju3mm_inw5DuE9SELhRxGmd6LHrP9C_T6gOAEqxwa4dyy4ujf9xE2lGHcnq7QaXckGtyf9qz80n2ig28zl0kzmtd_t_A8DTuylhsMgBoGjzXva34HjbX771vkfPrCyFT2hsEW9lyWWHXzJlqXIwWjkpU2QeLvGCXQR_BO_5emA4S0hyJurN8yoTR2kdZMUuLLdndlDp3qkLYWRjHaq28FNu7NrCF3kRwwc8lOmQ97W2lat",
    "secondaryImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCn_-E6Oe3XWvEtiGvDVpAOu9Tkq4EyuOR9i8oiJIdkpfnuaSB9GjH9ljXf2rhm-n803NLBMMFkDT7zwojDm0Gd6gjoEb7hoR1UZL55q3pevS1Lir-fkHBMRUtczQkSgEmr19Ugo77lkVCQAhF-PUwkAcQnv0e_D5KmgUs7kPZmFpXEy5ny9PgfwZShyby1-fWSmZ5o4M6CB5LTWq5AAPHpFuTK9cBPVeFHSEjRCo33Hwc5ylZYDlp-en1n6s0Ia80gw6GKOvDMx4KY",
    "benefits": [
      {
        "title": "Stress Relief",
        "description": "Powerful adaptogen to lower cortisol and balance the spirit.",
        "icon": "psychology"
      },
      {
        "title": "Respiratory Health",
        "description": "Eases coughs, colds, and congestion, supporting clear breathing.",
        "icon": "respiratory_rate"
      },
      {
        "title": "Boosts Immunity",
        "description": "Strengthens immune defense and helps fight infections.",
        "icon": "shield"
      }
    ],
    "contraindications": [
      "Pregnant Women (may affect hormone levels)",
      "Bleeding Disorders",
      "Low Blood Pressure Patients"
    ],
    "brewingRitual": [
      {
        "step": "01",
        "title": "Preparation",
        "description": "Warm your ceramic vessel. Add 1-2 teaspoons of dried Tulasi leaves per 8oz of water."
      },
      {
        "step": "02",
        "title": "Infusion",
        "description": "Pour water just off the boil. Steep for 5-7 minutes as it turns golden amber."
      },
      {
        "step": "03",
        "title": "Presence",
        "description": "Sip slowly. Feel the warmth move from your throat to your chest."
      }
    ]
  }
];
