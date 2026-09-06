// The brand palette, named as in neuf-www's variables.scss
const colors = {
  deepBrick: '#720328',
  neufPink: '#cd96ab',
  betongGray: '#e5e2d7',
  goldenOrange: '#ff6915',
  goldenBeige: '#f8bc90',
  chateauBlue: '#0a0f6d',
  white: '#ffffff',
  black: '#161516',
  // Derived colours neuf.no uses for muted text and secondary surfaces
  chateauBlue05: 'rgba(10, 15, 109, 0.5)',
  betongGrayDarkened: '#dcd8cc',
  // Not from the brand palette: status banners, errors and destructive actions
  danger: '#d9534f',
  success: '#5cb85c',
};

// Secondary surface, as neuf.no's forms and info boxes
const card = {
  backgroundColor: colors.betongGrayDarkened,
  padding: 16,
  margin: 16,
};

// Painted behind every screen by the navigator (see Navigation.tsx)
const background = {
  backgroundColor: colors.betongGray,
};

const text = {
  color: colors.chateauBlue,
};

// Button colour pairs from neuf.no: primary is its default button, secondary its beige menu style
const buttons = {
  primary: { background: colors.goldenOrange, text: colors.black },
  secondary: { background: colors.goldenBeige, text: colors.deepBrick },
};

// neuf.no's type scale at phone widths: body 1.5 line height, headings 600 at 1.2
const typography = {
  h1: { fontSize: 32, fontWeight: '600', lineHeight: 38 },
  h2: { fontSize: 26, fontWeight: '600', lineHeight: 31 },
  h3: { fontSize: 21, fontWeight: '600', lineHeight: 25 },
  lead: { fontSize: 19, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 14, lineHeight: 21 },
  suphead: { fontSize: 14, fontWeight: '700', lineHeight: 21, textTransform: 'uppercase', letterSpacing: 0.7 },
} as const;

export default { card, colors, background, text, typography, buttons };
