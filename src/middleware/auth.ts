import type { Request, Response, NextFunction } from 'express';
import { resolveAdminUserOnLogin } from '../db/repository.ts';
import { BOOTSTRAP_SUPER_ADMIN_EMAILS } from '../db/seedData.ts';
import type { AdminModuleKey, AdminRole } from '../utils/adminLogic.ts';
import { canAccessAdminModule } from '../utils/adminLogic.ts';

export interface AuthenticatedAdmin {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  assignedDistricts: string[];
  isActive: boolean;
}

export interface AdminRequest extends Request {
  adminUser?: AuthenticatedAdmin;
}

/**
 * Auth Boundary (Open Development Mode):
 * Firebase login has been removed so the Admin Console can be accessed directly
 * during pre-production development. When integrating Supabase Auth later,
 * verify the Supabase Bearer JWT here via supabase.auth.getUser(token) before
 * calling resolveAdminUserOnLogin().
 */
export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const devEmail =
      BOOTSTRAP_SUPER_ADMIN_EMAILS[0] || 'rahulsharmarahulworld@gmail.com';
    const identity = {
      uid: 'dev-super-admin',
      email: devEmail,
      name: 'Rahul Sharma (Founder Admin)',
    };

    const result = await resolveAdminUserOnLogin(identity);

    if (result.status === 'ok') {
      const adminRecord = result.user;
      req.adminUser = {
        id: adminRecord.id,
        uid: adminRecord.uid ?? identity.uid,
        email: adminRecord.email,
        displayName: adminRecord.displayName,
        role: adminRecord.role as AdminRole,
        assignedDistricts: Array.isArray(adminRecord.assignedDistricts)
          ? adminRecord.assignedDistricts
          : [],
        isActive: adminRecord.isActive,
      };
    } else {
      req.adminUser = {
        id: 1,
        uid: identity.uid,
        email: identity.email,
        displayName: identity.name,
        role: 'super_admin',
        assignedDistricts: [],
        isActive: true,
      };
    }

    next();
  } catch (error) {
    console.error('Admin session initialization failed:', error);
    return res.status(500).json({
      error: 'Unable to initialize admin workspace right now. Please try again.',
    });
  }
};

export function requireModuleAccess(moduleKey: AdminModuleKey) {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    const admin = req.adminUser;
    if (!admin) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!canAccessAdminModule(admin.role, moduleKey)) {
      return res.status(403).json({
        error: `Your role (${admin.role}) does not have permission to access ${moduleKey}.`,
        code: 'FORBIDDEN_ROLE',
      });
    }
    next();
  };
}
