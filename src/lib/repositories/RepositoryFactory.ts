import userRepository from "./userRepository";

const repositories = {
  user: userRepository,
};

export const repositoryFactory = {
  get: (name: keyof typeof repositories) => repositories[name],
};
