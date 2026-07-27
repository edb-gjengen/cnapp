// moment ships its locale files as plain JS with no type declarations. TypeScript 6
// (Expo SDK 56) rejects side-effect imports it cannot type, so declare them as untyped.
declare module 'moment/locale/*';
