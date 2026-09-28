import { useCallback, useEffect, useRef, useState } from 'react'
import HoloCard from './HoloCard'
import './PackOpening.css'

const PHASE = {
  sealed: 'sealed',
  tearing: 'tearing',
  reveal: 'reveal',
  done: 'done',
}

const TEAR_COMPLETE = 0.85

function ScissorsIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="sachet__scissors-svg">
      <circle cx="16" cy="18" r="9" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="16" cy="46" r="9" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M22 24 L48 12 M22 40 L48 52 M24 32 L42 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="32" r="3.5" fill="currentColor" />
    </svg>
  )
}

export default function PackOpening({ product, cards, onFinish }) {
  const [phase, setPhase] = useState(PHASE.sealed)
  const [revealed, setRevealed] = useState(0)
  const [focusIndex, setFocusIndex] = useState(-1)
  const [tearProgress, setTearProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const trackRef = useRef(null)
  const draggingRef = useRef(false)
  const tearProgressRef = useRef(0)
  const tearingRef = useRef(false)
  const tearTimer = useRef(0)

  useEffect(() => {
    setPhase(PHASE.sealed)
    setRevealed(0)
    setFocusIndex(-1)
    setTearProgress(0)
    tearProgressRef.current = 0
    tearingRef.current = false
    setDragging(false)
    draggingRef.current = false
    return () => clearTimeout(tearTimer.current)
  }, [cards])

  const finishTear = useCallback(() => {
    if (tearingRef.current) return
    tearingRef.current = true
    setPhase(PHASE.tearing)
    setTearProgress(1)
    tearProgressRef.current = 1
    setDragging(false)
    draggingRef.current = false
    clearTimeout(tearTimer.current)
    tearTimer.current = setTimeout(() => {
      setPhase(PHASE.reveal)
      setFocusIndex(0)
    }, 780)
  }, [])

  const updateTearFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      tearProgressRef.current = progress
      setTearProgress(progress)
      if (progress >= TEAR_COMPLETE) finishTear()
    },
    [finishTear],
  )

  const onPointerDown = (e) => {
    if (phase !== PHASE.sealed) return
    e.preventDefault()
    draggingRef.current = true
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateTearFromClientX(e.clientX)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current || phase !== PHASE.sealed) return
    updateTearFromClientX(e.clientX)
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (tearProgressRef.current >= TEAR_COMPLETE) finishTear()
  }

  const startTear = () => {
    if (phase !== PHASE.sealed) return
    finishTear()
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
  const packArt = product.packArt
  const scissorsLeft = `${Math.min(96, Math.max(4, tearProgress * 100))}%`
  const sealed = phase === PHASE.sealed || phase === PHASE.tearing

  return (
    <div className="opening">
      {sealed ? (
        <div
          className={[
            'sachet',
            phase === PHASE.tearing ? 'is-tearing' : '',
            dragging ? 'is-dragging' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            '--pack-accent': product.accent,
            '--tear': tearProgress,
          }}
        >
          <p className="sachet__hint">
            {phase === PHASE.tearing
              ? 'Opening…'
              : 'Drag the scissors or tap the pack to tear'}
          </p>

          <div className="sachet__stage">
            <button
              type="button"
              className="sachet__body"
              onClick={startTear}
              aria-label={`Open ${product.name}`}
            >
              <div className="sachet__half sachet__half--top" aria-hidden="true">
                <div className="sachet__crimp sachet__crimp--top" />
                <div className="sachet__face sachet__face--top">
                  <div
                    className="sachet__art"
                    style={packArt ? { backgroundImage: `url(${packArt})` } : undefined}
                  />
                  <div className="sachet__foil" />
                  <div className="sachet__sheen" />
                </div>
              </div>

              <div className="sachet__half sachet__half--bottom" aria-hidden="true">
                <div className="sachet__face sachet__face--bottom">
                  <div
                    className="sachet__art"
                    style={packArt ? { backgroundImage: `url(${packArt})` } : undefined}
                  />
                  <div className="sachet__foil" />
                  <div className="sachet__sheen" />
                  <div className="sachet__badge">BOSS CARDS</div>
                  <div className="sachet__label">
                    <strong>{product.name}</strong>
                  </div>
                  <div className="sachet__footer">
                    <span>{product.cardCount ?? product.fixedPulls?.length ?? 5} CARDS</span>
                  </div>
                </div>
                <div className="sachet__crimp sachet__crimp--bottom" />
              </div>

              <span className="sachet__edge sachet__edge--left" />
              <span className="sachet__edge sachet__edge--right" />

              {!packArt ? (
                <div className="sachet__fallback" style={{ background: product.accent }} />
              ) : null}
            </button>

            <div
              ref={trackRef}
              className="sachet__tear-track"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="slider"
              aria-label="Tear pack with scissors"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(tearProgress * 100)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  startTear()
                }
                if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  setTearProgress((p) => {
                    const next = Math.min(1, p + 0.12)
                    tearProgressRef.current = next
                    if (next >= TEAR_COMPLETE) finishTear()
                    return next
                  })
                }
              }}
            >
              <div className="sachet__perforation" aria-hidden="true" />
              <div
                className="sachet__rip"
                style={{ width: `${tearProgress * 100}%` }}
                aria-hidden="true"
              />
              <div
                className="sachet__scissors"
                style={{ left: scissorsLeft }}
                aria-hidden="true"
              >
                <ScissorsIcon />
              </div>
            </div>
          </div>
        </div>
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
              <div
                className="opening__grid"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(cards.length, 5)}, minmax(0, 1fr))`,
                }}
              >
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
