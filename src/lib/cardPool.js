/**
 * Seed pool of real Pokémon TCG card arts (images.pokemontcg.io),
 * plus original Boss Cards artwork.
 */
function card(setId, number, name, types, subtypes = ['Basic'], setName) {
  return {
    baseId: `${setId}-${number}`,
    name,
    number: String(number),
    set: setId,
    setName,
    types,
    subtypes,
    image: `https://images.pokemontcg.io/${setId}/${number}_hires.png`,
    smallImage: `https://images.pokemontcg.io/${setId}/${number}.png`,
  }
}

function bossCard(number, name, types, imageFile, subtypes = ['Basic']) {
  const image = `/cards/${imageFile}`
  return {
    baseId: `boss1-${number}`,
    name,
    number: String(number),
    set: 'boss1',
    setName: 'Boss Originals',
    types,
    subtypes,
    image,
    smallImage: image,
  }
}

/** Exclusive Boss Cards originals featured in the Duo Blister */
export const BOSS_ORIGINALS = [
  bossCard(1, 'Boss roupa lily', ['Grass', 'Lightning'], 'starhoof.jpg', ['V']),
  bossCard(2, 'Boss roupa replay', ['Psychic', 'Fire'], 'nightflare.jpg', ['V']),
]

export const CARD_POOL = [
  ...BOSS_ORIGINALS,

  // Sword & Shield
  card('swsh1', 1, 'Celebi V', ['Grass'], ['V'], 'Sword & Shield'),
  card('swsh1', 19, 'Raboot', ['Fire'], ['Stage 1'], 'Sword & Shield'),
  card('swsh1', 20, 'Cinderace', ['Fire'], ['Stage 2'], 'Sword & Shield'),
  card('swsh1', 25, 'Victini V', ['Fire'], ['V'], 'Sword & Shield'),
  card('swsh1', 30, 'Scorbunny', ['Fire'], ['Basic'], 'Sword & Shield'),
  card('swsh1', 43, 'Sobble', ['Water'], ['Basic'], 'Sword & Shield'),
  card('swsh1', 49, 'Drizzile', ['Water'], ['Stage 1'], 'Sword & Shield'),
  card('swsh1', 56, 'Inteleon', ['Water'], ['Stage 2'], 'Sword & Shield'),
  card('swsh1', 65, 'Morpeko', ['Lightning'], ['Basic'], 'Sword & Shield'),
  card('swsh1', 85, 'Sandaconda', ['Fighting'], ['Stage 1'], 'Sword & Shield'),
  card('swsh1', 138, 'Snorlax', ['Colorless'], ['Basic'], 'Sword & Shield'),
  card('swsh1', 197, 'Marnie', ['Colorless'], ['Supporter'], 'Sword & Shield'),

  // Darkness Ablaze
  card('swsh3', 20, 'Centiskorch', ['Fire'], ['Stage 1'], 'Darkness Ablaze'),
  card('swsh3', 21, 'Centiskorch V', ['Fire'], ['V'], 'Darkness Ablaze'),
  card('swsh3', 44, 'Galarian Slowbro', ['Psychic'], ['Stage 1'], 'Darkness Ablaze'),
  card('swsh3', 94, 'Eternatus V', ['Darkness'], ['V'], 'Darkness Ablaze'),

  // Evolving Skies
  card('swsh7', 19, 'Gyarados', ['Water'], ['Stage 1'], 'Evolving Skies'),
  card('swsh7', 40, 'Galarian Articuno', ['Psychic'], ['Basic'], 'Evolving Skies'),
  card('swsh7', 43, 'Galarian Zapdos', ['Fighting'], ['Basic'], 'Evolving Skies'),
  card('swsh7', 49, 'Galarian Moltres', ['Darkness'], ['Basic'], 'Evolving Skies'),
  card('swsh7', 58, 'Umbreon', ['Darkness'], ['Stage 1'], 'Evolving Skies'),
  card('swsh7', 74, 'Sylveon', ['Psychic'], ['Stage 1'], 'Evolving Skies'),
  card('swsh7', 91, 'Rayquaza V', ['Dragon'], ['V'], 'Evolving Skies'),

  // Champion's Path
  card('swsh35', 1, 'Venusaur', ['Grass'], ['Stage 2'], "Champion's Path"),
  card('swsh35', 2, 'Charmander', ['Fire'], ['Basic'], "Champion's Path"),
  card('swsh35', 8, 'Wobbuffet', ['Psychic'], ['Basic'], "Champion's Path"),
  card('swsh35', 50, 'Gardevoir', ['Psychic'], ['Stage 2'], "Champion's Path"),

  // Pokémon GO
  card('pgo', 1, 'Bulbasaur', ['Grass'], ['Basic'], 'Pokémon GO'),
  card('pgo', 8, 'Charmander', ['Fire'], ['Basic'], 'Pokémon GO'),
  card('pgo', 11, 'Squirtle', ['Water'], ['Basic'], 'Pokémon GO'),
  card('pgo', 28, 'Mewtwo', ['Psychic'], ['Basic'], 'Pokémon GO'),
  card('pgo', 35, 'Melmetal', ['Metal'], ['Stage 1'], 'Pokémon GO'),

  // Scarlet & Violet
  card('sv1', 1, 'Sprigatito', ['Grass'], ['Basic'], 'Scarlet & Violet'),
  card('sv1', 4, 'Floragato', ['Grass'], ['Stage 1'], 'Scarlet & Violet'),
  card('sv1', 7, 'Quaxly', ['Water'], ['Basic'], 'Scarlet & Violet'),
  card('sv1', 25, 'Pawmi', ['Lightning'], ['Basic'], 'Scarlet & Violet'),
  card('sv1', 36, 'Miraidon', ['Lightning'], ['Basic'], 'Scarlet & Violet'),
  card('sv1', 58, 'Koraidon', ['Fighting'], ['Basic'], 'Scarlet & Violet'),
  card('sv1', 86, 'Arcanine', ['Fire'], ['Stage 1'], 'Scarlet & Violet'),

  // Classics
  card('base1', 4, 'Charizard', ['Fire'], ['Stage 2'], 'Base Set'),
  card('base1', 58, 'Pikachu', ['Lightning'], ['Basic'], 'Base Set'),
  card('xy12', 108, 'Mewtwo-EX', ['Psychic'], ['EX'], 'Evolutions'),
  card('sm115', 7, 'Pikachu', ['Lightning'], ['Basic'], 'Hidden Fates'),
]

/** Optional enrichment hook for later custom APIs */
export async function enrichFromPokeApi() {
  return []
}
