import { motion } from "framer-motion";
import { useState } from "react";

export default function SamuraiAnimation() {
  const [strike, setStrike] = useState(false);

  const handleStrike = () => {
    if (strike) return;
    setStrike(true);

    setTimeout(() => {
      setStrike(false);
    }, 700);
  };

  return (
    <div
      onClick={handleStrike}
      className="cursor-pointer select-none"
    >
      <svg width="280" height="260" viewBox="0 0 280 260">

        {/* Samurai Silhouette */}
        <motion.g
          animate={strike ? { x: -10 } : { x: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Head */}
          <circle cx="110" cy="70" r="22" fill="#111111" />

          {/* Body */}
          <rect x="95" y="92" width="30" height="70" rx="6" fill="#111111" />

          {/* Legs */}
          <polygon points="95,162 110,210 125,162" fill="#111111" />
        </motion.g>

        {/* Katana Slash Arc */}
        <motion.path
          d="M110 95 Q180 40 240 120"
          stroke="#8B1E1E"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={strike ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* Bamboo - Top Piece */}
        <motion.rect
          x="220"
          y="110"
          width="18"
          height="60"
          fill="#22c55e"
          animate={
            strike
              ? { rotate: -25, y: 80, x: 230 }
              : { rotate: 0, y: 110, x: 220 }
          }
          style={{ originX: "229px", originY: "140px" }}
          transition={{ duration: 0.35 }}
        />

        {/* Bamboo - Bottom Piece */}
        <motion.rect
          x="220"
          y="170"
          width="18"
          height="50"
          fill="#16a34a"
          animate={
            strike
              ? { y: 190 }
              : { y: 170 }
          }
          transition={{ duration: 0.35 }}
        />

      </svg>
    </div>
  );
}