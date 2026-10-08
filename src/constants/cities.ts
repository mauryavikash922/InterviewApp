export type City = {
  id: string;
  displayName: string;
};

export const CITIES: readonly City[] = [
  { id: 'mumbai', displayName: 'Mumbai' },
  { id: 'delhi', displayName: 'Delhi' },
  { id: 'bengaluru', displayName: 'Bengaluru' },
  { id: 'kolkata', displayName: 'Kolkata' },
  { id: 'chennai', displayName: 'Chennai' },
  { id: 'hyderabad', displayName: 'Hyderabad' },
  { id: 'ahmedabad', displayName: 'Ahmedabad' },
  { id: 'pune', displayName: 'Pune' },
  { id: 'surat', displayName: 'Surat' },
  { id: 'jaipur', displayName: 'Jaipur' },
  { id: 'lucknow', displayName: 'Lucknow' },
  { id: 'kanpur', displayName: 'Kanpur' },
  { id: 'nagpur', displayName: 'Nagpur' },
  { id: 'indore', displayName: 'Indore' },
  { id: 'thane', displayName: 'Thane' },
  { id: 'bhopal', displayName: 'Bhopal' },
  { id: 'visakhapatnam', displayName: 'Visakhapatnam' },
  { id: 'pimpri-chinchwad', displayName: 'Pimpri-Chinchwad' },
  { id: 'patna', displayName: 'Patna' },
  { id: 'vadodara', displayName: 'Vadodara' },
];

const CITY_NAME_BY_ID: ReadonlyMap<string, string> = new Map(
  CITIES.map((city) => [city.id, city.displayName]),
);

export const getCityDisplayName = (cityId: string): string =>
  CITY_NAME_BY_ID.get(cityId) ?? cityId;
