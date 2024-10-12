import userRepository from "./userRepository";
import channelRepository from "./channelRepository";

const repositories = {
  user: userRepository,
  channel: channelRepository,
};

type RepositoryName = keyof typeof repositories;

export const repositoryFactory = {
  get<T extends RepositoryName>(name: T): (typeof repositories)[T] {
    return repositories[name];
  },
};
