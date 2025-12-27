/* =========================
   ROLES
========================= */

export type Role = "homeowner" | "tiler";

/* =========================
   PROFILE (UPGRADED)
========================= */

export type ServiceKey =
  | "staircase"
  | "bathroom"
  | "floor"
  | "pantry_top"
  | "waterproofing"
  | "double_nosing";

export type RateUnit = "LKR/sqft" | "LKR/ft" | "LKR/job";

export type ServiceRateItem = {
  rate: number | null;
  unit: RateUnit;
  photo_path: string | null;
};

export type ServiceRates = Partial<Record<ServiceKey, ServiceRateItem>>;

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

  /* Images */
  avatar_path?: string | null;
  cover_path?: string | null;

  /* Services */
  service_rates?: ServiceRates;

  /* Flow control */
  profile_completed?: boolean;
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