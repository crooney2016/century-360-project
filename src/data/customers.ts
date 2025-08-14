import { Customer } from "../types/customer";

export const demoCustomers: Customer[] = [
  // Wholesale Customers
  {
    id: "cust_001",
    name: "Global Electronics Distributors",
    type: "wholesale",
    status: "active",
    tier: "platinum",
    industry: "Electronics",
    website: "https://globaled.com",
    notes: "Major distributor for consumer electronics across North America",
    creditLimit: 500000,
    balance: 125000,
    totalOrders: 156,
    totalRevenue: 2850000,
    lastOrderDate: "2024-01-15",
    createdAt: "2020-03-15",
    updatedAt: "2024-01-20",
    addresses: [
      {
        id: "addr_001",
        street: "1234 Tech Boulevard",
        city: "San Jose",
        state: "CA",
        zipCode: "95123",
        country: "USA",
        type: "both",
        isDefault: true,
      },
      {
        id: "addr_002",
        street: "5678 Innovation Drive",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        country: "USA",
        type: "shipping",
        isDefault: false,
      },
    ],
    contacts: [
      {
        id: "cont_001",
        name: "Sarah Johnson",
        email: "sarah.johnson@globaled.com",
        phone: "+1-555-0123",
        role: "Procurement Manager",
        isPrimary: true,
      },
      {
        id: "cont_002",
        name: "Mike Chen",
        email: "mike.chen@globaled.com",
        phone: "+1-555-0124",
        role: "Operations Director",
        isPrimary: false,
      },
    ],
  },
  {
    id: "cust_002",
    name: "Metro Office Supplies Co.",
    type: "wholesale",
    status: "active",
    tier: "gold",
    industry: "Office Supplies",
    website: "https://metrooffice.com",
    notes: "Regional office supply distributor serving 5 states",
    creditLimit: 250000,
    balance: 45000,
    totalOrders: 89,
    totalRevenue: 1200000,
    lastOrderDate: "2024-01-10",
    createdAt: "2021-06-20",
    updatedAt: "2024-01-18",
    addresses: [
      {
        id: "addr_003",
        street: "456 Business Park Way",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_003",
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@metrooffice.com",
        phone: "+1-555-0125",
        role: "Purchasing Director",
        isPrimary: true,
      },
    ],
  },
  {
    id: "cust_003",
    name: "Industrial Parts Supply",
    type: "wholesale",
    status: "active",
    tier: "silver",
    industry: "Manufacturing",
    website: "https://industrialparts.com",
    notes: "Specialized in automotive and aerospace parts",
    creditLimit: 150000,
    balance: 75000,
    totalOrders: 67,
    totalRevenue: 850000,
    lastOrderDate: "2024-01-05",
    createdAt: "2022-01-10",
    updatedAt: "2024-01-12",
    addresses: [
      {
        id: "addr_004",
        street: "789 Industrial Avenue",
        city: "Detroit",
        state: "MI",
        zipCode: "48201",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_004",
        name: "David Thompson",
        email: "david.thompson@industrialparts.com",
        phone: "+1-555-0126",
        role: "Supply Chain Manager",
        isPrimary: true,
      },
    ],
  },
  // Retail Customers
  {
    id: "cust_004",
    name: "Tech Haven Store",
    type: "retail",
    status: "active",
    tier: "gold",
    industry: "Retail",
    website: "https://techhaven.com",
    notes: "Premium electronics retail store with 3 locations",
    creditLimit: 100000,
    balance: 25000,
    totalOrders: 234,
    totalRevenue: 1800000,
    lastOrderDate: "2024-01-18",
    createdAt: "2019-11-05",
    updatedAt: "2024-01-22",
    addresses: [
      {
        id: "addr_005",
        street: "321 Mall Plaza",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_005",
        name: "Alex Kim",
        email: "alex.kim@techhaven.com",
        phone: "+1-555-0127",
        role: "Store Manager",
        isPrimary: true,
      },
    ],
  },
  {
    id: "cust_005",
    name: "Home & Garden Center",
    type: "retail",
    status: "active",
    tier: "silver",
    industry: "Home & Garden",
    website: "https://homegarden.com",
    notes: "Family-owned home improvement and garden center",
    creditLimit: 75000,
    balance: 15000,
    totalOrders: 156,
    totalRevenue: 950000,
    lastOrderDate: "2024-01-12",
    createdAt: "2020-08-15",
    updatedAt: "2024-01-16",
    addresses: [
      {
        id: "addr_006",
        street: "654 Garden Street",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_006",
        name: "Emma Wilson",
        email: "emma.wilson@homegarden.com",
        phone: "+1-555-0128",
        role: "Owner",
        isPrimary: true,
      },
    ],
  },
  {
    id: "cust_006",
    name: "Fashion Forward Boutique",
    type: "retail",
    status: "active",
    tier: "bronze",
    industry: "Fashion",
    website: "https://fashionforward.com",
    notes: "Trendy fashion boutique for young professionals",
    creditLimit: 50000,
    balance: 8000,
    totalOrders: 89,
    totalRevenue: 450000,
    lastOrderDate: "2024-01-08",
    createdAt: "2021-03-20",
    updatedAt: "2024-01-14",
    addresses: [
      {
        id: "addr_007",
        street: "987 Style Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_007",
        name: "Sophia Martinez",
        email: "sophia.martinez@fashionforward.com",
        phone: "+1-555-0129",
        role: "Store Owner",
        isPrimary: true,
      },
    ],
  },
  {
    id: "cust_007",
    name: "Sports Equipment Plus",
    type: "retail",
    status: "inactive",
    tier: "bronze",
    industry: "Sports",
    website: "https://sportsequipmentplus.com",
    notes: "Specialized sports equipment store - temporarily closed",
    creditLimit: 30000,
    balance: 5000,
    totalOrders: 45,
    totalRevenue: 280000,
    lastOrderDate: "2023-11-15",
    createdAt: "2021-09-10",
    updatedAt: "2023-12-01",
    addresses: [
      {
        id: "addr_008",
        street: "147 Sports Lane",
        city: "Denver",
        state: "CO",
        zipCode: "80201",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_008",
        name: "James Brown",
        email: "james.brown@sportsequipmentplus.com",
        phone: "+1-555-0130",
        role: "Manager",
        isPrimary: true,
      },
    ],
  },
  {
    id: "cust_008",
    name: "Digital Solutions Inc.",
    type: "wholesale",
    status: "pending",
    tier: "bronze",
    industry: "Technology",
    website: "https://digitalsolutions.com",
    notes: "New technology consulting firm - credit application pending",
    creditLimit: 50000,
    balance: 0,
    totalOrders: 0,
    totalRevenue: 0,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    addresses: [
      {
        id: "addr_009",
        street: "258 Tech Circle",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA",
        type: "both",
        isDefault: true,
      },
    ],
    contacts: [
      {
        id: "cont_009",
        name: "Rachel Green",
        email: "rachel.green@digitalsolutions.com",
        phone: "+1-555-0131",
        role: "CEO",
        isPrimary: true,
      },
    ],
  },
];

