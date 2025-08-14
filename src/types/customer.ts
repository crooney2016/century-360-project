export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: "billing" | "shipping" | "both";
  isDefault: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  name: string;
  type: "wholesale" | "retail";
  status: "active" | "inactive" | "pending";
  tier: "bronze" | "silver" | "gold" | "platinum";
  industry: string;
  website?: string;
  notes?: string;
  creditLimit: number;
  balance: number;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  contacts: Contact[];
}

export interface CustomerFilters {
  type?: "wholesale" | "retail";
  status?: "active" | "inactive" | "pending";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  industry?: string;
  search?: string;
}

export interface CustomerSort {
  field: "name" | "type" | "status" | "tier" | "totalRevenue" | "lastOrderDate" | "createdAt";
  direction: "asc" | "desc";
}
