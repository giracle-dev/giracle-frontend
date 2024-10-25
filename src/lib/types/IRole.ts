export interface IResponseGetRoleList {
  message: "Role list";
  data: IRole[];
}


export interface IResponseGetRoleInfo {
  message: "Role fetched";
  data: IRole;
}

export interface IResponseSearchRoles {
  message: "Role searched";
  data: IRole[];
}

export interface IRole {
  name: string;
  id: string;
  createdAt: Date;
  createdUserId: string;
  color: string;
  manageServer: boolean;
  manageChannel: boolean;
  manageRole: boolean;
  manageUser: boolean;
}