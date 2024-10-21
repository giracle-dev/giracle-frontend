import userRepository from "./userRepository";
import channelRepository from "./channelRepository";
import messageRepository from "./messageRepository";
import serverRepository from "./serverRepository";
import roleRepository from "./roleRepository";

const repositories = {
  user: userRepository,
  channel: channelRepository,
  message: messageRepository,
  server: serverRepository,
  role: roleRepository
};

type RepositoryName = keyof typeof repositories;

export const repositoryFactory = {
  get<T extends RepositoryName>(name: T): (typeof repositories)[T] {
    return repositories[name];
  },
};
