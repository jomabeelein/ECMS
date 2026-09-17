/**
 * ECMS Family Passport - Master Google Apps Script Backend (Code.gs)
 * Master Sheet URL: https://docs.google.com/spreadsheets/d/1bPX3eMQVN9lpBG4cUetzpQldtcApP37mrA_MfZJquAg/edit?usp=sharing
 */

const SHEETS = {
  STUDENTS: 'Students',
  ACTIVITY_LOG: 'ActivityLog',
  PASSCODES: 'Passcodes',
  FAMILY_SURVEYS: 'FamilyEngagementSurveys',
  LIVE_EVENT_SURVEYS: 'LiveEventSurveys',
  WEEKLY_QUESTS: 'WeeklyQuests'
};

/**
 * HTTP GET Endpoint.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);

    const action = e.parameter.action || 'getLeaderboard';

    if (action === 'getLeaderboard') {
      const studentsSheet = ss.getSheetByName(SHEETS.STUDENTS);
      const data = studentsSheet.getDataRange().getValues();
      const leaderboard = [];
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0]) {
          leaderboard.push({
            id: data[i][0],
            name: data[i][1],
            grade: data[i][2],
            points: parseInt(data[i][3]) || 0,
            streak: parseInt(data[i][4]) || 0,
            shield: data[i][5] === 'Active' || data[i][5] === true,
            lastCheckIn: data[i][6],
            claimedPrizes: data[i][7] || '',
            completedQuests: data[i][8] || '',
            eventsAttended: data[i][9] || ''
          });
        }
      }

      leaderboard.sort((a, b) => b.points - a.points);
      return jsonResponse({ success: true, leaderboard: leaderboard });
    }

    return jsonResponse({ success: true, message: 'ECMS Passport API Ready' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * HTTP POST Endpoint.
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetsIfMissing(ss);

    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    if (action === 'registerStudent' || action === 'syncStudent') {
      return handleSyncStudent(ss, contents.student);
    } else if (action === 'logActivity') {
      return handleLogActivity(ss, contents.activity);
    } else if (action === 'submitFamilySurvey') {
      return handleSubmitFamilySurvey(ss, contents.survey);
    } else if (action === 'submitLiveEventSurvey') {
      return handleSubmitLiveEventSurvey(ss, contents.survey);
    } else if (action === 'completeQuest') {
      return handleCompleteQuest(ss, contents.quest);
    } else if (action === 'addPasscode') {
      return handleAddPasscode(ss, contents.passcode);
    }

    return jsonResponse({ success: false, message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function handleSyncStudent(ss, student) {
  const sheet = ss.getSheetByName(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  const timestamp = new Date();
  const studentId = student.id || Math.floor(100 + Math.random() * 900).toString();

  let studentRowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == studentId || (data[i][1].toLowerCase() == student.name.toLowerCase() && data[i][2] == student.grade)) {
      studentRowIndex = i + 1;
      break;
    }
  }

  if (studentRowIndex > 0) {
    sheet.getRange(studentRowIndex, 2).setValue(student.name);
    sheet.getRange(studentRowIndex, 3).setValue(student.grade);
    sheet.getRange(studentRowIndex, 4).setValue(student.points);
    sheet.getRange(studentRowIndex, 5).setValue(student.streak);
    sheet.getRange(studentRowIndex, 6).setValue(student.hasShield ? 'Active' : 'Used');
    sheet.getRange(studentRowIndex, 7).setValue(student.lastCheckIn || timestamp);
    sheet.getRange(studentRowIndex, 8).setValue(student.claimedPrizes ? student.claimedPrizes.join(',') : '');
    sheet.getRange(studentRowIndex, 9).setValue(student.completedQuests ? student.completedQuests.join(',') : '');
    sheet.getRange(studentRowIndex, 10).setValue(student.eventsAttended ? student.eventsAttended.join(',') : '');
    sheet.getRange(studentRowIndex, 11).setValue(timestamp);
  } else {
    sheet.appendRow([
      studentId,
      student.name,
      student.grade || '7th',
      student.points || 0,
      student.streak || 0,
      student.hasShield ? 'Active' : 'Used',
      student.lastCheckIn || timestamp,
      student.claimedPrizes ? student.claimedPrizes.join(',') : '',
      student.completedQuests ? student.completedQuests.join(',') : '',
      student.eventsAttended ? student.eventsAttended.join(',') : '',
      timestamp
    ]);
  }

  return jsonResponse({ success: true, message: 'Student synced successfully', studentId: studentId });
}

function handleLogActivity(ss, activity) {
  const sheet = ss.getSheetByName(SHEETS.ACTIVITY_LOG);
  sheet.appendRow([
    new Date(),
    activity.studentName,
    activity.grade,
    activity.type,
    activity.description,
    activity.pointsEarned
  ]);
  return jsonResponse({ success: true, message: 'Activity logged' });
}

function handleSubmitFamilySurvey(ss, survey) {
  const sheet = ss.getSheetByName(SHEETS.FAMILY_SURVEYS);
  sheet.appendRow([
    new Date(),
    survey.studentName || 'Anonymous',
    survey.grade || 'N/A',
    survey.regularAttendanceChallenge || '',
    survey.eventInterest || '',
    survey.preferredCommunication || '',
    survey.bestTimeSlot || '',
    survey.followsFacebook || '',
    survey.schoolConcerns || ''
  ]);
  return jsonResponse({ success: true, message: 'Family survey logged' });
}

function handleSubmitLiveEventSurvey(ss, survey) {
  const sheet = ss.getSheetByName(SHEETS.LIVE_EVENT_SURVEYS);
  sheet.appendRow([
    new Date(),
    survey.studentName || 'Anonymous',
    survey.eventName || 'ECMS Family Series Event',
    survey.positiveImpactRating || '',
    survey.wellOrganizedRating || '',
    survey.wouldRecommendRating || '',
    survey.openComments || ''
  ]);
  return jsonResponse({ success: true, message: 'Live event survey logged' });
}

function handleCompleteQuest(ss, quest) {
  const sheet = ss.getSheetByName(SHEETS.WEEKLY_QUESTS);
  sheet.appendRow([
    quest.weekNumber,
    quest.studentName,
    quest.grade,
    quest.score,
    quest.passcode,
    new Date()
  ]);
  return jsonResponse({ success: true, message: 'Quest logged' });
}

function handleAddPasscode(ss, passcode) {
  const sheet = ss.getSheetByName(SHEETS.PASSCODES);
  sheet.appendRow([
    passcode.code.toUpperCase(),
    passcode.points,
    passcode.type,
    'Active',
    new Date()
  ]);
  return jsonResponse({ success: true, message: 'Passcode added' });
}

function setupSheetsIfMissing(ss) {
  if (!ss.getSheetByName(SHEETS.STUDENTS)) {
    const s = ss.insertSheet(SHEETS.STUDENTS);
    s.appendRow(['3-Digit Code', 'Full Name', 'Grade', 'Total Points', 'Current Streak', 'Shield Status', 'Last Check-In', 'Claimed Prizes', 'Completed Quests', 'Events Attended', 'Last Updated']);
    s.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
  }

  if (!ss.getSheetByName(SHEETS.FAMILY_SURVEYS)) {
    const s = ss.insertSheet(SHEETS.FAMILY_SURVEYS);
    s.appendRow(['Timestamp', 'Student Name', 'Grade', 'Q1 Attendance Challenge', 'Q2 Preferred Event Type', 'Q3 Preferred Communication', 'Q4 Best Day/Time', 'Q5 Follows Facebook', 'Q6 School Concerns']);
    s.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
  }

  if (!ss.getSheetByName(SHEETS.LIVE_EVENT_SURVEYS)) {
    const s = ss.insertSheet(SHEETS.LIVE_EVENT_SURVEYS);
    s.appendRow(['Timestamp', 'Student/Family Name', 'Event Name', 'Q1 Positive Impact (1-5)', 'Q2 Well Organized (1-5)', 'Q3 Would Recommend (1-5)', 'Open Comments/Feedback']);
    s.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
  }

  if (!ss.getSheetByName(SHEETS.ACTIVITY_LOG)) {
    const s = ss.insertSheet(SHEETS.ACTIVITY_LOG);
    s.appendRow(['Timestamp', 'Student Name', 'Grade', 'Activity Type', 'Description', 'Points Earned']);
    s.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
  }

  if (!ss.getSheetByName(SHEETS.PASSCODES)) {
    const s = ss.insertSheet(SHEETS.PASSCODES);
    s.appendRow(['Passcode', 'Point Value', 'Category/Event', 'Status', 'Created Date']);
    s.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
    s.appendRow(['HERITAGE26', 200, 'ECMS Live Event - Sept 17 Hispanic Heritage', 'Active', new Date()]);
    s.appendRow(['STEAM26', 200, 'ECMS Live Event - Dec 17 Winter STEAM Night', 'Active', new Date()]);
    s.appendRow(['BLACKHISTORY', 200, 'ECMS Live Event - Feb 18 Black History Celebration', 'Active', new Date()]);
    s.appendRow(['TESTING27', 200, 'ECMS Live Event - Apr 15 Testing Night', 'Active', new Date()]);
  }

  if (!ss.getSheetByName(SHEETS.WEEKLY_QUESTS)) {
    const s = ss.insertSheet(SHEETS.WEEKLY_QUESTS);
    s.appendRow(['Week Number', 'Student Name', 'Grade', 'Score', 'Passcode', 'Completed Date']);
    s.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#990000').setFontColor('#ffffff');
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
