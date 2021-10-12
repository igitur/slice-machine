import { Manifest, removeAuthConfig } from "../filesystem";
import { startServerAndOpenBrowser } from "./auth";
import { buildEndpoints, CONSTS } from "../utils";
import { validateRepositoryName, listRepositories } from "./communication";

export * as Communication from "./communication";

export interface Core {
  cwd: string;
  base: string;
  manifest: Manifest;

  /*CustomTypes?: {
    get: (apiEndpoint: string, token: string, customTypeId: string) => Promise<any>,
    getAll: (apiEndpoint: string, token: string) => Promise<any>,
    insert: (apiEndpoint: string, token: string, data: any) => Promise<void>,
    update: (apiEndpoint: string, token: string, data: any) => Promise<void>,
    remove: (apiEndpoint: string, token: string, customTypeId: string) => Promise<void>
  },
  Slices?: {
    get: (apiEndpoint: string, token: string, sliceId: string) => Promise<any>,
    getAll: (apiEndpoint: string, token: string) => Promise<any>,
    insert: (apiEndpoint: string, token: string, data: any) => Promise<void>,
    update: (apiEndpoint: string, token: string, data: any) => Promise<void>,
    remove: (apiEndpoint: string, token: string, sliceId: string) => Promise<void>
  },*/

  Repository: {
    list: (token: string, base?: string) => Promise<string[]>;
    // create: (apiEndpoint: string, token: string) => Promise<void>
    validateName: (
      name: string,
      base?: string,
      existingRepo?: boolean
    ) => Promise<string>;
  };
}

export interface CoreParams {
  cwd: string;
  base: string;
  manifest: Manifest;
}

export default function createCore({ cwd, base, manifest }: CoreParams): Core {
  return {
    cwd,
    base,
    manifest,

    Repository: {
      list: async (token: string): Promise<string[]> => listRepositories(token, base),
      validateName: (
        name: string,
        base = CONSTS.DEFAULT_BASE,
        existingRepo = false
      ) => validateRepositoryName(name, base, existingRepo),
    },
  };
}

export const Auth = {
  login: async (base: string): Promise<void> => {
    const endpoints = buildEndpoints(base);
    return startServerAndOpenBrowser(
      endpoints.Dashboard.cliLogin,
      "login",
      base
    );
  },
  signup: async (base: string): Promise<void> => {
    const endpoints = buildEndpoints(base);
    return startServerAndOpenBrowser(
      endpoints.Dashboard.cliSignup,
      "signup",
      base
    );
  },
  logout: (): void => removeAuthConfig(),
};
