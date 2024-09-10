export interface User {
  id: string;
  sessionEndsAt: string;
  sessionToken: string;
  userName: string;
  userEmail: string;
  updatedAt: string;
  companies: Company[];
}

export interface Company {
  id: number;
  roleId: number;
  userTypeId: number;
  liteView: boolean;
  companyName: string;
  securePages: SecurePage[];
  projects?: Project[];
}

interface SecurePage {
  access: number;
  id: number;
  page?: string;
  parentId?: number;
}

interface Project {
  id: number;
  roleId: number;
  securePages: SecurePage[];
}