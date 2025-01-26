export const availableEntities = ['leads', 'contacts', 'companies'] as const;
export type TAmoEntity = (typeof availableEntities)[number];

// data?._embedded?.[entity]?.[0]?.id
export type TAmoResponse = {
  _embedded: {
    [entity: string]: {
      id: number;
    }[];
  };
};
