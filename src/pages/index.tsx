// pages/index.tsx
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { getAssetPrice } from "./api/getUSDPrice";
import { getADAV1PoolSupply, getADAV2PoolSupply } from "./api/getADATotalLPTokens";
import { fetchTrtlV1PoolData, fetchTrtlV2PoolData } from "./api/getADATRTLTVLData";
import { getSOLTRTLLPprice } from "./api/getTRTLSOLData";
import MintModal from "./components/mintModal";
import PriceCard from "./components/displayPrice";
import LPTokensCard from "./components/LPTokensCard";
import MintButton from "./components/mintModalButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [trtlprice, setTrtlPrice] = useState<number | null>(null);
  const [adaprice, setAdaPrice] = useState<number | null>(null);
  const [solprice, setSolPrice] = useState<number | null>(null);
  const [adaTvlV1, setAdaTvlV1] = useState<number | null>(null); 
  const [adaTvlV2, setAdaTvlV2] = useState<number | null>(null); 
  const [adaLpTokensV1, setV1LPTokens] = useState<number | null>(null);
  const [adaLpTokensV2, setV2LPTokens] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lpTokensNeededV1, setLPTokensNeededV1] = useState<number | null>(null);
  const [lpTokensNeededV2, setLPTokensNeededV2] = useState<number | null>(null);
  const [lpTokensSolNeeded, setLPTokensSolNeeded] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchAssetPrice = async (assetId: string, setPrice: React.Dispatch<React.SetStateAction<number | null>>) => {
    try {
      setLoading(true);
      const fetchedPrice = await getAssetPrice(assetId);
      setPrice(fetchedPrice);
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);
    } catch (error) {
      console.error(`Failed to retrieve ${assetId} price:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTotalADALPTokens = async () => {
    try {
      const fetchedLPV1Tokens = await getADAV1PoolSupply();
      setV1LPTokens(fetchedLPV1Tokens);
      const fetchedLPV2Tokens = await getADAV2PoolSupply();
      setV2LPTokens(fetchedLPV2Tokens);
    } catch (error) {
      console.error("Failed to retrieve total LP tokens:", error);
    }
  };

  const fetchTotalAdaLocked = async () => {
    try {
      const responsev1 = await fetchTrtlV1PoolData();
      setAdaTvlV1(responsev1);
      const responsev2 = await fetchTrtlV2PoolData();
      setAdaTvlV2(responsev2);
    } catch (error) {
      console.error("Failed to retrieve total ADA locked in V1 pool:", error);
    }
  };

  const calculateRequiredADALPTokensV1 = () => {
    try {
      if (adaprice && adaTvlV1 !== null && adaLpTokensV1 !== null) {
        const poolValueInUSD = adaTvlV1 * adaprice;
        const usdValuePerLPToken = poolValueInUSD / adaLpTokensV1;
        const lpTokensNeededV1 = 95.00 / usdValuePerLPToken;
        setLPTokensNeededV1(lpTokensNeededV1);
      } else {
        throw new Error('Failed to fetch necessary data for V1 pool calculations');
      }
    } catch (error) {
      console.error('Error calculating V1 LP tokens required:', error);
      setLPTokensNeededV1(null);
    }
  };

  const calculateRequiredADALPTokensV2 = () => {
    try {
      if (adaprice && adaTvlV2 !== null && adaLpTokensV2 !== null) {
        const poolValueInUSD = adaTvlV2 * adaprice;
        const usdValuePerLPToken = poolValueInUSD / adaLpTokensV2;
        const lpTokensNeededV2 = 95.00 / usdValuePerLPToken;
        setLPTokensNeededV2(lpTokensNeededV2);
      } else {
        throw new Error('Failed to fetch necessary data for V2 pool calculations');
      }
    } catch (error) {
      console.error('Error calculating V2 LP tokens required:', error);
      setLPTokensNeededV2(null);
    }
  };
  
  const calculateRequiredSOLLPTokens = async () => {
    try {
      const solLPprice = await getSOLTRTLLPprice();
      if (solLPprice && solLPprice !== null) {
        const lpTokensSolNeeded = 95.00 / solLPprice;
        setLPTokensSolNeeded(lpTokensSolNeeded);
      } else {
        throw new Error('Failed to fetch necessary data for SOL calculations');
      }
    } catch (error) {
      console.error('Error calculating SOL/TRTL LP tokens required:', error);
      setLPTokensSolNeeded(null);
    }
  };

  useEffect(() => {
    fetchAssetPrice('cardano', setAdaPrice);
    fetchAssetPrice('solana', setSolPrice);
    fetchAssetPrice('turtlecoin', setTrtlPrice);
    fetchTotalAdaLocked();
    fetchTotalADALPTokens();

    // const intervalId = setInterval(() => {
    //   fetchAssetPrice('cardano', setAdaPrice);
    //   fetchAssetPrice('solana', setSolPrice);
    //   fetchAssetPrice('tortol', setTrtlPrice);
    //   fetchTotalAdaLocked();
    //   fetchTotalADALPTokens();
    // }, 600000);

    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    calculateRequiredADALPTokensV1();
    calculateRequiredADALPTokensV2();
    calculateRequiredSOLLPTokens();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaprice, solprice, adaTvlV1, adaTvlV2, adaLpTokensV1, adaLpTokensV2]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
      style={{
        backgroundImage: 'url("/media/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ul className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] mx-auto w-50">
          <li className="mb-2 mx-auto text-center">Mint price: $95.</li>
        </ul>

        <div className="flex gap-4 items-center flex-row mx-auto">
          <PriceCard
            href="https://www.coingecko.com/en/coins/cardano"
            imgSrc="/cardano.png"
            imgAlt="Cardano logo"
            price={adaprice}
            loading={loading}
            lastUpdated={lastUpdated}
          />
          <PriceCard
            href="https://www.coingecko.com/en/coins/tortol"
            imgSrc="/tortol_coin.png"
            imgAlt="Tortol logo"
            price={trtlprice}
            loading={loading}
            lastUpdated={lastUpdated}
          />
          <PriceCard
            href="https://www.coingecko.com/en/coins/solana"
            imgSrc="/solanaLogoMark.png"
            imgAlt="Solana logo"
            price={solprice}
            loading={loading}
            lastUpdated={lastUpdated}
          />
        </div>
        
        <div className="flex gap-4 items-center flex-cols-2 mx-auto">
          <LPTokensCard
            imgSrc="/minLPtoken.png"
            imgAlt="ADA V1 LP token"
            amount={lpTokensNeededV1}
            version="V1"
          />
          <LPTokensCard
            imgSrc="/minLPtoken.png"
            imgAlt="ADA V2 LP token"
            amount={lpTokensNeededV2}
            version="V2"
          />
          <LPTokensCard
            imgSrc="/solanaLogoMark.png"
            imgAlt="SOL LP token"
            amount={lpTokensSolNeeded}
            version="V1"
          />
        </div>

        <MintButton onClick={openModal} />
      </main>
      {isModalOpen && <MintModal onClose={closeModal} lpTokensNeededADAV1={lpTokensNeededV1} lpTokensNeededADAV2={lpTokensNeededV2} lpTokensNeededSOL={lpTokensSolNeeded}/>}
    </div>
  );
}
