export const CUSTOM_IDENTIFIER = "abdelmounim_sifelhak";

export const accessLevelMapping: { [key in "None" | "View" | "Edit"]: number } = {
  None: 0,
  View: 1,
  Edit: 2,
};

export const permissionsArray = [
  { name: "Locks", label: "Locks", field: "locksPermission" },
  { name: "ActivateLocks", label: "Activate Locks", field: "activateLocksPermission" },
  { name: "Inventory", label: "Inventory", field: "inventoryPermission" },
  { name: "TenantLocks", label: "Tenant Locks", field: "tenantLocksPermission" },
  { name: "Facilities", label: "Facilities", field: "facilitiesPermission" },
  { name: "TransferFacilities", label: "Transfer Facilities", field: "transferFacilitiesPermission" },
  { name: "Users", label: "Users", field: "usersPermission" },
  { name: "EditAdmins", label: "Edit Admins", field: "editAdminsPermission" },
  { name: "Subdomains", label: "Subdomains", field: "subdomainsPermission" },
  { name: "ApiSettings", label: "API Settings", field: "apiSettingsPermission" },
];
