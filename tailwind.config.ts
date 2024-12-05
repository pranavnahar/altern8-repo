import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '20px'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'500': '#3490dc',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'500': '#ffed4a',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			danger: '#e3342f',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			'background-black-fade-font': '#8c8c8c',
  			'white-font': '#f4f2f2',
  			gainsboro: {
  				'100': '#ebdddd',
  				'200': '#d9d9d9'
  			},
  			'dark-purple': '#5d0696',
  			'orange-button': '#eb4647',
  			white: '#fff',
  			'background-black-font': '#a1a1a1',
  			'font-light-blue': '#9197B3',
  			'icon-light-blue': '#C3E1EF',
  			'font-green': '#006F12',
  			'font-gray': '#5C4F4F'
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
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			marquee: 'marquee var(--duration) infinite linear',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
  		},
  		fontFamily: {
  			exo: ['Exo', 'sans-serif']
  		},
  		fontSize: {
  			sm: '14px',
  			base: '16px',
  			base2: '18px',
  			base3: '19px',
  			xl: '20px',
  			'2xl': '22px',
  			'5xl': '24px',
  			'10xl': '30px',
  			'20xl': '35px',
  			'21xl': '40px',
  			'29xl': '48px',
  			'31xl': '50px',
  			inherit: 'inherit'
  		},
  		width: {
  			'35rem': '35rem'
  		}
  	},
  	screens: {
  		keypad: '180px',
  		phone: '360px',
  		xs: '480px',
  		s: '624px',
  		sm: '768px',
  		tablet: '914px',
  		md: '1060px',
  		lg: '1280px',
  		xl: '1490px',
  		xxl: '1700px',
  		'2xl': '1400px'
  	},
  	corePlugins: {
  		preflight: 'false'
  	}
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
