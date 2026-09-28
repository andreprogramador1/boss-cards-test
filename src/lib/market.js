import { CARD_POOL } from './cardPool'
import { FOIL_TIERS, subtypesForFoil } from './foils'
import { saveCollection } from './pack'

const MARKET_KEY = 'boss-cards-market-v1'

function uid() {
  return `trade-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function materializeFromPool(baseId, foilId = 'holo') {
  const base = CARD_POOL.find((c) => c.baseId === baseId) ?? CARD_POOL[0]
  const foil = FOIL_TIERS[foilId] ?? FOIL_TIERS.holo
  return {
    ...base,
    instanceId: uid(),
    foilId: foil.id,
    foilLabel: foil.label,
    foilColor: foil.color,
    hasFoil: foil.hasFoil,
    rarity: foil.rarityAttr,
    subtypes: subtypesForFoil(foil.id, base.subtypes),
    supertype: 'pokémon',
    obtainedAt: Date.now(),
  }
}

function defaultListings() {
  return [
    {
      id: 'npc-starhoof',
      owner: 'npc',
      ownerName: 'Market Bot',
      offer: materializeFromPool('boss1-1', 'rainbow'),
      wants: ['swsh1-25', 'sv1-36', 'base1-4'],
      createdAt: Date.now() - 86000000,
    },
    {
      id: 'npc-nightflare',
      owner: 'npc',
      ownerName: 'Market Bot',
      offer: materializeFromPool('boss1-2', 'cosmos'),
      wants: ['swsh7-91', 'pgo-28', 'sm115-7'],
      createdAt: Date.now() - 43000000,
    },
    {
      id: 'npc-charizard',
      owner: 'npc',
      ownerName: 'Rival Trader',
      offer: materializeFromPool('base1-4', 'secret'),
      wants: ['boss1-1', 'boss1-2'],
      createdAt: Date.now() - 12000000,
    },
  ]
}

export function loadListings() {
  try {
    const raw = localStorage.getItem(MARKET_KEY)
    if (!raw) {
      const seeded = defaultListings()
      localStorage.setItem(MARKET_KEY, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw)
  } catch {
    return defaultListings()
  }
}

export function saveListings(listings) {
  localStorage.setItem(MARKET_KEY, JSON.stringify(listings))
}

export function cardLabel(baseId) {
  const card = CARD_POOL.find((c) => c.baseId === baseId)
  return card ? card.name : baseId
}

export function cardThumb(baseId) {
  const card = CARD_POOL.find((c) => c.baseId === baseId)
  return card?.smallImage || card?.image || ''
}

/** Create a trade: lock offered card out of collection */
export function createListing(listings, collection, { offerInstanceId, wantBaseIds }) {
  const offer = collection.find((c) => c.instanceId === offerInstanceId)
  if (!offer) return { ok: false, error: 'Card not found in binder' }
  if (!wantBaseIds?.length) return { ok: false, error: 'Pick at least one wanted card' }

  const listing = {
    id: uid(),
    owner: 'you',
    ownerName: 'You',
    offer,
    wants: wantBaseIds.slice(0, 3),
    createdAt: Date.now(),
  }

  const nextCollection = collection.filter((c) => c.instanceId !== offerInstanceId)
  const nextListings = [listing, ...listings]
  saveCollection(nextCollection)
  saveListings(nextListings)
  return { ok: true, collection: nextCollection, listings: nextListings }
}

export function cancelListing(listings, collection, listingId) {
  const listing = listings.find((l) => l.id === listingId)
  if (!listing || listing.owner !== 'you') {
    return { ok: false, error: 'Cannot cancel this trade' }
  }
  const nextListings = listings.filter((l) => l.id !== listingId)
  const nextCollection = [listing.offer, ...collection]
  saveCollection(nextCollection)
  saveListings(nextListings)
  return { ok: true, collection: nextCollection, listings: nextListings }
}

/**
 * Accept a trade: give one owned card that matches wants,
 * receive the offered card.
 */
export function acceptListing(listings, collection, listingId, giveInstanceId) {
  const listing = listings.find((l) => l.id === listingId)
  if (!listing) return { ok: false, error: 'Listing gone' }
  if (listing.owner === 'you') return { ok: false, error: 'That is your own listing' }

  const give = collection.find((c) => c.instanceId === giveInstanceId)
  if (!give) return { ok: false, error: 'Select a card from your binder' }
  if (!listing.wants.includes(give.baseId)) {
    return { ok: false, error: 'This card is not accepted for that trade' }
  }

  const received = {
    ...listing.offer,
    instanceId: uid(),
    obtainedAt: Date.now(),
  }

  const nextCollection = [
    received,
    ...collection.filter((c) => c.instanceId !== giveInstanceId),
  ]
  const nextListings = listings.filter((l) => l.id !== listingId)
  saveCollection(nextCollection)
  saveListings(nextListings)
  return { ok: true, collection: nextCollection, listings: nextListings, received }
}

/** Unique catalog entries for the “I want” picker */
export function tradeCatalog() {
  return CARD_POOL.map((c) => ({
    baseId: c.baseId,
    name: c.name,
    image: c.smallImage || c.image,
    setName: c.setName,
  }))
}
