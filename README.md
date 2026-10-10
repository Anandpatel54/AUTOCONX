# AutoConX - Mini Inspection Booking Flow

A 3-screen React Native + TypeScript application implementing a real-world vehicle inspection booking flow for **AutoConX Technologies**.

---

## 📱 Features & Highlights

1. **Screen 1: My Vehicle**
   - Displays 2022 Nissan Patrol with official UAE Dubai license plate styling (`Dubai A 12345`).
   - Vehicle health stats (Odometer, Last Inspection Date, Chassis/VIN snippet, Status badge).
   - "Book Inspection" primary call-to-action.

2. **Screen 2: Book Inspection (Form & State Machine)**
   - **Inspection Package Selection:** Pre-Purchase (Popular), Annual Safety & RTA Check, and Major Powertrain Check with duration and AED pricing.
   - **Location with Graceful Fallback:** 
     - "Use Current Location" GPS button.
     - "Simulate GPS Deny" button for reviewers to easily test the permission denial flow.
     - Fully editable manual address input fallback so users are never blocked.
   - **Preferred Date:** Upcoming appointment selection chips with formatted days.
   - **Additional Notes:** Multi-line text field for special parking or gate access notes.
   - **Inline Validation:** User-friendly error messages on missing required fields.
   - **Loading State & Double-Tap Protection:** Button disabled with activity spinner, rapid tap throttling to prevent duplicate bookings.
   - **Draft Persistence:** Unfinished form inputs automatically persist via `@react-native-async-storage/async-storage` across app reloads/restarts.
   - **Failure Simulation & Retry:** Predictable network failure on attempt #1 with dedicated `ErrorBanner` and immediate "Try Again" retry action preserving all form inputs.
   - **Mobile Keyboard UX:** `KeyboardAvoidingView` with scroll view and tap handling to keep inputs and submit CTA fully visible.

3. **Screen 3: Confirmation**
   - "Inspection Confirmed" status with emerald checkmark badge.
   - Unique reference identifier (e.g. `ACX-29384`).
   - Full booking breakdown (Vehicle, Inspection type, Date, Address, Notes).
   - Next-steps dispatch timeline.
   - Navigation stack reset to prevent accidental backward navigation into a submitted form.

---

## 🛠 Tech Stack & Versions

- **Framework:** React Native `0.87.1` (New Architecture enabled)
- **Language:** TypeScript `6.0.3`
- **React:** `19.2.3`
- **Navigation:** `@react-navigation/native` & `@react-navigation/native-stack` `v7`
- **Persistence:** `@react-native-async-storage/async-storage` `v3.1.1`
- **Safe Area:** `react-native-safe-area-context` `v5.5.2`
- **Unit Testing:** Jest `v29.6.3` with React Native preset

---

## 📂 Project Architecture

```
src/
├── api/
│   └── mockApi.ts              # Simulated endpoints (GET /vehicles, GET /inspection-types, POST /bookings)
├── components/
│   ├── booking/
│   │   ├── DatePickerField.tsx # Date selection chips with validation
│   │   ├── LocationPicker.tsx  # GPS fetch + manual fallback + denial simulator
│   │   └── TypeSelector.tsx    # Inspection packages with pricing
│   ├── common/
│   │   ├── Button.tsx          # Double-tap throttling, loading spinner, variants
│   │   ├── Card.tsx            # Elevated container with shadow tokens
│   │   ├── ErrorBanner.tsx     # Submission failure card with "Try Again" retry CTA
│   │   └── Input.tsx           # Form input with label & error states
│   └── vehicle/
│       └── VehicleCard.tsx     # Nissan Patrol UAE license plate & service card
├── hooks/
│   ├── useBookingDraft.ts      # AsyncStorage draft auto-save and hydration hook
│   └── useLocation.ts          # Geolocation permission request with manual fallback
├── navigation/
│   ├── AppNavigator.tsx        # Native Stack Navigation container
│   └── types.ts                # RootStackParamList & navigation prop types
├── theme/
│   └── index.ts                # Automotive color palette, spacing, and radius tokens
└── types/
    └── index.ts                # Vehicle, InspectionType, BookingRequest, BookingResponse types
```

---

## 🚀 How to Install and Run

### 1. Prerequisites
- Node.js `>= 22.11.0`
- macOS with Xcode & CocoaPods (for iOS) or Android Studio (for Android)

### 2. Install Dependencies
```bash
npm install
cd ios && pod install && cd ..
```

### 3. Start Metro Bundler
```bash
npm start
```

### 4. Run on iOS Simulator
```bash
npm run ios
# OR directly open in Xcode:
# open ios/AutoConXAssessment.xcworkspace
```

### 5. Run on Android Emulator
```bash
npm run android
```

### 6. Run Unit Tests & Linter
```bash
npm test
npm run lint
npx tsc --noEmit
```

---

## 🔍 How Key Requirements Are Handled

### 1. Data State & Mock API Failure Simulation
- Located in [`src/api/mockApi.ts`](src/api/mockApi.ts).
- Network latency is simulated via async delays (~450ms–1000ms).
- **Predictable Failure:** The booking request is programmed to fail on attempt #1 with a `503 Service Unavailable` error, allowing reviewers to test the error UI and retry experience. Attempt #2 (or clicking "Try Again") succeeds and creates the booking.

### 2. Draft Persistence Across App Restarts
- Located in [`src/hooks/useBookingDraft.ts`](src/hooks/useBookingDraft.ts).
- Partially completed form fields (`inspectionType`, `address`, `date`, `notes`) are saved to `@react-native-async-storage/async-storage`.
- Upon reloading the app (`Cmd + R` in iOS Simulator), the draft is restored, and a notification banner indicates restored state.
- Upon successful booking submission, the draft is purged from storage.

### 3. Location Permission Fallback
- Located in [`src/hooks/useLocation.ts`](src/hooks/useLocation.ts) and [`src/components/booking/LocationPicker.tsx`](src/components/booking/LocationPicker.tsx).
- Reviewers can tap **"Use Current Location"** to simulate GPS acquisition or tap **"Simulate GPS Deny"** to test the denial message.
- The manual address text field is always active and editable as a fallback.

### 4. Duplicate Submit Protection
- Located in [`src/components/common/Button.tsx`](src/components/common/Button.tsx) and [`src/screens/BookInspectionScreen.tsx`](src/screens/BookInspectionScreen.tsx).
- When submitting, `isSubmitting` is set to `true`, disabling the submit button and rendering an `ActivityIndicator`.
- Buttons also feature a 600ms tap throttle to prevent hardware double-tap triggers.

---

## ⚖️ Trade-offs & Future Improvements

1. **Production Geolocation:** In a full-scale app, integrate `@react-native-community/geolocation` with reverse-geocoding (e.g. Google Places API or Mapbox) with live address autocomplete.
2. **Calendar UI:** Currently uses quick upcoming date chips (suitable for mobile appointment booking); could be expanded with a full month calendar modal for bookings further in advance.
3. **Offline Sync Queue:** Could integrate NetInfo and a local queue (WatermelonDB / MMKV) to queue bookings when device loses internet connectivity.

---

## 🤖 AI Usage Disclosure

Per Section 7 of the assessment instructions:
AI tools (Claude / Gemini via Antigravity) were used for project scaffolding, TypeScript typing verification, and code structuring assistance. All architectural decisions, state machines, and edge-case handling were actively reviewed and verified.
