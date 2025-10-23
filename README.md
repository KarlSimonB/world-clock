# World Clock - TypeScript & React Projekt

En webbapp för att se och jämföra vad klockan är i olika städer och tidszoner runt om i världen.

##  Om Projektet

En responsiv webbapp där användare kan:
- Jämföra tider mellan olika tidszoner
- Söka och lägga till populära städer
- Lägga till och ställa in egna städer
- Välja digital eller analog klockvisning
- Få sina inställningar sparade automatiskt 

Appen inkluderar ett urval av populära städer med bilder, och nyttjar localStorage för att spara användares valda städer och inställningar mellan sessioner.

## Design och Gränssitt

Kortbaserat, minimalistiskt gränssnitt med fokus på funktion,resposivitet och användarvänlighet:
- Ett responsivt 3x3 grid som vid mindre skärmar staplas vertikalt
- Modal-popup för att enkelt lägga till nya städer
- Real-time klockuppdateringar 
- Se GMT-tiszoner på valda städer och jämföra

### Responsiv bredd
- Desktop | 3 kort  | 900px+
- Tablet  | 2 kort  | 550-768px 
- Mobil   | 1 Kort  | <480px 


##  Projektstruktur

```
src/
├── App.tsx                          # Mainkomponent
├── index.tsx                        # Entry point
├── components/
│   ├── CityCard.tsx                # Stadskort
│   ├── CityDetail.tsx              # Detaljerad vy 
│   ├── CityGrid.tsx                # Grid för layout av Stadskort
│   ├── AddCityModal.tsx            # För att lägga till stad
│   ├── Header.tsx                  # Sökfält
│   ├── AnalogClock.tsx             # Analog klocka
│   ├── const/
│   │   ├── cities.ts               # Populära städer
│   │   ├── images.ts               # Bilder
│   │   ├── types.ts                # Types för vyer
│   │   └── utcOffsets.ts           # GMT/UTC förskjutning
│   ├── hooks/
│   │   ├── useCityManager.ts       # Stadstillståndshantering
│   │   ├── useCurrentTime.ts       # Hook för nuvarande tid
│   │   ├── useDisplayModes.ts      # Digital/analog mode
│   │   ├── useLocalStorage.ts      # Val sparas i localstorage imellan sessioner
│   └── services/
│       └── timeZoneService.ts      # API för tidszoner
├── styles/
│   ├── index.css                   # Main style import
│   ├── base.css                    # Style reset
│   ├── components.css              # Komponentstyles
│   └── responsive.css              # Responsivitet vid små skärmar
└── utils/
    └── formatTimezoneOffset.ts     # Tidszonsformatering
```


## Testning

Manuellt testad funktionalitet:
- Sökning och filtrering av städer
- Digital och analog tidsvisning
- Lägg till/ta bort förvalda och egenvalda städer
- Man kan lägga till och ta bort städer
- Tidszonberäkningar och se GMT 
- Växling mellan visningslägen
- Data sparas när man laddar om sidan
- Detaljvyn fungerar
- Responsiv design (mobil & desktop)

## Installation

```bash

# Klona projektet
git clone https://github.com/KarlSimonB/world-clock.git
cd world-clock

# Installera beroenden
npm install

# Starta utvecklingsserver (öppnas på http://localhost:5173) 
npm run dev

# Bygg projektet för produktion
npm run build
```

##  Förbättringar från Original

- Migrerad från Create React App till Vite
- Reducerad komplexitet - App.tsx: 1030 → 69 rader
- Bättre modulär struktur med separata komponente och mappar 
- Tydligare filmnamngivning och mappstruktur: 
`/components`, `/styles`, `/utils`, `/const`, `/hooks` & `/services`
- Organiserad styling, index.css har bara imports och undviker inline CSS 
- De-bloated och snyggat till överlag


##  Licens

Skolprojekt av Simon Bergstrand - FE24