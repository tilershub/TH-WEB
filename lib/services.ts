export type ServiceKey =
  | "floor_tiling"
  | "wall_tiling"
  | "staircase_tiling"
  | "bathroom_tiling"
  | "pantry_backsplash"
  | "waterproofing"
  | "screed"
  | "demolition"
  | "nosing"
  | "construction"
  | "plumbing"
  | "electrical"
  | "painting"
  | "carpentry"
  | "masonry"
  | "roofing"
  | "landscaping"
  | "cleaning";

export type RateUnit = "LKR/sqft" | "LKR/ft" | "LKR/job" | "LKR/step";

export const SERVICES: {
  key: ServiceKey;
  label: string;
  description: string;
  unit: RateUnit;
}[] = [
  { 
    key: "floor_tiling", 
    label: "බිම් ටයිල් කිරීම", 
    description: "බිම් සඳහා ටයිල් කිරීම - ග්‍රවුන්ඩ් ෆ්ලෝර්, උඩු මහල් ආදී.",
    unit: "LKR/sqft" 
  },
  { 
    key: "wall_tiling", 
    label: "බිත්ති ටයිල් කිරීම", 
    description: "ඕනෑම කාමරයක බිත්ති ටයිල් කිරීම",
    unit: "LKR/sqft" 
  },
  { 
    key: "staircase_tiling", 
    label: "පඩිපෙළ ටයිල් කිරීම", 
    description: "පඩිපෙළ, පියවිසි හා ලැන්ඩිං සඳහා ටයිල් කිරීම",
    unit: "LKR/step" 
  },
  { 
    key: "bathroom_tiling", 
    label: "නානකාමර ටයිල් කිරීම", 
    description: "නානකාමර බිත්ති සහ බිම සඳහා සම්පූර්ණ ටයිල් කිරීම",
    unit: "LKR/sqft" 
  },
  { 
    key: "pantry_backsplash", 
    label: "පෑන්ට්‍රි ටොප්/බැක්ස්ප්ලෑෂ්", 
    description: "පෑන්ට්‍රි ටොප් සහ බැක්ස්ප්ලෑෂ් සඳහා ටයිල්/ග්‍රැනයිට් වැඩ",
    unit: "LKR/ft" 
  },
  { 
    key: "waterproofing", 
    label: "ජලරෝධනය", 
    description: "නානකාමර සහ තෙත් ප්‍රදේශ සඳහා ජලරෝධන සේවාව",
    unit: "LKR/sqft" 
  },
  { 
    key: "screed", 
    label: "ස්ක్రీඩ් වැඩ", 
    description: "ටයිල් කිරීමට පෙර බිම් ස්ක್ರೀඩ් සකස් කිරීම",
    unit: "LKR/sqft" 
  },
  { 
    key: "demolition", 
    label: "විනාශ කිරීමේ වැඩ", 
    description: "පවතින ටයිල් සහ පෘෂ්ඨ ඉවත් කිරීම",
    unit: "LKR/sqft" 
  },
  { 
    key: "nosing", 
    label: "නෝසිං (එජ් ෆිනිෂින්)", 
    description: "ඩබල්/සිංගල් නෝසිං සහ එජ් ෆිනිෂින් වැඩ",
    unit: "LKR/ft" 
  },
  { 
    key: "construction", 
    label: "නව ගොඩනැගිලි/අලුත්වැඩියා", 
    description: "ගොඩනැගිලි ඉදිකිරීම සහ අලුත්වැඩියා සේවා",
    unit: "LKR/job" 
  },
  { 
    key: "plumbing", 
    label: "ප්ලම්බින්", 
    description: "ජල හා නාලිකා වැඩ",
    unit: "LKR/job" 
  },
  { 
    key: "electrical", 
    label: "විදුලි වැඩ", 
    description: "වයර්, ලයිට්, සහ විදුලි පද්ධති",
    unit: "LKR/job" 
  },
  { 
    key: "painting", 
    label: "පේන්ට් කිරීම", 
    description: "අභ්‍යන්තර හා බාහිර පේන්ට් වැඩ",
    unit: "LKR/sqft" 
  },
  { 
    key: "carpentry", 
    label: "වඩු වැඩ", 
    description: "ලී වැඩ, කැබිනට්, දොර/කවුළු",
    unit: "LKR/job" 
  },
  { 
    key: "masonry", 
    label: "මැසිවන් වැඩ", 
    description: "ගඩොල්/කොන්ක්‍රීට් බිත්ති සහ ඉදිකිරීම්",
    unit: "LKR/sqft" 
  },
  { 
    key: "roofing", 
    label: "මහල/වරළ (රුෆින්)", 
    description: "ඉස්සරළි/අලුත්වැඩියා රුෆින් සේවා",
    unit: "LKR/sqft" 
  },
  { 
    key: "landscaping", 
    label: "උද්‍යානය/ලෑන්ඩ්ස්කේපින්", 
    description: "ගස් ලගාව, උද්‍යාන සැකසුම්",
    unit: "LKR/job" 
  },
  { 
    key: "cleaning", 
    label: "පිරිසිදු කිරීම", 
    description: "ගොඩනැගිලි සහ ඉදිකිරීම් පසු පිරිසිදු කිරීම",
    unit: "LKR/job" 
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
