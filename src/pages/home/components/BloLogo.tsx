interface Props { size?: 'md' | 'lg' }

export default function BloLogo({ size = 'md' }: Props) {
  return (
    <img
      src="/LOGOS_BLOOMAR_ONE.png"
      alt="BLOOMAR ONE"
      style={{
        height: size === 'lg' ? 70 : 52,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
      onError={(e) => {
        // Fallback texte si image introuvable
        const target = e.currentTarget
        target.style.display = 'none'
        const parent = target.parentElement
        if (parent) {
          parent.innerHTML = `
            <div style="display:flex;flex-direction:column;line-height:1">
              <span style="font-family:'DM Sans',sans-serif;font-weight:800;font-size:${size === 'lg' ? '2rem' : '1.45rem'};letter-spacing:-0.03em;background:linear-gradient(90deg,#8B2FC9,#1A9CB0);-webkit-background-clip:text;-webkit-text-fill-color:transparent">BLOOMAR</span>
              <span style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:${size === 'lg' ? '0.85rem' : '0.65rem'};letter-spacing:0.35em;background:linear-gradient(90deg,#8B2FC9,#1A9CB0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:-3px;padding-left:2px">ONE</span>
            </div>`
        }
      }}
    />
  )
}