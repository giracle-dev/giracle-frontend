export interface IResponseGetConfig {
  message: "Server config fetched";
  data: IServer;
}

export interface IResponseGetInvite {
  message: "Server invites fetched";
  data: IInvite[];
}

export interface IResponseCreateInvite {
  message: "Server invite created";
  data: IInvite;
}

export interface IResponseDeleteInvite {
  message: "Server invite updated";
  data: {
    id: number;
  };
}

export interface IResponseGetStorageUsage {
  message: "Server storage usage fetched";
  data: number;
}

export interface IServer {
  name: string;
  introduction: string;
  RegisterAvailable: boolean;
  RegisterInviteOnly: boolean;
  MessageMaxLength: number;
}

export interface IInvite {
  inviteCode: string;
  id: number;
  isActive: boolean;
  createdUserId: string;
  expireDate: Date;
  usedCount: number;
}