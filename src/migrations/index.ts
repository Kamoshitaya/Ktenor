import * as migration_20260831_131454_initial from './20260831_131454_initial';

export const migrations = [
  {
    up: migration_20260831_131454_initial.up,
    down: migration_20260831_131454_initial.down,
    name: '20260831_131454_initial'
  },
];
