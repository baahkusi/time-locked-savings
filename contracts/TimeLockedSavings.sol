// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TimeLockedSavings {
    // structs

    struct Vault {
        address owner;
        uint256 depositAmount;
        uint256 targetAmount;
        uint256 lockEndTime;
        string purpose;
        bool withdrawn;
    }

    // state variables

    Vault[] public vaults;

    // events

    event VaultCreated(uint256 vaultId);
    event Deposit(uint256 vaultId);
    event Withdrawal(uint256 vaultId);

    // errors

    error NotVaultOwner();
    error VaultLocked();
    error VaultInactive();
    error ZeroValue();
    error ZeroTargetAmount();
    error InvalidDuration();
    error InvalidDepositAmount();
    error EmptyPurpose();

    // modifiers

    modifier onlyVaultOwner(uint256 vaultId) {
        if (vaults[vaultId].owner != msg.sender) revert NotVaultOwner();
        _;
    }

    modifier nonZeroValue() {
        if (msg.value == 0) revert ZeroValue();
        _;
    }

    modifier vaultUnlocked(uint256 vaultId) {
        if (vaults[vaultId].lockEndTime >= block.timestamp) revert VaultLocked();
        _;
    }

    modifier vaultActive(uint256 vaultId) {
        if (vaults[vaultId].withdrawn) revert VaultInactive();
        _;
    }

    // state update functions

    function createVault(
        uint256 _targetAmount,
        uint256 _duration,
        string memory _purpose
    ) external payable nonZeroValue {
        if (_targetAmount == 0) revert ZeroTargetAmount();
        if (msg.value < minDeposit(_targetAmount))
            revert InvalidDepositAmount();
        if (_duration < minDuration()) revert InvalidDuration();
        if (bytes(_purpose).length == 0) revert EmptyPurpose();

        vaults.push(
            Vault({
                owner: msg.sender,
                depositAmount: msg.value,
                targetAmount: _targetAmount,
                lockEndTime: block.timestamp + _duration,
                purpose: _purpose,
                withdrawn: false
            })
        );

        emit VaultCreated(vaults.length - 1);
    }

    function depositVault(
        uint256 _vaultId
    ) external payable vaultActive(_vaultId) nonZeroValue {
        vaults[_vaultId].depositAmount += msg.value;
        emit Deposit(_vaultId);
    }

    function withdrawVault(
        uint256 _vaultId
    )
        external
        onlyVaultOwner(_vaultId)
        vaultUnlocked(_vaultId)
        vaultActive(_vaultId)
    {
        vaults[_vaultId].withdrawn = true;

        payable(vaults[_vaultId].owner).transfer(
            vaults[_vaultId].depositAmount
        );

        emit Withdrawal(_vaultId);
    }

    // views functions

    function minDuration() public pure returns (uint256) {
        return 1 days;
    }

    function minDeposit(uint256 _targetAmount) public pure returns (uint256) {
        return _targetAmount / 10;
    }
}
