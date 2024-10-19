export interface IResponseUSerVerifyToken {
  message: string;
  data: {
    userId: string;
  };
}

export interface IResponseGetUserinfo {
  message: string;
  data: IUser;
}

export interface IUser {
  id: string;
  name: string;
  selfIntroduction: string;
  ChannelJoin: {
    channelId: string;
  }[];
  RoleLink: {
    roleId: string;
  }[];
}
