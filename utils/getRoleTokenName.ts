import type { TokenName } from "~/ts/types/RoleTokenName"
import { UserRole } from "~/ts/enums/Role"

export default (
  role: UserRole.ADMIN | UserRole.DISTRIBUTOR | UserRole.MERCHANT | UserRole.CHARGER | UserRole.B2C,
): TokenName => {
  switch (role) {
    case UserRole.ADMIN:
      return "adminToken"
    case UserRole.DISTRIBUTOR:
      return "distributorToken"
    case UserRole.MERCHANT:
      return "merchantToken"
    case UserRole.CHARGER:
      return "chargerToken"
    case UserRole.B2C:
      return "b2cToken"
    default:
      throw new Error(`Invalid role getTokenRole: ${role}`)
  }
}
