interface Props { size?: 'md' | 'lg' }

export default function BloLogo({ size = 'md' }: Props) {
  return (
    <img
      src="/LOGOS_BLOOMAR_ONE.png"
      alt="BLOOMAR ONE"
      style={{
        height: size === 'lg' ? 80 : 64,   // ✅ beaucoup plus grand
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        // ✅ fond transparent = épouse Navbar ET Footer
        background: 'transparent',
      }}
    />
  )
}