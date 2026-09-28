import './PackBlister.css'

export default function PackBlister({ product, disabled, onBuy }) {
  const count = product.cardCount ?? product.fixedPulls?.length ?? 5
  const previews = product.previewImages ?? []

  return (
    <article
      className={`blister ${previews.length ? 'blister--preview' : ''} ${disabled ? 'is-disabled' : ''}`}
      style={{
        '--pack-accent': product.accent,
        '--pack-glow': product.glow,
      }}
    >
      <div className="blister__shell" aria-hidden="true">
        <div className="blister__foil" />
        {previews.length ? (
          <div className="blister__previews">
            {previews.map((src, i) => (
              <img
                key={src}
                className={`blister__preview blister__preview--${i + 1}`}
                src={src}
                alt=""
                draggable={false}
              />
            ))}
          </div>
        ) : null}
        <div className="blister__pack">
          <span className="blister__brand">BOSS</span>
          <strong className="blister__title">{product.name}</strong>
          <span className="blister__count">{count} CARDS</span>
        </div>
        <div className="blister__shine" />
      </div>

      <div className="blister__meta">
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <button
          type="button"
          className="blister__buy"
          disabled={disabled}
          onClick={() => onBuy(product)}
        >
          <span>Open blister</span>
          <em>{product.price} ◎</em>
        </button>
      </div>
    </article>
  )
}
