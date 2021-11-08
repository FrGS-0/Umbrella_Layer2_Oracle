library MerkleProof {
  uint256 constant public ROOT_MASK = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000;
  uint256 constant public TIMESTAMP_MASK = 0xffffffff;

  function extractSquashedData(bytes32 _rootTimestamp) internal pure returns (bytes32 root, uint32 dataTimestamp) {
    assembly {
      root := and(_rootTimestamp, ROOT_MASK)
      dataTimestamp := and(_rootTimestamp, TIMESTAMP_MASK)
    }
  }

  function extractRoot(bytes32 _rootTimestamp) internal pure returns (bytes32 root) {
    assembly {
      root := and(_rootTimestamp, ROOT_MASK)
    }
  }

  function extractTimestamp(bytes32 _rootTimestamp) internal pure returns (uint32 dataTimestamp) {
    assembly {
      dataTimestamp := and(_rootTimestamp, TIMESTAMP_MASK)
    }
  }

  function makeSquashedRoot(bytes32 _root, uint32 _timestamp) internal pure returns (bytes32 rootTimestamp) {
    assembly {
      rootTimestamp := or(and(_root, ROOT_MASK), _timestamp)
    }
  }

  function verifySquashedRoot(bytes32 squashedRoot, bytes32[] memory proof, bytes32 leaf) internal pure returns (bool) {
    return extractRoot(computeRoot(proof, leaf)) == extractRoot(squashedRoot);
  }

  function verify(bytes32 root, bytes32[] memory proof, bytes32 leaf) internal pure returns (bool) {
    return computeRoot(proof, leaf) == root;
  }

  function computeRoot(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
    bytes32 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash <= proofElement) {
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }

    return computedHash;
  }
}

contract cntr_Validator {
  using MerkleProof for bytes32;

  mapping(uint256 => bytes32) public squashedRoots;

  constructor(uint256 _blockHeight, bytes32 _root) {
    squashedRoots[_blockHeight] = _root;
  }

  function verifyProofForBlock(
    uint256 _blockId,
    bytes32[] memory _proof,
    bytes memory _key,
    bytes memory _value
  ) public view returns (bool) {
    return squashedRoots[_blockId].verifySquashedRoot(_proof, keccak256(abi.encodePacked(_key, _value)));
  }
}
