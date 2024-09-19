import { useState } from "react";
import { formatNumber } from "../../helpers/formatNumber";

interface MintModalProps {
  onClose: () => void;
  lpTokensNeededADAV1: number; // ADA V1 LP tokens needed
  lpTokensNeededADAV2: number; // ADA V2 LP tokens needed
  lpTokensNeededSOL: number; // SOL LP tokens needed
}

const MintModal = ({ onClose, lpTokensNeededADAV1, lpTokensNeededADAV2, lpTokensNeededSOL }: MintModalProps) => {
  const [mintAmount, setMintAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // State for error message
  const [isSolSelected, setIsSolSelected] = useState<boolean>(true); // Toggle between SOL and ADA
  const [isAdaV1Selected, setIsAdaV1Selected] = useState<boolean>(true); // Toggle between ADA V1 and V2

  // Function to calculate the LP tokens needed based on the selected type
  const getLpTokensNeeded = () => {
    if (isSolSelected) {
      return lpTokensNeededSOL; // If SOL is selected
    }
    return isAdaV1Selected ? lpTokensNeededADAV2 : lpTokensNeededADAV1; // If ADA is selected, choose V1 or V2
  };

  // Calculate total cost based on mintAmount and selected LP tokens needed
  const lpTokensNeeded = getLpTokensNeeded();
  const totalCost = mintAmount !== null ? mintAmount * lpTokensNeeded : 0;

  const handleMint = () => {
    if (mintAmount !== null && mintAmount > 0) {
      alert(`Minting ${mintAmount} Sidekick NFT using ${isSolSelected ? 'TRTL/SOL' : (isAdaV1Selected ? 'TRTL/ADA V1' : 'TRTL/ADA V2')} LP...`);
      onClose();
    } else {
      setError("Please enter a valid mint amount.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1) {
      setError("Mint amount cannot be negative.");
    } else {
      setError(null); // Clear any existing error when input is valid
      setMintAmount(value);
    }
  };

  const incrementAmount = () => {
    setMintAmount((prev) => (prev !== null ? prev + 1 : 1));
  };

  const decrementAmount = () => {
    setMintAmount((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
  };

  const toggleLPType = () => {
    setIsSolSelected(!isSolSelected); // Toggle between SOL and ADA LP
  };

  const toggleAdaVersion = () => {
    setIsAdaV1Selected(!isAdaV1Selected); // Toggle between ADA V1 and V2
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
      <div className="bg-neutral-800 p-8 shadow-lg text-center text-white border-gradient rounded-lg">
        <h2 className="text-lg font-bold mb-4">Mint Sidekicks</h2>

        {/* Toggle switch between TRTL/SOL and TRTL/ADA */}
        <div className="mb-4 flex items-center justify-center">
          <span className={`mr-2 px-4 py-2 ${!isSolSelected ? '' : ''}`}>
            TRTL/ADA LP
          </span>
          <div
            onClick={toggleLPType}
            className={`relative inline-block w-12 h-6 cursor-pointer transition duration-200 ease-in-out ${!isSolSelected ? 'bg-gray-500' : 'bg-gray-500'} rounded-full`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out transform ${isSolSelected ? 'translate-x-6' : ''}`}
            />
          </div>
          <span className={`ml-2 px-4 py-2 ${isSolSelected ? '' : ''}`}>
            TRTL/SOL LP
          </span>
        </div>

        {/* Toggle switch between ADA V1 and ADA V2 (only visible if TRTL/ADA is selected) */}
        {!isSolSelected && (
          <div className="mb-4 flex items-center justify-center">
            <span className={`mr-2 px-4 text-right ${isAdaV1Selected ? '' : ''}`}>V1 Pool</span>
            <div
              onClick={toggleAdaVersion}
              className={`relative inline-block w-12 h-6 cursor-pointer transition duration-200 ease-in-out ${isAdaV1Selected ? 'bg-gray-500' : 'bg-gray-500'} rounded-full`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out transform ${isAdaV1Selected ? 'translate-x-6' : ''}`}
              />
            </div>
            <span className={`ml-2 px-4 text-left ${!isAdaV1Selected ? '' : ''}`}>V2 Pool</span>
          </div>
        )}

        {/* Display total cost based on selected LP type */}
        <p>
          {formatNumber(parseInt(totalCost.toFixed(0)))} {isSolSelected ? 'SOL' : 'ADA'} LP Tokens required
        </p>

        {/* Number input with increment and decrement buttons */}
        <div className="flex items-center justify-center mt-4 mb-4">
          <button
            onClick={decrementAmount}
            className="bg-gray-300 text-black px-2 rounded-l-md hover:bg-red-500"
          >
            -
          </button>
          <input
            type="number"
            placeholder="0"
            value={mintAmount !== null ? mintAmount : ""}
            onChange={handleInputChange}
            readOnly
            className="border p-2 w-24 text-white text-center rounded-lg bg-neutral-800" // Hide default spinner
            min="0" // Ensure the HTML input does not allow negative values
          />
          <button
            onClick={incrementAmount}
            className="bg-gray-300 text-black px-2 rounded-r-md hover:bg-green-500"
          >
            +
          </button>
        </div>

        {error && <p className="font-bold text-red-500">{error}</p>} {/* Display error message */}

        <button
          onClick={handleMint}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
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
