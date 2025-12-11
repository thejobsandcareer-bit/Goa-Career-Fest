import { SurveyFormData } from '../types';
import { GOOGLE_APPS_SCRIPT_URL } from '../constants';

export const submitSurvey = async (data: SurveyFormData): Promise<boolean> => {
  // DEMO MODE: If URL is not set, simulate a successful submission.
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes("YOUR_WEB_APP_URL_HERE")) {
    console.warn("⚠️ BACKEND NOT CONFIGURED. RUNNING IN DEMO MODE.");
    console.log("Simulating submission with data:", data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return success to allow UI testing
    return true;
  }

  try {
    const payload = {
        ...data,
        resume: undefined, // Remove the File object, we use resumeBase64
        photo: undefined, // Remove Photo File object
        timestamp: new Date().toISOString()
    };

    // Use 'no-cors' mode isn't ideal because we want to know if it failed,
    // but GAS Web Apps redirect, so we use standard fetch with follow redirect.
    // Ensure "Who has access" is set to "Anyone" in deployment settings.
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.status === 'success') {
        return true;
    } else {
        console.error("Google Script Error:", result.message);
        return false;
    }
  } catch (error) {
    console.error("Submission error:", error);
    return false;
  }
};