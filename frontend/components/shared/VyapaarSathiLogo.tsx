"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const VyapaarSathiLogo: React.FC<LogoProps> = ({
  className = "w-8 h-8",
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Badge */}
      <rect width="40" height="40" rx="10" fill="#002E6E" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9.5"
        stroke="#00BAF2"
        strokeOpacity="0.4"
      />

      {/* Interlocking Growth & Companion emblem */}
      <path
        d="M11 26L17.5 19.5L22.5 24.5L29 15"
        stroke="#00BAF2"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 15H29V21"
        stroke="#00BAF2"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* AI Companion Node Dot */}
      <circle cx="29" cy="15" r="2.5" fill="#FFFFFF" />

      {/* Foundation Base Line */}
      <path
        d="M11 29.5H29"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
