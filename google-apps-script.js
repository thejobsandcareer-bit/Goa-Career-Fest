/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * 1. Open your Spreadsheet: https://docs.google.com/spreadsheets/d/1UeoS_Khu3EDo92nQbje82s9XbvHi2blnljWWLn_yo0c/edit
 * 2. Go to Extensions > Apps Script.
 * 3. PASTE THIS CODE COMPLETELY.
 * 4. Run `setup()` once to create columns.
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select Type: "Web App".
 * 7. Execute as: "Me".
 * 8. Who has access: "Anyone" (CRITICAL).
 * 9. Copy the generated Web App URL and paste it into constants.ts.
 */

// Your specific Spreadsheet ID
const SPREADSHEET_ID = "1UeoS_Khu3EDo92nQbje82s9XbvHi2blnljWWLn_yo0c";
const UPLOAD_FOLDER_NAME = "GoaJobFest_Uploads_2026";

function setup() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const headers = [
      "Timestamp", "Full Name", "Mobile", "Email", "Age Group", "Location", 
      "Current Status", "Experience", "Current Job", "Qualification", "Skills", 
      "Industry", "Job Roles", "Work Type", "Salary Exp", "Availability", "Challenges", 
      "LinkedIn", "Resume Link", "Photo Link",
      "Auto-Tags"
    ];
    // Check if headers exist, if not, append them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    Logger.log("Setup Complete. Columns checked.");
  } catch (e) {
    Logger.log("Error in setup: " + e.toString());
  }
}

// Handle GET requests (Useful for testing connectivity in browser)
function doGet(e) {
  return ContentService.createTextOutput("Backend is active. Please send POST requests from the app.");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const data = JSON.parse(e.postData.contents);
    
    // Get or Create Upload Folder
    let folder;
    const folders = DriveApp.getFoldersByName(UPLOAD_FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(UPLOAD_FOLDER_NAME);
    }
    
    // Handle Resume Upload
    let resumeUrl = "";
    if (data.resumeBase64 && data.resumeName) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.resumeBase64.split(',')[1]), 
        "application/pdf", 
        data.resumeName + "_" + data.mobile
      );
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      resumeUrl = file.getUrl();
    }
    
    // Handle Photo Upload
    let photoUrl = "";
    if (data.photoBase64 && data.photoName) {
      // Basic MIME type detection
      let mimeType = "image/jpeg";
      if(data.photoName.toLowerCase().endsWith(".png")) mimeType = "image/png";
      
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.photoBase64.split(',')[1]), 
        mimeType, 
        "PHOTO_" + data.fullName + "_" + data.mobile
      );
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      photoUrl = file.getUrl();
    }

    // Auto-Tagging Logic
    const tags = [];
    if (["19–24"].includes(data.ageGroup)) tags.push("Fresher");
    
    const hospKeywords = ["Hotel", "Hospitality", "Casino", "Chef", "Kitchen", "Housekeeping"];
    if (data.jobRoles.some(r => hospKeywords.some(k => r.includes(k)))) tags.push("Hospitality");

    // Map fields to row
    const row = [
      new Date(),
      data.fullName,
      "'" + data.mobile, // Force string to prevent truncation
      data.email,
      data.ageGroup,
      data.location,
      data.currentStatus,
      data.experienceYears,
      data.currentJobTitle,
      data.qualification,
      data.skills.join(", "),
      data.industry,
      data.jobRoles.join(", "),
      data.workType,
      data.salaryExpectation,
      data.joinAvailability,
      data.challenges.join(", "),
      data.linkedIn,
      resumeUrl,
      photoUrl,
      tags.join(", ")
    ];

    sheet.appendRow(row);

    // Send Confirmation Email
    if (data.email) {
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: "Profile Created - Goa Career Fest 2026",
          htmlBody: `
            <p>Hi ${data.fullName},</p>
            <p>Thanks for creating your profile for Goa Career Fest 2026 — here’s what to expect next.</p>
            <p>We are reviewing your details and will start sending you matched job alerts soon.</p>
            <br/>
            <p>Best,<br/>The Jobs & Career (TJC) Team</p>
          `
        });
      } catch (emailErr) {
        console.log("Email failed", emailErr);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}