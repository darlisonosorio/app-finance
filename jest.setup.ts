import "@testing-library/jest-dom";


if (!(globalThis as any).TextEncoder) {
  (globalThis as any).TextEncoder = class {
    encode = (input: string) => new Uint8Array([...input].map(c => c.charCodeAt(0)));
  };
}

if (!(globalThis as any).TextDecoder) {
  (globalThis as any).TextDecoder = class {
    decode = (input: Uint8Array) => String.fromCharCode(...input);
  };
}
