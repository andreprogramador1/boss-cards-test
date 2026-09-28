import { useMemo, useState } from 'react'
import HoloCard from './HoloCard'
import './Collection.css'

export default function Collection({ cards }) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filters = useMemo(() => {
    const counts = cards.reduce((acc, card) => {
      acc[card.foilId] = (acc[card.foilId] || 0) + 1
      return acc
    }, {})
    return [
      { id: 'all', label: 'All', count: cards.length },
      ...Object.entries(counts).map(([id, count]) => ({
        id,
        label: cards.find((c) => c.foilId === id)?.foilLabel ?? id,
        count,
      })),
    ]
  }, [cards])

  const visible =
    filter === 'all' ? cards : cards.filter((c) => c.foilId === filter)

  if (!cards.length) {
    return (
      <section className="collection collection--empty">
        <h2>Your binder is empty</h2>
        <p>Open a blister in the store to start collecting holographic pulls.</p>
      </section>
    )
  }

  return (
    <section className="collection">
      <header className="collection__head">
        <div>
          <h2>Collection</h2>
          <p>{cards.length} cards owned</p>
        </div>
        <div className="collection__filters">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? 'is-active' : ''}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span>{f.count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="collection__grid">
        {visible.map((card) => (
          <button
            key={card.instanceId}
            type="button"
            className="collection__item"
            onClick={() => setSelected(card)}
          >
            <HoloCard card={card} size="sm" interactive={false} />
            <span className="collection__foil" style={{ color: card.foilColor }}>
              {card.foilLabel}
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="collection__modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="collection__backdrop"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="collection__panel">
            <HoloCard card={selected} size="lg" interactive />
            <div className="collection__info">
              <h3>{selected.name}</h3>
              <p style={{ color: selected.foilColor }}>{selected.foilLabel}</p>
              <p className="collection__set">
                {selected.setName} · #{selected.number}
              </p>
              <button type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
