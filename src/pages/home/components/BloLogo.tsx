interface Props { 
  size?: 'md' | 'lg'
  light?: boolean // Variant pour le fond sombre du footer
}

export default function BloLogo({ size = 'md', light = false }: Props) {
  // Gestion des hauteurs de manière fluide (responsive)
  const logoHeight = size === 'lg' 
    ? 'clamp(45px, 6vw, 65px)'  // Idéal pour la navbar sans déborder
    : 'clamp(35px, 4vw, 45px)'; // Taille moyenne classique

  return (
    <img
      // Si light est vrai, on applique un filtre CSS pour inverser les couleurs (Noir -> Blanc)
      // Cela évite de devoir charger une deuxième image !
      src="/LOGOS_BLOOMAR_ONE.png"
      alt="BLOOMAR ONE"
      style={{
        height: logoHeight,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        background: 'transparent',
        filter: light ? 'brightness(0) invert(1)' : 'none', // Rend le logo blanc sur fond sombre
        transition: 'all 0.3s ease',
      }}
    />
  )
}