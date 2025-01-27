-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Chat_rooms;
DROP TABLE IF EXISTS Alerts;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Learning_plans;
DROP TABLE IF EXISTS Assessments;
DROP TABLE IF EXISTS Progress_reports;
DROP TABLE IF EXISTS Submissions;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Student_section_map;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Counselors;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Users;

-- Create tables
CREATE TABLE Users (
    userID INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE Students (
    studentID INT PRIMARY KEY,
    userID INT,
    gradeLevel INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Parents (
    parentID INT PRIMARY KEY,
    userID INT,
    studentID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Teachers (
    teacherID INT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Counselors (
    counselorID INT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Subjects (
    subjectID INT PRIMARY KEY,
    subjectName VARCHAR(255),
    teacherID INT,
    FOREIGN KEY (teacherID) REFERENCES Teachers(teacherID)
);

CREATE TABLE Sections (
    sectionID INT PRIMARY KEY,
    sectionName VARCHAR(255),
    subjectID INT,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID)
);

CREATE TABLE Student_section_map (
    mapID INT PRIMARY KEY,
    studentID INT,
    sectionID INT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Assignments (
    assignmentID INT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    dueDate DATE,
    sectionID INT,
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Submissions (
    submissionID INT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    fileURL VARCHAR(255),
    grade DECIMAL(5, 2),
    feedback TEXT,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Progress_reports (
    reportID INT PRIMARY KEY,
    studentID INT,
    generatedDate DATE,
    details TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Assessments (
    assessmentID INT PRIMARY KEY,
    studentID INT,
    counselorID INT,
    results TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (counselorID) REFERENCES Counselors(counselorID)
);

CREATE TABLE Learning_plans (
    learningPlanID INT PRIMARY KEY,
    studentID INT,
    adaptiveFeatures TEXT,
    progressSummary TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Quizzes (
    quizID INT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    learningPlanID INT,
    FOREIGN KEY (learningPlanID) REFERENCES Learning_plans(learningPlanID)
);

CREATE TABLE Alerts (
    alertID INT PRIMARY KEY,
    userID INT,
    message TEXT,
    dateCreated TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Chat_rooms (
    chatRoomID INT PRIMARY KEY,
    sectionID INT,
    FOREIGN KEY (sectionID) REFERENCES Sections(sectionID)
);

CREATE TABLE Messages (
    messageID INT PRIMARY KEY,
    chatRoomID INT,
    userID INT,
    content TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (chatRoomID) REFERENCES Chat_rooms(chatRoomID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);
