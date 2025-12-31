/* =========================
   ROLES
========================= */

export type Role = "homeowner" | "tiler";

/* =========================
   PROFILE (UPGRADED)
========================= */

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

export type ServiceRateItem = {
  rate: number | null;
  unit: RateUnit;
  photo_path: string | null;
};

export type ServiceRates = Partial<Record<ServiceKey, ServiceRateItem>>;

export type AvailabilityStatus = "available" | "busy" | "unavailable";

export type Profile = {
  id: string;
  role: Role;

  /* Existing fields */
  display_name: string | null;
  full_name?: string | null;
  district: string | null;
  city: string | null;
  created_at: string;

  /* New identity fields */
  nic_no?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  bio?: string | null;

  /* Images */
  avatar_path?: string | null;
  cover_path?: string | null;

  /* Services */
  service_rates?: ServiceRates;

  /* Availability & Working Areas */
  working_districts?: string[];
  availability_status?: AvailabilityStatus;

  /* Verification & Experience */
  is_verified?: boolean;
  years_experience?: number | null;
  completed_jobs?: number;

  /* Flow control */
  profile_completed?: boolean;
};

/* =========================
   PORTFOLIO
========================= */

export type PortfolioItem = {
  id: string;
  tiler_id: string;
  title: string;
  description: string | null;
  service_type: string | null;
  image_path: string;
  before_image_path: string | null;
  location: string | null;
  completed_date: string | null;
  created_at: string;
  is_featured: boolean;
};

/* =========================
   TASKS
========================= */

export type TaskStatus = "open" | "awarded" | "closed";

export type Task = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

/* =========================
   TASK PHOTOS
========================= */

export type TaskPhoto = {
  id: string;
  task_id: string;
  storage_path: string;
  created_at: string;
};

/* =========================
   BIDS
========================= */

export type BidStatus =
  | "active"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "revision_requested";

export type Bid = {
  id: string;
  task_id: string;
  tiler_id: string;
  amount: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
  updated_at?: string;
};

/* =========================
   CONVERSATIONS
========================= */

export type Conversation = {
  id: string;
  task_id: string;
  homeowner_id: string;
  tiler_id: string;
  created_at: string;
};

/* =========================
   MESSAGES
========================= */

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string | null;
  attachment_path: string | null;
  created_at: string;
};

/* =========================
   BID CHANGE REQUESTS
========================= */

export type BidChangeRequestStatus = "open" | "resolved" | "cancelled";

export type BidChangeRequest = {
  id: string;
  bid_id: string;
  task_id: string;
  homeowner_id: string;
  tiler_id: string;
  message: string | null;
  status: BidChangeRequestStatus;
  created_at: string;
};

/* =========================
   CERTIFICATIONS
========================= */

export type Certification = {
  id: string;
  tiler_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_number: string | null;
  image_path: string | null;
  description: string | null;
  created_at: string;
};