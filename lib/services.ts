export type ServiceKey =
  | "floor_tiling"
  | "wall_tiling"
  | "staircase_tiling"
  | "bathroom_tiling"
  | "pantry_backsplash"
  | "waterproofing"
  | "screed"
  | "demolition"
  | "nosing";

export type RateUnit = "LKR/sqft" | "LKR/ft" | "LKR/job" | "LKR/step";

export const SERVICES: {
  key: ServiceKey;
  label: string;
  description: string;
  unit: RateUnit;
}[] = [
  { 
    key: "floor_tiling", 
    label: "Floor Tiling", 
    description: "Tiling for floors - ground floor, upper floors, etc.",
    unit: "LKR/sqft" 
  },
  { 
    key: "wall_tiling", 
    label: "Wall Tiling", 
    description: "Tiling for walls in any room",
    unit: "LKR/sqft" 
  },
  { 
    key: "staircase_tiling", 
    label: "Staircase Tiling", 
    description: "Tiling for staircases including steps, risers, and landings",
    unit: "LKR/step" 
  },
  { 
    key: "bathroom_tiling", 
    label: "Bathroom Tiling", 
    description: "Complete bathroom tiling (walls and floor)",
    unit: "LKR/sqft" 
  },
  { 
    key: "pantry_backsplash", 
    label: "Pantry Top / Backsplash", 
    description: "Granite/tile work for pantry tops and backsplashes",
    unit: "LKR/ft" 
  },
  { 
    key: "waterproofing", 
    label: "Waterproofing", 
    description: "Waterproofing service for bathrooms and wet areas",
    unit: "LKR/sqft" 
  },
  { 
    key: "screed", 
    label: "Screed Work", 
    description: "Floor screed preparation before tiling",
    unit: "LKR/sqft" 
  },
  { 
    key: "demolition", 
    label: "Demolition Work", 
    description: "Removal of existing tiles and surfaces",
    unit: "LKR/sqft" 
  },
  { 
    key: "nosing", 
    label: "Nosing (Edge Finishing)", 
    description: "Double/single nosing and edge finishing work",
    unit: "LKR/ft" 
  },
];

export const TILE_SIZES = [
  "1×1",
  "2×1",
  "2×2",
  "4×2",
  "300×300",
  "300×600",
  "600×600",
  "Other",
];

export const MATERIALS = [
  "Tile",
  "Mosaic",
  "Granite",
  "Marble",
  "Porcelain",
  "Other",
];
