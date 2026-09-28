/** Foil tiers mapped to poke-holo CSS data-rarity values */
export const FOIL_TIERS = {
  common: {
    id: 'common',
    label: 'Common',
    rarityAttr: 'common',
    color: '#9aa4b2',
    hasFoil: false,
  },
  uncommon: {
    id: 'uncommon',
    label: 'Uncommon',
    rarityAttr: 'uncommon',
    color: '#6fcf97',
    hasFoil: false,
  },
  reverse: {
    id: 'reverse',
    label: 'Reverse Holo',
    rarityAttr: 'common reverse holo',
    color: '#56ccf2',
    hasFoil: true,
  },
  holo: {
    id: 'holo',
    label: 'Rare Holo',
    rarityAttr: 'rare holo',
    color: '#f2c94c',
    hasFoil: true,
  },
  cosmos: {
    id: 'cosmos',
    label: 'Cosmos Holo',
    rarityAttr: 'rare holo cosmos',
    color: '#bb6bd9',
    hasFoil: true,
  },
  radiant: {
    id: 'radiant',
    label: 'Radiant Rare',
    rarityAttr: 'radiant rare',
    color: '#eb5757',
    hasFoil: true,
  },
  v: {
    id: 'v',
    label: 'Rare Holo V',
    rarityAttr: 'rare holo v',
    color: '#2d9cdb',
    hasFoil: true,
  },
  vmax: {
    id: 'vmax',
    label: 'Rare VMAX',
    rarityAttr: 'rare holo vmax',
    color: '#9b51e0',
    hasFoil: true,
  },
  rainbow: {
    id: 'rainbow',
    label: 'Rainbow Rare',
    rarityAttr: 'rare rainbow',
    color: '#f2994a',
    hasFoil: true,
  },
  secret: {
    id: 'secret',
    label: 'Secret Rare',
    rarityAttr: 'rare secret',
    color: '#f2c94c',
    hasFoil: true,
  },
}

/** Pack slot pull rates — TCG Pocket–style (5 cards) */
export const PACK_SLOTS = [
  // slots 1–3: bulk
  [
    { foil: 'common', weight: 70 },
    { foil: 'uncommon', weight: 25 },
    { foil: 'reverse', weight: 5 },
  ],
  [
    { foil: 'common', weight: 60 },
    { foil: 'uncommon', weight: 30 },
    { foil: 'reverse', weight: 10 },
  ],
  [
    { foil: 'uncommon', weight: 55 },
    { foil: 'reverse', weight: 30 },
    { foil: 'holo', weight: 15 },
  ],
  // slot 4: rare-ish
  [
    { foil: 'reverse', weight: 35 },
    { foil: 'holo', weight: 40 },
    { foil: 'cosmos', weight: 15 },
    { foil: 'v', weight: 8 },
    { foil: 'radiant', weight: 2 },
  ],
  // slot 5: chase
  [
    { foil: 'holo', weight: 40 },
    { foil: 'cosmos', weight: 25 },
    { foil: 'v', weight: 18 },
    { foil: 'radiant', weight: 8 },
    { foil: 'vmax', weight: 5 },
    { foil: 'rainbow', weight: 3 },
    { foil: 'secret', weight: 1 },
  ],
]

export function subtypesForFoil(foilId, baseSubtypes = ['Basic']) {
  if (foilId === 'vmax') return ['VMAX']
  if (foilId === 'v' || foilId === 'rainbow' || foilId === 'secret') return ['V']
  if (foilId === 'radiant') return ['Radiant', 'Basic']
  return baseSubtypes
}
