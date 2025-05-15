# 📚 BACIP – Blockchain Academic Credential Interoperability Protocol

BACIP is a blockchain-based protocol for issuing, managing, and verifying academic credentials in a secure, decentralized, and globally interoperable manner. It combats academic fraud and empowers students and institutions with ownership, control, and privacy of educational data.

---

## 🔧 Specifications & Technologies Used

### 🔐 Core Technologies

- **Blockchain**: Public Ethereum-compatible chain (Polygon Amoy testnet)
- **Smart Contracts**: Solidity-based, deployed to Polygon
- **Backend**: Node.js, Express, TypeScript
- **Blockchain Integration**: Ethers.js v6
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: React + Vite + TypeScript
- **Notifications**: Sonner (toast notifications)
- **REST API**: Express routes for credential lifecycle

---

## ⚙️ How BACIP Works

### 📥 Credential Issuance

1. University/institution fills out a form on the frontend.
2. Backend receives the request and calls the smart contract to issue the credential.
3. Transaction hash and degree ID are returned and stored in MongoDB.
4. The recipient receives an email notification (future roadmap).

### ✅ Credential Verification

1. Verifier enters a credential ID on the frontend.
2. Backend queries the smart contract for credential data.
3. Verification result (valid/revoked/not found) is returned.

### 🔄 Credential Revocation

1. Issuer searches for a credential by ID.
2. If found and active, issuer provides a revocation reason.
3. Backend calls the smart contract to revoke the credential.
4. Revocation is recorded on-chain and in MongoDB.

---

## 🧠 Core Principles

1. **Interoperability** – Open standards for global compatibility.
2. **Security** – Blockchain immutability, cryptographic proofs.
3. **Privacy** – Student-controlled access (future: DIDs, encryption).
4. **Transparency** – Public audit trails.
5. **Scalability** – Efficient, L2-compatible.
6. **Usability** – For institutions, employers, and students.

---

## 🧩 Key System Components

- **Smart Contracts**: Credential lifecycle automation
- **MongoDB**: Off-chain storage for credential metadata
- **Express REST API**: Credential issuance, verification, revocation
- **React Frontend**: User-friendly interface for all roles

---

## 🚦 API Endpoints

All endpoints are prefixed with `/api/degrees`.

| Method | Endpoint                        | Description                         |
| ------ | ------------------------------- | ----------------------------------- |
| POST   | `/api/degrees/issue`            | Issue a new credential              |
| GET    | `/api/degrees/verify/:degreeId` | Verify a credential by ID           |
| POST   | `/api/degrees/revoke/:degreeId` | Revoke a credential by ID           |
| GET    | `/api/degrees/address/:address` | List all credentials for an address |

**Example: Issue a Credential**

```http
POST /api/degrees/issue
Content-Type: application/json

{
  "recipientAddress": "0x...",
  "degreeName": "Bachelor of Science",
  "university": "Stanford University",
  "studentName": "Alice",
  "studentId": "S123456",
  "studentEmail": "alice@example.com"
}
```

**Example: Verify a Credential**

```http
GET /api/degrees/verify/0xDEGREE_ID
```

**Example: Revoke a Credential**

```http
POST /api/degrees/revoke/0xDEGREE_ID
```

**Example: Get Credentials by Address**

```http
GET /api/degrees/address/0xWALLET_ADDRESS
```

---

## ✅ Use Cases

- Universities issuing tamper-proof digital degrees
- Employers verifying credentials instantly
- Students owning and managing their educational identity

---

## ⚖️ Legal & Ethical Considerations

- Data stored on-chain is public; off-chain data is in MongoDB
- Future: consent management, DIDs, and encryption for privacy

---

## 🚀 Future Roadmap

- Email notifications for issuance/revocation
- DID-based credential wallet
- IPFS integration for document storage
- DAO governance and cross-chain support

---

## 📌 Summary

BACIP is a practical, production-ready protocol for academic credentialing: decentralized, secure, and globally verifiable. It removes intermediaries and brings trust to education.
