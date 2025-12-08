import React, { useState, useEffect } from 'react';
import { X, Smartphone, Share, MoreVertical, PlusSquare, Globe, QrCode, Copy, Check, Link as LinkIcon, AlertCircle, Cloud, Github, ArrowRight } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'link'>('guide');
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);
  const [showDeployHelp, setShowDeployHelp] = useState(false);
  
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const current = window.location.href;
      setShareUrl(current);
      // Automatically show help if on a preview link
      if (current.includes('localhost') || current.startsWith('blob:') || current.includes('127.0.0.1')) {
        setShowDeployHelp(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const qrCodeUrl = shareUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : null;

  const isLocalOrBlob = shareUrl.startsWith('blob:') || shareUrl.includes('localhost') || shareUrl.includes('127.0.0.1');

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: 'Hari PG Hostel Manager',
          text: 'Install the Hari PG Hostel Manager App to manage tenants and receipts!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Smartphone size={20} /> Install Hari PG
          </h3>
          <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'guide' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Step-by-Step Guide
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'link' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Get App Link
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'guide' ? (
            <div className="animate-fade-in">
              <p className="text-gray-600 text-sm mb-4">
                This is a Web App. You don't need the Play Store! Just follow these steps to add it to your home screen.
              </p>

              {/* Platform Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setPlatform('android')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    platform === 'android' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Android (Chrome)
                </button>
                <button
                  onClick={() => setPlatform('ios')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    platform === 'ios' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  iOS (Safari)
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {platform === 'android' ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">1. Open in Chrome</h4>
                        <p className="text-sm text-gray-500">Ensure the app link is open in <b>Google Chrome</b>.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <MoreVertical size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">2. Open Menu</h4>
                        <p className="text-sm text-gray-500">Tap the <b>three dots</b> in the top-right corner.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">3. Install App</h4>
                        <p className="text-sm text-gray-500">Select <b>"Install App"</b> or <b>"Add to Home Screen"</b>.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">1. Open in Safari</h4>
                        <p className="text-sm text-gray-500">Open the app link in the Safari browser.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <Share size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">2. Tap Share</h4>
                        <p className="text-sm text-gray-500">Tap the <b>Share icon</b> at the bottom of the screen.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 mt-1">
                        <PlusSquare size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">3. Add to Home Screen</h4>
                        <p className="text-sm text-gray-500">Scroll down and select <b>"Add to Home Screen"</b>.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center animate-fade-in space-y-6">
              {/* Show Deployment Guide if toggle is on or automatically if local */}
              {showDeployHelp ? (
                <div className="w-full bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-left">
                  <div className="flex justify-between items-start mb-3">
                     <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                       <Cloud size={18} /> How to Deploy Free
                     </h4>
                     <button onClick={() => setShowDeployHelp(false)} className="text-indigo-400 hover:text-indigo-600 text-xs underline">
                       Show QR
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">1</div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Download Code</p>
                        <p className="text-[10px] text-gray-600">Download the project files from this editor to your computer.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">2</div>
                      <div>
                         <p className="text-xs font-bold text-gray-800 flex items-center gap-1"><Github size={10} /> Upload to GitHub</p>
                         <p className="text-[10px] text-gray-600">Create a repository on GitHub.com and upload your files.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">3</div>
                      <div>
                         <p className="text-xs font-bold text-gray-800">Deploy on Netlify</p>
                         <p className="text-[10px] text-gray-600">Go to Netlify.com → "Import from GitHub". It will auto-detect React. Click Deploy.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-indigo-100">
                    <p className="text-[10px] text-indigo-700 italic">
                      Once deployed, Netlify will give you a public URL (e.g., <b>hari-pg.netlify.app</b>). Paste that URL below!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900">Scan to Install</h4>
                    <p className="text-sm text-gray-500">
                      {shareUrl 
                        ? "Scan this QR code with your mobile camera to open the app." 
                        : "Enter your deployed app URL below to generate a QR code."}
                    </p>
                  </div>
                  
                  <div className="p-4 border-2 border-indigo-100 rounded-xl bg-indigo-50 min-h-[200px] flex items-center justify-center transition-all relative">
                    {shareUrl ? (
                      <img src={qrCodeUrl!} alt="App QR" className="w-48 h-48 mix-blend-multiply animate-fade-in" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center gap-2">
                        <QrCode size={48} className="text-indigo-200" />
                        <span className="text-xs text-gray-400">QR Code Preview</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="w-full space-y-2">
                 <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 text-left font-medium">App Link</p>
                    {isLocalOrBlob && !showDeployHelp && (
                      <button onClick={() => setShowDeployHelp(true)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                        <AlertCircle size={12} /> How to fix preview link?
                      </button>
                    )}
                 </div>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={16} className="text-gray-400" />
                      </div>
                      <input 
                        value={shareUrl} 
                        onChange={(e) => setShareUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-10 bg-white border border-gray-300 rounded-lg py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    <button 
                      onClick={handleCopy}
                      disabled={!shareUrl}
                      className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 disabled:opacity-50"
                      title="Copy Link"
                    >
                      {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                    </button>
                 </div>
                 
                 <button 
                    onClick={handleShare}
                    disabled={!shareUrl}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 mt-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                 >
                   <Share size={18} /> Share Download Link
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end shrink-0 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};