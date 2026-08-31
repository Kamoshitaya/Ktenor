import * as migration_20260831_131454_initial from './20260831_131454_initial';
import * as migration_20260831_173730_update_services from './20260831_173730_update_services';

export const migrations = [
  {
    up: migration_20260831_131454_initial.up,
    down: migration_20260831_131454_initial.down,
    name: '20260831_131454_initial',
  },
  {
    up: migration_20260831_173730_update_services.up,
    down: migration_20260831_173730_update_services.down,
    name: '20260831_173730_update_services'
  },
];
