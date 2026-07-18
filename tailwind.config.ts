import type { Config } from 'tailwindcss'
import { facetPreset } from '@ciphera-net/facet-tailwind'

const config: Config = {
  presets: [facetPreset as Partial<Config>],
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@ciphera-net/facet/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			display: [
  				'var(--font-geist-sans)',
  				'Geist',
  				'system-ui',
  				'sans-serif'
  			],
  			sans: [
  				'var(--font-geist-sans)',
  				'Geist',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-jetbrains-mono)',
  				'"JetBrains Mono"',
  				'monospace'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
export default config
