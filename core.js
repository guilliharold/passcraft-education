/* ═══════════════════════════════════════════════
   PASSCRAFT — Shared generator logic
   core.js  (loaded by index.html and bulk.html)
   No DOM access in this file.
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   WORD BANKS
───────────────────────────────────────────── */
const ADJECTIVES = [
  // Original 32
  'Brave','Clever','Swift','Mighty','Calm','Bright','Gentle','Bold',
  'Fierce','Lucky','Jolly','Proud','Witty','Eager','Loyal','Vivid',
  'Sunny','Crisp','Daring','Noble','Honest','Quirky','Zesty','Lively',
  'Fluffy','Grumpy','Bouncy','Sparky','Fuzzy','Snappy','Peppy','Wobbly',
  // Added 32
  'Radiant','Nimble','Sleek','Grand','Merry','Sharp','Tender','Wild',
  'Plucky','Serene','Gusty','Valiant','Silky','Zippy','Mellow','Stormy',
  'Brisk','Crafty','Dazzling','Fearless','Graceful','Hardy','Inventive','Jazzy',
  'Keen','Lofty','Mystic','Nifty','Outgoing','Prickly','Regal','Spirited'
];

const NOUNS = [
  // Original 32
  'Mountain','Rocket','Castle','Comet','Storm','Forest','River','Galaxy',
  'Lantern','Shield','Compass','Anchor','Sunrise','Crystal','Flame','Tower',
  'Bridge','Cloud','Stone','Ember','Breeze','Canyon','Meadow','Crater',
  'Candle','Barrel','Feather','Pebble','Wagon','Kettle','Blanket','Hammer',
  // Added 32
  'Glacier','Horizon','Lighthouse','Nebula','Orchard','Pinnacle','Quartz','Ravine',
  'Sapphire','Tide','Volcano','Waterfall','Zenith','Acorn','Beacon','Cavern',
  'Dewdrop','Eclipse','Fossil','Geyser','Haven','Iceberg','Jungle','Keystone',
  'Lagoon','Mosaic','Nomad','Oasis','Prism','Ripple','Summit','Tundra'
];

const ANIMALS = [
  // Original 29
  'Dingo','Kangaroo','Koala','Wombat','Platypus','Echidna','Quokka',
  'Wallaby','Possum','Bilby','Kookaburra','Magpie','Numbat','Gecko',
  'Eagle','Parrot','Dolphin','Penguin','Falcon','Otter','Panda','Jaguar',
  'Meerkat','Lemur','Narwhal','Axolotl','Capybara','Flamingo','Hamster',
  // Added 29
  'Cheetah','Gorilla','Octopus','Peacock','Raccoon','Seahorse','Toucan',
  'Vulture','Walrus','Wolverine','Lynx','Mantis','Newt','Ocelot','Pelican',
  'Quetzal','Reindeer','Stingray','Tapir','Uakari','Viper','Weasel','Xerus',
  'Yak','Zebrafish','Basilisk','Condor','Dragonfly'
];

const COLOURS = [
  // Original 30
  'Blue','Red','Green','Purple','Orange','Yellow','Silver','Golden',
  'Pink','Violet','Coral','Amber','Indigo','Teal','Crimson','Jade',
  'Scarlet','Azure','Ivory','Olive','Maroon','Cobalt','Magenta','Bronze',
  'Russet','Cerulean','Vermillion','Chartreuse','Ochre','Lavender',
  // Added 30
  'Turquoise','Periwinkle','Burgundy','Tangerine','Fuchsia','Slate','Sage',
  'Copper','Sapphire','Emerald','Ruby','Onyx','Pearl','Champagne','Topaz',
  'Mahogany','Saffron','Lilac','Mint','Denim','Claret','Apricot','Flaxen',
  'Obsidian','Pewter','Sienna','Taupe','Umber','Viridian','Wisteria'
];

/* ─────────────────────────────────────────────
   PASSWORD PATTERN DEFINITIONS
   Each pattern picks one word from each bank,
   then appends a 2-digit number + special char.
   Structure: Word + Word + Number + Symbol
───────────────────────────────────────────── */
const PATTERNS = [
  {
    id:    'adj-noun',
    label: '✏️ Adjective + Noun',
    desc:  'e.g. CleverRocket83@',
    banks: ['ADJECTIVES', 'NOUNS']
  },
  {
    id:    'colour-animal',
    label: '🎨 Colour + Animal',
    desc:  'e.g. BlueDingo47!',
    banks: ['COLOURS', 'ANIMALS']
  }
];

/* Maps bank name strings → actual arrays */
const BANK_MAP = { ADJECTIVES, NOUNS, ANIMALS, COLOURS };

/* Human-readable labels for the formula hint */
const BANK_LABELS = {
  ADJECTIVES: 'Adjective',
  NOUNS:      'Noun',
  ANIMALS:    'Animal',
  COLOURS:    'Colour'
};

/* ─────────────────────────────────────────────
   PASSPHRASE — uses all word types combined
───────────────────────────────────────────── */
const ALL_WORDS = [
  ...ADJECTIVES, ...NOUNS, ...ANIMALS, ...COLOURS
];

/* ─────────────────────────────────────────────
   CHARACTER SETS
   Ambiguous chars (0/O, 1/l/I) excluded
───────────────────────────────────────────── */
const CHARS = {
  num: '23456789',
  sym: '!@#$%&*?'
};

/* ─────────────────────────────────────────────
   CRYPTO UTILITIES
───────────────────────────────────────────── */

/** Cryptographically secure random integer in [0, max) */
function randInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

/** Pick a random element from an array or string */
function pick(collection) {
  return collection[randInt(collection.length)];
}

/** Generate a random 2-digit number string (10–99) */
function randTwoDigit() {
  return String(10 + randInt(90));
}

/** Capitalise first letter, lowercase the rest */
function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/* ─────────────────────────────────────────────
   BUILD A PASSWORD (no DOM) — used by bulk.js
   Formula: Word + Word + Number + Symbol
───────────────────────────────────────────── */
function buildPassword(patternId) {
  const pattern = PATTERNS.find(p => p.id === patternId);
  if (!pattern) throw new Error('Unknown pattern: ' + patternId);
  const words = pattern.banks.map(b => titleCase(pick(BANK_MAP[b])));
  return words.join('') + randTwoDigit() + pick(CHARS.sym);
}
