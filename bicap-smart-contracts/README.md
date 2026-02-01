# 🔗 BICAP Smart Contracts

## 📋 Mục Đích

Thư mục này chứa infrastructure cho smart contracts của hệ thống BICAP, được thiết kế để tích hợp với VeChainThor blockchain.

---

## 🎯 Chức Năng Dự Kiến

### 1. ProductTraceability Contract
**Mục đích**: Lưu trữ thông tin nguồn gốc sản phẩm bất biến trên blockchain

**Dữ liệu lưu trữ**:
- Batch code sản phẩm
- Farm ID và tên trang trại
- Season ID và thông tin vụ mùa
- Hash của dữ liệu traceability
- Timestamp ghi nhận

**Functions**:
```solidity
registerProduct(batchCode, farmId, dataHash) → txHash
getProduct(productId) → Product details
verifyProduct(productId, dataHash) → bool
```

### 2. FarmingProcess Contract
**Mục đích**: Ghi nhận các hoạt động canh tác

**Dữ liệu lưu trữ**:
- Process type (gieo hạt, bón phân, thu hoạch)
- Timestamp
- IoT sensor data hash
- Người thực hiện

### 3. SupplyChain Contract
**Mục đích**: Theo dõi vận chuyển và chuyển giao quyền sở hữu

**Dữ liệu lưu trữ**:
- Shipment ID
- Sender/Receiver addresses
- Product batch codes
- Delivery status
- Proof of Delivery hash

---

## 🏗️ Công Nghệ

- **Framework**: Hardhat 2.22.0
- **Language**: Solidity ^0.8.24
- **Target Blockchain**: VeChainThor (TestNet)
- **Standards**: ERC-721 (NFT cho product batches)

---

## 📊 Trạng Thái Hiện Tại

### ⚠️ Development Phase

Hiện tại hệ thống BICAP đang sử dụng **mock blockchain implementation** để:
- ✅ Demonstrate blockchain concepts
- ✅ Development và testing nhanh chóng
- ✅ Không phụ thuộc external network
- ✅ Tránh chi phí gas fees trong quá trình phát triển

### 🔄 Mock Implementation

**File**: `bicap-backend/src/utils/blockchainHelper.js`

Mock blockchain hiện tại:
- Tạo SHA-256 hash từ dữ liệu
- Simulate network delay (500ms)
- Trả về transaction hash format: `0x[hash]`
- Lưu txHash vào database

---

## 🚀 Roadmap Triển Khai

### Phase 1: Smart Contract Development ⏳
- [ ] Viết ProductTraceability.sol
- [ ] Viết FarmingProcess.sol  
- [ ] Viết SupplyChain.sol
- [ ] Unit tests cho contracts
- [ ] Gas optimization

**Thời gian ước tính**: 1-2 tuần

### Phase 2: VeChain Integration ⏳
- [ ] Cài đặt thor-devkit
- [ ] Configure VeChain TestNet
- [ ] Deploy contracts lên TestNet
- [ ] Verify contracts trên VeChain Explorer
- [ ] Update backend để sử dụng real contracts

**Thời gian ước tính**: 3-5 ngày

### Phase 3: Backend Integration ⏳
- [ ] Replace mock blockchain helper
- [ ] Implement transaction signing
- [ ] Add retry logic
- [ ] Queue system cho concurrent transactions
- [ ] Monitoring và logging

**Thời gian ước tính**: 1 tuần

---

## 🔧 Cách Sử Dụng (Khi Hoàn Thành)

### Setup
```bash
cd bicap-smart-contracts
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to VeChain TestNet
```bash
npx hardhat run scripts/deploy.js --network vechain-testnet
```

### Verify Contract
```bash
npx hardhat verify --network vechain-testnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 🎓 Lý Do Sử Dụng Mock (Cho Đồ Án)

### Ưu Điểm Mock Blockchain:

1. **Development Speed** ⚡
   - Không cần chờ block confirmation
   - Không phụ thuộc network status
   - Test cases chạy nhanh

2. **Cost Effective** 💰
   - Không cần VTHO tokens
   - Không tốn gas fees
   - Miễn phí hoàn toàn

3. **Reliability** 🔒
   - Luôn available (không downtime)
   - Deterministic results
   - Dễ debug

4. **Educational Purpose** 📚
   - Demonstrate blockchain concepts
   - Hiểu workflow và architecture
   - Không cần setup phức tạp

### Architecture Sẵn Sàng:

Hệ thống đã được thiết kế với:
- ✅ Database schema có txHash fields
- ✅ Blockchain helper abstraction layer
- ✅ Traceability APIs
- ✅ RBAC implementation

**Chỉ cần thay thế** `blockchainHelper.js` bằng real VeChain integration!

---

## 📝 Sample Contract (Planned)

```solidity
// ProductTraceability.sol (Concept)
pragma solidity ^0.8.24;

contract ProductTraceability {
    struct Product {
        string batchCode;
        uint256 farmId;
        uint256 seasonId;
        bytes32 dataHash;
        uint256 timestamp;
        address registeredBy;
    }
    
    mapping(uint256 => Product) public products;
    uint256 public productCount;
    
    event ProductRegistered(
        uint256 indexed productId,
        string batchCode,
        uint256 farmId,
        bytes32 dataHash
    );
    
    function registerProduct(
        string memory _batchCode,
        uint256 _farmId,
        uint256 _seasonId,
        bytes32 _dataHash
    ) public returns (uint256) {
        productCount++;
        products[productCount] = Product({
            batchCode: _batchCode,
            farmId: _farmId,
            seasonId: _seasonId,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            registeredBy: msg.sender
        });
        
        emit ProductRegistered(
            productCount,
            _batchCode,
            _farmId,
            _dataHash
        );
        
        return productCount;
    }
    
    function verifyProduct(
        uint256 _productId,
        bytes32 _dataHash
    ) public view returns (bool) {
        return products[_productId].dataHash == _dataHash;
    }
}
```

---

## 🔐 Security Considerations

### Planned Security Features:

1. **Access Control**
   - Only authorized farms can register products
   - Role-based permissions (Owner, Admin, Farm)

2. **Data Integrity**
   - keccak256 hashing for data
   - Digital signatures verification
   - Immutable records

3. **VeChain Standards**
   - Follow VIP-180 (Token Standard)
   - Use thor-devkit for cryptography
   - Proper gas optimization

---

## 📚 Tài Liệu Tham Khảo

- [VeChain Developer Docs](https://docs.vechain.org/)
- [thor-devkit Documentation](https://github.com/vechain/thor-devkit.js)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

## ✅ Kết Luận

Thư mục `bicap-smart-contracts` thể hiện:
- ✅ **Planning tốt**: Infrastructure sẵn sàng cho blockchain
- ✅ **Scalable design**: Dễ dàng migrate từ mock sang real
- ✅ **Professional approach**: Separation of concerns rõ ràng

Với mục đích học tập, mock blockchain đã đủ để demonstrate concepts. Khi cần deploy production, chỉ cần implement các contracts đã được plan sẵn.

---

**🌱 BICAP - Blockchain-Ready Architecture!**
