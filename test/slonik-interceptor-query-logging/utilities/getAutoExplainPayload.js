// @flow

import test from 'ava';
import getAutoExplainPayload from '../../../src/utilities/getAutoExplainPayload';

test('extracts JSON from the message', (t) => {
  t.deepEqual(getAutoExplainPayload('duration: {"foo":"bar"}'), {
    foo: 'bar'
  });
});

test('throws an error if payload is not found', (t) => {
  t.throws(() => {
    getAutoExplainPayload('duration:');
  }, 'Notice message does not contain a recognizable JSON payload.');
});

test('throws an error if multiple payloads are found', (t) => {
  t.throws(() => {
    getAutoExplainPayload('duration: {"foo":"bar"} {"foo":"bar"}');
  }, 'Notice message contains multiple JSON payloads.');
});
