export interface Order {
  id: string;
  amount: string;            // Total amount due
  name: string;
  contactNumber: string;
  date: string;
  pickupTime: string;
  remarks: string;
  status: 'Cook' | 'Pick-up Already';
  createdAt: string;
  paymentStatus: 'Not Paid' | 'Partially Paid' | 'Paid';
  balance: string;           // Amount still owed (e.g. "500.00"), zero if fully paid
  partialPaymentAmount?: string;  // Amount already paid if partially paid (e.g. "1000.00")
  tinae: 'Paklay' | 'Sampayna' | 'Kwaon';
  orderType?: 'Order' | 'Labor';
}

export interface FilterOptions {
  day?: string;
  month?: string;
  year?: string;
  status?: 'all' | 'Cook' | 'Pick-up Already';
  paymentStatus?: 'all' | 'Not Paid' | 'Partially Paid' | 'Paid';
}
