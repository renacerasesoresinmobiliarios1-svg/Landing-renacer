import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './Navbar';
import HeroFilter from './HeroFilter';
import PropertyCard from './PropertyCard';
import PropertyDetail from './PropertyDetail';
import PropertyComparator from './PropertyComparator';
import LeadCaptureModal from './LeadCaptureModal';
import ShareModal from './ShareModal';
import FavoritesDrawer from './FavoritesDrawer';
import LoginModal from './LoginModal';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { mockProperties } from '../data/mockProperties';
import { Building, ShieldCheck, Users, Award, SearchX, ArrowRight, CheckCircle2, Heart, Sparkles, Scale, Trash2 } from 'lucide-react';

export default function Home({ authUser }) {
  const [propertiesList, setPropertiesList] = useState(mockProperties);
  
  // Estados de Filtros
  const [selectedCity, setSelectedCity] = useState('Todas las ciudades');
  const [selectedType, setSelectedType] = useState('Todos los tipos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRecamaras, setMinRecamaras] = useState(0);
  const [minBanos, setMinBanos] = useState(0);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [comparedProperties, setComparedProperties] = useState([]);
  
  // Modales
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);
  const [leadCaptureProperty, setLeadCaptureProperty] = useState(null);
  const [leadCaptureMode, setLeadCaptureMode] = useState('info'); // 'info' | 'visita'
  const [shareProperty, setShareProperty] = useState(null);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPropertiesList(data.data);
          if (data.favorite_ids) {
            setFavoriteIds(data.favorite_ids);
          }
        }
      })
      .catch((err) => {
        console.log('Using local mock properties');
      });

    if (authUser) {
      fetch('/api/favorites')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.favorite_ids) {
            setFavoriteIds(data.favorite_ids);
          }
        })
        .catch(() => {});
    }
  }, [authUser]);

  const handleToggleFavorite = async (propertyId) => {
    if (!authUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const isCurrentlyFavorite = favoriteIds.includes(propertyId);
    if (isCurrentlyFavorite) {
      setFavoriteIds(favoriteIds.filter(id => id !== propertyId));
    } else {
      setFavoriteIds([...favoriteIds, propertyId]);
    }

    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ property_id: propertyId }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.is_favorite) {
          if (!favoriteIds.includes(propertyId)) {
            setFavoriteIds(prev => [...prev, propertyId]);
          }
        } else {
          setFavoriteIds(prev => prev.filter(id => id !== propertyId));
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleCompare = (property) => {
    const isAlready = comparedProperties.some(p => p.id === property.id);
    if (isAlready) {
      setComparedProperties(comparedProperties.filter(p => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 3) {
        alert('Puedes comparar un máximo de 3 propiedades a la vez.');
        return;
      }
      setComparedProperties([...comparedProperties, property]);
    }
  };

  const handleRemoveFromCompare = (propId) => {
    setComparedProperties(comparedProperties.filter(p => p.id !== propId));
  };

  const handleClearCompare = () => {
    setComparedProperties([]);
  };

  const handleScheduleVisit = (property) => {
    setLeadCaptureMode('visita');
    setLeadCaptureProperty(property);
  };

  const handleWhatsAppContact = (property) => {
    if (authUser) {
      fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          cliente_nombre: authUser.name,
          cliente_telefono: authUser.telefono || 'Sin teléfono',
          origen: 'WhatsApp',
          notas: `Interesado en: ${property.titulo}`,
        }),
      }).catch(() => {});

      fetch(`/api/properties/${property.id}/whatsapp-click`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      }).catch(() => {});

      const phone = property.telefono_asesor || '526141234567';
      const cleanPhone = String(phone).replace(/\D/g, '');
      const msg = `Hola, me interesa información sobre la propiedad: ${property.titulo} - Ubicada en ${property.ciudad || property.ubicacion}`;
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    } else {
      setLeadCaptureMode('info');
      setLeadCaptureProperty(property);
    }
  };

  const favoriteProperties = useMemo(() => {
    return propertiesList.filter(p => favoriteIds.includes(p.id));
  }, [propertiesList, favoriteIds]);

  const filteredProperties = useMemo(() => {
    return propertiesList.filter((property) => {
      const matchCity =
        selectedCity === 'Todas las ciudades' ||
        property.ciudad?.toLowerCase() === selectedCity.toLowerCase() ||
        property.ubicacion?.toLowerCase().includes(selectedCity.toLowerCase());

      const matchType =
        selectedType === 'Todos los tipos' ||
        property.tipo?.toLowerCase() === selectedType.toLowerCase();

      const propPrice = typeof property.precio === 'number' ? property.precio : parseFloat(property.precio) || 0;
      const matchMinPrice = !minPrice || propPrice >= parseFloat(minPrice);
      const matchMaxPrice = !maxPrice || propPrice <= parseFloat(maxPrice);

      const recs = property.recamaras || property.habitaciones || 0;
      const matchRecamaras = minRecamaras === 0 || recs >= minRecamaras;

      const bns = property.banos || 0;
      const matchBanos = minBanos === 0 || bns >= minBanos;

      return matchCity && matchType && matchMinPrice && matchMaxPrice && matchRecamaras && matchBanos;
    });
  }, [propertiesList, selectedCity, selectedType, minPrice, maxPrice, minRecamaras, minBanos]);

  const handleResetFilters = () => {
    setSelectedCity('Todas las ciudades');
    setSelectedType('Todos los tipos');
    setMinPrice('');
    setMaxPrice('');
    setMinRecamaras(0);
    setMinBanos(0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. Navbar de Lujo */}
      <Navbar 
        authUser={authUser} 
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
      />

      {/* 2. Hero con Filtros Avanzados */}
      <HeroFilter
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRecamaras={minRecamaras}
        setMinRecamaras={setMinRecamaras}
        minBanos={minBanos}
        setMinBanos={setMinBanos}
        totalResults={filteredProperties.length}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Propuesta de Valor en Negro Puro y Oro Brillante */}
      <section className="border-y border-[#D4AF37]/25 bg-[#000000] py-12 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#0D0D0D] border border-[#D4AF37]/20 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black flex items-center justify-center shrink-0 font-black shadow-md shadow-[#D4AF37]/20">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Certeza Jurídica 100%</h4>
                <p className="text-xs text-slate-400 mt-0.5">Validación notarial, fiscal y registral en cada inmueble.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#0D0D0D] border border-[#D4AF37]/20 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black flex items-center justify-center shrink-0 font-black shadow-md shadow-[#D4AF37]/20">
                <Users className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Asesores Certificados</h4>
                <p className="text-xs text-slate-400 mt-0.5">Atención personalizada y acompañamiento integral.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#0D0D0D] border border-[#D4AF37]/20 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black flex items-center justify-center shrink-0 font-black shadow-md shadow-[#D4AF37]/20">
                <Award className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Portafolio Exclusivo</h4>
                <p className="text-xs text-slate-400 mt-0.5">Propiedades prime en Chihuahua y Guadalajara.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección de Catálogo de Propiedades */}
      <main id="catalogo" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Encabezado de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-5 border-b border-[#D4AF37]/20 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-extrabold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Inventario Selecto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Catálogo de Propiedades Exclusivas
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Filtra por precio, recámaras y ubicación para encontrar la propiedad ideal.
            </p>
          </div>

          {/* Filtros Rápidos por Píldoras */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#121212] p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setSelectedType('Todos los tipos')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedType === 'Todos los tipos'
                  ? 'bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({propertiesList.length})
            </button>
            <button
              onClick={() => setSelectedType('Venta')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedType === 'Venta'
                  ? 'bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Venta
            </button>
            <button
              onClick={() => setSelectedType('Renta')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedType === 'Renta'
                  ? 'bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Renta
            </button>
          </div>
        </div>

        {/* Grilla de Propiedades */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isFavorite={favoriteIds.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={comparedProperties.some(cp => cp.id === property.id)}
                onToggleCompare={handleToggleCompare}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onOpenDetail={(prop) => setSelectedPropertyDetail(prop)}
                onOpenWhatsApp={handleWhatsAppContact}
                onShare={(prop) => setShareProperty(prop)}
                authUser={authUser}
              />
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="bg-[#0D0D0D] rounded-3xl border border-[#D4AF37]/30 p-12 text-center max-w-lg mx-auto shadow-2xl my-8">
            <div className="w-16 h-16 bg-[#171717] rounded-2xl flex items-center justify-center mx-auto text-[#D4AF37] mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron propiedades</h3>
            <p className="text-sm text-slate-400 mb-6">
              No hay inmuebles que coincidan con los criterios seleccionados. Prueba ampliando el rango de precio o reduciendo filtros.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FBF0B9] via-[#D4AF37] to-[#AA771C] text-black text-xs font-black rounded-xl shadow-md transition-all cursor-pointer hover:brightness-110"
            >
              <span>Restablecer Todos los Filtros</span>
            </button>
          </div>
        )}

      </main>

      {/* Barra Flotante de Comparador (cuando hay propiedades seleccionadas) */}
      {comparedProperties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-[#141416]/95 border border-[#D4AF37]/50 shadow-2xl shadow-black rounded-2xl p-3 sm:p-4 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs font-bold text-white">
                Comparando {comparedProperties.length} {comparedProperties.length === 1 ? 'propiedad' : 'propiedades'}
              </span>
              <span className="text-[11px] text-slate-400">
                Máximo 3 propiedades en simultáneo
              </span>
            </div>

            {/* Mini miniaturas */}
            <div className="flex items-center -space-x-2 overflow-hidden">
              {comparedProperties.map(p => (
                <img 
                  key={p.id}
                  src={p.imagen} 
                  alt={p.titulo} 
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#141416]" 
                  title={p.titulo}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearCompare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Limpiar"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsComparatorOpen(true)}
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Ver Comparativa</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Sección Nosotros */}
      <section id="nosotros" className="bg-[#000000] py-16 md:py-24 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121212] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-black tracking-wider uppercase">
                Sobre Nosotros
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                RENACER - Grupo Inmobiliario: Excelencia y Patrimonio Seguro
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                En <strong>RENACER - Grupo Inmobiliario</strong> consolidamos una trayectoria de confianza brindando asesoría inmobiliaria de alto nivel en <strong>Chihuahua</strong> y <strong>Guadalajara</strong>. Nuestro compromiso es respaldar tu inversión patrimonial con ética, agilidad y transparencia absoluta.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 font-medium">
                    Cobertura estratégica en las zonas y fraccionamientos de mayor plusvalía.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 font-medium">
                    Dictaminación jurídica y comercial rigurosa de cada inmueble.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 font-medium">
                    Atención personalizada y ágil con asesores asignados vía WhatsApp.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 bg-[#0A0A0A]">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
                  alt="Asesoría Inmobiliaria Renacer"
                  className="w-full h-80 sm:h-96 object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <span className="block text-2xl font-black text-white">Patrimonio con Respaldo Total</span>
                    <span className="text-sm text-[#D4AF37] font-black uppercase tracking-wider">RENACER - Grupo Inmobiliario</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sedes Corporativas */}
      <ContactSection />

      {/* 7. Footer */}
      <Footer />

      {/* MODAL FICHA DE DETALLE */}
      <PropertyDetail
        property={selectedPropertyDetail}
        isOpen={!!selectedPropertyDetail}
        onClose={() => setSelectedPropertyDetail(null)}
        isFavorite={selectedPropertyDetail ? favoriteIds.includes(selectedPropertyDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isCompared={selectedPropertyDetail ? comparedProperties.some(cp => cp.id === selectedPropertyDetail.id) : false}
        onToggleCompare={handleToggleCompare}
        onScheduleVisit={handleScheduleVisit}
        onOpenWhatsApp={handleWhatsAppContact}
        onShare={(prop) => setShareProperty(prop)}
        authUser={authUser}
      />

      {/* MODAL COMPARADOR DE PROPIEDADES */}
      <PropertyComparator
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        properties={comparedProperties}
        onRemoveProperty={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
        onOpenWhatsApp={handleWhatsAppContact}
        onOpenDetail={(prop) => setSelectedPropertyDetail(prop)}
      />

      {/* MODAL COMPARTIR EN REDES SOCIALES */}
      <ShareModal
        property={shareProperty}
        isOpen={!!shareProperty}
        onClose={() => setShareProperty(null)}
      />

      {/* MODAL CAPTURA RÁPIDA / AGENDADOR DE VISITA */}
      <LeadCaptureModal
        property={leadCaptureProperty}
        isOpen={!!leadCaptureProperty}
        onClose={() => setLeadCaptureProperty(null)}
        authUser={authUser}
        initialMode={leadCaptureMode}
      />

      {/* Drawer de Favoritos */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favoriteProperties}
        onRemoveFavorite={handleToggleFavorite}
      />

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}
