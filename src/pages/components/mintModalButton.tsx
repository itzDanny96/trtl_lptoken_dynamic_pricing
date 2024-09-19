// components/MintButton.tsx
interface MintButtonProps {
    onClick: () => void;
  }
  
  const MintButton: React.FC<MintButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="mt-4 mx-auto bg-green-600 text-white px-6 py-3 rounded-full hover:text-white hover:bg-green-500 transition"
    >
      Mint 
    </button>
  );
  
  export default MintButton;