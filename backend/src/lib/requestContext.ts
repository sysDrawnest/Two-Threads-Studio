import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestStore {
  route: string;
  method: string;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();
