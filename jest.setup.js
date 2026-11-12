// jsdom does not expose these Node globals, which the Firebase SDK needs at import time.
const { TextDecoder, TextEncoder } = require('util');
const fetch = require('node-fetch');

const { Headers, Request, Response } = fetch;

Object.assign(globalThis, { TextDecoder, TextEncoder, fetch, Headers, Request, Response });
