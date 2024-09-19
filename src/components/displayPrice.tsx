import Image from "next/image";

interface PriceCardProps {
  href: string;
  imgSrc: string;
  imgAlt: string;
  price: number | null;
  loading: boolean;
  lastUpdated: string | null;
}

const formatPrice = (price: number | null): string => {
  if (price === null) return "Price unavailable";

  // Handle zero price
  if (price === 0) return "$0.00";

  // Determine number of decimal places based on the price
  const priceString = price.toString();
  const decimalIndex = priceString.indexOf('.');
  const decimalPlaces = decimalIndex === -1 ? 0 : priceString.length - decimalIndex - 1;

  // Display up to 9 decimal places
  const maxDecimalPlaces = Math.min(9, decimalPlaces);
  return `$${price.toFixed(maxDecimalPlaces)}`;
};

const PriceCard: React.FC<PriceCardProps> = ({ href, imgSrc, imgAlt, price, loading, lastUpdated }) => (
  <a
    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      className="dark"
      src={imgSrc}
      alt={imgAlt}
      width={40}
      height={40}
    />
    {loading ? "Loading..." : formatPrice(price)}
    {!loading && lastUpdated && (
      <span className="text-xs text-gray-500 block mt-1">
        (Last updated at: {lastUpdated})
      </span>
    )}
  </a>
);

export default PriceCard;
