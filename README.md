# 🚀 Donkey - Full Stack Healthcare Application

Modern healthcare platform combining a Next.js frontend with Cardano blockchain-powered encrypted medical records backend.

---

## 📁 Project Structure

```
donkey/
├── fe/              # Next.js 16 Frontend (TypeScript + Tailwind)
└── backend/         # Cardano Healthcare Vault (Node.js + Blockchain)
```

---

## 🎨 Frontend (`/fe`)

### Tech Stack
- **Framework**: Next.js 16.0.3 (React 19.2.0)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 + Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **3D Graphics**: Three.js + React Three Fiber
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Theme**: next-themes (dark/light mode)

### Key Features
- 🎭 Modern UI with Radix UI primitives
- 🌗 Dark/Light theme support
- 📊 Interactive data visualization (Recharts)
- 🎨 3D graphics rendering (Three.js)
- 📱 Responsive design
- 🎯 Form validation with Zod
- ⚡ Optimized with Vercel Analytics

### Frontend Setup

```bash
cd fe

# Install dependencies (using pnpm)
pnpm install

# Or with npm
npm install

# Run development server
pnpm dev
# or
npm run dev

# Build for production
pnpm build
npm run build

# Start production server
pnpm start
npm start
```

**Development URL**: `http://localhost:3000`

### UI Components Available
- Accordion, Alert Dialog, Avatar
- Buttons, Cards, Checkboxes
- Dialogs, Dropdowns, Forms
- Navigation, Popover, Progress
- Tabs, Toast notifications
- Tooltips, Carousels
- Data Tables, Charts

---

## 🔐 Backend (`/backend`)

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Redis
- **Blockchain**: Cardano (Blockfrost API)
- **Layer-2**: Hydra state channels
- **Smart Contracts**: Aiken (Plutus V3)
- **Encryption**: AES-256-GCM + RSA-OAEP
- **Storage**: IPFS (Pinata)
- **Zero-Knowledge**: Midnight ZK proofs
- **Logging**: Winston (HIPAA/GDPR compliant)

### Key Features
- 🔒 **Military-grade encryption** (AES-256-GCM)
- ⚡ **4-Layer Permission System**:
  1. Hydra L2 (5-15ms) - 100-400x faster
  2. Aiken L1 (~2s) - Smart contracts
  3. Midnight ZK (800-1200ms) - Privacy proofs
  4. Blockfrost L1 (500-2000ms) - Blockchain fallback
- 📁 **Decentralized storage** (IPFS)
- 🔄 **CEK Rotation** on access revocation
- 📝 **Audit logging** (90-day retention)
- 🎭 **4 Actor roles**: Patient, Doctor, Hospital, Insurance

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate actor keys (RSA key pairs)
node scripts/genActorKeys.js

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start main server
npm start

# Or with nodemon (development)
npm run dev

# Start mock Hydra (in separate terminal)
cd mock-hydra
npm install
npm start
```

**Backend URLs**:
- Main API: `http://localhost:5000`
- Mock Hydra: `http://localhost:4001`
- Demo Interface: `http://localhost:5000/demo.html`
- API Tester: `http://localhost:5000/api-demo.html`

### Environment Variables (Backend)

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cardano-health
REDIS_URL=redis://localhost:6379

# IPFS Storage
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret

# Blockchain
BLOCKFROST_PROJECT_ID=your_blockfrost_id
CARDANO_NETWORK=preview

# Development
MOCK_HYDRA=true
```

### API Endpoints

#### Upload & Encrypt
```bash
POST /api/encrypt/upload
Content-Type: multipart/form-data

Body:
- file: medical file
- ownerAddr: wallet address
- actorIds: comma-separated (e.g., "01,02,03")
```

#### Access Request
```bash
POST /api/access/request
Content-Type: application/json

{
  "recordId": "uuid",
  "actorId": "02",
  "actorAddr": "addr_test1...",
  "actorSignature": "signature"
}
```

#### Revoke Access
```bash
POST /api/encrypt/revoke
Content-Type: application/json

