# Boss Cards

Pokémon TCG Pocket–style blister pack opener with holographic foils from [poke-holo](https://poke-holo.simey.me/).

## Run

```bash
cd boss-cards-proect
npm install
npm run dev
```

Open http://127.0.0.1:5173/

## Features

- **Store** with 3 blister packs (5 cards each)
- **Pack opening** flow: tear → reveal one-by-one → summary
- **Weighted foil slots** (common → rainbow / secret)
- **Holo effects** via [simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css)
- **Binder** collection saved in `localStorage`
- Placeholder arts from `images.pokemontcg.io` (swap in `src/lib/cardPool.js` later)

## Coins

Start with 500 ◎. Use **+** in the top bar to refill.
