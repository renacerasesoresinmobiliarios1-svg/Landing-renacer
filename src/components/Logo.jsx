import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

export default function Logo({ 
  className = "h-10 sm:h-12 w-auto", 
  variant = "full", // "full", "icon", "dark"
  alt = "RENACER - Grupo Inmobiliario" 
}) {
  const [imgError, setImgError] = useState(false);

  if (variant === 'icon') {
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0 font-black">
        <Building2 className="w-5 h-5 stroke-[2.2]" />
      </div>
    );
  }

  if (imgError) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-white leading-none">
            RENACER
          </span>
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mt-0.5">
            Grupo Inmobiliario
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src="/images/logo.png"
      alt={alt}
      onError={() => {
        setImgError(true);
      }}
      className={`object-contain transition-transform duration-200 ${className}`}
    />
  );
}
