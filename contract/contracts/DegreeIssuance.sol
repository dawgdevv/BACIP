// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DegreeIssuance {
    struct Degree {
        bytes32 degreeId;
        address recipient;
        string degreeName;
        string university;
        uint256 issueDate;
        uint256 nonce;
        bool isValid;
    }

    // Degree tracking
    mapping(bytes32 => Degree) public degrees;
    mapping(address => bytes32[]) private degreesByAddress;
    mapping(address => uint256) private recipientNonces;

    // Admin management
    mapping(address => bool) public admins;
    uint256 public adminCount;
    bool public paused;

    // Events
    event DegreeIssued(bytes32 indexed degreeId, address indexed recipient, string degreeName, string university, uint256 issueDate);
    event DegreeRevoked(bytes32 indexed degreeId, address indexed recipient);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event Paused();
    event Unpaused();

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can perform this action");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        admins[msg.sender] = true;
        adminCount = 1;
        emit AdminAdded(msg.sender);
    }

    // Admin management functions (same as before)
    function addAdmin(address _newAdmin) public onlyAdmin { /* ... */ }
    function removeAdmin(address _adminToRemove) public onlyAdmin { /* ... */ }
    function pause() public onlyAdmin { /* ... */ }
    function unpause() public onlyAdmin { /* ... */ }

    function issueDegree(
        address _recipient,
        string memory _degreeName,
        string memory _university
    ) public onlyAdmin whenNotPaused {
        require(_recipient != address(0), "Invalid recipient address");
        require(bytes(_degreeName).length > 0, "Degree name cannot be empty");
        require(bytes(_university).length > 0, "University name cannot be empty");

        uint256 currentNonce = recipientNonces[_recipient];
        uint256 issueDate = block.timestamp;

        // Generate unique degree ID
        bytes32 degreeId = keccak256(
            abi.encodePacked(
                _recipient,
                currentNonce,
                _degreeName,
                _university,
                issueDate
            )
        );

        require(degrees[degreeId].degreeId == 0, "Degree collision detected");

        degrees[degreeId] = Degree({
            degreeId: degreeId,
            recipient: _recipient,
            degreeName: _degreeName,
            university: _university,
            issueDate: issueDate,
            nonce: currentNonce,
            isValid: true
        });

        degreesByAddress[_recipient].push(degreeId);
        recipientNonces[_recipient]++;

        emit DegreeIssued(degreeId, _recipient, _degreeName, _university, issueDate);
    }

    function revokeDegree(bytes32 _degreeId) public onlyAdmin whenNotPaused {
        require(degrees[_degreeId].degreeId != 0, "Degree does not exist");
        require(degrees[_degreeId].isValid, "Degree already revoked");

        degrees[_degreeId].isValid = false;
        emit DegreeRevoked(_degreeId, degrees[_degreeId].recipient);
    }

    // Verification functions
    function verifyDegree(bytes32 _degreeId) public view returns (Degree memory) {
        return degrees[_degreeId];
    }

    function getDegreesByAddress(address _recipient) public view returns (bytes32[] memory) {
        return degreesByAddress[_recipient];
    }

    function calculateDegreeId(
        address _recipient,
        uint256 _nonce,
        string memory _degreeName,
        string memory _university,
        uint256 _issueDate
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _recipient,
                _nonce,
                _degreeName,
                _university,
                _issueDate
            )
        );
    }
}