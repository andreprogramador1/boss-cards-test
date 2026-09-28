import { useEffect, useState } from 'react'
import HoloCard from './HoloCard'
import './PackOpening.css'

const PHASE = {
  sealed: 'sealed',
  tearing: 'tearing',
  reveal: 'reveal',
  done: 'done',
}

export default function PackOpening({ product, cards, onFinish }) {
  const [phase, setPhase] = useState(PHASE.sealed)
  const [revealed, setRevealed] = useState(0)
  const [focusIndex, setFocusIndex] = useState(-1)

  useEffect(() => {
    setPhase(PHASE.sealed)
    setRevealed(0)
    setFocusIndex(-1)
  }, [cards])

  const startTear = () => {
    if (phase !== PHASE.sealed) return
    setPhase(PHASE.tearing)
    setTimeout(() => {
      setPhase(PHASE.reveal)
      setFocusIndex(0)
    }, 900)
  }

  const revealNext = () => {
    if (phase !== PHASE.reveal) return
    if (focusIndex < cards.length - 1) {
      setRevealed((n) => Math.max(n, focusIndex + 1))
      setFocusIndex((i) => i + 1)
      return
    }
    setRevealed(cards.length)
    setPhase(PHASE.done)
  }

  const current = focusIndex >= 0 ? cards[focusIndex] : null

  return (
    <div className="opening">
      {phase === PHASE.sealed || phase === PHASE.tearing ? (
        <button
          type="button"
          className={`opening__pack ${phase === PHASE.tearing ? 'is-tearing' : ''}`}
          style={{ '--pack-accent': product.accent }}
          onClick={startTear}
        >
          <span className="opening__hint">
            {phase === PHASE.sealed ? 'Tap to open' : 'Opening…'}
          </span>
          <strong>{product.name}</strong>
          <span className="opening__rip" aria-hidden="true" />
        </button>
      ) : null}

      {phase === PHASE.reveal || phase === PHASE.done ? (
        <div className="opening__stage">
          {current && phase === PHASE.reveal ? (
            <div
              className="opening__focus"
              role="button"
              tabIndex={0}
              onClick={revealNext}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  revealNext()
                }
              }}
            >
              <div className="opening__rarity" style={{ color: current.foilColor }}>
                {current.foilLabel}
              </div>
              <HoloCard card={current} size="xl" interactive />
              <p className="opening__name">{current.name}</p>
              <span className="opening__tap">
                {focusIndex < cards.length - 1 ? 'Tap for next card' : 'Tap to finish'}
              </span>
            </div>
          ) : null}

          {phase === PHASE.done ? (
            <div className="opening__summary">
              <h2>Pack complete</h2>
              <div className="opening__grid">
                {cards.map((card) => (
                  <div key={card.instanceId} className="opening__slot">
                    <HoloCard card={card} size="sm" interactive />
                    <span style={{ color: card.foilColor }}>{card.foilLabel}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="opening__done" onClick={onFinish}>
                Add to collection
              </button>
            </div>
          ) : null}

          <div className="opening__dots" aria-hidden="true">
            {cards.map((card, i) => (
              <span
                key={card.instanceId}
                className={i <= revealed || i === focusIndex ? 'is-on' : ''}
                style={{ background: i <= focusIndex ? card.foilColor : undefined }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
