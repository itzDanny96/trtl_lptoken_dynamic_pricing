/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { getTrtlPrice } from "./api/getTRTLUSDPrice"; 
import { getAdaPrice } from "./api/getADAUSDPrice";
import { getTotalLPTokens } from "./api/getTotalLPTokens";
import { getTrtlTVL } from "./api/getTrtlTVL";
import { formatNumber } from "../helpers/formatNumber";
import MintModal from "./components/mintModal";

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
  const [totalAdaLocked, setTotalAdaLocked] = useState<number | null>(null); 
  const [lpTokens, setLPTokens] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lpTokensNeeded, setLPTokensNeeded] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchAdaPrice = async () => {
    try {
      setLoading(true);
      const fetchedAdaPrice = await getAdaPrice();
      setAdaPrice(fetchedAdaPrice);
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);
    } catch (error) {
      console.error("Failed to retrieve ADA price:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrtlPrice = async () => {
    try {
      setLoading(true);
      const fetchedTrtlPrice = await getTrtlPrice();
      setTrtlPrice(fetchedTrtlPrice);
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdated(currentTime);
    } catch (error) {
      console.error("Failed to retrieve TRTL price:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalLPTokens = async () => {
    try {
      const fetchedLPTokens = await getTotalLPTokens();
      setLPTokens(fetchedLPTokens);
    } catch (error) {
      console.error("Failed to retrieve total LP tokens:", error);
    }
  };

  const fetchTotalAdaLocked = async () => {
    try {
      const response = await getTrtlTVL();
      setTotalAdaLocked(response);
    } catch (error) {
      console.error("Failed to retrieve total ADA locked:", error);
    }
  };

  const calculateRequiredLPTokens = () => {
    try {
      if (adaprice && totalAdaLocked !== null && lpTokens !== null) {
        // Step 1: Calculate ADA amount for $95
        const adaAmountFor95USD = 95.00 / adaprice;
        const trtlAmountFor95USD = 95.00 / trtlprice;
        console.log(adaAmountFor95USD/2," Ada");
        console.log(trtlAmountFor95USD/2," Trtl")
        // Step 2: Calculate ADA value of 1 LP token
        const adaValuePerLPToken = totalAdaLocked / lpTokens;

        // Step 3: Calculate LP tokens needed to equal $95 in ADA
        const lpTokensNeeded = adaAmountFor95USD / adaValuePerLPToken;
        setLPTokensNeeded(lpTokensNeeded);
      } else {
        throw new Error('Failed to fetch necessary data for calculations');
      }
    } catch (error) {
      console.error('Error calculating LP tokens required:', error);
      setLPTokensNeeded(null);
    }
  };

  useEffect(() => { // Fetch values when component loads
    fetchAdaPrice();
    fetchTrtlPrice();
    fetchTotalAdaLocked();
    fetchTotalLPTokens(); 

    const intervalId = setInterval(() => {// Update every 10 minutes
      fetchAdaPrice();
      fetchTrtlPrice();
      fetchTotalAdaLocked();
      fetchTotalLPTokens(); 
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    calculateRequiredLPTokens(); // Recalculate whenever adaprice, trtlprice or totalAdaLocked change
  }, [adaprice, trtlprice, totalAdaLocked, calculateRequiredLPTokens]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
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

        <div className="flex gap-4 items-center flex-col">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.coingecko.com/en/coins/cardano"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark"
              src="/cardano.png"
              alt="Cardano logo"
              width={40}
              height={40}
            />
            ADA Price: {loading ? "Loading..." : adaprice ? `$${adaprice.toFixed(4)}` : "Price unavailable"}
            {!loading && lastUpdated && (
              <span className="text-xs text-gray-500 block mt-1">
                (Last updated at: {lastUpdated})
              </span>
            )}
          </a>

          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.coingecko.com/en/coins/tortol"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark"
              src="/tortol_coin.png"
              alt="Tortol logo"
              width={50}
              height={50}
            />
            TRTL Price: {loading ? "Loading..." : trtlprice ? `$${trtlprice.toFixed(9)}` : "Price unavailable"}
            {!loading && lastUpdated && (
              <span className="text-xs text-gray-500 block mt-1">
                (Last updated at: {lastUpdated})
              </span>
            )}
          </a>

          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.taptools.io/charts/token/0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.ccd6ccf11c5eab6a9964bc9a080a506342a4bb037209e100f0be238da7495a9c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark"
              src="/minLPtoken.png"
              alt="MinSwap LP token"
              width={40}
              height={40}
            />
            TRTL/ADA Pool TVL:{" "}
            {totalAdaLocked ? `${formatNumber(totalAdaLocked)} ADA` : "Loading..."}
          </a>

          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            <Image
              className="dark"
              src="/minLPtoken.png"
              alt="MinSwap LP token"
              width={40}
              height={40}
            />
            Amount of LP tokens needed:{" "}
            {lpTokensNeeded !== null ? `${formatNumber(lpTokensNeeded)}` : "Loading..."}
          </a>

           {/* Mint Button */}
           <button
            onClick={openModal}
            className="mt-10 bg-white text-black px-6 py-3 rounded-full hover:text-white hover:bg-green-600 transition"
          >
            Mint 
          </button>

        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center"></footer>
      {/* Render MintModal if the modal is open */}
      {isModalOpen && <MintModal onClose={closeModal} lpTokensNeeded={lpTokensNeeded} />}
    </div>
  );
}
