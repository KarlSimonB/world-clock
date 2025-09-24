# World Clock - TypeScript Project av Simon Bergstrand FE24 

## Om Projektet

En webbapp med tidszoner över hela världen. 
Användaren kan lägga till städer och se klockan i städer över hela världen i digital och analog form. 
Inställningar sparas i localStorage, så städerna man lagt till sparas.

## Design och Gränssitt

Jag valde ett enkelt kortbaserat gränssnitt där varje stad får ett eget kort med en bakgrundsbild. 
Layouten är ett 3x3 rutnät på desktop som blir 1 kolumn med hjälp av responsive design på mobil/små skärmar.

- Minimal design med fokus på funktionerna först och främst
- Varje stad har en en fin bild för att det ska se bra ut
- Placeholder kort och Modal-popup för att lägga till nya städer

## Applikationsstruktur

### Komponenter
- **App.tsx** - Mainkomponenten
- **CityDetail.tsx** - Detaljvy när man klickar på stadskorten
- **useLocalStorage.ts** - Sparar städerna så man har kvar dem vid nästa tillfälle

### Types och Interfaces

```typescript
interface City {
  id: string;
  name: string;
  country: string;
  timezone: TimeZone;
  imageUrl: string;
}
```

Alla interfaces ligger i App.tsx och exporteras för att andra filer ska kunna använda sig av dem dem.

## TypeScript-fördelar i projektet

### 1. Props får rätt typ
```typescript
const CityCard: React.FC<{
  city: City;
  displayMode: 'digital' | 'analog';
}> = ({ city, displayMode }) => {
```
Man kan inte skicka fel data till komponenter.

### 2. Interfaces håller koll på datastruktur
När jag skapar en ny stad måste den ha alla rätta fält, annars går det inte med TypeScript.

### 3. Type Guards validerar data
```typescript
const isValidCityArray = (data: unknown): data is City[] => {
  // Kollar att datan är korrekt
}
```
Säkerställer att data från localStorage är korrekt.

## TypeScript blir JavaScript

TypeScript kan inte köras direkt i webbläsaren. Create React App gör om TypeScript-koden till vanlig JavaScript när man kör `npm start`. 

## Git-process

Jag missade lite med git, behöver repetera git under nästa projekt
Ungefär såhär borde jag jobbat mer I git:


```bash
git commit -m "Initial commit"
git commit -m "Add city component"
git commit -m "Add localStorage support"
git commit -m "Add React Router for detail view"
git commit -m "Fix timezone calculation"
```


## Testning

Jag har testat manuellt att:
- Det går att söka efter städer
- Mängden timmar som skiljer
- Man kan lägga till och ta bort städer
- Klockan visar rätt tid, bade digital och visarna på analoga
- Digital/analog växling fungerar
- Data sparas när man laddar om sidan
- Detaljvyn fungerar
- Layouten fungerar på mobil och desktop

## Installation

```bash
# Installera
npm install

# Starta
npm start

# Bygg för produktion
npm run build
```

## Projektstruktur
```
src/
├── App.tsx              # Huvudfil
├── App.css              # Stilar
├── CityDetail.tsx       # Detaljvy
├── CityDetail.css       # Stilar för detaljvy
└── useLocalStorage.ts   # localStorage hook
```