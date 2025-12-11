import React from 'react';
import { WhatsAppIcon, InstagramIcon, LinkIcon } from './Icons';

interface Props {
  onClose: () => void;
  url: string;
}

const ShareModal: React.FC<Props> = ({ onClose, url }) => {
  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent("Check out the Goa Career Fest 2026! Create your profile now:");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl transform transition-all scale-100 animate-fade-in-up border-4 border-tjc-orange">
        <h3 className="text-2xl font-poppins font-black text-tjc-blue mb-6">Share with a Friend</h3>
        
        <div className="space-y-4">
          <a 
            href={`https://wa.me/?text=${shareText}%20${encodedUrl}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-[#25D366] hover:bg-[#1dbf57] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:-translate-y-1"
          >
            <WhatsAppIcon className="h-6 w-6 mr-3" />
            WhatsApp
          </a>

          <button 
            onClick={handleCopyLink} // Instagram doesn't have a direct web share link, copying is best
            className="flex items-center justify-center w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:-translate-y-1"
          >
             <InstagramIcon className="h-6 w-6 mr-3" />
             Instagram / DM
          </button>
          
          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition-all border-2 border-gray-200"
          >
            <LinkIcon className="h-5 w-5 mr-3" />
            Copy Link
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 text-sm font-bold text-gray-400 hover:text-gray-600 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShareModal;