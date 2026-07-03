"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      className={cn("glass p-6", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
