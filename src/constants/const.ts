export const CUSTOM_IDENTIFIER = "abdelmounim_sifelhak";

export const accessLevelMapping: { [key in "None" | "View" | "Edit"]: number } = {
  None: 0,
  View: 1,
  Edit: 2,
};
// Reverse the mapping: number to string
export const accessLevelMappingReverse: { [key in number]: "None" | "View" | "Edit" } = {
  0: "None",
  1: "View",
  2: "Edit",
};

export const accessLevelMappingReverseBinary: { [key in number]: "NO" | "YES" } = {
  0: "NO",
  1: "YES",
  // 2: "Edit",
};

export const idToNameMap: Record<number, string> = {
  1: "Locks",
  2: "ActivateLocks",
  3: "Inventory",
  4: "TenantLocks",
  5: "Facilities",
  6: "TransferFacilities",
  7: "Users",
  8: "EditAdmins",
  9: "Subdomains",
  10: "ApiSettings",
};
export const permissionsArray = [
  { id: 1, name: "Locks", label: "Locks", field: "locksPermission" },
  { id: 2, name: "ActivateLocks", label: "Activate Locks", field: "activateLocksPermission" },
  { id: 3, name: "Inventory", label: "Inventory", field: "inventoryPermission" },
  { id: 4, name: "TenantLocks", label: "Tenant Locks", field: "tenantLocksPermission" },
  { id: 5, name: "Facilities", label: "Facilities", field: "facilitiesPermission" },
  { id: 6, name: "TransferFacilities", label: "Transfer Facilities", field: "transferFacilitiesPermission" },
  { id: 7, name: "Users", label: "Users", field: "usersPermission" },
  { id: 8, name: "EditAdmins", label: "Edit Admins", field: "editAdminsPermission" },
  { id: 9, name: "Subdomains", label: "Subdomains", field: "subdomainsPermission" },
  { id: 10, name: "ApiSettings", label: "API Settings", field: "apiSettingsPermission" },
];
