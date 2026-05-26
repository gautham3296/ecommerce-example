/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  contraindications: string[];
  brewingRitual: {
    step: string;
    title: string;
    description: string;
  }[];
  flavorProfile: string;
  heroImage: string;
  secondaryImage?: string;
  tertiaryImage?: string;
  tags: string[];
  category: "Digestion" | "Immunity" | "Skin" | "Weight" | "Detox";
}

export interface CartItem extends Product {
  quantity: number;
}
