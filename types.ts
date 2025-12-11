export interface SurveyFormData {
  fullName: string;
  mobile: string;
  email: string;
  ageGroup: string;
  location: string;
  
  currentStatus: string;
  experienceYears: string; // Conditional
  currentJobTitle: string;
  
  qualification: string;
  otherQualification?: string;
  skills: string[];
  otherSkill?: string;
  
  industry: string; // New field
  jobRoles: string[];
  otherJobRole?: string;
  workType: string;
  salaryExpectation: string;
  
  joinAvailability: string;
  challenges: string[];
  otherChallenge?: string;
  
  // File Uploads
  resume: File | null;
  resumeBase64?: string;
  resumeName?: string;
  
  photo: File | null;
  photoBase64?: string;
  photoName?: string;
  
  linkedIn: string;
}

export type SectionType = 'basic' | 'status' | 'skills' | 'job' | 'uploads' | 'done';

export interface FormSection {
  id: SectionType;
  label: string;
}

export const SECTIONS: FormSection[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'status', label: 'Status' },
  { id: 'skills', label: 'Skills' },
  { id: 'job', label: 'Job' },
  { id: 'uploads', label: 'Uploads' },
];