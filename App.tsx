import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JobSurveyForm from './components/JobSurveyForm';
import SuccessModal from './components/SuccessModal';
import ShareModal from './components/ShareModal';
import { COPY, GOOGLE_APPS_SCRIPT_URL } from './constants';
import { ShareIcon, DoodleStar, DoodleSpiral } from './components/Icons';
import { SurveyFormData } from './types';

const App: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [submittedData, setSubmittedData] = useState<SurveyFormData | undefined>(undefined);
  const [shareUrl, setShareUrl] = useState('https://goacareerfest.com/');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we are in demo mode (URL is not configured)
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes("YOUR_WEB_APP_URL_HERE")) {
      setIsDemoMode(true);
    }

    // Only use window.location.href if it's a valid http/https URL (prevents blob/srcdoc errors)
    if (window.location.href.startsWith('http')) {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleSuccess = (data: SurveyFormData) => {
    setSubmittedData(data);
    setShowSuccess(true);
  };

  const scrollToForm = () => {
    const el = document.getElementById('survey-form');
    el?.scrollIntoView({ behavior: 'smooth' });
  };
return (
  <div className="min-h-screen flex flex-col font-sans bg-gray-50 relative pb-10">
    <h1 style={{color: 'red', fontSize: '50px', zIndex: 9999, position: 'relative'}}>
      TEST: CAN YOU SEE ME?
    </h1>
    <Header />
    ...
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 relative pb-10">
      <Header />

      {/* Hero Section */}
      <div className="bg-tjc-blue text-white py-12 md:py-20 relative overflow-hidden">
        {/* Abstract Background Shapes (Mixed Colors) */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-900 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-tjc-orange rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        {/* Doodles */}
        <div className="absolute top-20 left-10 text-tjc-orange opacity-20 animate-float hidden md:block">
           <DoodleStar className="h-16 w-16" />
        </div>
        <div className="absolute bottom-20 right-10 text-blue-300 opacity-20 animate-float hidden md:block" style={{animationDelay: '1s'}}>
           <DoodleSpiral className="h-24 w-24" />
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          
          {/* Illustrative Characters (SVG Representation) */}
          <div className="flex justify-center items-end -mb-4 space-x-2 md:space-x-4 opacity-90">
             {/* Character 1 */}
             <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="transform translate-y-2">
                <circle cx="30" cy="25" r="15" fill="#ffcdb2" />
                <path d="M5 80v-20c0-10 10-15 25-15s25 5 25 15v20H5z" fill="#ff6100" />
             </svg>
             {/* Character 2 (Center) */}
             <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="z-10">
                <circle cx="40" cy="30" r="20" fill="#e29578" />
                <path d="M10 100v-30c0-15 15-20 30-20s30 5 30 20v30H10z" fill="#ffffff" />
                <rect x="35" y="60" width="10" height="40" fill="#040084" opacity="0.1" />
             </svg>
             {/* Character 3 */}
             <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="transform translate-y-2">
                <circle cx="30" cy="25" r="15" fill="#8d5524" />
                <path d="M5 80v-20c0-10 10-15 25-15s25 5 25 15v20H5z" fill="#4dabf7" />
             </svg>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg font-poppins relative">
            <span className="relative z-10">{COPY.HEADLINE}</span>
            <svg className="absolute -bottom-2 w-full h-4 text-tjc-orange opacity-60 z-0 left-0" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C2.00025 6.99997 101.5 0.500018 198 2.00002" stroke="currentColor" strokeWidth="3"/></svg>
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-100 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            {COPY.SUBHEADLINE}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={scrollToForm}
              className="bg-tjc-orange hover:bg-orange-500 text-white font-poppins font-bold py-4 px-10 rounded-full text-lg shadow-[0_10px_40px_-10px_rgba(255,97,0,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105 w-full sm:w-auto ring-4 ring-orange-500/30"
            >
              Create My Profile
            </button>
            <button 
              onClick={() => setShowShare(true)}
              className="flex items-center text-white hover:text-tjc-orange font-semibold transition-colors py-3 px-6 rounded-full border-2 border-white/30 hover:bg-white hover:border-white w-full sm:w-auto justify-center"
            >
              <ShareIcon className="h-5 w-5 mr-2" /> Share with a friend
            </button>
          </div>
          
          <p className="mt-8 text-xs text-blue-200/80 flex items-center justify-center font-medium tracking-wide">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></span>
            {COPY.MICROTEXT}
          </p>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-[0] rotate-180">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
            </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow -mt-4 pb-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto" id="survey-form">
               <JobSurveyForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-tjc-blue text-blue-200 py-12 text-center text-sm border-t border-blue-900">
        <p className="font-medium">&copy; 2026 The Jobs & Career (TJC). All rights reserved.</p>
        <div className="mt-6 space-x-6">
          <a href="#" className="hover:text-white transition-colors underline decoration-blue-500 underline-offset-4">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors underline decoration-blue-500 underline-offset-4">Terms of Service</a>
        </div>
      </footer>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} data={submittedData} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} url={shareUrl} />}
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="fixed bottom-0 left-0 w-full bg-yellow-400 text-black p-3 text-center text-xs font-bold z-[100] shadow-lg border-t-2 border-yellow-500">
          ⚠️ DEMO MODE: Backend not connected. Data will not be saved to Google Sheets. 
          <span className="hidden md:inline ml-1">Deploy the Apps Script and update constants.ts to go live.</span>
        </div>
      )}
    </div>
  );
};

export default App;
