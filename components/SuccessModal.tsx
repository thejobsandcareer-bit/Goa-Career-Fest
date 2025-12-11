import React from 'react';
import { COPY } from '../constants';
import { CheckIcon, ShareIcon } from './Icons';
import { SurveyFormData } from '../types';

interface Props {
  onClose: () => void;
  data?: SurveyFormData;
}

const SuccessModal: React.FC<Props> = ({ onClose, data }) => {
  const handleShare = async () => {
    // Determine the URL to share. Fallback to production URL if current is invalid (e.g. in preview).
    let shareUrl = window.location.href;
    if (!shareUrl.startsWith('http')) {
       shareUrl = 'https://goacareerfest.com/';
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Goa Career Fest 2026',
          text: 'Still searching for a job? Create your profile in 45 seconds.',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard failed", err);
        prompt("Copy this link:", shareUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl transform transition-all scale-100 border border-gray-100 relative overflow-hidden my-8">
        {/* Decorative background circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white mb-6 shadow-xl ring-4 ring-blue-50">
          <CheckIcon className="h-10 w-10 text-green-500" />
        </div>
        
        <h2 className="relative z-10 text-3xl font-black text-tjc-blue mb-2">Thank You!</h2>
        <p className="relative z-10 text-gray-600 mb-8 leading-relaxed font-medium">
          Your profile has been successfully created.
        </p>

        {/* Profile Card Preview */}
        {data && (
           <div className="relative z-10 bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 shadow-inner">
              <div className="flex items-center space-x-4 mb-4">
                 <div className="h-16 w-16 rounded-full bg-gray-200 border-2 border-white shadow flex-shrink-0 overflow-hidden">
                    {data.photoBase64 ? (
                      <img src={data.photoBase64} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                         {data.fullName.charAt(0)}
                      </div>
                    )}
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-tjc-blue font-poppins leading-tight">{data.fullName}</h3>
                    <p className="text-sm text-gray-500">{data.location}</p>
                    <p className="text-xs text-tjc-orange font-bold uppercase mt-1">{data.currentStatus}</p>
                 </div>
              </div>
              
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Qualification</span>
                    <span className="font-medium text-gray-800">{data.qualification}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Looking For</span>
                    <span className="font-medium text-gray-800 text-right truncate w-1/2">{data.jobRoles[0]} {data.jobRoles.length > 1 && `+${data.jobRoles.length - 1}`}</span>
                 </div>
                 <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Expected Salary</span>
                    <span className="font-medium text-gray-800">{data.salaryExpectation}</span>
                 </div>
              </div>
           </div>
        )}

        <div className="relative z-10 space-y-4">
          <button 
             onClick={handleShare}
             className="block w-full bg-tjc-orange hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-1"
          >
             Share Profile Link
          </button>
          
          <button 
             onClick={onClose}
             className="block w-full text-gray-400 hover:text-gray-600 font-bold py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;