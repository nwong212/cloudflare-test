import * as migration_20251001_203813 from './20251001_203813';

export const migrations = [
  {
    up: migration_20251001_203813.up,
    down: migration_20251001_203813.down,
    name: '20251001_203813'
  },
];
