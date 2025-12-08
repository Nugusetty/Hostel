import React, { useState } from 'react';
import { AppData, Floor, Room, Tenant } from '../types';
import { Plus, User, Trash2, Pencil, X, Save } from 'lucide-react';

interface RoomGridProps {
  data: AppData;
  onAddFloor: (name: string) => void;
  onAddRoom: (floorId: string, number: string, capacity: number) => void;
  onDeleteRoom: (roomId: string) => void;
  onEditRoom: (roomId: string, number: string, capacity: number) => void;
  onDeleteFloor: (floorId: string) => void;
  onEditFloor: (floorId: string, name: string) => void;
  onSelectRoom: (roomId: string) => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({ 
  data, 
  onAddFloor, 
  onAddRoom, 
  onDeleteRoom,
  onEditRoom,
  onDeleteFloor,
  onEditFloor,
  onSelectRoom 
}) => {
  // Add State
  const [newFloorName, setNewFloorName] = useState('');
  const [addingRoomToFloor, setAddingRoomToFloor] = useState<string | null>(null);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);

  // Edit State
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [editFloorName, setEditFloorName] = useState('');

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editRoomCapacity, setEditRoomCapacity] = useState(0);

  // Handlers - Add
  const handleAddFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFloorName.trim()) {
      onAddFloor(newFloorName);
      setNewFloorName('');
    }
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (addingRoomToFloor && newRoomNumber.trim()) {
      onAddRoom(addingRoomToFloor, newRoomNumber, newRoomCapacity);
      setAddingRoomToFloor(null);
      setNewRoomNumber('');
      setNewRoomCapacity(2);
    }
  };

  // Handlers - Edit Floor
  const startEditFloor = (floor: Floor) => {
    setEditingFloor(floor);
    setEditFloorName(floor.name);
  };

  const saveFloor = () => {
    if (editingFloor && editFloorName.trim()) {
      onEditFloor(editingFloor.id, editFloorName);
      setEditingFloor(null);
    }
  };

  // Handlers - Edit Room
  const startEditRoom = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setEditingRoom(room);
    setEditRoomNumber(room.number);
    setEditRoomCapacity(room.capacity);
  };

  const saveRoom = () => {
    if (editingRoom && editRoomNumber.trim() && editRoomCapacity > 0) {
      onEditRoom(editingRoom.id, editRoomNumber, editRoomCapacity);
      setEditingRoom(null);
    }
  };

  const getTenantsForRoom = (room: Room): Tenant[] => {
    return data.tenants.filter(t => t.roomId === room.id);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rooms & Floors</h2>
        <form onSubmit={handleAddFloor} className="flex gap-2">
          <input
            type="text"
            placeholder="New Floor Name"
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 md:w-auto"
            value={newFloorName}
            onChange={(e) => setNewFloorName(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center">
            <Plus size={16} className="mr-1" /> Add Floor
          </button>
        </form>
      </div>

      {data.floors.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
          <p>No floors added yet. Start by adding a floor above.</p>
        </div>
      )}

      {/* Floors List */}
      {data.floors.map(floor => (
        <div key={floor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg text-gray-700">{floor.name}</h3>
              <div className="flex space-x-1">
                <button onClick={() => startEditFloor(floor)} className="p-1 text-gray-400 hover:text-indigo-600 rounded">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDeleteFloor(floor.id)} className="p-1 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setAddingRoomToFloor(floor.id)}
              className="text-indigo-600 text-sm hover:text-indigo-800 font-medium flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Plus size={16} className="mr-1" /> Add Room
            </button>
          </div>

          <div className="p-6">
            {/* Add Room Form */}
            {addingRoomToFloor === floor.id && (
              <form onSubmit={handleAddRoom} className="mb-6 bg-indigo-50 p-4 rounded-lg flex flex-wrap gap-4 items-end animate-fade-in-down">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Room No.</label>
                  <input
                    type="text"
                    required
                    className="border rounded px-2 py-1 w-24"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="border rounded px-2 py-1 w-20"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(parseInt(e.target.value))}
                  />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">Save</button>
                <button 
                  type="button" 
                  onClick={() => setAddingRoomToFloor(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm px-2"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Rooms Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.rooms.filter(r => r.floorId === floor.id).map(room => {
                const roomTenants = getTenantsForRoom(room);
                const isFull = roomTenants.length >= room.capacity;
                
                return (
                  <div 
                    key={room.id} 
                    className={`
                      relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group
                      ${isFull ? 'border-red-100 bg-red-50' : 'border-green-100 bg-green-50'}
                    `}
                    onClick={() => onSelectRoom(room.id)}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-800 text-lg">{room.number}</span>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => startEditRoom(e, room)}
                            className="text-gray-400 hover:text-indigo-600 bg-white p-1 rounded shadow-sm"
                            title="Edit Room"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.id); }}
                            className="text-gray-400 hover:text-red-500 bg-white p-1 rounded shadow-sm"
                            title="Delete Room"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                     </div>
                     
                     <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className={`px-2 py-0.5 rounded-full ${isFull ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                          {roomTenants.length} / {room.capacity}
                        </span>
                     </div>

                     <div className="space-y-1">
                        {roomTenants.map(t => (
                          <div key={t.id} className="flex items-center text-xs text-gray-700">
                             <User size={12} className="mr-1 opacity-50" />
                             <span className="truncate">{t.name}</span>
                          </div>
                        ))}
                        {Array.from({ length: Math.max(0, room.capacity - roomTenants.length) }).map((_, i) => (
                           <div key={i} className="flex items-center text-xs text-gray-400 border-dashed border border-gray-300 rounded px-1 py-0.5">
                              Empty Bed
                           </div>
                        ))}
                     </div>
                  </div>
                );
              })}
              {data.rooms.filter(r => r.floorId === floor.id).length === 0 && !addingRoomToFloor && (
                <div className="col-span-full text-center text-gray-400 text-sm py-4 italic">
                  No rooms on this floor yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Edit Floor Modal */}
      {editingFloor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="bg-gray-100 px-6 py-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Edit Floor</h3>
              <button onClick={() => setEditingFloor(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor Name</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                value={editFloorName}
                onChange={(e) => setEditFloorName(e.target.value)}
              />
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setEditingFloor(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button onClick={saveFloor} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
             <div className="bg-gray-100 px-6 py-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Edit Room</h3>
              <button onClick={() => setEditingRoom(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editRoomCapacity}
                  onChange={(e) => setEditRoomCapacity(parseInt(e.target.value))}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setEditingRoom(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button onClick={saveRoom} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};