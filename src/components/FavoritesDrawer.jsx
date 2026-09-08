import React from 'react';
import { X, Heart, Trash2, MessageCircle, ArrowUpRight, MapPin, Building, Bed, Bath, Maximize2 } from 'lucide-react';

export default function FavoritesDrawer({ 
  isOpen, 
  onClose, 
  favorites = [], 
  onRemoveFavorite 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141416] border-l border-[#D4AF37]/35 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-white">
          
          {/* Cabecera del Drawer */}
          <div className="p-6 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-400 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-pink-500 stroke-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mis Favoritos</h3>
                <span className="text-xs text-[#D4AF37] font-bold">
                  {favorites.length} {favorites.length === 1 ? 'inmueble guardado' : 'inmuebles guardados'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Favoritos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favorites.length > 0 ? (
              favorites.map((prop) => {
                const phone = prop.telefono_asesor || '526141234567';
                const cleanPhone = String(phone).replace(/\D/g, '');
                const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hola, me interesa mi propiedad favorita: ${prop.titulo}`)}`;

                return (
                  <div
                    key={prop.id}
                    className="p-4 rounded-2xl border border-[#D4AF37]/20 bg-[#0A0A0A] hover:border-[#D4AF37]/40 transition-all space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prop.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                        alt={prop.titulo}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#D4AF37]/30"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-1 bg-black border border-[#D4AF37]/40 text-[#D4AF37]">
                            {prop.tipo}
                          </span>
                          <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                            {prop.titulo}
                          </h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            {prop.ubicacion}
                          </span>
                        </div>

                        <span className="text-sm font-black text-white">
                          {prop.precio_texto || `$${Number(prop.precio).toLocaleString('es-MX')} MXN`}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-black/20" />
                        <span>Contactar Asesor</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => onRemoveFavorite && onRemoveFavorite(prop.id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Quitar de Favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#0A0A0A] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">No tienes propiedades guardadas</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explora nuestro catálogo y haz clic en el corazón en cualquier inmueble para guardarlo aquí.
                </p>
                <button
                  onClick={onClose}
                  style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                  className="mt-4 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            )}
          </div>

          {/* Pie del Drawer */}
          {favorites.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#0A0A0A] text-center">
              <span className="text-xs text-slate-400">
                Tus favoritos se sincronizan automáticamente con tu cuenta.
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
