import { SetMetadata } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const STATUS_KEY = 'status';
export const userStatus = (...status: Status[]) => SetMetadata(STATUS_KEY, status);
