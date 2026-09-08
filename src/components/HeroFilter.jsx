import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  Building2, 
  SlidersHorizontal, 
  RotateCcw, 
  DollarSign, 
  Bed, 
  Bath, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { mockCities, mockTypes } from '../data/mockProperties';

export default function HeroFilter({
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRecamaras,
  setMinRecamaras,
  minBanos,
  setMinBanos,
  totalResults,
  onResetFilters
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeAdvancedCount = (minPrice ? 1 : 0) + 
                              (maxPrice ? 1 : 0) + 
                              (minRecamaras > 0 ? 1 : 0) + 
                              (minBanos > 0 ? 1 : 0);

  return (
    <section className="relative overflow-hidden bg-[#000000] text-white py-16 md:py-24 border-b border-[#D4AF37]/25">
      
      {/* Fondos y Efectos de Iluminación Dorada */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-[#000000] to-[#000000] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black tracking-wider uppercase mb-6 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>RENACER - Grupo Inmobiliario</span>
        </div>

        {/* Título Principal con Máscara de Gradiente Dorado Exacto */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Encuentra tu próximo patrimonio <span className="bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#F3E8CB] bg-clip-text text-transparent">con exclusividad y certeza jurídica</span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Residencias de alta gama, departamentos ejecutivos y terrenos selectos en las zonas de mayor plusvalía de <strong>Chihuahua</strong> y <strong>Guadalajara</strong>.
        </p>

        {/* CONTENEDOR PRINCIPAL DE BÚSQUEDA Y FILTRADO */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <div className="bg-[#141416] border border-[#D4AF37]/25 p-4 sm:p-5 rounded-2xl shadow-2xl shadow-black backdrop-blur-xl space-y-4">
            
            {/* 1. Barra Principal */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* Selector de Ciudad */}
              <div className="sm:col-span-5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  id="filter-city"
                  className="w-full pl-10 pr-8 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs sm:text-sm font-bold text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none cursor-pointer"
                >
                  {mockCities.map((city) => (
                    <option key={city} value={city} className="bg-[#141416] text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Tipo de Operación */}
              <div className="sm:col-span-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  id="filter-type"
                  className="w-full pl-10 pr-8 py-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs sm:text-sm font-bold text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 outline-none cursor-pointer"
                >
                  {mockTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#141416] text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de Filtros Avanzados */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  id="btn-advanced-filters"
                  style={showAdvanced || activeAdvancedCount > 0 ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    showAdvanced || activeAdvancedCount > 0
                      ? 'hover:brightness-110 active:brightness-95'
                      : 'bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#D4AF37]/35 text-[#D4AF37]'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtros</span>
                  {activeAdvancedCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-black text-[#D4AF37] text-[10px] font-black">
                      {activeAdvancedCount}
                    </span>
                  )}
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* 2. PANEL EXPANDIBLE DE FILTROS AVANZADOS */}
            {showAdvanced && (
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left animate-in fade-in duration-200">
                
                {/* Rango de Precio */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Rango de Precio (MXN)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-[#D4AF37]"
                    >
                      <option value="">Precio Mín.</option>
                      <option value="20000">$20,000 (Renta)</option>
                      <option value="3000000">$3,000,000</option>
                      <option value="6000000">$6,000,000</option>
                      <option value="9000000">$9,000,000</option>
                    </select>

                    <select
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white outline-none cursor-pointer focus:border-[#D4AF37]"
                    >
                      <option value="">Precio Máx.</option>
                      <option value="35000">$35,000 (Renta)</option>
                      <option value="7000000">$7,000,000</option>
                      <option value="10000000">$10,000,000</option>
                      <option value="15000000">$15,000,000+</option>
                    </select>
                  </div>
                </div>

                {/* Recámaras */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" />
                    <span>Recámaras</span>
                  </label>
                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMinRecamaras(num)}
                        style={minRecamaras === num ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          minRecamaras === num
                            ? 'font-black shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {num === 0 ? 'Todas' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Baños */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    <span>Baños</span>
                  </label>
                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMinBanos(num)}
                        style={minBanos === num ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          minBanos === num
                            ? 'font-black shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {num === 0 ? 'Todos' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. Conteo de Resultados y Limpiar Filtros */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">
                Mostrando <strong className="text-[#D4AF37] font-bold">{totalResults}</strong> propiedades exclusivas disponibles
              </span>

              {(selectedCity !== 'Todas las ciudades' || selectedType !== 'Todos los tipos' || activeAdvancedCount > 0) && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-slate-400 hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