{
  "recordId": "uuid",
  "actorId": "03",
  "ownerAddr": "addr_test1...",
  "ownerSignature": "signature"
}
```

#### Hydra Health
```bash
GET /api/hydra/health
```

#### Get Record Metadata
```bash
GET /api/records/:recordId/metadata
```

---

## 🚀 Full Stack Development

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB (for backend)
- Redis (for backend CEK storage)
- Pinata account (IPFS storage)
- pnpm or npm

### Quick Start (Both Services)

**Terminal 1 - Frontend**:
```bash
cd fe
pnpm install
pnpm dev
```

**Terminal 2 - Backend**:
```bash
cd backend
npm install
node scripts/genActorKeys.js
npm run dev
```

**Terminal 3 - Mock Hydra**:
```bash
cd backend/mock-hydra
npm install
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Demo UI**: http://localhost:5000/demo.html
- **API Tester**: http://localhost:5000/api-demo.html

---

## 📚 Documentation

### Frontend (`/fe`)
- Built with **Next.js 16 App Router**
- Uses **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Three.js** for 3D visualizations
- Configured for **Vercel deployment**

### Backend (`/backend`)
- Complete **Cardano integration**
- **4-layer permission verification**
- **IPFS decentralized storage**
- **Audit logging** (Winston)
- **CEK rotation** on revocation
- **Mock Hydra** for development

See individual README files:
- [`/fe/README.md`](./fe/README.md) - Frontend documentation
- [`/backend/README.md`](./backend/README.md) - Backend documentation

---

## 🔒 Security Features (Backend)

- ✅ **AES-256-GCM** encryption
- ✅ **RSA-OAEP** key wrapping
- ✅ **Ephemeral CEKs** (in-memory only)
- ✅ **Signature verification** (CIP-8)
- ✅ **Audit logging** (no PHI leaked)
- ✅ **90-day retention** (compliance)
- ✅ **Multi-layer permissions**
- ✅ **CEK rotation** on revoke

---

## 📊 Performance Metrics

### Backend Layer Performance
- **Hydra L2**: 5-15ms (100-400x faster than L1)
- **Aiken L1**: ~2000ms (smart contract execution)
- **Midnight ZK**: 800-1200ms (zero-knowledge proofs)
- **Blockfrost L1**: 500-2000ms (blockchain query)
- **CEK Rotation**: <500ms (typical medical files)

### Frontend Performance
- **SSR**: Next.js 16 server-side rendering
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Built-in Next.js optimization
- **3D Rendering**: Hardware-accelerated Three.js

---

## 🎯 Actor Roles (Backend)

| Actor ID | Role | Permissions |
|----------|------|-------------|
| `01` | Patient | Owner, full control |
| `02` | Doctor | Read/write medical records |
| `03` | Hospital | Institutional access |
| `04` | Insurance | Billing/claims verification |

---

## 🧪 Testing

### Frontend Tests
```bash
cd fe
pnpm lint
```

### Backend Tests
```bash
cd backend
npm test
npm run demo  # Run demo flow
```

---

## 📦 Deployment

### Frontend Deployment (Vercel)
```bash
cd fe
vercel deploy
```

### Backend Deployment (Docker)
```bash
cd backend
docker-compose up -d
```

Or manually:
```bash
docker build -t cardano-health-backend .
docker run -p 5000:5000 --env-file .env cardano-health-backend
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Resources

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Three.js](https://threejs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

### Backend
- [Cardano Documentation](https://docs.cardano.org/)
- [Hydra Head Protocol](https://hydra.family/)
- [Aiken Smart Contracts](https://aiken-lang.org/)
- [Midnight Network](https://midnight.network/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

## 📞 Support

For issues or questions:
- Frontend: Open issue with `[FE]` prefix
- Backend: Open issue with `[BE]` prefix
- Full Stack: Open issue with `[FULL]` prefix

---

**Built with ❤️ using Next.js, Cardano, and Blockchain Technology**
