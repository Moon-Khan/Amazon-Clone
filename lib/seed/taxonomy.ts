// Amazon-style category taxonomy, mapped from DummyJSON's flat 24-category
// list (see `curl https://dummyjson.com/products/category-list`). Every
// DummyJSON category slug appears in exactly one leaf below.

export type TaxonomyNode = {
  slug: string;
  name: string;
  children?: TaxonomyLeaf[];
  dummyjsonCategories?: string[]; // only set on childless top-level nodes
};

export type TaxonomyLeaf = {
  slug: string;
  name: string;
  dummyjsonCategories: string[];
};

export const CATEGORY_TAXONOMY: TaxonomyNode[] = [
  {
    slug: "electronics",
    name: "Electronics",
    children: [
      { slug: "electronics-phones-tablets", name: "Smartphones & Tablets", dummyjsonCategories: ["smartphones", "tablets"] },
      { slug: "electronics-laptops", name: "Laptops", dummyjsonCategories: ["laptops"] },
      { slug: "electronics-mobile-accessories", name: "Mobile Accessories", dummyjsonCategories: ["mobile-accessories"] },
    ],
  },
  {
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    children: [
      { slug: "beauty-skin-care", name: "Skin Care", dummyjsonCategories: ["skin-care"] },
      { slug: "beauty-fragrances", name: "Fragrances", dummyjsonCategories: ["fragrances"] },
      { slug: "beauty-makeup", name: "Makeup", dummyjsonCategories: ["beauty"] },
    ],
  },
  {
    slug: "mens-fashion",
    name: "Men's Fashion",
    children: [
      { slug: "mens-shirts", name: "Shirts", dummyjsonCategories: ["mens-shirts"] },
      { slug: "mens-shoes", name: "Shoes", dummyjsonCategories: ["mens-shoes"] },
      { slug: "mens-watches", name: "Watches", dummyjsonCategories: ["mens-watches"] },
    ],
  },
  {
    slug: "womens-fashion",
    name: "Women's Fashion",
    children: [
      { slug: "womens-tops", name: "Tops", dummyjsonCategories: ["tops"] },
      { slug: "womens-dresses", name: "Dresses", dummyjsonCategories: ["womens-dresses"] },
      { slug: "womens-shoes", name: "Shoes", dummyjsonCategories: ["womens-shoes"] },
      { slug: "womens-bags", name: "Bags", dummyjsonCategories: ["womens-bags"] },
      { slug: "womens-jewellery", name: "Jewellery", dummyjsonCategories: ["womens-jewellery"] },
      { slug: "womens-watches", name: "Watches", dummyjsonCategories: ["womens-watches"] },
    ],
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    children: [
      { slug: "home-furniture", name: "Furniture", dummyjsonCategories: ["furniture"] },
      { slug: "home-decoration", name: "Home Decoration", dummyjsonCategories: ["home-decoration"] },
      { slug: "home-kitchen-accessories", name: "Kitchen Accessories", dummyjsonCategories: ["kitchen-accessories"] },
    ],
  },
  {
    slug: "grocery",
    name: "Grocery",
    dummyjsonCategories: ["groceries"],
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    dummyjsonCategories: ["sports-accessories"],
  },
  {
    slug: "automotive",
    name: "Automotive",
    children: [
      { slug: "automotive-motorcycle", name: "Motorcycle", dummyjsonCategories: ["motorcycle"] },
      { slug: "automotive-vehicle", name: "Vehicle Accessories", dummyjsonCategories: ["vehicle"] },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    dummyjsonCategories: ["sunglasses"],
  },
];

/** Maps a DummyJSON category slug -> our leaf category slug (the one Products attach to). */
export function buildDummyjsonCategoryMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const node of CATEGORY_TAXONOMY) {
    const leaves = node.children ?? [{ slug: node.slug, name: node.name, dummyjsonCategories: node.dummyjsonCategories ?? [] }];
    for (const leaf of leaves) {
      for (const dj of leaf.dummyjsonCategories) {
        map.set(dj, leaf.slug);
      }
    }
  }
  return map;
}
