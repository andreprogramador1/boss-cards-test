import { BOSS_ORIGINALS, CARD_POOL } from './cardPool'
import { FOIL_TIERS, PACK_SLOTS, subtypesForFoil } from './foils'
import { pickWeighted } from './math'

const STORAGE_KEY = 'boss-cards-collection-v1'
const COINS_KEY = 'boss-cards-coins-v1'

export const PACK_PRICE = 100
export const STARTER_COINS = 500
export const CARDS_PER_PACK = 5

export const PACK_PRODUCTS = [
  {
    id: 'boss-duo-blister',
    name: 'Boss Duo Blister',
    subtitle: '2 exclusive cards · rainbow + cosmos foils',
    price: 120,
    accent: '#b8f23a',
    glow: 'rgba(184, 242, 58, 0.45)',
    cardCount: 2,
    packArt: '/packs/boss-duo.jpg',
    previewImages: BOSS_ORIGINALS.map((c) => c.image),
    /** Guaranteed pulls — each card gets a distinct foil */
    fixedPulls: [
      { baseId: 'boss1-1', foilId: 'rainbow' },
      { baseId: 'boss1-2', foilId: 'cosmos' },
    ],
  },
  {
    id: 'scarlet-blister',
    name: 'Scarlet Blister',
    subtitle: '5 cards · chase slot guaranteed',
    price: PACK_PRICE,
    accent: '#e85d4c',
    glow: 'rgba(232, 93, 76, 0.45)',
    setFilter: ['sv1', 'swsh1', 'pgo', 'base1', 'sm115'],
  },
  {
    id: 'violet-blister',
    name: 'Violet Blister',
    subtitle: '5 cards · cosmos & radiant rates ↑',
    price: PACK_PRICE,
    accent: '#7b6cf6',
    glow: 'rgba(123, 108, 246, 0.45)',
    setFilter: ['swsh7', 'swsh3', 'swsh35', 'xy12'],
    boost: { cosmos: 1.4, radiant: 1.6, rainbow: 1.3 },
  },
  {
    id: 'champions-blister',
    name: "Champion's Blister",
    subtitle: '5 cards · V / VMAX weighted',
    price: 150,
    accent: '#d4a017',
    glow: 'rgba(212, 160, 23, 0.5)',
    setFilter: ['swsh35', 'swsh1', 'swsh7', 'base1'],
    boost: { v: 2, vmax: 2, secret: 1.5 },
  },
]

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function poolForProduct(product) {
  if (!product?.setFilter?.length) return CARD_POOL
  const filtered = CARD_POOL.filter((c) => product.setFilter.includes(c.set))
  return filtered.length >= 8 ? filtered : CARD_POOL
}

function rollFoil(slotWeights, boost = {}) {
  const weighted = slotWeights.map((entry) => ({
    ...entry,
    weight: entry.weight * (boost[entry.foil] ?? 1),
  }))
  return pickWeighted(weighted).foil
}

function materializeCard(base, foilId, slot) {
  const foil = FOIL_TIERS[foilId] ?? FOIL_TIERS.common
  return {
    ...base,
    instanceId: uid(),
    foilId: foil.id,
    foilLabel: foil.label,
    foilColor: foil.color,
    hasFoil: foil.hasFoil,
    rarity: foil.rarityAttr,
    subtypes: subtypesForFoil(foil.id, base.subtypes),
    supertype: base.subtypes.some((s) => /supporter|item|tool/i.test(s))
      ? 'trainer'
      : 'pokémon',
    slot,
    obtainedAt: Date.now(),
  }
}

export function openPack(product) {
  if (product?.fixedPulls?.length) {
    return product.fixedPulls.map((pull, index) => {
      const base =
        CARD_POOL.find((c) => c.baseId === pull.baseId) ??
        BOSS_ORIGINALS.find((c) => c.baseId === pull.baseId) ??
        CARD_POOL[0]
      return materializeCard(base, pull.foilId, index + 1)
    })
  }

  const pool = poolForProduct(product)
  const used = new Set()
  return PACK_SLOTS.map((slotWeights, index) => {
    const foilId = rollFoil(slotWeights, product.boost)

    let base
    let attempts = 0
    do {
      base = pool[Math.floor(Math.random() * pool.length)]
      attempts += 1
    } while (used.has(base.baseId) && attempts < 20)
    used.add(base.baseId)

    return materializeCard(base, foilId, index + 1)
  })
}

export function loadCoins() {
  const raw = localStorage.getItem(COINS_KEY)
  if (raw == null) {
    localStorage.setItem(COINS_KEY, String(STARTER_COINS))
    return STARTER_COINS
  }
  return Number(raw) || 0
}

export function saveCoins(amount) {
  localStorage.setItem(COINS_KEY, String(Math.max(0, amount)))
}

export function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCollection(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function addToCollection(existing, pulled) {
  const next = [...pulled, ...existing]
  saveCollection(next)
  return next
}
