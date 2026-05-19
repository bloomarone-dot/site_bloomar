import React from 'react'

interface Props { size?: 'md' | 'lg' }

export default function BloLogo({ size = 'md' }: Props) {
  const h = size === 'lg' ? 56 : 42
  const w = h * 3.2 // ratio width/height du viewBox 320/100

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: h }}>
      <svg
        height={h}
        width={w}
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B2FC9"/>
            <stop offset="50%" stopColor="#6B3FC0"/>
            <stop offset="100%" stopColor="#1A9CB0"/>
          </linearGradient>
        </defs>

        {/* BLOOMAR */}
        <text
          x="0" y="58"
          fontFamily="DM Sans, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="url(#logoGrad)"
          letterSpacing="-1"
        >
          BLOOMAR
        </text>

        {/* ONE centré en dessous */}
        <text
          x="160" y="90"
          fontFamily="DM Sans, sans-serif"
          fontWeight="600"
          fontSize="26"
          fill="url(#logoGrad)"
          textAnchor="middle"
          letterSpacing="6"
        >
          ONE
        </text>

        {/* Deux cercles stylisés sur les OO */}
        <circle cx="148" cy="38" r="14"
          stroke="url(#logoGrad)" strokeWidth="3.5" fill="none"/>
        <circle cx="172" cy="38" r="14"
          stroke="url(#logoGrad)" strokeWidth="3.5" fill="none"/>
      </svg>
    </div>
  )
}