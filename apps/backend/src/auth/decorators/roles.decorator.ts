import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

// ROLES_KEY is the reflection token NestJS stores under the hood.
// Reflector.getAllAndOverride uses this string to pull metadata back off
// the handler or class at runtime — it must match exactly between the
// decorator and the guard or the lookup silently returns undefined.
export const ROLES_KEY = 'roles';

// Roles is a parameter decorator factory. Each call to SetMetadata writes
// an array of UserRole values onto the method/class metadata map under
// ROLES_KEY. getAllAndOverride later merges method-level and class-level
// values, so controller-wide defaults can be overridden per-handler.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
