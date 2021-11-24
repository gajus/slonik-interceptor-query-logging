import test from 'ava';
import {
  isAutoExplainJsonMessage,
} from '../../../src/utilities/isAutoExplainJsonMessage';

test('recognizes notice containing JSON', (t) => {
  t.true(isAutoExplainJsonMessage('duration: {}'));
});
