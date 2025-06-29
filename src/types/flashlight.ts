// Lookup data interfaces
export interface Manufacturer {
  id: number;
  name: string;
}

export interface EmitterType {
  id: number;
  name: string;
}

// String type definitions (for backwards compatibility and validation)
export type BatteryType = string;
export type FinishGroup = string;
export type ShippingStatus = "Received" | "Shipped" | "Ordered";
export type EmitterColor = "White" | "Red" | "Green" | "Blue" | "UV" | "RGB" | "Green Laser" | "Red Laser";
export type FlashlightStatus = "Wanted" | "Ordered" | "Owned" | "Sold";
export type FormFactor = string;
export type IPRating = string;

export interface Emitter {
  id?: string;
  flashlight_id?: string;
  type: string;
  cct: string | null; // Can be null for non-white emitters
  count: number;
  color: EmitterColor; // Defaults to WHITE if not specified
  created_at?: string;
}


export interface Flashlight {
  id?: string;
  user_id?: string;
  model: string;
  manufacturer: string;
  finish: string;
  finish_group: FinishGroup;
  battery_type: BatteryType;
  emitters: Emitter[];
  driver: string;
  ui: string;
  anduril: boolean;
  form_factors: FormFactor[];
  ip_rating?: IPRating;
  special_features: string[];
  notes?: string;
  purchase_date: string;
  shipping_status: ShippingStatus;
  status: FlashlightStatus;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  user_id: string;
  preferred_cct_min?: number;
  preferred_cct_max?: number;
  preferred_battery_types?: string[];
  preferred_manufacturers?: string[];
  preferred_form_factors?: string[];
  preferred_features?: string[];
  updated_at?: string;
}

export interface FlashlightManual {
  id?: string;
  flashlight_id: string;
  title: string;
  content?: string;
  file_path?: string;
  embedding?: number[];
  created_at?: string;
}
