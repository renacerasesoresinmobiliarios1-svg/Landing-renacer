import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ShieldAlert,
  LogOut,
  Bell,
  UserCheck,
  MessageCircle,
  Phone,
  FileText,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';
import PropertyFormModal from './PropertyFormModal';

export default function DashboardVendedor({ 
  user, 
  properties = [], 
  onRefresh 
}) {
  const [activeTab, setActiveTab] = useState('inventario'); // 'inventario', 'leads'
  const [items, setItems] = useState(properties);
  const [myLeads, setMyLeads] = useState([]);
  const [nuevosLeadsCount, setNuevosLeadsCount] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [editingProperty, setEditingProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingLeadNote, setEditingLeadNote] = useState(null);
  const [leadNoteText, setLeadNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadProperties = () => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setItems(data.data);
        }
      })
      .catch(err => console.log('Error loading properties:', err));
  };

  const loadMyLeads = () => {
    fetch('/api/my-leads')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyLeads(data.data || []);
          setNuevosLeadsCount(data.nuevos_count || 0);
        }
      })
      .catch(err => console.log('Error loading my leads:', err));
  };

  useEffect(() => {
    loadProperties();
    loadMyLeads();
  }, []);

  const totalActivas = items.filter(p => p.estatus === 'Activo').length;
  const totalEnTrato = items.filter(p => p.estatus === 'En Trato').length;
  const totalVendidas = items.filter(p => p.estatus === 'Vendido').length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val || 0);
  };

  const filteredItems = items.filter((p) => {
    const matchSearch = p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.ciudad?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || p.estatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingProperty(prop);
    setIsModalOpen(true);
  };

  const handlePropertySaved = (savedProp) => {
    if (editingProperty) {
      setItems(items.map(i => i.id === savedProp.id ? savedProp : i));
    } else {
      setItems([savedProp, ...items]);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      setItems(items.map(p => p.id === id ? { ...p, estatus: newStatus } : p));
      await fetch(`/api/properties/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estatus: newStatus }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleLeadStatusChange = async (leadId, newStatus) => {
    try {
      setMyLeads(myLeads.map(l => l.id === leadId ? { ...l, estatus: newStatus } : l));
      await fetch(`/api/leads/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estatus: newStatus }),
      });
      loadMyLeads();
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  const handleOpenNoteModal = (lead) => {
    setEditingLeadNote(lead);
    setLeadNoteText(lead.notas || '');
  };

  const handleSaveLeadNote = async (e) => {
    e.preventDefault();
    if (!editingLeadNote) return;
    setSavingNote(true);

    try {
      await fetch(`/api/leads/${editingLeadNote.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ notas: leadNoteText }),
      });

      setMyLeads(myLeads.map(l => l.id === editingLeadNote.id ? { ...l, notas: leadNoteText } : l));
      setEditingLeadNote(null);
    } catch (err) {
      console.error('Error saving lead note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('¿Estás seguro de retirar esta propiedad del catálogo?')) return;
    try {
      setItems(items.filter(p => p.id !== id));
      await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans pb-16">
      
      {/* Topbar del Dashboard Vendedor */}
      <header className="bg-[#000000] text-white sticky top-0 z-30 shadow-xl border-b border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* Logo y Rol */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center group">
                <Logo className="h-10 sm:h-12 w-auto" />
              </a>

              <div className="h-6 w-px bg-[#202024] mx-2 hidden sm:block"></div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141416] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black">
                <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Asesor Comercial (Ventas)</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2.5">
              <a
                href="/"
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#141416] hover:bg-[#1A1A1A] text-slate-300 border border-white/10 transition-colors"
              >
                <span>Ver Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                id="btn-vendedor-logout"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 border border-red-800/60 transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* ALERTA VISUAL SUPERIOR SI TIENE LEADS NUEVOS */}
        {nuevosLeadsCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-[#D4AF37]/40 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center shrink-0 font-black shadow-md shadow-[#D4AF37]/20">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-[#D4AF37]">
                  🔔 ¡Tienes {nuevosLeadsCount} nuevo{nuevosLeadsCount > 1 ? 's' : ''} prospecto{nuevosLeadsCount > 1 ? 's' : ''} asignado{nuevosLeadsCount > 1 ? 's' : ''}!
                </h4>
                <p className="text-xs text-slate-300">
                  Clientes interesados esperan tu asesoría vía WhatsApp para resolver dudas o agendar recorrido.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('leads')}
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all self-start sm:self-auto cursor-pointer"
            >
              Ver Mis Prospectos
            </button>
          </div>
        )}

        {/* Selector de Pestañas Vendedor */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
          <div className="flex items-center gap-2 bg-[#141416] p-1.5 rounded-2xl border border-white/5 shadow-xs">
            <button
              onClick={() => setActiveTab('inventario')}
              id="tab-vendedor-inventario"
              style={activeTab === 'inventario' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'inventario'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Inventario Operativo</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'inventario' ? 'bg-black text-[#D4AF37]' : 'bg-[#202024] text-slate-300'
              }`}>
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              id="tab-vendedor-leads"
              style={activeTab === 'leads' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Mis Prospectos Asignados</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'leads' ? 'bg-black text-[#D4AF37]' : 'bg-[#202024] text-[#D4AF37]'
              }`}>
                {myLeads.length}
              </span>
            </button>
          </div>

          {activeTab === 'inventario' && (
            <button
              onClick={handleOpenAddModal}
              id="btn-vendedor-add-property"
              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nueva Propiedad</span>
            </button>
          )}
        </div>

        {/* PESTAÑA 1: INVENTARIO OPERATIVO */}
        {activeTab === 'inventario' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Resumen Operativo en Carbón #141416 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#141416] p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#202024] text-[#D4AF37] border border-white/5 flex items-center justify-center font-black text-xl shrink-0">
                  {totalActivas}
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Propiedades Activas</span>
                  <span className="text-lg font-black text-white">Listas para Venta/Renta</span>
                </div>
              </div>

              <div className="bg-[#141416] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#202024] text-slate-300 flex items-center justify-center font-black text-xl shrink-0">
                  {totalEnTrato}
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">En Trato / Oferta</span>
                  <span className="text-lg font-black text-white">Proceso Notarial</span>
                </div>
              </div>

              <div className="bg-[#141416] p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/30 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center font-black text-xl shrink-0">
                  {totalVendidas}
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Cerradas / Vendidas</span>
                  <span className="text-lg font-black text-white">Operaciones Exitosas</span>
                </div>
              </div>
            </div>

            {/* TABLA OPERATIVA DE INVENTARIO */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">
                    Inventario Operativo ({filteredItems.length})
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por título, zona..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-medium text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 pl-3 pr-8 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-bold text-slate-300 outline-none cursor-pointer focus:border-[#D4AF37]"
                  >
                    <option value="Todos">Todos los estatus</option>
                    <option value="Activo">Activos</option>
                    <option value="En Trato">En Trato</option>
                    <option value="Vendido">Vendidos</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0A] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Propiedad</th>
                      <th className="py-3.5 px-4">Ubicación</th>
                      <th className="py-3.5 px-4">Operación</th>
                      <th className="py-3.5 px-4">Precio Público</th>
                      <th className="py-3.5 px-4">Estatus</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredItems.map((prop) => (
                      <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-500">#{prop.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.titulo}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                            <span className="font-bold text-white truncate max-w-[220px] block">
                              {prop.titulo}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 truncate max-w-[150px]">{prop.ubicacion}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black border border-[#D4AF37]/40 text-[#D4AF37]">
                            {prop.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-white">
                          {prop.precio_texto || formatCurrency(prop.precio)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={prop.estatus}
                            onChange={(e) => handleQuickStatusChange(prop.id, e.target.value)}
                            className="text-xs font-bold rounded-lg px-2.5 py-1 border border-white/10 cursor-pointer outline-none bg-[#0A0A0A] text-white focus:border-[#D4AF37]"
                          >
                            <option value="Activo">Activo</option>
                            <option value="En Trato">En Trato</option>
                            <option value="Vendido">Vendido</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(prop)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D4AF37] hover:bg-white/5 cursor-pointer"
                            title="Editar disponibilidad"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(prop.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 cursor-pointer"
                            title="Eliminar propiedad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA 2: MIS PROSPECTOS ASIGNADOS */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  Seguimiento de Ventas
                </span>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  Mis Prospectos Asignados ({myLeads.length})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Atiende a tus prospectos por WhatsApp, actualiza su estatus comercial y registra notas de avance.
                </p>
              </div>
            </div>

            {/* Tabla de Leads del Vendedor */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0A] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4">Prospecto</th>
                      <th className="py-3.5 px-4">Teléfono</th>
                      <th className="py-3.5 px-4">Propiedad de Interés</th>
                      <th className="py-3.5 px-4">Estatus Comercial</th>
                      <th className="py-3.5 px-4">Bitácora / Notas</th>
                      <th className="py-3.5 px-4 text-right">Acción Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {myLeads.map((lead) => {
                      const cleanPhone = String(lead.cliente_telefono).replace(/\D/g, '');
                      const propTitle = lead.property?.titulo || 'Inmueble';

                      return (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {lead.cliente_nombre}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {lead.cliente_telefono}
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px]">
                            <span className="font-bold text-white block truncate" title={propTitle}>
                              {propTitle}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lead.property?.ciudad}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.estatus}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-bold border border-white/10 outline-none cursor-pointer bg-[#0A0A0A] text-white focus:border-[#D4AF37]"
                            >
                              <option value="Nuevo">Nuevo</option>
                              <option value="Contactado">Contactado</option>
                              <option value="Cita Agendada">Cita Agendada</option>
                              <option value="Cerrado">Cerrado</option>
                              <option value="Descartado">Descartado</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 text-[11px] truncate flex-1" title={lead.notas}>
                                {lead.notas || 'Sin notas de seguimiento'}
                              </span>
                              <button
                                onClick={() => handleOpenNoteModal(lead)}
                                className="p-1 rounded-md text-slate-400 hover:text-[#D4AF37] hover:bg-white/5 shrink-0"
                                title="Editar notas"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hola ${lead.cliente_nombre}, te saluda tu asesor comercial de RENACER - Grupo Inmobiliario sobre la propiedad ${propTitle}. ¿Te gustaría que coordinemos una visita o llamada?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md hover:brightness-110 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL PARA EDITAR NOTAS */}
      {editingLeadNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#141416] rounded-2xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden text-white">
            <div className="bg-[#0A0A0A] p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
                  Seguimiento de Prospecto
                </span>
                <h3 className="text-base font-bold text-white">Bitácora de {editingLeadNote.cliente_nombre}</h3>
              </div>
              <button
                onClick={() => setEditingLeadNote(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeadNote} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Notas de Avance y Acuerdos
                </label>
                <textarea
                  rows={4}
                  required
                  value={leadNoteText}
                  onChange={(e) => setLeadNoteText(e.target.value)}
                  placeholder="Ej: Se agendó visita para el sábado a las 11:00 AM..."
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white focus:border-[#D4AF37] outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingLeadNote(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 hover:brightness-110"
                >
                  {savingNote ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Nota</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REUTILIZABLE */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={editingProperty}
        onSaved={handlePropertySaved}
        isAdmin={false}
      />

    </div>
  );
}
