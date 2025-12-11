
// REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
// If left as default, the app will run in DEMO MODE (simulating success).
export const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx323aYK-wEI1pJ8hc1wjXbmXFDm9imKrhzU8UW7n_NM7It70EY0YwDiyLvHtQbEA5z/exec"; 

export const AGE_GROUPS = ["19–24", "25–34", "35–44", "45+"];

export const LOCATIONS = [
  "Panjim", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Porvorim",
  "Calangute", "Candolim", "Anjuna/Vagator", "Bicholim", "Canacona",
  "Curchorem", "Sanquelim", "Pernem", "Valpoi", "Verna", "Nuvem",
  "Fatorda", "Siolim", "Cuncolim", "Quepem", "Sanguem", "Dabolim",
  "Dona Paula", "Bambolim", "Colva/Benaulim", "Anywhere in Goa",
  "Outside Goa (Open to relocate)"
];

export const EMPLOYMENT_STATUS = [
  "Unemployed, looking for a job",
  "Employed, but searching for better opportunities",
  "Employed and not looking",
  "Student",
  "Freelancer",
  "Self-employed",
  "Homemaker",
  "Returning to work"
];

export const EXPERIENCE_YEARS = [
  "0 (Fresher)", "1–2 Years", "3–5 Years", "6–10 Years", "10+ Years"
];

export const QUALIFICATIONS = [
  "10th", "12th", "Diploma/ITI", "Graduate", "Postgraduate", "Engineering", "Other"
];

export const SKILLS_LIST = [
  "Communication", "Customer Service", "Sales & Marketing", "Accounting/Finance",
  "Computer Skills", "Hospitality", "HR/Recruitment", "Graphic Design",
  "IT/Technical Support", "Mechanical/Electrical", "Driving/Delivery"
];

// New Industry List
export const INDUSTRIES = [
  "Information Technology (IT) & Software",
  "Business, Management & Operations",
  "Sales & Marketing",
  "Finance, Banking & Accounting",
  "Human Resources (HR)",
  "Manufacturing & Production",
  "Engineering (Core)",
  "Healthcare & Life Sciences",
  "Education & Training",
  "Hospitality, Tourism & Travel",
  "Retail & E-Commerce",
  "Logistics, Transportation & Supply Chain",
  "Real Estate & Construction",
  "Creative, Media & Design",
  "Legal",
  "Energy, Oil & Gas, Power",
  "Agriculture & Food Processing",
  "Government & Public Sector",
  "Telecommunications",
  "Sports, Fitness & Wellness",
  "Security & Facility Services",
  "Entertainment & Performing Arts",
  "Fashion & Lifestyle",
  "Non-Profit & Social Impact"
];

