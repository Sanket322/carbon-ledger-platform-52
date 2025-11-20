// Currency utility functions for Indian market

export const CURRENCY_SYMBOL = "₹";
export const CURRENCY_CODE = "INR";

// Conversion rate (can be updated or fetched from API)
export const USD_TO_INR_RATE = 83.5;

export function formatINR(amount: number, includeSymbol = true): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: includeSymbol ? "currency" : "decimal",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return formatted;
}

export function convertUSDtoINR(usdAmount: number): number {
  return usdAmount * USD_TO_INR_RATE;
}

export function formatCreditPrice(pricePerTon: number): string {
  const inrPrice = convertUSDtoINR(pricePerTon);
  return formatINR(inrPrice);
}

// Format large numbers in Indian numbering system (Lakhs, Crores)
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} K`;
  }
  return num.toFixed(2);
}
