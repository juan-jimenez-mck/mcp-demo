import type { Territory } from '../territory/types';

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export type Address = {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type Account = {
  id: number;
  name: string;
  description: string;
  notes: string;
  industry: string;
  creditLimit: number;
  territoryId: number;
  territory: Territory;
  contact: Contact;
  address: Address;
};