// Mapped Job Categories
export const JOB_CATEGORIES: Record<string, string[]> = {
  "Information Technology (IT) & Software": [
    "Software Development", "Web Development", "Mobile App Development", "Cloud Computing",
    "DevOps / SRE", "Cybersecurity", "Data Science", "AI / Machine Learning",
    "Blockchain Development", "IT Support / Helpdesk", "UI/UX Design", "Product Management",
    "Quality Assurance / Testing", "Database Administration", "Network Engineering"
  ],
  "Business, Management & Operations": [
    "Business Development", "Strategy & Planning", "Operations Management", "Project Management",
    "Program Management", "Supply Chain Management", "Procurement", "Quality Assurance",
    "Risk Management", "Administration / Office Management"
  ],
  "Sales & Marketing": [
    "Field Sales", "Inside Sales", "B2B / B2C Sales", "Enterprise Sales", "Account Management",
    "Digital Marketing", "SEO / SEM", "Content Marketing", "Social Media Marketing",
    "Brand Management", "Performance Marketing", "Email Marketing", "Public Relations",
    "Customer Success / CRM"
  ],
  "Finance, Banking & Accounting": [
    "Accounting", "Bookkeeping", "Financial Analysis", "Investment Banking", "Corporate Finance",
    "Audit & Compliance", "Risk & Governance", "Taxation", "Treasury", "Banking Operations",
    "Insurance & Claims", "Wealth Management"
  ],
  "Human Resources (HR)": [
    "Talent Acquisition", "HR Operations", "HR Business Partner (HRBP)", "Learning & Development",
    "Payroll", "Employee Engagement", "Organizational Development", "Industrial Relations"
  ],
  "Manufacturing & Production": [
    "Production Engineering", "Manufacturing Operations", "Process Engineering", "Machine Operators",
    "Quality Control / QA", "Plant Management", "Tool & Die", "CNC Operation",
    "Maintenance Engineering", "Lean / Six Sigma"
  ],
  "Engineering (Core)": [
    "Mechanical Engineering", "Electrical Engineering", "Electronics Engineering", "Civil Engineering",
    "Chemical Engineering", "Industrial Engineering", "Aerospace Engineering", "Automotive Engineering",
    "Marine Engineering", "Biomedical Engineering"
  ],
  "Healthcare & Life Sciences": [
    "Doctors / Physicians", "Nursing", "Pharmacists", "Lab Technicians", "Medical Technologists",
    "Physiotherapists", "Dieticians", "Medical Coding", "Biotechnology", "Clinical Research",
    "Hospital Administration"
  ],
  "Education & Training": [
    "Teachers", "Professors", "Academic Counselors", "Instructional Designers",
    "Trainers & Coaches", "Curriculum Developers"
  ],
  "Hospitality, Tourism & Travel": [
    "Front Office", "Guest Relations", "Housekeeping", "F&B Service", "Chefs / Kitchen Staff",
    "Travel Consultants", "Tour Guides", "Airline Ground Staff", "Ticketing & Reservations"
  ],
  "Retail & E-Commerce": [
    "Store Operations", "Category Management", "Merchandising", "Visual Merchandising",
    "Inventory Control", "E-commerce Operations", "Customer Support", "Delivery & Logistics"
  ],
  "Logistics, Transportation & Supply Chain": [
    "Warehouse Management", "Transport / Fleet Management", "Freight & Shipping",
    "Inventory Planning", "Demand Planning", "Supply Chain Analytics", "Last-Mile Delivery"
  ],
  "Real Estate & Construction": [
    "Real Estate Sales", "Property Management", "Facility Management", "Construction Management",
    "Architecture", "Interior Design", "Urban Planning", "Civil Site Engineering"
  ],
  "Creative, Media & Design": [
    "Graphic Design", "Motion Graphics", "Video Editing", "Photography", "Animation / VFX",
    "3D Modeling", "Copywriting", "Creative Direction", "UI/UX", "Film / TV Production"
  ],
  "Legal": [
    "Corporate Lawyer", "Litigation Lawyer", "Legal Research", "Contract Management",
    "Compliance", "Intellectual Property (IP)", "Paralegal Services"
  ],
  "Energy, Oil & Gas, Power": [
    "Renewable Energy Engineer", "Solar Technician", "Electrical Grid Operations",
    "Oil & Gas Drilling", "Refinery Operations", "Energy Auditing", "Power Plant Engineering"
  ],
  "Agriculture & Food Processing": [
    "Farming Operations", "Food Technologists", "Agronomy", "Quality Control",
    "Dairy & Poultry Technicians", "Packaging", "Food Production Management"
  ],
  "Government & Public Sector": [
    "Civil Services", "Administrative Roles", "Public Health", "Policy & Research",
    "Public Infrastructure", "Defense & Armed Forces"
  ],
  "Telecommunications": [
    "Network Operations", "Telecom Engineering", "Infrastructure Deployment",
    "Field Technicians", "Customer Support"
  ],
  "Sports, Fitness & Wellness": [
    "Fitness Trainers", "Coaches", "Nutritionists", "Wellness Therapists", "Sports Management"
  ],
  "Security & Facility Services": [
    "Security Personnel", "Facility Management", "Housekeeping", "Fire & Safety", "Maintenance Staff"
  ],
  "Entertainment & Performing Arts": [
    "Actors", "Musicians", "Dancers", "Choreographers", "Stage Crew", "Event Management"
  ],
  "Fashion & Lifestyle": [
    "Fashion Designers", "Stylists", "Merchandisers", "Production (Apparel)", "Modeling"
  ],
  "Non-Profit & Social Impact": [
    "NGO Program Manager", "Fundraising", "Community Development", "Social Work",
    "Policy Research", "Volunteer Coordination"
  ]
};

export const WORK_TYPES = [
  "Full-time", "Part-time", "Internship", "Work-from-home", "Hybrid"
];

export const SALARY_RANGES = [
  "₹8,000–12,000", "₹12,000–18,000", "₹18,000–25,000", "₹25,000–35,000", "₹35,000+"
];

export const AVAILABILITY = [
  "Immediately", "Within 30 days", "Within 3 months", "Not sure"
];

export const CHALLENGES_LIST = [
  "No response from companies", "Not enough job openings", "Low salary offered",
  "Not sure what job suits me", "Resume/profile is weak", "Lack of experience", "Competition"
];

export const COPY = {
  HEADLINE: "Still Searching for a Job? Let’s Fix That.",
  SUBHEADLINE: "You deserve a job that actually fits you. Create your 45-second Job Profile, tell us what you want, and get FREE job alerts, resume tips, and career support from The Jobs & Career (TJC).",
  MICROTEXT: "Your information is secure & will ONLY be used to help you find better job opportunities.",
  SUCCESS_TITLE: "Done!",
  SUCCESS_MSG: "Thank you for completing your profile. Your answers help us match you with better job opportunities across Goa. You’ll start receiving relevant job alerts, career tips, and openings soon."
};
