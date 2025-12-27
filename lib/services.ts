export type ServiceKey =
  | "staircase"
  | "bathroom"
  | "floor"
  | "pantry_top"
  | "waterproofing"
  | "double_nosing";

export type RateUnit = "LKR/sqft" | "LKR/ft" | "LKR/job";

export const SERVICES: {
  key: ServiceKey;
  label: string;
  unit: RateUnit;
}[] = [
  { key: "staircase", label: "Staircase", unit: "LKR/sqft" },
  { key: "bathroom", label: "Bathroom", unit: "LKR/sqft" },
  { key: "floor", label: "Floor", unit: "LKR/sqft" },
  { key: "pantry_top", label: "Pantry Top", unit: "LKR/ft" },
  { key: "waterproofing", label: "Waterproofing", unit: "LKR/sqft" },
  { key: "double_nosing", label: "Double Nosing", unit: "LKR/ft" },
];