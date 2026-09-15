# 🎟️ Book_kar. — The Royal Heritage Box Office ✨🏰

> **"Padharo Mhare Desh!"** 🙏 Step into Rajasthan’s premier digital box office for curated classical concerts, desert festivals, royal polo matches, theatrical plays, and sacred Sufi nights!

---

## 🌟 What is Book_kar.?

Ever wanted to book front-row baithak cushions at **Mehrangarh Fort** under a full moon? 🌕 Or catch thunderous thumps at the **Jaipur Royal Polo Trophy**? 🏇 Or dance to Manganiyar melodies on the golden sand dunes of **Pushkar**? 🐪🎶

**Book_kar.** is an artisanal, lightning-fast cultural ticketing platform dedicated to the living arts and heritage fixtures of Rajasthan. We blend centuries-old Rajasthani royal aesthetics (sandstone parchment, brass gold, terracotta, and intricate *Jali* lattice patterns) with cutting-edge React 19 performance! 🚀🎨

---

## ✨ Features That Make You Say *"Wah Ustad!"* 👏

- 🏛️ **Seasonal Cultural Repertoire** — Explore curated festivals: *Jodhpur RIFF*, *Jaipur Polo Trophy*, *Pushkar Camel Fair*, *Udaipur World Music Festival*, *Hawa Mahal Kathak Evenings*, and *Sacred Spirit Ranthambore*!
- 💺 **Interactive Jali Seat Map** — Real-time reserved seating with micro-haptic spring animations, stage orientation guides, and sold-out crossbars. Clicking a seat won't freeze your screen! ⚡
- 🎟️ **General Admission & Baithak Passes** — Smooth fluid steppers with real-time pass inventory counts and tier breakdowns.
- 🪪 **Royal Wax-Seal Passes** — Complete with an authentic embossed stamp (`राजकीय मुद्रा • OFFICIALLY SEALED`), gold foil borders, perforated tear-off ticket stubs, real QR barcodes, and festive confetti showers! 🎊
- 🔍 **Instant-Response Search & Filters** — Zero-lag search powered by React 19's `useDeferredValue` so you can type at lightning speed without grid frame drops! ⚡
- 🌗 **Warm Parchment & Midnight Twilight Themes** — Switch between handcrafted sun-bleached desert parchment and deep indigo palace twilight with a single click. 🌙☀️
- 🖼️ **Resilient Heritage Media** — Shimmer skeleton pre-loaders, responsive `srcSet` generation across screen sizes, and fallback motifs if the network blinks.

---

## 🚀 How to Run Locally in Your Browser 💻

Getting **Book_kar.** up and running on your machine is as breezy as a palace courtyard! Follow these simple steps:

### 1️⃣ Prerequisites
Make sure you have:
- [Node.js](https://nodejs.org/) (`v18` or later recommended) 🟢
- `npm` (comes bundled with Node.js) 📦

### 2️⃣ Clone or Navigate to the Project Folder
Open your terminal and jump into the project directory:
```bash
cd book_kar
```

### 3️⃣ Install Dependencies 📦
Install all the required packages:
```bash
npm install
```

### 4️⃣ Fire Up the Development Server 🔥
Start Vite’s blazing fast dev server:
```bash
npm run dev
```

### 5️⃣ Open in Your Browser! 🌐🎉
Point your favorite web browser to:
```
http://localhost:3000
```
*(Or whatever port your terminal displays if 3000 is occupied)*

Boom! You're ready to reserve your royal passes! 🎪🥂

---

## 🛠️ Tech Stack & Magic Ingredients 🪄

| Layer | Technology | Why We Chose It |
|---|---|---|
| **Frontend Core** | ⚛️ **React 19** | Modern state primitives, `useDeferredValue`, and non-blocking `startTransition` |
| **Language** | 🔷 **TypeScript** | Strict type safety for seats, orders, passes, and events |
| **Styling** | 🎨 **Tailwind CSS v4** | Instant CSS utility compilation with CSS custom properties |
| **Bundler** | ⚡ **Vite 6** | Sub-millisecond HMR and lightning-fast Rollup builds |
| **Motion & Physics** | 🪄 **Motion (Framer)** | 3D card tilt, springy wax seal stamping, and confetti celebrations |
| **Icons** | 🪶 **Lucide React** | Clean, minimalist, and lightweight icon set |
| **Typography** | 🖋️ **Fraunces & General Sans** | Expressive old-world display serifs paired with crisp modern grotesk numbers |

---

## ⚡ Performance Superpowers (Under the Hood) 🏎️💨

We hate laggy checkout screens, so we supercharged every corner:

1. 🧩 **Split Context Architecture**:
   - `CatalogContext`: Manages events, search queries, and category filters.
   - `CartContext`: Manages seat selections, guest details, and reservations.
   - `UIContext`: Manages themes and non-urgent screen routes.
   - *Typing in the search box never re-renders the seat map or navbar!* 🎯
2. 📦 **Route Code-Splitting (`React.lazy`)**:
   - First-time visitors download only the discovery view (~53 kB)! The hefty checkout and confirmation modules load on-demand when clicked.
3. 🧱 **Stable Vendor Chunks**:
   - React, Motion, and Lucide icons are bundled into dedicated chunks (`vendor-react`, `vendor-motion`, `vendor-icons`), making caching super sticky across updates.
4. 💺 **Surgical `React.memo` Seat Nodes**:
   - Selecting a single seat only re-renders that exact seat button, skipping redundant diffing of hundreds of surrounding seats!

---

## 📂 Project Directory Tour 🗺️

```text
├── 📁 src
│   ├── 📁 components         # Repertoire cards, SeatMap, CheckoutView, ConfirmationView, Navbar, etc.
│   ├── 📁 context            # Split contexts: UIContext, CatalogContext, CartContext & BookingContext bridge
│   ├── 📁 data               # Curated Rajasthan cultural fixture data & schedules
│   ├── 📁 utils              # Dynamic category themes, currency formatters & palettes
│   ├── 📄 App.tsx            # Main application shell with lazy route suspense
│   ├── 📄 main.tsx           # React entry point
│   ├── 📄 index.css          # Tailwind CSS root styles & theme variables
│   └── 📄 types.ts           # Shared TypeScript interfaces & types
├── 📄 index.html             # HTML entry point with Fraunces & General Sans typography
├── 📄 vite.config.ts         # Vite build configuration with manual Rollup chunking
└── 📄 package.json           # Scripts & project dependencies
```

---

## 🤝 Contributing & Feedback 💌

Got ideas for a new desert festival or custom palace seat layout?
1. Fork the repo 🍴
2. Create your feature branch (`git checkout -b feature/jal-mahal-concert`) 🌿
3. Commit your changes (`git commit -m 'Add Jal Mahal floating stage fixture'`) 💬
4. Push to the branch (`git push origin feature/jal-mahal-concert`) 🚀
5. Open a Pull Request! 🎁

---

<div align="center">

Made with ❤️, saffron spices, and royal heritage.  
**Khammaghani & Happy Booking!** 🎪👑🐪✨

</div>
