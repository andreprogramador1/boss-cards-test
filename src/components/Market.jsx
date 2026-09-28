import { useMemo, useState } from 'react'
import HoloCard from './HoloCard'
import {
  acceptListing,
  cancelListing,
  cardLabel,
  cardThumb,
  createListing,
  tradeCatalog,
} from '../lib/market'
import './Market.css'

export default function Market({ collection, listings, onUpdate, onToast }) {
  const [mode, setMode] = useState('browse') // browse | create
  const [offerId, setOfferId] = useState('')
  const [wants, setWants] = useState([])
  const [search, setSearch] = useState('')
  const [acceptFor, setAcceptFor] = useState(null) // listing being accepted
  const [giveId, setGiveId] = useState('')

  const catalog = useMemo(() => tradeCatalog(), [])
  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return catalog.slice(0, 24)
    return catalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.setName.toLowerCase().includes(q),
    )
  }, [catalog, search])

  const matchingOwned = (listing) =>
    collection.filter((c) => listing.wants.includes(c.baseId))

  const toggleWant = (baseId) => {
    setWants((prev) => {
      if (prev.includes(baseId)) return prev.filter((id) => id !== baseId)
      if (prev.length >= 3) return prev
      return [...prev, baseId]
    })
  }

  const submitCreate = () => {
    const result = createListing(listings, collection, {
      offerInstanceId: offerId,
      wantBaseIds: wants,
    })
    if (!result.ok) {
      onToast(result.error)
      return
    }
    onUpdate({ collection: result.collection, listings: result.listings })
    setOfferId('')
    setWants([])
    setSearch('')
    setMode('browse')
    onToast('Trade listed')
  }

  const submitCancel = (listingId) => {
    const result = cancelListing(listings, collection, listingId)
    if (!result.ok) {
      onToast(result.error)
      return
    }
    onUpdate({ collection: result.collection, listings: result.listings })
    onToast('Listing cancelled — card returned')
  }

  const openAccept = (listing) => {
    const matches = matchingOwned(listing)
    if (!matches.length) {
      onToast('You do not own any accepted card')
      return
    }
    setAcceptFor(listing)
    setGiveId(matches[0].instanceId)
  }

  const submitAccept = () => {
    if (!acceptFor) return
    const result = acceptListing(listings, collection, acceptFor.id, giveId)
    if (!result.ok) {
      onToast(result.error)
      return
    }
    onUpdate({ collection: result.collection, listings: result.listings })
    setAcceptFor(null)
    setGiveId('')
    onToast(`Trade done — got ${result.received.name}`)
  }

  return (
    <section className="market">
      <header className="market__head">
        <div>
          <h2>Trade market</h2>
          <p>Offer one card. Pick up to 3 cards you accept in return.</p>
        </div>
        <div className="market__tabs">
          <button
            type="button"
            className={mode === 'browse' ? 'is-active' : ''}
            onClick={() => setMode('browse')}
          >
            Browse
            <span>{listings.length}</span>
          </button>
          <button
            type="button"
            className={mode === 'create' ? 'is-active' : ''}
            onClick={() => setMode('create')}
          >
            New trade
          </button>
        </div>
      </header>

      {mode === 'create' ? (
        <div className="market__create">
          <div className="market__step">
            <h3>1. Card you offer</h3>
            {!collection.length ? (
              <p className="market__empty">Open packs first — binder is empty.</p>
            ) : (
              <div className="market__pick-grid">
                {collection.map((card) => (
                  <button
                    key={card.instanceId}
                    type="button"
                    className={`market__pick ${offerId === card.instanceId ? 'is-on' : ''}`}
                    onClick={() => setOfferId(card.instanceId)}
                  >
                    <img src={card.smallImage || card.image} alt={card.name} />
                    <span>{card.name}</span>
                    <em style={{ color: card.foilColor }}>{card.foilLabel}</em>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="market__step">
            <h3>2. Cards you accept ({wants.length}/3)</h3>
            <input
              className="market__search"
              type="search"
              placeholder="Search card name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {wants.length ? (
              <div className="market__chips">
                {wants.map((id) => (
                  <button key={id} type="button" onClick={() => toggleWant(id)}>
                    {cardLabel(id)} ×
                  </button>
                ))}
              </div>
            ) : null}
            <div className="market__pick-grid">
              {filteredCatalog.map((card) => (
                <button
                  key={card.baseId}
                  type="button"
                  className={`market__pick ${wants.includes(card.baseId) ? 'is-on' : ''}`}
                  onClick={() => toggleWant(card.baseId)}
                >
                  <img src={card.image} alt={card.name} />
                  <span>{card.name}</span>
                  <em>{card.setName}</em>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="market__submit"
            disabled={!offerId || !wants.length}
            onClick={submitCreate}
          >
            Post trade
          </button>
        </div>
      ) : (
        <div className="market__list">
          {!listings.length ? (
            <p className="market__empty">No open trades. Create one.</p>
          ) : (
            listings.map((listing) => {
              const canTrade = matchingOwned(listing).length > 0
              const yours = listing.owner === 'you'
              return (
                <article key={listing.id} className="market__card">
                  <div className="market__offer">
                    <HoloCard card={listing.offer} size="sm" interactive={false} />
                    <div>
                      <p className="market__who">{listing.ownerName}</p>
                      <h3>{listing.offer.name}</h3>
                      <p style={{ color: listing.offer.foilColor }}>
                        {listing.offer.foilLabel}
                      </p>
                    </div>
                  </div>

                  <div className="market__wants">
                    <span>Accepts</span>
                    <div className="market__want-row">
                      {listing.wants.map((baseId) => (
                        <div key={baseId} className="market__want">
                          <img src={cardThumb(baseId)} alt="" />
                          <span>{cardLabel(baseId)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="market__actions">
                    {yours ? (
                      <button type="button" className="ghost" onClick={() => submitCancel(listing.id)}>
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canTrade}
                        onClick={() => openAccept(listing)}
                      >
                        {canTrade ? 'Trade' : 'Need matching card'}
                      </button>
                    )}
                  </div>
                </article>
              )
            })
          )}
        </div>
      )}

      {acceptFor ? (
        <div className="market__modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="market__backdrop"
            aria-label="Close"
            onClick={() => setAcceptFor(null)}
          />
          <div className="market__panel">
            <h3>Complete trade</h3>
            <p>
              You receive <strong>{acceptFor.offer.name}</strong>. Give one of these:
            </p>
            <div className="market__pick-grid">
              {matchingOwned(acceptFor).map((card) => (
                <button
                  key={card.instanceId}
                  type="button"
                  className={`market__pick ${giveId === card.instanceId ? 'is-on' : ''}`}
                  onClick={() => setGiveId(card.instanceId)}
                >
                  <img src={card.smallImage || card.image} alt={card.name} />
                  <span>{card.name}</span>
                  <em style={{ color: card.foilColor }}>{card.foilLabel}</em>
                </button>
              ))}
            </div>
            <div className="market__modal-actions">
              <button type="button" className="ghost" onClick={() => setAcceptFor(null)}>
                Back
              </button>
              <button type="button" disabled={!giveId} onClick={submitAccept}>
                Confirm trade
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
