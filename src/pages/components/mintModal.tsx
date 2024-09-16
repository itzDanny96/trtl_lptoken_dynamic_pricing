import { useState } from "react";
import { formatNumber } from "../../helpers/formatNumber";

interface MintModalProps {
  onClose: () => void;
  lpTokensNeeded: number; // Receive lpTokensNeeded as a prop
}

const MintModal = ({ onClose, lpTokensNeeded }: MintModalProps) => {
  const [mintAmount, setMintAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // State for error message

  // Calculate total cost based on mintAmount and lpTokensNeeded
  const totalCost = mintAmount !== null ? mintAmount * lpTokensNeeded : 0;

  const handleMint = () => {
    if (mintAmount !== null && mintAmount > 0) {
      alert(`Minting ${mintAmount} Sidekick NFT...`);
      onClose();
    } else {
      setError("Please enter a valid mint amount.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setError("Mint amount cannot be negative.");
    } else {
      setError(null); // Clear any existing error when input is valid
      setMintAmount(value);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center text-black">
        <h2 className="text-lg font-bold mb-4">Mint Sidekicks</h2>
        <p>
          Total Cost: {formatNumber(parseInt(totalCost.toFixed(0)))} LP Tokens
        </p>
        <input
          type="number"
          placeholder="Enter mint amount"
          value={mintAmount !== null ? mintAmount : ""}
          onChange={handleInputChange}
          className="border p-2 mb-4 w-full text-black text-center"
          min="0" // Ensure the HTML input does not allow negative values
        />
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        <button
          onClick={handleMint}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Mint
        </button>
        <button
          onClick={onClose}
          className="block mx-auto mt-4 text-center text-sm text-red-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MintModal;
