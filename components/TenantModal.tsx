import React, { useState, useEffect } from 'react';
import { Room, Tenant } from '../types';
import { X, Save } from 'lucide-react';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Omit<Tenant, 'id'> | Tenant) => void;
  selectedRoom: Room | null;
  initialData?: Tenant | null;
}

export const TenantModal: React.FC<TenantModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedRoom,
  initialData 
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [rent, setRent] = useState(5000);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setMobile(initialData.mobile);
        setRent(initialData.rent);
        setJoiningDate(initialData.joiningDate);
      } else {
        setName('');
        setMobile('');
        setRent(5000);
        setJoiningDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tenantData = {
      name,
      mobile,
      rent,
      joiningDate,
      roomId: selectedRoom?.id || initialData?.roomId || ''
    };

    if (initialData) {
      // Editing existing tenant
      onSave({ ...tenantData, id: initialData.id });
    } else {
      // Adding new tenant
      onSave(tenantData);
    }
    onClose();
  };

  const title = initialData 
    ? 'Edit Tenant Details' 
    : `Add Tenant to Room ${selectedRoom?.number || ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-indigo-100 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input 
              type="tel" 
              required
              pattern="[0-9]{10}"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
            <input 
              type="date" 
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'Update Tenant' : 'Save Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};