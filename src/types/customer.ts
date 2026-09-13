export type CustomerView = "all" | "new" | "returning" | "high-value" | "no-orders";
export type CustomerTypeFilter = "all" | Exclude<CustomerView, "all">;
export type CustomerOrdersFilter = "all" | "none" | "one" | "repeat" | "five-plus";
export type CustomerSpentFilter = "all" | "zero" | "under-100" | "100-500" | "over-500";
export type CustomerJoinedFilter = "all" | "7-days" | "30-days" | "this-year";
export type CustomerSort =
  | "active-newest"
  | "active-oldest"
  | "newest"
  | "oldest"
  | "orders-high"
  | "spent-high"
  | "spent-low"
  | "name-asc"
  | "name-desc";

export interface CustomerAddress {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
}

export interface CustomerNote {
  id: number;
  text: string;
  date: string;
  author: string;
}
export interface CustomerTimelineEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
}

/** Normalized customer data used by the dashboard. */
export interface Customer {
  id: number;
  userId?: number | null;
  username?: string;
  lastActiveDate?: string | null;
  dateRegisteredLocal?: string | null;
  lastActiveDateLocal?: string | null;
  hasAverageOrderValue?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  dateCreated: string;
  billing: CustomerAddress;
  shipping: CustomerAddress;
  ordersCount: number;
  paidOrdersCount?: number;
  totalSpent: string;
  averageOrderValue: string;
  lastOrderDate: string | null;
  tags: string[];
  currency: string;
}

export interface CustomerDetails extends Customer {
  readOnly?: boolean;
  daysSinceLastOrder?: number | null;
  firstOrderDate: string | null;
  refundsCount: number;
  favoriteCategory: string;
  notes: CustomerNote[];
  timeline: CustomerTimelineEvent[];
}
