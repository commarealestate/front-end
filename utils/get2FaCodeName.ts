import type { FaCodeName } from '~/ts/types/FaCodeName';
import { UserRole } from '~/ts/enums/Role';

export default (role: UserRole.ADMIN | UserRole.DISTRIBUTOR | UserRole.MERCHANT | UserRole.CHARGER) : FaCodeName => {
  switch (role) {
    case UserRole.ADMIN:
      return 'admin2FaCode';
    case UserRole.DISTRIBUTOR:
      return 'distributor2FaCode';
    case UserRole.MERCHANT:
      return 'merchant2FaCode';
    case UserRole.CHARGER:
      return 'charger2FaCode';
    default:
      throw new Error(`Invalid role get2FaCodeRole: ${role}`);
  }
}
