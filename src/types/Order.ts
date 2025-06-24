export interface Order {
  id: string;
  amount: string;                 // Total amount due, e.g. "5000"
  name: string;
  contactNumber: string;
  date: string;
  pickupTime: string;
  remarks: string;
  status: 'Cook' | 'Pick-up Already';
  createdAt: string;

  paymentStatus: 'Not Paid' | 'Partially Paid' | 'Paid';
  partialPaymentAmount?: string;  // Amount already paid if partially paid
  balance: string;                // amount still owed, e.g. "3500"
}
