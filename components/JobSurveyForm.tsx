import React, { useState, useEffect, useRef } from 'react';
import { SurveyFormData, SECTIONS } from '../types';
import { 
  AGE_GROUPS, LOCATIONS, EMPLOYMENT_STATUS, EXPERIENCE_YEARS, 
  QUALIFICATIONS, SKILLS_LIST, INDUSTRIES, JOB_CATEGORIES, WORK_TYPES, 
  SALARY_RANGES, AVAILABILITY, CHALLENGES_LIST 
} from '../constants';
import { submitSurvey } from '../services/googleSheetService';
import { UploadIcon, FileIcon, TrashIcon, CheckIcon, AlertIcon, ShieldIcon } from './Icons';

const INITIAL_DATA: SurveyFormData = {
  fullName: '', mobile: '', email: '', ageGroup: '', location: '',
  currentStatus: '', experienceYears: '', currentJobTitle: '',
  qualification: '', skills: [], 
  industry: '', jobRoles: [], // Updated initial state
  workType: '',
  salaryExpectation: '', joinAvailability: '', challenges: [],
  resume: null, linkedIn: '', photo: null
};

interface Props {
  onSuccess: (data: SurveyFormData) => void;
}

const JobSurveyForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SurveyFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Location Search State
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Autosave load
  useEffect(() => {
    const saved = localStorage.getItem('goaJobFestProfile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData({ 
          ...INITIAL_DATA, 
          ...parsed, 
          resume: null, resumeBase64: undefined, resumeName: undefined,
          photo: null, photoBase64: undefined, photoName: undefined
        });
        if (parsed.location) setLocationSearch(parsed.location);
      } catch (e) {
        console.error("Failed to load autosave");
      }
    }
  }, []);

  // Autosave save
  useEffect(() => {
    const toSave = { 
      ...formData, 
      resume: undefined, resumeBase64: undefined,
      photo: undefined, photoBase64: undefined 
    };
    localStorage.setItem('goaJobFestProfile', JSON.stringify(toSave));
  }, [formData]);

  // Close location dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = field ? { ...errors } : {};
    const rules = {
      fullName: (val: string) => !val ? "Full Name is required" : "",
      mobile: (val: string) => !/^[0-9]{10}$/.test(val) ? "Please enter a valid 10-digit mobile number" : "",
      location: (val: string) => !val ? "Please select your location" : "",
      ageGroup: (val: string) => !val ? "Please select your age group" : "",
      currentStatus: (val: string) => !val ? "Please select your status" : "",
      qualification: (val: string) => !val ? "Qualification is required" : "",
      industry: (val: string) => !val ? "Industry selection is required" : "",
      workType: (val: string) => !val ? "Preferred work type is required" : "",
      salaryExpectation: (val: string) => !val ? "Salary expectation is required" : "",
      joinAvailability: (val: string) => !val ? "Availability is required" : "",
    };

    if (field && rules[field as keyof typeof rules]) {
      const error = rules[field as keyof typeof rules](formData[field as keyof SurveyFormData] as string);
      if (error) newErrors[field] = error;
      else delete newErrors[field];
    } else if (!field) {
      Object.keys(rules).forEach(key => {
        const error = rules[key as keyof typeof rules](formData[key as keyof SurveyFormData] as string);
        if (error) newErrors[key] = error;
      });
      if (formData.skills.length === 0) newErrors.skills = "Select at least one skill";
      if (formData.jobRoles.length === 0) newErrors.jobRoles = "Select at least one job role";
      if (formData.challenges.length === 0) newErrors.challenges = "Select at least one challenge";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field);
  };

  const handleChange = (field: keyof SurveyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleIndustryChange = (val: string) => {
      setFormData(prev => ({ ...prev, industry: val, jobRoles: [] })); // Reset job roles when industry changes
      if (touched.industry) validate('industry');
  };

  const handleCheckbox = (field: 'skills' | 'jobRoles' | 'challenges', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
    if (errors[field]) {
       setErrors(prev => {
         const newErrs = { ...prev };
         delete newErrs[field];
         return newErrs;
       });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      if (type === 'resume' && file.type !== "application/pdf") {
        alert("Please upload a PDF file for your resume");
        return;
      }
      
      if (type === 'photo' && !file.type.startsWith("image/")) {
        alert("Please upload an image file (JPG/PNG)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'resume') {
           setFormData(prev => ({ ...prev, resume: file, resumeName: file.name, resumeBase64: reader.result as string }));
        } else {
           setFormData(prev => ({ ...prev, photo: file, photoName: file.name, photoBase64: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: 'resume' | 'photo') => {
    if (type === 'resume') {
        setFormData(prev => ({ ...prev, resume: null, resumeName: undefined, resumeBase64: undefined }));
    } else {
        setFormData(prev => ({ ...prev, photo: null, photoName: undefined, photoBase64: undefined }));
    }
  };

  const handleSubmit = async () => {
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(k => allTouched[k] = true);
    setTouched(allTouched);

    if (validate()) {
      setIsSubmitting(true);
      setSubmitError('');
      const success = await submitSurvey(formData);
      if (success) {
        localStorage.removeItem('goaJobFestProfile');
        onSuccess(formData);
      } else {
        setSubmitError('Something went wrong. Please check your connection and try again.');
        setIsSubmitting(false);
      }
    } else {
      const firstError = document.querySelector('.error-msg');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Location Search Logic
  const filteredLocations = LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const selectLocation = (loc: string) => {
    handleChange('location', loc);
    setLocationSearch(loc);
    setShowLocationDropdown(false);
  };

  const showExperience = formData.currentStatus.includes("Employed");
  const availableJobRoles = formData.industry && JOB_CATEGORIES[formData.industry] ? JOB_CATEGORIES[formData.industry] : [];

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-tjc-blue/10 relative">
      {/* Decorative top border */}
      <div className="h-2 w-full bg-gradient-to-r from-tjc-blue via-tjc-orange to-tjc-blue"></div>
      
      {/* Pattern Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 pattern-grid opacity-30"></div>

      {/* Progress Indicator */}
      <div className="bg-white/95 backdrop-blur p-4 sticky top-0 z-20 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center min-w-max px-2">
           {SECTIONS.slice(0, 5).map((section, idx) => (
             <div key={section.id} className="flex items-center space-x-2 mr-6 group cursor-default">
               <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm ${idx === 0 ? 'bg-tjc-orange text-white ring-2 ring-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                 {idx + 1}
               </span>
               <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-tjc-blue transition-colors">{section.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-16 relative z-10">
        
        {/* BASIC DETAILS */}
        <section id="basic" className="space-y-8 animate-fade-in-up">
          <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">Basic Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.fullName ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                placeholder="e.g. Rahul Naik"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.fullName}</p>}
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g,'').slice(0,10))}
                onBlur={() => handleBlur('mobile')}
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.mobile ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                placeholder="9876543210"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.mobile}</p>}
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Email (Optional)</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 border-transparent focus:border-tjc-orange transition-all shadow-sm"
                placeholder="rahul@example.com"
              />
            </div>
            
            <div className="group relative" ref={locationWrapperRef}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Location <span className="text-red-500">*</span></label>
              <input 
                 type="text"
                 value={locationSearch}
                 onChange={(e) => {
                   setLocationSearch(e.target.value);
                   setShowLocationDropdown(true);
                   if (e.target.value === '') handleChange('location', '');
                 }}
                 onFocus={() => setShowLocationDropdown(true)}
                 placeholder="Search City/Village..."
                 className={`w-full p-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.location ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
              />
              {showLocationDropdown && (
                <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto ring-1 ring-black/5">
                   {filteredLocations.length > 0 ? (
                      filteredLocations.map(loc => (
                        <div 
                          key={loc} 
                          onClick={() => selectLocation(loc)}
                          className="p-3 hover:bg-orange-50 hover:text-tjc-orange cursor-pointer text-sm font-medium transition-colors border-b border-gray-50 last:border-0"
                        >
                          {loc}
                        </div>
                      ))
                   ) : (
                      <div className="p-3 text-sm text-gray-400 text-center">No matches found</div>
                   )}
                </div>
              )}
              {errors.location && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.location}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Age Group <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-4">
              {AGE_GROUPS.map(age => (
                <label key={age} className={`flex-1 min-w-[100px] text-center p-4 border-2 rounded-2xl cursor-pointer transition-all select-none hover:shadow-md ${formData.ageGroup === age ? 'bg-tjc-blue text-white border-tjc-blue shadow-lg shadow-blue-900/20 transform scale-105' : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'}`}>
                  <input 
                    type="radio" 
                    name="ageGroup" 
                    value={age} 
                    checked={formData.ageGroup === age}
                    onChange={(e) => handleChange('ageGroup', e.target.value)}
                    className="hidden"
                  />
                  <span className="text-sm font-bold">{age}</span>
                </label>
              ))}
            </div>
            {errors.ageGroup && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.ageGroup}</p>}
          </div>
        </section>

        <hr className="border-t border-gray-100" />

        {/* STATUS */}
        <section id="status" className="space-y-8 animate-fade-in-up">
          <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">Current Status</h3>
          </div>

          <div className="space-y-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Employment Status <span className="text-red-500">*</span></label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {EMPLOYMENT_STATUS.map(status => (
                 <label key={status} className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-md ${formData.currentStatus === status ? 'border-tjc-orange bg-orange-50 shadow-md' : 'border-gray-100 hover:border-orange-200 bg-white'}`}>
                    <input 
                      type="radio" 
                      name="currentStatus" 
                      value={status}
                      checked={formData.currentStatus === status}
                      onChange={(e) => handleChange('currentStatus', e.target.value)}
                      className="text-tjc-orange focus:ring-tjc-orange h-5 w-5 border-gray-300" 
                    />
                    <span className={`ml-3 text-sm font-bold ${formData.currentStatus === status ? 'text-tjc-blue' : 'text-gray-600'}`}>{status}</span>
                 </label>
               ))}
             </div>
             {errors.currentStatus && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.currentStatus}</p>}
          </div>
          
          {showExperience && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="group">
                   <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Years of Experience</label>
                   <select 
                      value={formData.experienceYears} 
                      onChange={(e) => handleChange('experienceYears', e.target.value)}
                      className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl focus:outline-none focus:border-tjc-orange transition-all"
                   >
                     <option value="">Select Experience</option>
                     {EXPERIENCE_YEARS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                </div>
                <div className="group">
                   <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Current Job Title</label>
                   <input 
                      type="text" 
                      value={formData.currentJobTitle}
                      onChange={(e) => handleChange('currentJobTitle', e.target.value)}
                      placeholder="e.g. Sales Associate"
                      className="w-full p-4 bg-white border-2 border-blue-100 rounded-xl focus:outline-none focus:border-tjc-orange transition-all"
                   />
                </div>
             </div>
          )}
        </section>

        <hr className="border-t border-gray-100" />

        {/* EDUCATION & SKILLS */}
        <section id="skills" className="space-y-8 animate-fade-in-up">
           <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">Education & Skills</h3>
          </div>

           <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Highest Qualification <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  value={formData.qualification} 
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  onBlur={() => handleBlur('qualification')}
                  className={`w-full p-4 appearance-none bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.qualification ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                >
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.qualification && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.qualification}</p>}
           </div>
           
           <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Skills (Select all that apply) <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                 {SKILLS_LIST.map(skill => (
                   <button
                     key={skill}
                     type="button"
                     onClick={() => handleCheckbox('skills', skill)}
                     className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all transform active:scale-95 hover:shadow-sm ${formData.skills.includes(skill) ? 'bg-tjc-blue text-white border-tjc-blue shadow-lg' : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200'}`}
                   >
                     {skill}
                   </button>
                 ))}
              </div>
              {errors.skills && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.skills}</p>}
           </div>
        </section>

        <hr className="border-t border-gray-100" />

        {/* JOB YOU WANT */}
        <section id="job" className="space-y-8 animate-fade-in-up">
           <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">The Job You Want</h3>
          </div>

           {/* Step 1: Select Industry */}
           <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">Select Industry <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  value={formData.industry} 
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  onBlur={() => handleBlur('industry')}
                  className={`w-full p-4 appearance-none bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.industry ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                >
                  <option value="">-- Choose Industry --</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.industry && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.industry}</p>}
           </div>

           {/* Step 2: Select Job Roles (Conditional) */}
           {formData.industry && (
             <div className="animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Roles looking for in {formData.industry} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {availableJobRoles.map(role => (
                      <label key={role} className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all hover:shadow-sm ${formData.jobRoles.includes(role) ? 'bg-orange-50 border-tjc-orange shadow-sm' : 'border-transparent hover:bg-gray-50'}`}>
                         <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${formData.jobRoles.includes(role) ? 'bg-tjc-orange border-tjc-orange' : 'border-gray-300 bg-white'}`}>
                            {formData.jobRoles.includes(role) && <CheckIcon className="w-3 h-3 text-white" />}
                         </div>
                         <input 
                           type="checkbox"
                           checked={formData.jobRoles.includes(role)}
                           onChange={() => handleCheckbox('jobRoles', role)}
                           className="hidden"
                         />
                         <span className={`text-sm font-bold ${formData.jobRoles.includes(role) ? 'text-tjc-blue' : 'text-gray-600'}`}>{role}</span>
                      </label>
                   ))}
                </div>
                {errors.jobRoles && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.jobRoles}</p>}
             </div>
           )}
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Preferred Work Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.workType} 
                    onChange={(e) => handleChange('workType', e.target.value)}
                    className={`w-full p-4 appearance-none bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.workType ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                  >
                     <option value="">Select Type</option>
                     {WORK_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {errors.workType && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.workType}</p>}
             </div>
             <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Expected Monthly Salary <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.salaryExpectation} 
                    onChange={(e) => handleChange('salaryExpectation', e.target.value)}
                    className={`w-full p-4 appearance-none bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 transition-all shadow-sm ${errors.salaryExpectation ? 'border-red-500' : 'border-transparent focus:border-tjc-orange'}`}
                  >
                     <option value="">Select Range</option>
                     {SALARY_RANGES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {errors.salaryExpectation && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.salaryExpectation}</p>}
             </div>
           </div>
        </section>

        <hr className="border-t border-gray-100" />

        {/* BEHAVIOUR */}
        <section id="behaviour" className="space-y-8 animate-fade-in-up">
           <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">Availability & Challenges</h3>
          </div>

           <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">When can you join? <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                 {AVAILABILITY.map(opt => (
                    <label key={opt} className={`flex items-center justify-center px-4 py-3 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-sm ${formData.joinAvailability === opt ? 'bg-tjc-blue text-white border-tjc-blue shadow-lg' : 'bg-gray-50 text-gray-600 border-transparent hover:border-orange-200'}`}>
                       <input 
                         type="radio"
                         name="joinAvailability"
                         value={opt}
                         checked={formData.joinAvailability === opt}
                         onChange={(e) => handleChange('joinAvailability', e.target.value)}
                         className="hidden"
                       />
                       <span className="text-sm font-bold">{opt}</span>
                    </label>
                 ))}
              </div>
              {errors.joinAvailability && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.joinAvailability}</p>}
           </div>
           
           <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Biggest challenge in finding a job? <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {CHALLENGES_LIST.map(challenge => (
                    <label key={challenge} className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all hover:shadow-sm ${formData.challenges.includes(challenge) ? 'bg-red-50 border-red-300' : 'border-transparent hover:bg-gray-50'}`}>
                       <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${formData.challenges.includes(challenge) ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'}`}>
                          {formData.challenges.includes(challenge) && <CheckIcon className="w-3 h-3 text-white" />}
                       </div>
                       <input 
                         type="checkbox"
                         checked={formData.challenges.includes(challenge)}
                         onChange={() => handleCheckbox('challenges', challenge)}
                         className="hidden"
                       />
                       <span className={`text-sm font-medium ${formData.challenges.includes(challenge) ? 'text-gray-900' : 'text-gray-600'}`}>{challenge}</span>
                    </label>
                 ))}
              </div>
              {errors.challenges && <p className="text-red-500 text-xs mt-1 font-medium error-msg">{errors.challenges}</p>}
           </div>
        </section>

        <hr className="border-t border-gray-100" />

        {/* UPLOADS */}
        <section id="uploads" className="space-y-8 animate-fade-in-up">
           <div className="flex items-center">
             <div className="h-10 w-1.5 bg-tjc-orange rounded-r-full mr-4 shadow-sm"></div>
             <h3 className="text-3xl font-black text-tjc-blue tracking-tight font-poppins">Uploads</h3>
          </div>
          
           {/* Profile Photo Upload */}
           <div className={`rounded-3xl transition-all ${formData.photoBase64 ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50 border-2 border-dashed border-gray-300 hover:bg-white hover:border-tjc-orange hover:shadow-lg'}`}>
             <label className="block w-full h-full p-8 text-center cursor-pointer">
               {!formData.photoBase64 ? (
                 <>
                   <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-tjc-orange">
                       <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                       <circle cx="12" cy="13" r="4"></circle>
                     </svg>
                   </div>
                   <span className="text-lg font-bold text-gray-800 hover:text-tjc-orange transition-colors">Add Profile Photo</span>
                   <span className="text-sm text-gray-500 block mt-1">JPG/PNG, Max 5MB</span>
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
                 </>
               ) : (
                  <div className="flex flex-col items-center">
                     <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                       <img src={formData.photoBase64} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <span className="text-sm font-bold text-gray-800 mb-4">{formData.photoName}</span>
                     <button type="button" onClick={(e) => { e.preventDefault(); removeFile('photo'); }} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center px-6 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors z-10 relative">
                        <TrashIcon className="h-4 w-4 mr-2" /> Remove Photo
                     </button>
                  </div>
               )}
             </label>
           </div>

           {/* Resume Upload */}
           <div className={`rounded-3xl transition-all ${formData.resumeBase64 ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50 border-2 border-dashed border-gray-300 hover:bg-white hover:border-tjc-orange hover:shadow-lg'}`}>
             <label className="block w-full h-full p-8 text-center cursor-pointer">
               {!formData.resumeBase64 ? (
                 <>
                   <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                     <UploadIcon className="h-8 w-8 text-tjc-orange" />
                   </div>
                   <span className="text-lg font-bold text-gray-800 hover:text-tjc-orange transition-colors">Upload Resume</span>
                   <span className="text-sm text-gray-500 block mt-1">PDF only, Max 5MB</span>
                   <p className="text-xs text-tjc-blue font-bold mt-4 uppercase tracking-wider bg-blue-100 inline-block px-3 py-1 rounded-full">Recommended</p>
                   <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'resume')} />
                 </>
               ) : (
                  <div className="flex flex-col items-center">
                     <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                       <FileIcon className="text-green-600 h-8 w-8" />
                     </div>
                     <span className="text-sm font-bold text-gray-800 mb-4">{formData.resumeName}</span>
                     <button type="button" onClick={(e) => { e.preventDefault(); removeFile('resume'); }} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center px-6 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors z-10 relative">
                        <TrashIcon className="h-4 w-4 mr-2" /> Remove Resume
                     </button>
                  </div>
               )}
             </label>
           </div>
           
           <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-tjc-orange transition-colors">LinkedIn Profile (Optional)</label>
              <input 
                type="text" 
                value={formData.linkedIn}
                onChange={(e) => handleChange('linkedIn', e.target.value)}
                placeholder="https://www.linkedin.com/in/yourname"
                className="w-full p-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none focus:ring-0 border-transparent focus:border-tjc-orange transition-all shadow-sm"
              />
           </div>
        </section>

        {/* Submit Actions */}
        <div className="space-y-6 pt-4">
           {submitError && (
             <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm font-medium border border-red-100">
                <AlertIcon className="h-5 w-5 mr-3" /> {submitError}
             </div>
           )}
           
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="w-full bg-tjc-orange hover:bg-orange-600 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-orange-500/20 transform transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ring-4 ring-orange-100 font-poppins"
           >
             {isSubmitting ? 'Creating Profile...' : 'Submit Profile'}
           </button>
           
           <p className="text-xs text-gray-400 text-center flex items-center justify-center py-2">
             <ShieldIcon className="h-3 w-3 mr-1" />
             By clicking Submit, you agree to our <a href="#" className="underline ml-1 hover:text-gray-600">Privacy Policy</a>.
           </p>
        </div>

      </div>
    </div>
  );
};

export default JobSurveyForm;