// This file is used to set up the test environment for Vitest.
// You can use this file to add polyfills, mocks, or other global setup.

// Polyfill for TextEncoder, which is required by the 'jose' library and
// can be problematic in the JSDOM environment used by Vitest.
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;


import '@testing-library/jest-dom';
