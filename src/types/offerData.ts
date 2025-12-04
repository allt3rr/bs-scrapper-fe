export type Offer = {
  id: string;
  name: string;
  salary: string | null;
  link: string;
  city: string | null;
  availability: string | null;
  contractType: string | null;
};

export type DataType = {
  title: string;
  offers: Offer[];
} | null;
