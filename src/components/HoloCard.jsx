import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adjust, clamp, round } from '../lib/math'
import './HoloCard.css'

const CARD_BACK =
  'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg'

function useSpringPose(activeInteraction) {
  const [pose, setPose] = useState({
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
    go: 0,
    bx: 50,
    by: 50,
  })
  const target = useRef(pose)
  const raf = useRef(0)

  const tick = useCallback(() => {
    setPose((current) => {
      const t = target.current
      const stiffness = activeInteraction ? 0.18 : 0.08
      const next = {
        rx: current.rx + (t.rx - current.rx) * stiffness,
        ry: current.ry + (t.ry - current.ry) * stiffness,
        gx: current.gx + (t.gx - current.gx) * stiffness,
        gy: current.gy + (t.gy - current.gy) * stiffness,
        go: current.go + (t.go - current.go) * stiffness,
        bx: current.bx + (t.bx - current.bx) * stiffness,
        by: current.by + (t.by - current.by) * stiffness,
      }
      const done =
        Math.abs(next.rx - t.rx) < 0.05 &&
        Math.abs(next.ry - t.ry) < 0.05 &&
        Math.abs(next.go - t.go) < 0.01
      if (!done) raf.current = requestAnimationFrame(tick)
      return next
    })
  }, [activeInteraction])

  const setTarget = useCallback(
    (next) => {
      target.current = { ...target.current, ...next }
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(tick)
    },
    [tick],
  )

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return [pose, setTarget]
}

export default function HoloCard({
  card,
  size = 'md',
  interactive = true,
  flipped = false,
  onClick,
  className = '',
}) {
  const rootRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [pose, setTarget] = useSpringPose(interacting)

  const seed = useMemo(
    () => ({
      x: Math.random(),
      y: Math.random(),
      cosmosX: Math.floor(Math.random() * 734),
      cosmosY: Math.floor(Math.random() * 1280),
    }),
    [card.instanceId ?? card.baseId],
  )

  const types = Array.isArray(card.types)
    ? card.types.join(' ').toLowerCase()
    : String(card.types || '').toLowerCase()
  const subtypes = Array.isArray(card.subtypes)
    ? card.subtypes.join(' ').toLowerCase()
    : String(card.subtypes || 'basic').toLowerCase()
  const rarity = String(card.rarity || 'common').toLowerCase()
  const supertype = String(card.supertype || 'pokémon').toLowerCase()

  const interact = (e) => {
    if (!interactive) return
    const el = rootRef.current
    if (!el) return
    const point = e.touches?.[0] ?? e
    const rect = el.getBoundingClientRect()
    const percent = {
      x: clamp(round((100 / rect.width) * (point.clientX - rect.left))),
      y: clamp(round((100 / rect.height) * (point.clientY - rect.top))),
    }
    const center = { x: percent.x - 50, y: percent.y - 50 }
    setInteracting(true)
    setTarget({
      bx: adjust(percent.x, 0, 100, 37, 63),
      by: adjust(percent.y, 0, 100, 33, 67),
      rx: round(-(center.x / 3.5)),
      ry: round(center.y / 3.5),
      gx: round(percent.x),
      gy: round(percent.y),
      go: 1,
    })
  }

  const interactEnd = () => {
    setInteracting(false)
    setTarget({ rx: 0, ry: 0, gx: 50, gy: 50, go: 0, bx: 50, by: 50 })
  }

  const fromCenter = clamp(
    Math.sqrt((pose.gy - 50) ** 2 + (pose.gx - 50) ** 2) / 50,
    0,
    1,
  )

  const style = {
    '--pointer-x': `${pose.gx}%`,
    '--pointer-y': `${pose.gy}%`,
    '--pointer-from-center': fromCenter,
    '--pointer-from-top': pose.gy / 100,
    '--pointer-from-left': pose.gx / 100,
    '--card-opacity': pose.go,
    '--rotate-x': `${pose.rx}deg`,
    '--rotate-y': `${pose.ry}deg`,
    '--background-x': `${pose.bx}%`,
    '--background-y': `${pose.by}%`,
    '--card-scale': 1,
    '--translate-x': '0px',
    '--translate-y': '0px',
    '--seedx': seed.x,
    '--seedy': seed.y,
    '--cosmosbg': `${seed.cosmosX}px ${seed.cosmosY}px`,
  }

  const typeClass = types.split(' ')[0] || ''

  return (
    <div
      ref={rootRef}
      className={[
        'card',
        'holo-card',
        `holo-card--${size}`,
        typeClass,
        interactive ? 'interactive' : '',
        interacting ? 'interacting' : '',
        loading ? 'loading' : '',
        flipped ? 'is-flipped' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-number={card.number}
      data-set={card.set}
      data-subtypes={subtypes}
      data-supertype={supertype}
      data-rarity={rarity}
      style={style}
      onClick={onClick}
    >
      <div className="card__translater">
        <button
          type="button"
          className="card__rotator"
          aria-label={`${card.name} card`}
          onPointerMove={interact}
          onPointerLeave={interactEnd}
          onPointerUp={interactEnd}
          onBlur={interactEnd}
        >
          <img
            className="card__back"
            src={CARD_BACK}
            alt=""
            width="660"
            height="921"
            draggable={false}
          />
          <div className="card__front">
            <img
              src={card.image}
              alt={card.name}
              width="660"
              height="921"
              draggable={false}
              onLoad={() => setLoading(false)}
              onError={(e) => {
                e.currentTarget.src = card.smallImage || card.image
                setLoading(false)
              }}
            />
            {(card.hasFoil || rarity.includes('holo') || rarity.includes('rare')) && (
              <>
                <div className="card__shine" />
                <div className="card__glare" />
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
