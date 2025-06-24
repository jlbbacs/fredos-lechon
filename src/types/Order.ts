export interface Order {
  id: string;
  amount:string;
  name: string;
  contactNumber: string;
  date: string;
  pickupTime: string;
  remarks: string;
  status: 'Cook' | 'Pick-up Already';
  createdAt: string;
}

export interface FilterOptions {
  day?: string;
  month?: string;
  year?: string;
  status?: 'all' | 'Cook' | 'Pick-up Already';
}