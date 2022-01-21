import type {
  QueryContext,
} from 'slonik';

export default (): QueryContext => {
  return {
    connectionId: '1',
    log: {
      getContext: () => {
        return {
          connectionId: '1',
          poolId: '1',
        };
      },
    },
    poolId: '1',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};
