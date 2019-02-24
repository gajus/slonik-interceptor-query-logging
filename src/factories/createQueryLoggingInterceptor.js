// @flow

import type {
  InterceptorType
} from 'slonik';
import prettyMs from 'pretty-ms';
import {
  getAutoExplainPayload,
  isAutoExplainJsonMessage
} from '../utilities';

/**
 * @property logValues Dictates whether to include parameter values used to execute the query. (default: true)
 */
type UserConfigurationType = {|
  +logValues: boolean
|};

const stringifyCallSite = (callSite) => {
  return (callSite.fileName || '') + ':' + callSite.lineNumber + ':' + callSite.columnNumber;
};

const defaultConfiguration = {
  logValues: true
};

export default (userConfiguration?: UserConfigurationType): InterceptorType => {
  const configuration = {
    ...defaultConfiguration,
    ...userConfiguration
  };

  return {
    afterQueryExecution: (context, query, result) => {
      let rowCount: number | null = null;

      if (result.rowCount) {
        rowCount = result.rowCount;
      }

      for (const notice of result.notices) {
        if (isAutoExplainJsonMessage(notice.message)) {
          context.log.info({
            autoExplain: getAutoExplainPayload(notice.message)
          }, 'auto explain');
        }
      }

      context.log.debug({
        executionTime: prettyMs(Number(process.hrtime.bigint() - context.queryInputTime) / 1000000),
        rowCount
      }, 'query execution result');

      return result;
    },
    beforeQueryExecution: async (context, query) => {
      let stackTrace;

      if (context.stackTrace) {
        stackTrace = context.stackTrace
          .filter((callSite) => {
            // Hide the internal call sites.
            return callSite.fileName !== null && !callSite.fileName.includes('slonik') && !callSite.fileName.includes('next_tick');
          })
          .map((callSite) => {
            return stringifyCallSite(callSite);
          });
      }

      context.log.debug({
        sql: query.sql,
        stackTrace,
        values: configuration.logValues ? query.values : undefined
      }, 'executing query');
    }
  };
};