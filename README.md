# BICAP: Blockchain Integration in Clean Agricultural Production

BICAP (Blockchain Integration in Clean Agricultural Production) is a comprehensive technological solution designed to enhance transparency in clean agricultural supply chains. The system integrates Blockchain (VeChain), IoT, and Mobile application technologies to ensure that all products traveling from farm to consumer have immutable and reliable origin records.

---

## Core Features and Roles

### Farm Management (Farm Owner)
- **Crop Lifecycle Tracking:** Comprehensive monitoring of processes from planting to harvesting.
- **Blockchain Transparency:** Recording cultivation logs including fertilizer and pest control data onto the VeChain network.
- **IoT Monitoring:** Real-time environmental metrics visualization via a dedicated dashboard.
- **Marketplace Integration:** Product listing, image management, and order fulfillment.

### Logistics Management (Shipping Manager)
- **Fleet Administration:** Management of transport vehicles, maintenance schedules, and operational status.
- **Personnel Management:** Tracking of driver assignments and performance metrics.
- **Deployment Coordination:** Conversion of orders into shipments and resource allocation.
- **Incident Oversight:** Real-time reception and processing of driver incident reports.

### Mobile Operations (Driver Application)
- **Expo-powered Platform:** Dedicated mobile application featuring QR code integration.
- **Authentication:** Verification of pickup and delivery points via high-speed scanning.
- **Reporting System:** Standardized incident reporting with direct feedback loops.

### Retail Operations (Retailer)
- **E-commerce Access:** Direct procurement of agricultural products from source farms.
- **Traceability Verification:** QR code scanning to access complete product history.
- **Payment Reconciliation:** Management of delivery confirmation and Proof of Delivery (POD).

---

## Technical Architecture

| Component | Technology Stack | Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14, TailwindCSS | Multi-role Administrative Dashboard |
| **Mobile App** | React Native, Expo | Driver Operations Platform |
| **Backend** | Node.js, Express, Sequelize | Business Logic and API Orchestration |
| **Database** | Azure SQL Edge (MSSQL) | Centralized Data Storage |
| **Cache & Queue** | Redis (Docker/Cloud) | API Acceleration and Background Tasking |
| **Blockchain** | VeChainThor (Real/Solo Node) | Immortality and Transparency Layer |
| **Containerization** | Docker & Docker Compose | Consistent Environment Deployment |

---

## Operational Performance and Security

The system is engineered to meet industry performance and reliability standards:

- **Asynchronous Task Processing:** Utilization of Bull Queue and Redis for background transactions ensures stability during high data loads.
- **Data Integrity Standards:** Product data is hashed and stored directly on VeChainThor Smart Contracts to prevent tampering.
- **Optimized Caching:** Redis implementation ensures ultra-low latency for product and seasonal data queries.
- **API Rate Limiting:** Protection against automated threats via a 100 requests per 15-minute policy.
- **Transaction Security:** Secp256k1 digital signature encryption for all blockchain operations.

---

## System Operation Guide

### 1. Global Deployment via Docker
To initialize all services including Backend, Database, Redis, and the Blockchain Solo Node:

```bash
docker-compose up -d --build
```

**Service Endpoints:**
- **Web Portal:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Blockchain Node:** http://localhost:8669

### 2. Blockchain Verification
Administrative scripts for blockchain validation are located in the `bicap-backend` directory:

```bash
# Verify Administrative Wallet Balance (Solo Node)
node scripts/check_balance.js

# Execute Concurrency Validation (Queue Testing)
node scripts/test_blockchain_queue.js
```

### 3. Mobile Application Execution
```bash
cd bicap-mobile-driver
npm install
npx expo start
```

---

## Directory Structure
- `bicap-backend/`: API Server, Blockchain Helpers, and Background Workers.
- `bicap-web-client/`: Core Web interface (Next.js 14).
- `bicap-mobile-driver/`: Mobile application source (Expo).
- `bicap-smart-contracts/`: Solidity Smart Contracts and Hardhat deployment configurations.

---
**BICAP - Ensuring Transparency and Integrity in Agricultural Production.**