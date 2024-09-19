// components/LPTokensCard.tsx
import Image from "next/image";
import { formatNumber } from "../../helpers/formatNumber";

interface LPTokensCardProps {
  imgSrc: string;
  imgAlt: string;
  amount: number | null;
  version?: 'V1' | 'V2'; // Optional prop to specify ADA version
}

const LPTokensCard: React.FC<LPTokensCardProps> = ({ imgSrc, imgAlt, amount, version }) => {
  const versionText = version ? `ADA ${version}` : 'ADA';

  return (
    <a
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      <Image
        className="dark"
        src={imgSrc}
        alt={imgAlt}
        width={40}
        height={40}
      />
      {amount !== null 
        ? `Amount of ${versionText} LP tokens needed: ${formatNumber(amount)}` 
        : `Loading ${versionText} LP tokens...`
      }
    </a>
  );
};

export default LPTokensCard;
