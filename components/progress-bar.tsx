"use client"

import { useEffect, useState } from "react"

const glowColors: Record<string, string> = {
  "#ff3c6e": "0 0 8px rgba(255,60,110,0.8)",
  "#ffd700": "0 0 8px rgba(255,215,0,0.8)",
  "#00bfff": "0 0 8px rgba(0,191,255,0.8)",
  "#bf5fff": "0 0 8px rgba(191,95,255,0.8)",
}

export default function ProgressBar({
  value,
  color
}: {
  value: number
  color: string
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex-1 max-w-[160px] h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
      <div
        style={{
          width: `${width}%`,
          backgroundColor: color,
          boxShadow: width > 0 ? glowColors[color] : "none",
          transition: "width 0.8s ease-out",
          height: "100%",
          borderRadius: "9999px",
        }}
      />
    </div>
  )
}