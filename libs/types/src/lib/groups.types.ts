/**
 * Stakeholder type definition
 */
export interface Stakeholder {
  id: number;
  uuid: string;
  name: string;
  email: string | null;
  phone: string;
  designation: string;
  organization: string;
  district: string;
  municipality: string;
  supportArea: string[];
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Stakeholders Group type definition
 */
export interface StakeholdersGroup {
  id: number;
  uuid: string;
  name: string;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  stakeholders: Stakeholder[];
}

/**
 * PII (Personally Identifiable Information) type for beneficiary
 */
export interface BeneficiaryPII {
  beneficiaryId: number;
  name: string;
  phone: string;
  email: string | null;
  extras?: Record<string, unknown>;
}

/**
 * Individual Beneficiary type definition
 */
export interface BeneficiaryDetail {
  id: number;
  uuid: string;
  gender: string;
  walletAddress: string | null;
  birthDate: string | null;
  age: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  extras?: Record<string, unknown>;
  notes: string | null;
  bankedStatus: string;
  internetStatus: string;
  phoneStatus: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  isVerified: boolean;
  pii?: BeneficiaryPII;
}

/**
 * Grouped Beneficiary type (relationship between group and beneficiary)
 */
export interface GroupedBeneficiary {
  id: number;
  uuid: string;
  beneficiaryGroupId: string;
  beneficiaryId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  Beneficiary: BeneficiaryDetail;
}

/**
 * Beneficiaries Group type definition (with grouped beneficiaries)
 */
export interface BeneficiariesGroup {
  id: number;
  uuid: string;
  name: string;
  groupPurpose?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  groupedBeneficiaries: GroupedBeneficiary[];
}