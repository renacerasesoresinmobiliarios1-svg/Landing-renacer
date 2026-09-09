import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MessageCircle, 
  TrendingUp, 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Tag, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  X,
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  RefreshCw,
  Users,
  UserPlus,
  Mail,
  Phone,
  Lock,
  LogOut,
  Briefcase,
  UserCheck,
  Calendar,
  AlertCircle,
  Sparkles,
  Download,
  FileSpreadsheet,
  Link2,
  Copy,
  Trophy,
  Target,
  BarChart3,
  Check
} from 'lucide-react';
import Logo from './Logo';
import PropertyFormModal from './PropertyFormModal';

export default function DashboardAdmin({ 
  user, 
  kpis = {}, 
  properties = [], 
  onRefresh 
}) {
  const [activeTab, setActiveTab] = useState('inventario'); // 'inventario', 'asesores', 'leads', 'marketing'
  const [items, setItems] = useState(properties);
  const [advisors, setAdvisors] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadKpis, setLeadKpis] = useState({ total: 0, nuevos: 0, contactados: 0, citas: 0, cerrados: 0 });
  const [teamPerformance, setTeamPerformance] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('Todos');
  const [leadAdvisorFilter, setLeadAdvisorFilter] = useState('Todos');
  const [leadPeriodFilter, setLeadPeriodFilter] = useState('todos'); // 'todos', 'hoy', 'semana', 'mes'
  
  // Marketing UTM Link Generator State
  const [utmPropertyId, setUtmPropertyId] = useState('');
  const [utmCanal, setUtmCanal] = useState('Facebook Ads');
  const [utmCampana, setUtmCampana] = useState('Campana_Inversionistas');
  const [utmAdvisorPhone, setUtmAdvisorPhone] = useState('526141234567');
  const [isCopiedUtm, setIsCopiedUtm] = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Form state de asesor
  const [advisorForm, setAdvisorForm] = useState({
    name: '',
    email: '',
    telefono: '',
    password: '',
  });

  const exportToCSV = (filename, rows) => {
    const processRow = (row) => {
      return row.map(val => {
        if (val === null || val === undefined) return '""';
        let str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',');
    };

    const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPropertiesCSV = () => {
    const headers = [
      'ID', 
      'Título', 
      'Ubicación', 
      'Ciudad', 
      'Operación', 
      'Precio MXN', 
      'Costo Base MXN', 
      'Utilidad MXN', 
      'Estatus', 
      'Recámaras', 
      'Baños', 
      'Construcción m2', 
      'Terreno m2', 
      'Clics WhatsApp', 
      'Teléfono Asesor'
    ];

    const rows = items.map(p => [
      p.id,
      p.titulo,
      p.ubicacion,
      p.ciudad,
      p.tipo,
      p.precio,
      p.costo_base || 0,
      p.utilidad || 0,
      p.estatus || 'Activo',
      p.recamaras || p.habitaciones || 1,
      p.banos || 1,
      p.construccion_m2 || p.superficie || '',
      p.terreno_m2 || '',
      p.whatsapp_clicks || 0,
      p.telefono_asesor || ''
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    exportToCSV(`inventario_renacer_${dateStr}.csv`, [headers, ...rows]);
  };

  const handleExportLeadsCSV = () => {
    const headers = [
      'ID', 
      'Fecha Registro', 
      'Nombre Cliente', 
      'Teléfono WhatsApp', 
      'Email', 
      'Propiedad de Interés', 
      'Asesor Asignado', 
      'Estatus', 
      'Fecha Visita Solicitada', 
      'Turno Visita', 
      'Origen', 
      'Canal Campaña', 
      'Notas'
    ];

    const rows = leads.map(l => [
      l.id,
      l.created_at ? l.created_at.replace('T', ' ').substring(0, 19) : '',
      l.cliente_nombre,
      l.cliente_telefono,
      l.cliente_email || '',
      l.property?.titulo || 'Inmueble',
      l.advisor?.name || 'Sin Asignar',
      l.estatus,
      l.fecha_visita || '',
      l.turno_visita || '',
      l.origen || 'WhatsApp',
      l.canal_utm || '',
      l.notas || ''
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    exportToCSV(`prospectos_renacer_${dateStr}.csv`, [headers, ...rows]);
  };

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

  const loadAdvisors = () => {
    fetch('/api/advisors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdvisors(data.data);
        }
      })
      .catch((err) => console.log('Error fetching advisors:', err));
  };

  const loadLeads = () => {
    let url = '/api/leads?';
    if (leadPeriodFilter && leadPeriodFilter !== 'todos') {
      url += `periodo=${leadPeriodFilter}&`;
    }
    if (leadSearchTerm) {
      url += `search=${encodeURIComponent(leadSearchTerm)}&`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeads(data.data || []);
          if (data.kpis) {
            setLeadKpis(data.kpis);
          }
          if (data.team_performance) {
            setTeamPerformance(data.team_performance);
          }
        }
      })
      .catch(err => console.log('Error loading leads:', err));
  };

  useEffect(() => {
    loadProperties();
    loadAdvisors();
  }, []);

  useEffect(() => {
    loadLeads();
  }, [leadPeriodFilter, leadSearchTerm]);

  const getGeneratedUtmLink = () => {
    const selectedProp = items.find(p => String(p.id) === String(utmPropertyId)) || items[0];
    const phone = utmAdvisorPhone || (selectedProp?.telefono_asesor) || '526141234567';
    const cleanPhone = String(phone).replace(/\D/g, '');
    const propTitle = selectedProp ? selectedProp.titulo : 'Inmueble Renacer';
    const propCity = selectedProp ? (selectedProp.ciudad || selectedProp.ubicacion) : 'Chihuahua';

    const msg = `🏛️ *CONSULTA (${utmCanal.toUpperCase()}) - RENACER*\n\n` +
      `📌 *Campaña:* ${utmCampana}\n` +
      `🏡 *Propiedad:* ${propTitle} (${propCity})\n` +
      `Hola, vi este anuncio en ${utmCanal} y deseo recibir la ficha técnica y disponibilidad.`;

    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  };

  const handleCopyUtmLink = () => {
    const link = getGeneratedUtmLink();
    navigator.clipboard.writeText(link);
    setIsCopiedUtm(true);
    setTimeout(() => setIsCopiedUtm(false), 2000);
  };

  const totalWhatsAppClicks = items.reduce((acc, p) => acc + (p.whatsapp_clicks || 0), 0);
  const totalUtilidad = items.reduce((acc, p) => acc + (Number(p.utilidad) || 0), 0);
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

  const filteredLeads = leads.filter((l) => {
    const matchStatus = leadStatusFilter === 'Todos' || l.estatus === leadStatusFilter;
    const matchAdvisor = leadAdvisorFilter === 'Todos' || String(l.user_id) === String(leadAdvisorFilter);
    return matchStatus && matchAdvisor;
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

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;
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

  const handleAssignAdvisor = async (leadId, advisorId) => {
    try {
      const selectedAdv = advisors.find(a => String(a.id) === String(advisorId));
      setLeads(leads.map(l => l.id === leadId ? { ...l, user_id: advisorId, advisor: selectedAdv } : l));

      await fetch(`/api/leads/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ user_id: advisorId || null }),
      });
    } catch (err) {
      console.error('Error assigning advisor:', err);
    }
  };

  const handleLeadStatusChange = async (leadId, newStatus) => {
    try {
      setLeads(leads.map(l => l.id === leadId ? { ...l, estatus: newStatus } : l));
      await fetch(`/api/leads/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estatus: newStatus }),
      });
      loadLeads();
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  const handleSaveAdvisor = async (e) => {
    e.preventDefault();
    setLoadingAction(true);

    try {
      const res = await fetch('/api/advisors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(advisorForm),
      });

      const data = await res.json();
      if (data.success) {
        setAdvisors([data.data, ...advisors]);
        setIsAdvisorModalOpen(false);
        setAdvisorForm({ name: '', email: '', telefono: '', password: '' });
      } else {
        alert(data.message || 'Error al registrar asesor');
      }
    } catch (err) {
      console.error('Error creating advisor:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteAdvisor = async (id) => {
    if (!window.confirm('¿Estás seguro de dar de baja a este asesor comercial?')) return;
    try {
      setAdvisors(advisors.filter(a => a.id !== id));
      await fetch(`/api/advisors/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
    } catch (err) {
      console.error('Error deleting advisor:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans pb-16">
      
      {/* Topbar del Dashboard Admin */}
      <header className="bg-[#000000] text-white sticky top-0 z-30 shadow-xl border-b border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* Logo y Badge */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center group">
                <Logo className="h-10 sm:h-12 w-auto" />
              </a>

              <div className="h-6 w-px bg-[#202024] mx-2 hidden sm:block"></div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141416] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Jorge (Admin Director)</span>
              </div>
            </div>

            {/* Acciones Topbar */}
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
                id="btn-admin-logout"
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
        
        {/* Selector de Pestañas Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/20 pb-4 gap-4">
          <div className="flex items-center gap-1.5 bg-[#141416] p-1.5 rounded-2xl border border-white/5 shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('inventario')}
              id="tab-inventario"
              style={activeTab === 'inventario' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inventario'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Inventario y Métricas</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'inventario' ? 'bg-black text-[#D4AF37]' : 'bg-[#202024] text-slate-300'
              }`}>
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('asesores')}
              id="tab-asesores"
              style={activeTab === 'asesores' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'asesores'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Equipo de Asesores</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'asesores' ? 'bg-black text-[#D4AF37]' : 'bg-[#202024] text-slate-300'
              }`}>
                {advisors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              id="tab-leads"
              style={activeTab === 'leads' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Distribución de Leads (CRM)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'leads' ? 'bg-black text-[#D4AF37]' : 'bg-[#202024] text-[#D4AF37]'
              }`}>
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              id="tab-marketing"
              style={activeTab === 'marketing' ? { background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' } : {}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'marketing'
                  ? 'shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Generador de Enlaces UTM</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'inventario' && (
              <>
                <button
                  onClick={handleExportPropertiesCSV}
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#141416] hover:bg-[#1F1F24] border border-white/10 hover:border-[#D4AF37]/50 shadow-md transition-all cursor-pointer shrink-0"
                  title="Descargar base de datos en formato Excel/CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
                  <span>Exportar Excel</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  id="btn-admin-add-property"
                  style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Nueva Propiedad</span>
                </button>
              </>
            )}

            {activeTab === 'leads' && (
              <button
                onClick={handleExportLeadsCSV}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#141416] hover:bg-[#1F1F24] border border-white/10 hover:border-[#D4AF37]/50 shadow-md transition-all cursor-pointer shrink-0"
                title="Descargar prospectos en formato Excel/CSV"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Exportar Leads (CSV)</span>
              </button>
            )}

            {activeTab === 'asesores' && (
              <button
                onClick={() => setIsAdvisorModalOpen(true)}
                id="btn-admin-add-advisor"
                style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Nuevo Asesor</span>
              </button>
            )}
          </div>
        </div>

        {/* PESTAÑA 1: INVENTARIO Y MÉTRICAS */}
        {activeTab === 'inventario' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* TARJETAS KPI EN CARBÓN #141416 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* KPI 1: Clics WhatsApp */}
              <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black shadow-md shadow-[#D4AF37]/20">
                    <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/35">
                    Rastreo Activo
                  </span>
                </div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Clics a WhatsApp
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {totalWhatsAppClicks}
                  </span>
                  <span className="text-xs text-[#D4AF37] font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Prospectos
                  </span>
                </div>
              </div>

              {/* KPI 2: Utilidad Total Estimada */}
              <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/35 flex items-center justify-center font-black">
                    <DollarSign className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#202024] text-[#D4AF37] border border-white/5">
                    Margen Estimado
                  </span>
                </div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Utilidad Total en Catálogo
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {formatCurrency(totalUtilidad)}
                  </span>
                </div>
              </div>

              {/* KPI 3: Estatus Global */}
              <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#202024] text-slate-300 flex items-center justify-center font-black">
                    <Building2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {items.length} Inmuebles
                  </span>
                </div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Estado de Disponibilidad
                </span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5">
                    <span className="block text-lg font-black text-[#D4AF37]">{totalActivas}</span>
                    <span className="text-[10px] font-bold text-slate-300">Activas</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#202024] border border-white/5">
                    <span className="block text-lg font-black text-white">{totalEnTrato}</span>
                    <span className="text-[10px] font-bold text-slate-400">En Trato</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/30 text-white">
                    <span className="block text-lg font-black text-[#D4AF37]">{totalVendidas}</span>
                    <span className="text-[10px] font-bold text-slate-400">Vendidas</span>
                  </div>
                </div>
              </div>

            </div>

            {/* TABLA DE INVENTARIO EN CARBÓN #141416 */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">
                    Catálogo de Propiedades y Utilidades
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#202024] text-slate-300">
                    {filteredItems.length} registros
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar..."
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
                      <th className="py-3.5 px-4">Precio</th>
                      <th className="py-3.5 px-4 text-[#D4AF37]">Utilidad</th>
                      <th className="py-3.5 px-4 text-center">Clics WA</th>
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
                            <span className="font-bold text-white truncate max-w-[200px] block">
                              {prop.titulo}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 truncate max-w-[140px]">{prop.ubicacion}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black border border-[#D4AF37]/40 text-[#D4AF37]">
                            {prop.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {prop.precio_texto || formatCurrency(prop.precio)}
                        </td>
                        <td className="py-3.5 px-4 font-black text-[#D4AF37]">
                          {formatCurrency(prop.utilidad)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black border border-[#D4AF37]/30 text-[#D4AF37] font-black text-xs">
                            <MessageCircle className="w-3 h-3" />
                            {prop.whatsapp_clicks ?? 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={prop.estatus}
                            onChange={(e) => handleQuickStatusChange(prop.id, e.target.value)}
                            className="text-xs font-bold rounded-lg px-2 py-1 border border-white/10 cursor-pointer outline-none bg-[#0A0A0A] text-white focus:border-[#D4AF37]"
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
                            title="Editar propiedad"
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

        {/* PESTAÑA 2: EQUIPO DE ASESORES */}
        {activeTab === 'asesores' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                  Fuerza de Ventas
                </span>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  Gestión del Equipo Comercial
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Da de alta a nuevos vendedores y gestiona sus credenciales de acceso al portal.
                </p>
              </div>

              <button
                onClick={() => setIsAdvisorModalOpen(true)}
                style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Registrar Nuevo Asesor</span>
              </button>
            </div>

            {/* Tabla de Asesores */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>Asesores Comerciales Activos ({advisors.length})</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0A] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-5">ID</th>
                      <th className="py-3.5 px-5">Nombre del Asesor</th>
                      <th className="py-3.5 px-5">Correo Electrónico</th>
                      <th className="py-3.5 px-5">Teléfono / WhatsApp</th>
                      <th className="py-3.5 px-5">Fecha de Alta</th>
                      <th className="py-3.5 px-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {advisors.map((adv) => (
                      <tr key={adv.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-500">#{adv.id}</td>
                        <td className="py-4 px-5 font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#202024] text-[#D4AF37] font-black flex items-center justify-center border border-white/5">
                              {adv.name?.charAt(0)}
                            </div>
                            <span>{adv.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{adv.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{adv.telefono || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-500">
                          {adv.created_at ? new Date(adv.created_at).toLocaleDateString('es-MX') : 'Reciente'}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteAdvisor(adv.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/60 font-bold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Dar de Baja</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA DE RENDIMIENTO COMERCIAL / LEADERBOARD */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/25 shadow-xl overflow-hidden mt-6">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black">
                    <Trophy className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Rendimiento Comercial y Conversión de Ventas
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Métricas en tiempo real por asesor: asignaciones, visitas concretadas y efectividad de cierre.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0A] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-5">Posición</th>
                      <th className="py-3.5 px-5">Asesor Comercial</th>
                      <th className="py-3.5 px-5 text-center">Leads Asignados</th>
                      <th className="py-3.5 px-5 text-center">Citas Agendadas</th>
                      <th className="py-3.5 px-5 text-center text-[#D4AF37]">Ventas Cerradas</th>
                      <th className="py-3.5 px-5 text-right">Tasa de Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamPerformance.length > 0 ? (
                      teamPerformance.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                              idx === 0 ? 'bg-[#D4AF37] text-black shadow-md' :
                              idx === 1 ? 'bg-slate-300 text-black' :
                              idx === 2 ? 'bg-amber-700 text-white' : 'bg-[#202024] text-slate-400'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{item.name}</span>
                              {idx === 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400/20 text-[#D4AF37] border border-[#D4AF37]/30">
                                  Top Seller
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal">{item.email}</span>
                          </td>
                          <td className="py-4 px-5 text-center font-bold text-white">
                            {item.total_leads}
                          </td>
                          <td className="py-4 px-5 text-center font-bold text-blue-400">
                            {item.citas_count}
                          </td>
                          <td className="py-4 px-5 text-center font-black text-[#D4AF37] text-sm">
                            {item.cerrados_count}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-20 bg-[#0A0A0A] rounded-full h-2 overflow-hidden border border-white/10 hidden sm:block">
                                <div 
                                  className="bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#996515] h-full rounded-full" 
                                  style={{ width: `${Math.min(item.tasa_cierre, 100)}%` }}
                                />
                              </div>
                              <span className="font-black text-[#D4AF37]">{item.tasa_cierre}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No hay datos de rendimiento registrados aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA 3: DISTRIBUCIÓN DE LEADS (CRM) */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Tarjetas KPI de Leads */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-[#141416] border border-[#D4AF37]/20 shadow-xl">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Leads</span>
                <span className="text-2xl font-black text-white mt-1 block">{leadKpis.total}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#141416] border border-[#D4AF37]/30 shadow-xl">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Nuevos</span>
                <span className="text-2xl font-black text-[#D4AF37] mt-1 block">{leadKpis.nuevos}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 shadow-xl">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Contactados</span>
                <span className="text-2xl font-black text-white mt-1 block">{leadKpis.contactados}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 shadow-xl">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-400">Citas Agendadas</span>
                <span className="text-2xl font-black text-white mt-1 block">{leadKpis.citas}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/40 text-white shadow-xl col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Cerrados</span>
                <span className="text-2xl font-black text-[#D4AF37] mt-1 block">{leadKpis.cerrados}</span>
              </div>
            </div>

            {/* Filtros de Período y Búsqueda */}
            <div className="bg-[#141416] p-4 rounded-2xl border border-[#D4AF37]/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Filtrar por Fecha:</span>
                </span>
                <div className="inline-flex p-1 rounded-xl bg-[#0A0A0A] border border-white/10">
                  <button
                    onClick={() => setLeadPeriodFilter('todos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadPeriodFilter === 'todos' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Histórico
                  </button>
                  <button
                    onClick={() => setLeadPeriodFilter('hoy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadPeriodFilter === 'hoy' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => setLeadPeriodFilter('semana')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadPeriodFilter === 'semana' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Últimos 7 Días
                  </button>
                  <button
                    onClick={() => setLeadPeriodFilter('mes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadPeriodFilter === 'mes' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Este Mes
                  </button>
                </div>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar prospecto por nombre, tel, notas..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-medium text-white focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            {/* Tabla de Distribución de Leads */}
            <div className="bg-[#141416] rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">
                    Bandeja de Prospectos Entrantes ({filteredLeads.length})
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="py-2 pl-3 pr-8 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-bold text-slate-300 outline-none cursor-pointer focus:border-[#D4AF37]"
                  >
                    <option value="Todos">Todos los estatus</option>
                    <option value="Nuevo">Nuevos</option>
                    <option value="Contactado">Contactados</option>
                    <option value="Cita Agendada">Citas Agendadas</option>
                    <option value="Cerrado">Cerrados</option>
                    <option value="Descartado">Descartados</option>
                  </select>

                  <select
                    value={leadAdvisorFilter}
                    onChange={(e) => setLeadAdvisorFilter(e.target.value)}
                    className="py-2 pl-3 pr-8 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-bold text-slate-300 outline-none cursor-pointer focus:border-[#D4AF37]"
                  >
                    <option value="Todos">Todos los asesores</option>
                    {advisors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A0A] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Fecha / Registro</th>
                      <th className="py-3.5 px-4">Prospecto</th>
                      <th className="py-3.5 px-4">Teléfono / WhatsApp</th>
                      <th className="py-3.5 px-4">Propiedad & Cita</th>
                      <th className="py-3.5 px-4 text-[#D4AF37]">Asesor Asignado</th>
                      <th className="py-3.5 px-4">Estatus</th>
                      <th className="py-3.5 px-4">Canal / Notas</th>
                      <th className="py-3.5 px-4 text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead) => {
                      const cleanPhone = String(lead.cliente_telefono).replace(/\D/g, '');
                      const propTitle = lead.property?.titulo || 'Inmueble';

                      return (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            <div>{lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) : 'Reciente'}</div>
                            <span className="text-[10px] text-slate-600">{lead.created_at ? new Date(lead.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div>{lead.cliente_nombre}</div>
                            {lead.cliente_email && (
                              <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{lead.cliente_email}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {lead.cliente_telefono}
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px]">
                            <span className="font-semibold text-white block truncate" title={propTitle}>
                              {propTitle}
                            </span>
                            {lead.fecha_visita ? (
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-600/40 text-blue-300 text-[10px] font-bold">
                                <Calendar className="w-3 h-3" />
                                <span>Cita: {lead.fecha_visita} ({lead.turno_visita || 'Turno'})</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                {lead.property?.ciudad || 'Consulta general'}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.user_id || ''}
                              onChange={(e) => handleAssignAdvisor(lead.id, e.target.value)}
                              className="py-1.5 px-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#0A0A0A] text-[#D4AF37] text-xs font-bold outline-none cursor-pointer"
                            >
                              <option value="">-- Sin Asignar --</option>
                              {advisors.map((adv) => (
                                <option key={adv.id} value={adv.id}>
                                  {adv.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.estatus}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className="py-1 px-2 rounded-lg text-xs font-bold border border-white/10 bg-[#0A0A0A] text-white outline-none cursor-pointer focus:border-[#D4AF37]"
                            >
                              <option value="Nuevo">Nuevo</option>
                              <option value="Contactado">Contactado</option>
                              <option value="Cita Agendada">Cita Agendada</option>
                              <option value="Cerrado">Cerrado</option>
                              <option value="Descartado">Descartado</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 max-w-[180px]">
                            {lead.canal_utm && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-[#202024] text-[#D4AF37] border border-white/5 mb-1">
                                {lead.canal_utm}
                              </span>
                            )}
                            <div className="text-slate-400 truncate text-[11px]" title={lead.notas}>
                              {lead.notas || '-'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hola ${lead.cliente_nombre}, te contacto de RENACER - Grupo Inmobiliario sobre tu consulta de ${propTitle}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
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

        {/* PESTAÑA 4: GENERADOR DE ENLACES MARKETING / UTM */}
        {activeTab === 'marketing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDE68A] via-[#D4AF37] to-[#996515] text-black flex items-center justify-center font-black">
                  <Link2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Generador de Enlaces de Campaña (UTM & WhatsApp)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Crea enlaces rastreables para anuncios en Facebook, Instagram, TikTok o lonas con mensajes predefinidos automáticos.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Formulario de Configuración de UTM */}
              <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#D4AF37]" />
                  <span>Configuración de la Campaña</span>
                </h3>

                {/* Selección de Propiedad */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Propiedad a Promocionar
                  </label>
                  <select
                    value={utmPropertyId}
                    onChange={(e) => setUtmPropertyId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-bold text-white outline-none cursor-pointer focus:border-[#D4AF37]"
                  >
                    {items.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.titulo} ({prop.ciudad || prop.ubicacion}) - {formatCurrency(prop.precio)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Canal / Medio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Canal de Difusión
                    </label>
                    <select
                      value={utmCanal}
                      onChange={(e) => setUtmCanal(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs font-bold text-white outline-none cursor-pointer focus:border-[#D4AF37]"
                    >
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="Portal Inmobiliario">Portal Inmobiliario</option>
                      <option value="Lona / Cartelera Exterior">Lona / Cartelera Exterior</option>
                      <option value="Volante Impreso">Volante Impreso</option>
                      <option value="WhatsApp Masivo">WhatsApp Masivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nombre de la Campaña
                    </label>
                    <input
                      type="text"
                      value={utmCampana}
                      onChange={(e) => setUtmCampana(e.target.value)}
                      placeholder="Ej: promo_primavera_2026"
                      className="w-full py-2 px-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Teléfono de Recepción */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Teléfono Receptor (Asesor o Central)
                  </label>
                  <input
                    type="text"
                    value={utmAdvisorPhone}
                    onChange={(e) => setUtmAdvisorPhone(e.target.value)}
                    placeholder="526141234567"
                    className="w-full py-2 px-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Incluye clave de país (ej. 52 para México).
                  </p>
                </div>
              </div>

              {/* Vista Previa y Copia de Enlace */}
              <div className="bg-[#141416] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Vista Previa del Mensaje Rastreable</span>
                  </h3>

                  <div className="mt-4 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {`🏛️ *CONSULTA (${utmCanal.toUpperCase()}) - RENACER*\n` +
                    `📌 *Campaña:* ${utmCampana}\n` +
                    `🏡 *Propiedad:* ${items.find(p => String(p.id) === String(utmPropertyId))?.titulo || 'Inmueble'} (${items.find(p => String(p.id) === String(utmPropertyId))?.ciudad || 'Chihuahua'})\n\n` +
                    `Hola, vi este anuncio en ${utmCanal} y deseo recibir la ficha técnica y disponibilidad.`}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/30 text-xs text-slate-300 truncate font-mono">
                    {getGeneratedUtmLink()}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyUtmLink}
                      style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:brightness-95 transition-all cursor-pointer"
                    >
                      {isCopiedUtm ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>¡Enlace Copiado al Portapapeles!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 stroke-[2.5]" />
                          <span>Copiar Enlace para Anuncio</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getGeneratedUtmLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl text-xs font-bold text-slate-300 bg-[#202024] hover:bg-[#2A2A30] border border-white/10 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Probar</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODAL REGISTRAR ASESOR */}
      {isAdvisorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#141416] rounded-2xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden text-white">
            <div className="bg-[#0A0A0A] p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
                  Equipo Comercial
                </span>
                <h3 className="text-lg font-bold text-white">Registrar Nuevo Asesor</h3>
              </div>
              <button
                onClick={() => setIsAdvisorModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdvisor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={advisorForm.name}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, name: e.target.value })}
                  placeholder="Ej: Daniel Castillo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  required
                  value={advisorForm.email}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, email: e.target.value })}
                  placeholder="daniel@renacer.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Teléfono / WhatsApp Asignado
                </label>
                <input
                  type="text"
                  value={advisorForm.telefono}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, telefono: e.target.value })}
                  placeholder="526141234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={advisorForm.password}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAdvisorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #996515 100%)', color: '#000000' }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer hover:brightness-110"
                >
                  {loadingAction ? 'Guardando...' : 'Crear Asesor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROPIEDAD REUTILIZABLE */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={editingProperty}
        onSaved={handlePropertySaved}
        isAdmin={true}
      />

    </div>
  );
}
