export interface IResponseGetInvite {
  message: "Server invites fetched";
  data: IInvite[];
}

export interface IResponseCreateInvite {
  message: "Server invite created";
  data: IInvite;
}

export interface IResponseUpdateInvite {
  message: "Server invite updated";
  data: IInvite;
}

export interface IInvite {
  inviteCode: string;
  id: number;
  isActive: boolean;
  createdUserId: string;
  expireDate: Date;
  usedCount: number;
}