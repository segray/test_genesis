export const availableEntities = ['leads', 'contacts', 'companies'] as const;
export type TAmoEntity = (typeof availableEntities)[number];
