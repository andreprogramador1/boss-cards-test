import './PackBlister.css'

export default function PackBlister({ product, disabled, onBuy }) {
  return (
    <article
      className={`blister ${disabled ? 'is-disabled' : ''}`}
      style={{
        '--pack-accent': product.accent,
        '--pack-glow': product.glow,
      }}
    >
      <div className="blister__shell" aria-hidden="true">
        <div className="blister__foil" />
        <div className="blister__pack">
          <span className="blister__brand">BOSS</span>
          <strong className="blister__title">{product.name}</strong>
          <span className="blister__count">5 CARDS</span>
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