export const getCustomers = (
  filters?: Partial<CustomerFilters>,
  sort?: CustomerSort
): Customer[] => {
  let filtered = [...demoCustomers];

  // Apply filters
  if (filters?.type) {
    filtered = filtered.filter(customer => customer.type === filters.type);
  }
  if (filters?.status) {
    filtered = filtered.filter(customer => customer.status === filters.status);
  }
  if (filters?.tier) {
    filtered = filtered.filter(customer => customer.tier === filters.tier);
  }
  if (filters?.industry) {
    filtered = filtered.filter(customer => customer.industry === filters.industry);
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.industry.toLowerCase().includes(searchLower) ||
        customer.contacts.some(
          contact =>
            contact.name.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower)
        )
    );
  }

  // Apply sorting
  if (sort) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "tier":
          aValue = a.tier;
          bValue = b.tier;
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "lastOrderDate":
          aValue = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
          bValue = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return filtered;
};

export const getCustomerById = (id: string): Customer | undefined => {
  return demoCustomers.find(customer => customer.id === id);
};

export const getCustomerStats = () => {
  const total = demoCustomers.length;
  const wholesale = demoCustomers.filter(c => c.type === "wholesale").length;
  const retail = demoCustomers.filter(c => c.type === "retail").length;
  const active = demoCustomers.filter(c => c.status === "active").length;
  const totalRevenue = demoCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalOrders = demoCustomers.reduce((sum, c) => sum + c.totalOrders, 0);

  return {
    total,
    wholesale,
    retail,
    active,
    totalRevenue,
    totalOrders,
  };
};
