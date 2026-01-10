/* =========================
   ROLES
========================= */

export type Role = 'homeowner' | 'tasker';

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
  is_admin?: boolean;
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

  // ✅ NEW: thumbnail image saved on task row
  cover_image?: string | null;

    /**
     * Optional city for this task. When using the simplified posting flow
     * (Task Hub), the city represents the general location of the job. It
     * replaces the more free‑form `location_text` when available. This
     * field may be null for older tasks that were created without a city.
     */
    city?: string | null;

    /**
     * Indicates how the start date for the task should be interpreted. A value
     * of "asap" means the job should start as soon as possible, whereas
     * "date" means a specific date is provided in `start_date`. This field
     * will be null for legacy tasks created before the simplified posting flow.
     */
    start_date_type?: string | null;

    /**
     * The scheduled start date for the task when `start_date_type` is "date".
     * Stored as an ISO 8601 string (YYYY‑MM‑DD) or null when not applicable.
     */
    start_date?: string | null;

    /**
     * A list of service identifiers for this task. These correspond to the
     * keys defined in the SERVICES constant in `lib/services.ts`. When using
     * the simplified posting flow, tasks can involve one or more services.
     * This field may be null for legacy tasks.
     */
    service_ids?: string[] | null;
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
   SERVICES & SUB-SERVICES
========================= */

export type Service = {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
};

export type SubService = {
  id: string;
  service_id: string;
  name: string;
  unit: "sq.ft" | "lin.ft" | "item" | "hour" | "day" | "fixed";
  default_price: number | null;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type TaskerSubService = {
  id: string;
  tasker_id: string;
  sub_service_id: string;
  price: number;
  currency: string;
  image_path: string | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
