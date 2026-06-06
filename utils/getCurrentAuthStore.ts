import { UserRole } from '~/ts/enums/Role';

import { useAuthStore } from '~/store/admin/auth';

export default (role: UserRole.ADMIN ) => {
  switch (role) {
    case UserRole.ADMIN:
      return useAuthStore();
    default:
      throw new Error(`Invalid role: ${role}`);
  }
}
