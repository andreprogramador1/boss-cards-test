import { useCallback, useEffect, useState } from 'react'
import PackBlister from './components/PackBlister'
import PackOpening from './components/PackOpening'
import Collection from './components/Collection'
import HoloCard from './components/HoloCard'
import {
  PACK_PRODUCTS,
  addToCollection,
  loadCoins,
  loadCollection,
  openPack,
  saveCoins,
} from './lib/pack'
import { BOSS_ORIGINALS } from './lib/cardPool'
import { FOIL_TIERS } from './lib/foils'
import './App.css'

const DEMO_CARD = {
  ...BOSS_ORIGINALS[0],
  instanceId: 'demo-starhoof',
  foilId: 'rainbow',
  foilLabel: FOIL_TIERS.rainbow.label,
  foilColor: FOIL_TIERS.rainbow.color,
  hasFoil: true,
  rarity: FOIL_TIERS.rainbow.rarityAttr,
  subtypes: ['V'],
  supertype: 'pokémon',
}

const VIEWS = {
  store: 'store',
  opening: 'opening',
  collection: 'collection',
}

export default function App() {
  const [view, setView] = useState(VIEWS.store)
  const [coins, setCoins] = useState(STARTER_SAFE)
  const [collection, setCollection] = useState([])
  const [session, setSession] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setCoins(loadCoins())
    setCollection(loadCollection())
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const buyPack = useCallback(
    (product) => {
      if (coins < product.price) {
        setToast('Not enough coins')
        return
      }
      const nextCoins = coins - product.price
      setCoins(nextCoins)
      saveCoins(nextCoins)
      const pulled = openPack(product)
      setSession({ product, cards: pulled })
      setView(VIEWS.opening)
    },
    [coins],
  )

  const finishOpening = () => {
    if (!session) return
    const next = addToCollection(collection, session.cards)
    setCollection(next)
    setSession(null)
    setView(VIEWS.collection)
    setToast('Cards added to your binder')
  }

  const showcase = collection.find((c) => c.hasFoil) ?? collection[0] ?? DEMO_CARD

  return (
    <div className="app">
      <div className="app__atmosphere" aria-hidden="true" />

      <header className="topbar">
        <button type="button" className="brand" onClick={() => setView(VIEWS.store)}>
          <span className="brand__mark">B</span>
          <span className="brand__text">
            Boss <em>Cards</em>
          </span>
        </button>

        <nav className="topbar__nav">
          <button
            type="button"
            className={view === VIEWS.store || view === VIEWS.opening ? 'is-active' : ''}
            onClick={() => setView(VIEWS.store)}
          >
            Store
          </button>
          <button
            type="button"
            className={view === VIEWS.collection ? 'is-active' : ''}
            onClick={() => setView(VIEWS.collection)}
          >
            Binder
            <span>{collection.length}</span>
          </button>
        </nav>

        <div className="topbar__coins" title="Coins">
          <span>◎</span>
          {coins}
          <button
            type="button"
            className="topbar__refill"
            onClick={() => {
              const next = coins + 300
              setCoins(next)
              saveCoins(next)
              setToast('+300 coins')
            }}
          >
            +
          </button>
        </div>
      </header>

      <main className="app__main">
        {view === VIEWS.store ? (
          <>
            <section className="hero">
              <div className="hero__copy">
                <p className="hero__eyebrow">Pocket-style blister pulls</p>
                <h1 className="hero__brand">Boss Cards</h1>
                <p className="hero__lead">
                  Tear open exclusive Boss Duo blisters — Starhoof rainbow and
                  Nightflare cosmos — then chase more foils in the store.
                </p>
                <div className="hero__cta">
                  <button type="button" onClick={() => buyPack(PACK_PRODUCTS[0])}>
                    Open Boss Duo
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setView(VIEWS.collection)}
                  >
                    View binder
                  </button>
                </div>
              </div>
              <div className="hero__card">
                <HoloCard card={showcase} size="lg" interactive />
              </div>
            </section>

            <section className="store">
              <div className="store__head">
                <h2>Blister store</h2>
                <p>Exclusive duo blister up front — classic 5-card packs below.</p>
              </div>
              <div className="store__grid">
                {PACK_PRODUCTS.map((product) => (
                  <PackBlister
                    key={product.id}
                    product={product}
                    disabled={coins < product.price}
                    onBuy={buyPack}
                  />
                ))}
              </div>
            </section>
          </>
        ) : null}

        {view === VIEWS.opening && session ? (
          <PackOpening
            product={session.product}
            cards={session.cards}
            onFinish={finishOpening}
          />
        ) : null}

        {view === VIEWS.collection ? <Collection cards={collection} /> : null}
      </main>

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}

function STARTER_SAFE() {
  try {
    return loadCoins()
  } catch {
    return 500
  }
}
