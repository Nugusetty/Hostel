import React, { useMemo } from 'react';
import { AppData } from '../types';
import { Users, Home, IndianRupee, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  data: AppData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalRooms = data.rooms.length;
    const totalTenants = data.tenants.length;
    const totalCapacity = data.rooms.reduce((acc, room) => acc + room.capacity, 0);
    const totalRevenue = data.tenants.reduce((acc, tenant) => acc + tenant.rent, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalTenants / totalCapacity) * 100) : 0;

    return { totalRooms, totalTenants, totalCapacity, totalRevenue, occupancyRate };
  }, [data]);

  const occupancyData = [
    { name: 'Occupied', value: stats.totalTenants },
    { name: 'Vacant', value: stats.totalCapacity - stats.totalTenants },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Tenants</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalTenants}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Rooms</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalRooms}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <PieChart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Occupancy Rate</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</h3>
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Occupancy Visualization</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={occupancyData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]}>
               {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#e2e8f0'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
