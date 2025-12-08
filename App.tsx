import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  Settings, 
  Menu, 
  X,
  Smartphone,
  LogOut,
  Pencil,
  Trash2,
  Download,
  FileText
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { RoomGrid } from './components/RoomGrid';
import { TenantModal } from './components/TenantModal';
import { AIAssistant } from './components/AIAssistant';
import { InstallModal } from './components/InstallModal';
import { ReceiptModal } from './components/ReceiptModal';
import { Logo } from './components/Logo';
import { AppData, Floor, Room, Tenant, ViewState, AppSettings } from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_DATA: AppData = {
  floors: [
    { id: 'f1', name: 'Ground Floor', rooms: ['r1', 'r2'] },
    { id: 'f2', name: 'First Floor', rooms: ['r3', 'r4'] }
  ],
  rooms: [
    { id: 'r1', number: '101', floorId: 'f1', capacity: 2, tenants: [] },
    { id: 'r2', number: '102', floorId: 'f1', capacity: 3, tenants: [] },
    { id: 'r3', number: '201', floorId: 'f2', capacity: 2, tenants: [] },
    { id: 'r4', number: '202', floorId: 'f2', capacity: 1, tenants: [] }
  ],
  tenants: [],
  settings: {
    hostelName: 'Hari PG Hostel',
    address: '29, PR Layout, Chandra Layout, Marathahalli, Bengaluru, Karnataka 560037',
    upiId: 'harihostel@upi',
    contactNumber: '9876543210',
    signatureText: 'Hari N'
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('hariPgData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure settings exist for older saves
      if (!parsed.settings) {
        parsed.settings = INITIAL_DATA.settings;
      }
      return parsed;
    }
    return INITIAL_DATA;
  });
  
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for Tenant Modal
  const [selectedRoomIdForTenant, setSelectedRoomIdForTenant] = useState<string | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  // State for Install Modal
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // State for Receipt Modal
  const [receiptTenant, setReceiptTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    localStorage.setItem('hariPgData', JSON.stringify(data));
  }, [data]);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const updateSettings = (newSettings: AppSettings) => {
    setData(prev => ({ ...prev, settings: newSettings }));
  };

  // --- Floor Actions ---
  const addFloor = (name: string) => {
    const newFloor: Floor = { id: generateId(), name, rooms: [] };
    setData(prev => ({ ...prev, floors: [...prev.floors, newFloor] }));
  };

  const deleteFloor = (floorId: string) => {
    if (window.confirm("Delete this floor? All rooms and tenants in it will be removed.")) {
      setData(prev => {
        const floorRooms = prev.rooms.filter(r => r.floorId === floorId).map(r => r.id);
        return {
          ...prev,
          floors: prev.floors.filter(f => f.id !== floorId),
          rooms: prev.rooms.filter(r => r.floorId !== floorId),
          tenants: prev.tenants.filter(t => !floorRooms.includes(t.roomId))
        };
      });
    }
  };

  const editFloor = (floorId: string, name: string) => {
    setData(prev => ({
      ...prev,
      floors: prev.floors.map(f => f.id === floorId ? { ...f, name } : f)
    }));
  };

  // --- Room Actions ---
  const addRoom = (floorId: string, number: string, capacity: number) => {
    const newRoom: Room = { id: generateId(), number, floorId, capacity, tenants: [] };
    setData(prev => ({ 
      ...prev, 
      rooms: [...prev.rooms, newRoom],
      floors: prev.floors.map(f => f.id === floorId ? { ...f, rooms: [...f.rooms, newRoom.id] } : f)
    }));
  };

  const deleteRoom = (roomId: string) => {
    if (window.confirm("Are you sure? This will remove the room and its tenants.")) {
      setData(prev => ({
        ...prev,
        rooms: prev.rooms.filter(r => r.id !== roomId),
        tenants: prev.tenants.filter(t => t.roomId !== roomId)
      }));
    }
  };

  const editRoom = (roomId: string, number: string, capacity: number) => {
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, number, capacity } : r)
    }));
  };

  // --- Tenant Actions ---
  const handleSaveTenant = (tenantData: Omit<Tenant, 'id'> | Tenant) => {
    if ('id' in tenantData) {
      // Edit existing
      setData(prev => ({
        ...prev,
        tenants: prev.tenants.map(t => t.id === tenantData.id ? tenantData as Tenant : t)
      }));
    } else {
      // Add new
      const newTenant: Tenant = { ...tenantData, id: generateId() } as Tenant;
      setData(prev => ({
        ...prev,
        tenants: [...prev.tenants, newTenant],
        rooms: prev.rooms.map(r => 
          r.id === tenantData.roomId ? { ...r, tenants: [...r.tenants, newTenant.id] } : r
        )
      }));
    }
    // Reset states
    setEditingTenant(null);
    setSelectedRoomIdForTenant(null);
  };

  const removeTenant = (tenantId: string) => {
    if(window.confirm("Remove this tenant?")) {
      setData(prev => ({
        ...prev,
        tenants: prev.tenants.filter(t => t.id !== tenantId),
        rooms: prev.rooms.map(r => ({ ...r, tenants: r.tenants.filter(tid => tid !== tenantId) }))
      }));
    }
  };

  const startEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
  };

  // --- UI Handlers ---
  const handleRoomClick = (roomId: string) => {
    const room = data.rooms.find(r => r.id === roomId);
    if (!room) return;
    
    // Calculate current occupancy
    const currentTenants = data.tenants.filter(t => t.roomId === roomId).length;
    
    if (currentTenants < room.capacity) {
      setSelectedRoomIdForTenant(roomId);
      setEditingTenant(null); // Ensure we are not in edit mode
    } else {
      alert("Room is fully occupied!");
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === view ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <Logo />
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={ViewState.ROOMS} icon={BedDouble} label="Rooms & Floors" />
            <NavItem view={ViewState.TENANTS} icon={Users} label="All Tenants" />
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
             <button 
                onClick={handleInstallClick}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 group hover:text-indigo-600"
             >
                <div className={`transition-transform ${deferredPrompt ? 'scale-110 text-indigo-600' : ''}`}>
                  {deferredPrompt ? <Download size={20} /> : <Smartphone size={20} />}
                </div>
                <span className={deferredPrompt ? "font-bold text-indigo-600" : ""}>
                  {deferredPrompt ? "Install Now" : "Get Mobile App"}
                </span>
             </button>
             <div className="text-xs text-center text-gray-400 mt-4">
                v1.2.1 &copy; 2024
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" showText={false} />
            <span className="font-bold text-gray-800">Hari PG</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {currentView === ViewState.DASHBOARD && <Dashboard data={data} />}
          
          {currentView === ViewState.ROOMS && (
            <RoomGrid 
              data={data} 
              onAddFloor={addFloor} 
              onAddRoom={addRoom}
              onDeleteRoom={deleteRoom}
              onEditRoom={editRoom}
              onDeleteFloor={deleteFloor}
              onEditFloor={editFloor}
              onSelectRoom={handleRoomClick}
            />
          )}

          {currentView === ViewState.TENANTS && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">All Tenants</h2>
                  <span className="text-sm text-gray-500">{data.tenants.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Room</th>
                        <th className="px-6 py-3">Mobile</th>
                        <th className="px-6 py-3">Rent</th>
                        <th className="px-6 py-3">Joined</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.tenants.map(tenant => {
                        const room = data.rooms.find(r => r.id === tenant.roomId);
                        return (
                          <tr key={tenant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">{tenant.name}</td>
                            <td className="px-6 py-4 text-indigo-600 font-medium">#{room?.number || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-600">{tenant.mobile}</td>
                            <td className="px-6 py-4 text-gray-600">₹{tenant.rent}</td>
                            <td className="px-6 py-4 text-gray-600">{tenant.joiningDate}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => setReceiptTenant(tenant)}
                                  className="text-green-600 hover:text-green-800 p-1.5 rounded bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-1 text-xs font-medium"
                                  title="Receipt"
                                >
                                  <FileText size={14} /> Receipt
                                </button>
                                <button 
                                  onClick={() => startEditTenant(tenant)}
                                  className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={() => removeTenant(tenant.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                                  title="Remove"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {data.tenants.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                            No tenants found. Go to Rooms view to add tenants to empty beds.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <TenantModal 
        isOpen={!!selectedRoomIdForTenant || !!editingTenant} 
        selectedRoom={data.rooms.find(r => r.id === (editingTenant?.roomId || selectedRoomIdForTenant)) || null}
        initialData={editingTenant}
        onClose={() => {
          setSelectedRoomIdForTenant(null);
          setEditingTenant(null);
        }}
        onSave={handleSaveTenant}
      />

      <InstallModal 
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <ReceiptModal 
        isOpen={!!receiptTenant}
        onClose={() => setReceiptTenant(null)}
        tenant={receiptTenant}
        room={data.rooms.find(r => r.id === receiptTenant?.roomId) || null}
        settings={data.settings}
        onUpdateSettings={updateSettings}
      />

      <AIAssistant data={data} />
    </div>
  );
};

export default App;