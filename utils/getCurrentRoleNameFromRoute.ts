import { UserRole } from '~/ts/enums/Role';

export default (path: string) : UserRole.ADMIN | UserRole.DISTRIBUTOR | UserRole.MERCHANT | UserRole.CHARGER | UserRole.B2C => {
  return path.includes(UserRole.ADMIN)   ? UserRole.ADMIN :
    path.includes(UserRole.DISTRIBUTOR)  ? UserRole.DISTRIBUTOR :
    path.includes(UserRole.MERCHANT)     ? UserRole.MERCHANT :
    path.includes(UserRole.B2C)     ? UserRole.B2C :
    path.includes(UserRole.CHARGER)      ? UserRole.CHARGER : UserRole.ADMIN;
}
