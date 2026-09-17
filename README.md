# 🦅 ECMS Family Passport (Cardinal Series) v4.0

A bilingual (English & Spanish), interactive web application designed for **East Central Middle School (ECMS)** families to engage with the **ECMS Cardinal Family Series**, track attendance, complete weekly morphology quests, register for City Year Tutoring, verify OSU Extension Workshops, claim milestone prizes, and submit event feedback surveys.

All data rolls up into the **Master Google Spreadsheet**:
🔗 [Master Google Spreadsheet Link](https://docs.google.com/spreadsheets/d/1bPX3eMQVN9lpBG4cUetzpQldtcApP37mrA_MfZJquAg/edit?usp=sharing)

---

## ⚡ What's New in Version 4.0

### 1. 🕒 9:15 AM First Bell & No-Tardies Passcode Section
- **Updated First Bell**: Bell time updated to **9:15 AM** across all attendance check-in & punctuality components.
- **No-Tardies Passcode Section**: Added on `tab-attendance`. Enter a passcode (e.g. `NOTARDY`) given to students with zero tardies for the week to claim **+50 Pts**.
- **PowerSchool Verification & TalkingPoints Button**: Added a dedicated card for PowerSchool attendance tracking with a prominent button: **"Need access to PowerSchool? Message Dr. Lein on TalkingPoints"** opening direct messaging instructions.

### 2. 🔢 3-Digit Student Passport Codes
- Student Passport IDs are now generated as **3-digit numbers** (e.g. `247`, `108`, `492`) to prevent confusion with official school student ID numbers.

### 3. 📊 Staff Back-End Upgrades: Events Attended & Live Survey Table
- **Events Attended Column**: Added to the Registered Student Master Table on `tab-admin` showing each student's event history (*Sept 17 Hispanic Heritage, Oct 22 OSU Workshop, etc.*).
- **Live Family Survey Submissions Table**: Dedicated backend table displaying all raw survey responses submitted by families with timestamps, names, grades, and answers to Q1–Q6.

### 4. 📝 Updated Official City Year Digital OpenSign Links
- **Spanish OpenSign Form**: [https://app.opensignlabs.com/publicsign?templateid=K2zDicFQ3R](https://app.opensignlabs.com/publicsign?templateid=K2zDicFQ3R)
- **English OpenSign Form**: [https://app.opensignlabs.com/publicsign?templateid=bnWyOZPbNA](https://app.opensignlabs.com/publicsign?templateid=bnWyOZPbNA)

---

## 📊 Master Google Spreadsheet Structure Guide

To set up your Google Sheet ([Master Google Spreadsheet Link](https://docs.google.com/spreadsheets/d/1bPX3eMQVN9lpBG4cUetzpQldtcApP37mrA_MfZJquAg/edit?usp=sharing)), create the following **5 Tabs** with their respective header rows (Column A to Column K):

### Tab 1: `Students`
| Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I | Col J | Col K |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 3-Digit Code | Full Name | Grade | Total Points | Current Streak | Shield Status | Last Check-In | Claimed Prizes | Completed Quests | Events Attended | Last Updated |

### Tab 2: `ActivityLog`
| Col A | Col B | Col C | Col D | Col E | Col F |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Timestamp | Student Name | Grade | Activity Type | Description | Points Earned |

### Tab 3: `Passcodes`
| Col A | Col B | Col C | Col D | Col E |
| :--- | :--- | :--- | :--- | :--- |
| Passcode | Point Value | Category/Event | Status | Created Date |

### Tab 4: `SurveyResponses`
| Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Timestamp | Student/Family Name | Grade | Q1 Attendance Challenge | Q2 Preferred Event Type | Q3 Preferred Communication | Q4 Best Day/Time | Q5 Follows Facebook | Q6 School Concerns |

### Tab 5: `WeeklyQuests`
| Col A | Col B | Col C | Col D | Col E | Col F |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Week Number | Student Name | Grade | Score | Passcode | Completed Date |

---

## 🛠️ Google Apps Script Backend Setup Instructions

1. Open your [Master Google Spreadsheet](https://docs.google.com/spreadsheets/d/1bPX3eMQVN9lpBG4cUetzpQldtcApP37mrA_MfZJquAg/edit?usp=sharing).
2. Go to **Extensions** > **Apps Script**.
3. Copy the contents of `google_apps_script.js` (or use the one-click copy button inside the Staff Back-End tab in the app).
4. Replace all code in `Code.gs` and save.
5. Click **Deploy** > **New Deployment**.
6. Set *Type*: **Web App**, *Execute as*: **Me**, *Who has access*: **Anyone**.
7. Click **Deploy** and authorize permissions.
