// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BicapTraceability {
    struct Record {
        string identifier; // ID của sản phẩm, vận đơn, hoặc quy trình
        string dataHash;   // Mã băm dữ liệu (SHA-256)
        uint256 timestamp; // Thời gian ghi nhận
        address owner;     // Người ghi nhận
    }

    // Mapping từ identifier (ví dụ: Product Batch Code, Shipment ID) đến danh sách các bản ghi
    mapping(string => Record[]) public records;
    
    event RecordCreated(string indexed identifier, string dataHash, uint256 timestamp, address indexed owner);

    /**
     * @dev Thêm một bản ghi mới vào blockchain
     * @param _identifier ID định danh cho đối tượng (ví dụ: BATCH-123)
     * @param _dataHash Mã băm dữ liệu SHA-256
     */
    function addRecord(string memory _identifier, string memory _dataHash) public {
        Record memory newRecord = Record({
            identifier: _identifier,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            owner: msg.sender
        });

        records[_identifier].push(newRecord);
        emit RecordCreated(_identifier, _dataHash, block.timestamp, msg.sender);
    }

    /**
     * @dev Lấy số lượng bản ghi cho một định danh
     */
    function getRecordsCount(string memory _identifier) public view returns (uint256) {
        return records[_identifier].length;
    }

    /**
     * @dev Lấy thông tin bản ghi theo index
     */
    function getRecord(string memory _identifier, uint256 _index) public view returns (
        string memory identifier,
        string memory dataHash,
        uint256 timestamp,
        address owner
    ) {
        require(_index < records[_identifier].length, "Index out of bounds");
        Record memory rec = records[_identifier][_index];
        return (rec.identifier, rec.dataHash, rec.timestamp, rec.owner);
    }
}
