import React, { useState } from 'react';
import PayPalButton from './PayPalDonate';

export default function DonateSection() {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    // Strip everything except numbers and a single decimal point
    let raw = e.target.value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts[1];
    }

    // Limit to 2 decimal places
    if (raw.includes('.')) {
      const [intPart, decimalPart] = raw.split('.');
      raw = intPart + '.' + decimalPart.slice(0, 2);
    }

    setAmount(raw);
  };

  const numericAmount = parseFloat(amount);

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        inputMode="decimal"
        value={`$${amount}`}
        onChange={handleChange}
        className="w-[170px] min-h-[70px] border p-4 rounded-[8px] mb-6 text-6xl text-center font-bold"
      />

      {amount && numericAmount > 0 ? (
        <PayPalButton amount={numericAmount} />
      ) : (
        <p className="text-lg text-red-500">Enter a valid amount to donate.</p>
      )}
    </div>
  );
}
