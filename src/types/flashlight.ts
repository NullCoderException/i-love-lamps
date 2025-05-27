export enum BatteryType {
  AA = "AA",
  AAA = "AAA",
  FOURTEEN500 = "14500", // Using FOURTEEN500 since enums can't start with numbers
  EIGHTEEN350 = "18350",
  EIGHTEEN650 = "18650",
  TWENTY1700 = "21700",
  DUAL_FUEL_AA = "AA/14500", // For your Ryder and other dual fuel lights
  DUAL_FUEL_AAA = "AAA/10440", // For future compatibility
  BUILT_IN = "Built-in", // For non-replaceable batteries,
}

export enum Manufacturer {
  ACEBEAM = "Acebeam",
  WURKKOS = "Wurkkos",
  SOFIRN = "Sofrin",  // Note: Database uses "Sofrin" not "Sofirn"
  SKILHUNT = "Skilhunt",
  OLIGHT = "Olight",
  NITECORE = "Nitecore",
  CONVOY = "Convoy",
  EMISAR = "Emisar",
  FIREFLIES = "Fireflies",
  REYLIGHT = "Reylight",
}

export enum FinishGroup {
  MAO = "MAO",
  ANODIZED = "Anodized",
  TITANIUM = "Titanium",
  COPPER = "Copper",
  COPPER_TITANIUM = "Copper+Titanium",
  STAINLESS_STEEL = "Stainless Steel",
  BRASS = "Brass",
}

export enum ShippingStatus {
  RECEIVED = "Received",
  SHIPPED = "Shipped",
  ORDERED = "Ordered",
}

export enum EmitterColor {
  WHITE = "White",
  RED = "Red",
  GREEN = "Green",
  BLUE = "Blue",
  UV = "UV",
  RGB = "RGB",
  LASER_GREEN = "Green Laser",
  LASER_RED = "Red Laser",
}

export enum FlashlightStatus {
  WANTED = "Wanted",
  ORDERED = "Ordered",
  OWNED = "Owned",
  SOLD = "Sold",
}

export interface Emitter {
  id?: string;
  flashlight_id?: string;
  type: string;
  cct: string | null; // Can be null for non-white emitters
  count: number;
  color: EmitterColor; // Defaults to WHITE if not specified
  created_at?: string;
}

export enum FormFactor {
  TUBE = "Tube",
  RIGHT_ANGLE = "Right Angle",
  HEADLAMP = "Headlamp",
  FLAT = "Flat",
  COMPACT = "Compact",
  KEYCHAIN = "Keychain",
  MULTI_FUNCTION = "Multi-Function",
}

export enum IPRating {
  NONE = "None",
  IPX4 = "IPX4", // Splash resistant
  IPX5 = "IPX5", // Water jets
  IPX6 = "IPX6", // Powerful water jets
  IPX7 = "IPX7", // Temporary immersion (up to 1m for 30 min)
  IPX8 = "IPX8", // Continuous immersion (beyond 1m)
  IP54 = "IP54", // Dust protected + splash resistant
  IP55 = "IP55", // Dust protected + water jets
  IP65 = "IP65", // Dust tight + powerful water jets
  IP66 = "IP66", // Dust tight + powerful water jets
  IP67 = "IP67", // Dust tight + temporary immersion
  IP68 = "IP68", // Dust tight + continuous immersion
}

export interface Flashlight {
  id?: string;
  user_id?: string;
  model: string;
  manufacturer: Manufacturer;
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
