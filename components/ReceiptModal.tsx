import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, QrCode, Save, Edit2, Upload, Trash } from 'lucide-react';
import { Tenant, Room, AppSettings } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  room: Room | null;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  isOpen, 
  onClose, 
  tenant, 
  room,
  settings,
  onUpdateSettings
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen || !tenant) return null;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  // QR Code URL (UPI)
  // Format: upi://pay?pa=<upi_id>&pn=<name>&am=<amount>&cu=INR
  const qrData = `upi://pay?pa=${localSettings.upiId}&pn=${encodeURIComponent(localSettings.hostelName)}&am=${tenant.rent}&cu=INR`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Rent Receipt - ${tenant.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Inter', sans-serif; padding: 20px; background: white; }
              .print-container { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 40px; }
              @media print {
                @page { margin: 0; }
                body { padding: 2cm; }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent}
            </div>
            <script>
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, customQrCode: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomQr = () => {
    setLocalSettings(prev => ({ ...prev, customQrCode: undefined }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Rent Receipt Preview</h3>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-300 hover:text-white flex items-center gap-1 text-sm bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Settings Editor (Visible only when editing) */}
        {isEditing && (
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 shrink-0 animate-fade-in-down overflow-y-auto max-h-[200px]">
            <h4 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <Edit2 size={14} /> Edit Hostel & Payment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hostel Name</label>
                <input 
                  type="text" 
                  value={localSettings.hostelName}
                  onChange={(e) => setLocalSettings({...localSettings, hostelName: e.target.value})}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Signature Name</label>
                <input 
                  type="text" 
                  value={localSettings.signatureText || ''}
                  onChange={(e) => setLocalSettings({...localSettings, signatureText: e.target.value})}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                  placeholder="e.g. Hari N"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={localSettings.address}
                  onChange={(e) => setLocalSettings({...localSettings, address: e.target.value})}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={localSettings.contactNumber}
                  onChange={(e) => setLocalSettings({...localSettings, contactNumber: e.target.value})}
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment QR Code</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                     <p className="text-[10px] text-gray-500 mb-1">Dynamic generation based on UPI ID:</p>
                     <input 
                        type="text" 
                        value={localSettings.upiId}
                        onChange={(e) => setLocalSettings({...localSettings, upiId: e.target.value})}
                        className="w-full border rounded px-2 py-1.5 text-sm mb-2"
                        placeholder="e.g. name@upi"
                      />
                  </div>
                  <div className="flex-1 border-l pl-4">
                      <p className="text-[10px] text-gray-500 mb-1">OR Upload Custom Image (Screenshot):</p>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-white border border-gray-300 rounded px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-1">
                          <Upload size={12} /> Choose File
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        {localSettings.customQrCode && (
                          <button onClick={removeCustomQr} className="text-red-500 hover:bg-red-50 p-1.5 rounded" title="Remove Custom QR">
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                      {localSettings.customQrCode && <p className="text-[10px] text-green-600 mt-1">✓ Custom image loaded</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Printable Area */}
        <div className="overflow-y-auto p-8 bg-gray-50 flex-1">
          <div ref={receiptRef} className="bg-white p-8 shadow-sm border border-gray-200 mx-auto max-w-lg relative">
             {/* Receipt Header */}
             <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  {/* Simplified Logo for Print */}
                  <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-white font-bold text-xl">
                    H
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{localSettings.hostelName}</h1>
                    <p className="text-xs text-gray-500 max-w-[200px] leading-tight mt-1">{localSettings.address}</p>
                    <p className="text-xs text-gray-500 mt-1">Ph: {localSettings.contactNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-indigo-600 uppercase tracking-widest">Receipt</h2>
                  <p className="text-sm font-mono text-gray-500 mt-1">#{receiptNo}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">{currentDate}</p>
                </div>
             </div>

             {/* Receipt Body */}
             <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-sm">Received with thanks from</span>
                  <span className="text-lg font-bold text-gray-800 border-b border-dotted border-gray-400 px-2 flex-1 text-right">{tenant.name}</span>
                </div>

                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                   <div className="w-full">
                    <span className="text-gray-500 text-sm block mb-1">The Sum of Rupees</span>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="font-bold text-xl text-gray-900">₹ {tenant.rent.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 italic">/- (Cash / UPI / Online)</span>
                    </div>
                   </div>
                </div>

                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-sm">Towards Rent for Room No.</span>
                  <span className="text-lg font-bold text-indigo-600 border-b border-dotted border-gray-400 px-2 flex-1 text-right">{room?.number || 'N/A'}</span>
                </div>

                {/* QR Code Section */}
                <div className="mt-8 flex justify-between items-end pt-4">
                  <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                     {localSettings.customQrCode ? (
                       <img 
                          src={localSettings.customQrCode}
                          alt="Custom Payment QR"
                          className="w-32 h-32 object-contain"
                       />
                     ) : (
                       <img 
                          src={dynamicQrCodeUrl} 
                          alt="Payment QR" 
                          className="w-24 h-24 mix-blend-multiply"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                     )}
                     <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-medium">
                        <QrCode size={12} />
                        <span>Scan to Pay</span>
                     </div>
                  </div>

                  <div className="text-center">
                    <div className="h-12 flex items-end justify-center pb-1">
                      {localSettings.signatureText ? (
                        <span className="font-script text-xl text-indigo-900 font-bold border-b border-gray-400 px-4">{localSettings.signatureText}</span>
                      ) : (
                        <div className="border-b border-gray-400 w-32"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mt-1">Signature</span>
                  </div>
                </div>
             </div>
             
             {/* Footer */}
             <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">Thank you for your payment!</p>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
          >
            <Printer size={18} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};