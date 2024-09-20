export interface ServiceMatrices {
  id: string;
  projectId: number;
  currencyId: number | null;
  serviceDescription?: string;
  serviceUnitCost?: number | null;
  quantityProjected?: number | null;
  activated?: boolean;
  closeMatrix?: boolean;
  serviceMatricesSubTotal?: number | null;
  serviceMatricesAvailable?: number | null;
  prServiceTypeId?: number | null;
  prServiceTypeName?: string;
  providerId?: number | null;
  providerName?: string;
  providerDocument?: string;
  bItemId?: number | null;
  descripcion?: string;
  accountItem?: string;
  fFormServicesId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
