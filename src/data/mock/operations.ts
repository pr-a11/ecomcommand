'use client';

export const operationsKpis = {
  dispatched: { value: 127, label: 'Dispatched Today', sub: 'orders' },
  pending: { value: 17, label: 'Pending Dispatch', sub: 'urgent', isAlert: true },
  inTransit: { value: 89, label: 'In Transit', sub: 'active' },
  deliveredToday: { value: 43, label: 'Delivered Today', change: 12 },
  returnRequests: { value: 8, label: 'Return Requests', change: -3 },
  avgDeliveryDays: { value: 3.2, label: 'Avg Delivery Time', sub: 'days', change: -0.4 },
};

export const courierData = [
  { courier: 'Delhivery', shipments: 48, deliveredPct: 94.2, avgDays: 2.8, ndrRate: 3.1, costPerShipment: 62 },
  { courier: 'Shiprocket', shipments: 32, deliveredPct: 91.8, avgDays: 3.4, ndrRate: 4.8, costPerShipment: 54 },
  { courier: 'BlueDart', shipments: 24, deliveredPct: 97.1, avgDays: 2.1, ndrRate: 1.4, costPerShipment: 98 },
  { courier: 'Xpressbees', shipments: 18, deliveredPct: 89.4, avgDays: 3.8, ndrRate: 6.2, costPerShipment: 48 },
  { courier: 'Ecom Express', shipments: 12, deliveredPct: 88.2, avgDays: 4.1, ndrRate: 7.4, costPerShipment: 44 },
];

export const orderFunnelData = [
  { stage: 'Placed', count: 144, pct: 100 },
  { stage: 'Confirmed', count: 141, pct: 97.9 },
  { stage: 'Packed', count: 138, pct: 95.8 },
  { stage: 'Dispatched', count: 127, pct: 88.2 },
  { stage: 'In Transit', count: 89, pct: 61.8 },
  { stage: 'Delivered', count: 43, pct: 29.9 },
];

export const ndrData = [
  { orderId: 'ORD-8421', customer: 'Priya Sharma', city: 'Jaipur', courier: 'Delhivery', attempts: 2, reason: 'Customer not available', status: 'Pending' },
  { orderId: 'ORD-8398', customer: 'Anita Gupta', city: 'Mumbai', courier: 'Shiprocket', attempts: 1, reason: 'Wrong address', status: 'Reattempt' },
  { orderId: 'ORD-8374', customer: 'Kavya Reddy', city: 'Hyderabad', courier: 'BlueDart', attempts: 3, reason: 'Refused delivery', status: 'RTO' },
  { orderId: 'ORD-8361', customer: 'Meera Patel', city: 'Ahmedabad', courier: 'Xpressbees', attempts: 1, reason: 'Door locked', status: 'Reattempt' },
  { orderId: 'ORD-8342', customer: 'Sunita Verma', city: 'Delhi', courier: 'Delhivery', attempts: 2, reason: 'Phone unreachable', status: 'Pending' },
];

export const inventoryAlerts = [
  { product: 'Bridal Combo Set', sku: 'CMB-WED-004', stock: 17, reorderPoint: 20, suggested: 50, urgency: 'high' },
  { product: 'Gold-plated Charm Bracelet', sku: 'BRC-GLD-025', stock: 6, reorderPoint: 15, suggested: 40, urgency: 'critical' },
  { product: 'Choker Pearl Necklace', sku: 'NKL-CHK-016', stock: 42, reorderPoint: 40, suggested: 80, urgency: 'medium' },
  { product: 'Kundan Layered Necklace', sku: 'NKL-GLD-001', stock: 62, reorderPoint: 50, suggested: 100, urgency: 'low' },
  { product: 'Meenakari Stud Earrings', sku: 'ERG-MNK-031', stock: 94, reorderPoint: 80, suggested: 150, urgency: 'low' },
];

export const deliveryByStateData = [
  { state: 'Maharashtra', deliveries: 284, onTime: 94.2 },
  { state: 'Delhi', deliveries: 241, onTime: 91.8 },
  { state: 'Karnataka', deliveries: 198, onTime: 96.1 },
  { state: 'Tamil Nadu', deliveries: 164, onTime: 93.4 },
  { state: 'Gujarat', deliveries: 142, onTime: 95.2 },
  { state: 'Rajasthan', deliveries: 128, onTime: 89.6 },
  { state: 'West Bengal', deliveries: 112, onTime: 88.4 },
  { state: 'Telangana', deliveries: 98, onTime: 92.8 },
];

function mockOps(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: mockOps is not implemented yet.', args);
  return null;
}

export default mockOps;