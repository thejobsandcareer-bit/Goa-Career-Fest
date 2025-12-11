import React from 'react';
import { CheckIcon } from './Icons';

const PERKS = [
  "Free job alerts & matched openings",
  "Free resume review (if opted-in)",
  "Exclusive priority access to Goa Job Fest 2026 employers",
  "Data secured & used only for job matching"
];

const PerksSection = () => (
  <div className="bg-white md:bg-transparent rounded-xl p-6 md:p-0 mt-8 md:mt-0 md:sticky md:top-24 h-fit">
     <h4 className="text-lg font-bold mb-4 uppercase text-gray-800">Why create a profile?</h4>
     <ul className="space-y-4">
       {PERKS.map((perk, i) => (
         <li key={i} className="flex items-start">
           <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
             <CheckIcon className="h-4 w-4 text-green-600" />
           </div>
           <span className="text-sm font-medium text-gray-700 leading-relaxed">{perk}</span>
         </li>
       ))}
     </ul>
     
     <div className="mt-8 pt-6 border-t border-gray-200">
       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Trusted By Top Employers</p>
       <div className="flex space-x-4 opacity-50 grayscale">
          {/* Placeholders for logos */}
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
       </div>
     </div>
  </div>
);

export default PerksSection;