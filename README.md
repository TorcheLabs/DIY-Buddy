# HomeValue DIY

A cross-platform mobile app (iOS, Android, and web) built with [Expo](https://expo.dev) and React Native that guides homeowners through DIY home improvement projects designed to increase their home's resale value.

## Features

- **Curated project library** — 15 real-world DIY projects across Kitchen, Bathroom, Curb Appeal, Energy Efficiency, Outdoor, Interior Paint, Storage, and Flooring categories, each with:
  - Estimated cost range, time commitment, difficulty, average ROI %, and estimated home value added
  - Step-by-step instructions with time estimates per step
  - Required tools and materials
  - Safety tips and a pro tip
- **Explore & filter** — search by keyword and filter by category or difficulty.
- **Save for later** — bookmark projects to a dedicated Saved tab.
- **Track progress** — check off steps as you complete them, with a live progress bar per project, and mark whole projects as complete.
- **Progress dashboard** — see how many projects you've completed, which are in progress, and your cumulative estimated home value added.
- **Persistent state** — favorites, step progress, and completed projects are saved locally on-device with `AsyncStorage`, so your progress survives app restarts.

## Tech stack

- [Expo](https://expo.dev) (SDK 57) + React Native + TypeScript
- [React Navigation](https://reactnavigation.org/) (bottom tabs + native stack per tab)
- `@react-native-async-storage/async-storage` for local persistence
- `expo-linear-gradient` and `@expo/vector-icons` (Ionicons) for the UI
- Runs on iOS, Android, and web (via `react-native-web`) from a single codebase

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Then choose a platform:

```bash
npm run ios      # requires macOS + Xcode, or use Expo Go on a physical device
npm run android  # requires Android Studio, or use Expo Go on a physical device
npm run web       # runs in the browser
```

Scan the QR code shown in the terminal with the [Expo Go](https://expo.dev/go) app to run it on your own phone without any native build tools.

## Project structure

```
App.tsx                     App entry point, providers, navigation root
src/
  components/                Reusable UI building blocks (ProjectCard, Badge, SearchBar, ...)
  context/                   AppStateContext — favorites, step progress, completed projects (persisted)
  data/                      Static project catalog (projects.ts)
  navigation/                React Navigation setup (tabs + stacks, route types)
  screens/                   Home, Explore, Saved, Progress, ProjectDetail
  theme/                     Design tokens (colors, spacing, typography)
  types/                     Shared TypeScript types
  utils/                     Formatting helpers
```

## Notes on data

Cost, time, and ROI figures are illustrative averages inspired by commonly cited home-improvement cost/value data (e.g. exterior and energy-efficiency projects tend to have the highest ROI, while large renovations have more variable returns). Actual results vary significantly by home, region, and market conditions — the app frames these as estimates, not guarantees.
