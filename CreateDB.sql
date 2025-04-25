-- Create database
CREATE DATABASE IF NOT EXISTS individualized_learning;
USE individualized_learning;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Chat_rooms;
DROP TABLE IF EXISTS Alerts;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Learning_plans;
DROP TABLE IF EXISTS Assessments;
DROP TABLE IF EXISTS Progress_reports;
DROP TABLE IF EXISTS moodcheckins;
DROP TABLE IF EXISTS subjectcontent;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Submissions;
DROP TABLE IF EXISTS Student_Assignments;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Student_Teachers;
DROP TABLE IF EXISTS Student_Subjects;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Counselors;
DROP TABLE IF EXISTS Users;

-- Create tables
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    is_pwd_encrypted BOOLEAN DEFAULT FALSE
);

CREATE TABLE Counselors (
    counselorID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Students (
    studentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    gradeLevel INT,
    counselorID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (counselorID) REFERENCES Counselors(counselorID)
);

CREATE TABLE Parents (
    parentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    studentID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Subjects (
    subjectID INT AUTO_INCREMENT PRIMARY KEY,
    subjectName VARCHAR(255)
);

CREATE TABLE Teachers (
    teacherID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    subjectID INT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) 
);

CREATE TABLE Student_Subjects (
    studentID INT,
    subjectID INT,
    PRIMARY KEY (studentID, subjectID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) ON DELETE CASCADE
);

CREATE TABLE Student_Teachers (
    studentID INT,
    teacherID INT,
    PRIMARY KEY (studentID, teacherID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (teacherID) REFERENCES teachers(teacherID) ON DELETE CASCADE
);

CREATE TABLE Assignments (
    assignmentID INT PRIMARY KEY AUTO_INCREMENT,
    subjectID INT,
    title VARCHAR(255),
    description TEXT,
    dueDate DATE,
    FOREIGN KEY (subjectID) REFERENCES Subjects(subjectID) ON DELETE CASCADE
);

CREATE TABLE Student_Assignments (
    studentID INT,
    assignmentID INT,
    completed INT DEFAULT 0,
    PRIMARY KEY (studentID, assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID) ON DELETE CASCADE
);

-- Submissions Table
CREATE TABLE Submissions (
    submissionID INT PRIMARY KEY AUTO_INCREMENT,
    assignmentID INT,
    studentID INT,
    actualFileName VARCHAR(255),
    uploadsFileName VARCHAR(255),
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentID) REFERENCES Assignments(assignmentID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

-- Feedback Table
CREATE TABLE Feedback (
    feedbackID INT PRIMARY KEY AUTO_INCREMENT,
    submissionID INT,
    grade DECIMAL(5,2),
    feedback TEXT,
    FOREIGN KEY (submissionID) REFERENCES Submissions(submissionID)
);

CREATE TABLE SubjectContent (
    contentId INT PRIMARY KEY AUTO_INCREMENT,
    fileName VARCHAR(255),
    uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contentType VARCHAR(50),  -- e.g., 'pdf', 'video', 'link', 'text'
    studentId INT REFERENCES Students(studentId),
    subjectId INT REFERENCES Subjects(subjectId)
);

CREATE TABLE MoodCheckins (
    moodId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT REFERENCES Students(studentId),
    mood VARCHAR(50),  -- e.g., 'happy', 'tired', 'frustrated', etc.
    checkinTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Progress_reports (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    generatedDate DATE,
    details TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Assessments (
    assessmentID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    counselorID INT,
    results TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID),
    FOREIGN KEY (counselorID) REFERENCES Counselors(counselorID)
);

CREATE TABLE Learning_plans (
    learningPlanID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    adaptiveFeatures TEXT,
    progressSummary TEXT,
    FOREIGN KEY (studentID) REFERENCES Students(studentID)
);

CREATE TABLE Quizzes (
    quizID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    learningPlanID INT,
    FOREIGN KEY (learningPlanID) REFERENCES Learning_plans(learningPlanID)
);

CREATE TABLE Alerts (
    alertID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    message TEXT,
    dateCreated TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Chat_rooms (
    chatRoomID INT AUTO_INCREMENT PRIMARY KEY,
    user1ID INT,
    user2ID INT,
    FOREIGN KEY (user1ID) REFERENCES Users(userID),
    FOREIGN KEY (user2ID) REFERENCES Users(userID)
);

CREATE TABLE Messages (
    messageId INT PRIMARY KEY AUTO_INCREMENT,
    chatRoomId INT,
    senderId INT,
    receiverId INT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatRoomID) REFERENCES Chat_rooms(chatRoomID),
    FOREIGN KEY (senderId) REFERENCES Users(userID),
    FOREIGN KEY (receiverId) REFERENCES Users(userID)
);

CREATE TRIGGER mark_assignment_completed
AFTER INSERT ON Submissions
FOR EACH ROW
UPDATE Student_Assignments
SET completed = 1
WHERE studentID = NEW.studentID AND assignmentID = NEW.assignmentID;

-- Insert data into Users
INSERT INTO Users (userID, name, email, password, role) VALUES
(1, 'Alice Johnson', 'alice@ils.edu', 'password123', 'student'),
(2, 'Mr. Bob Smith', 'bob@ils.edu', 'password456', 'teacher'),
(3, 'Mr. Charlie Davis', 'charlie@ils.edu', 'password789', 'parent'),
(4, 'Ms. Dana White', 'dana@ils.edu', 'password321', 'counselor'),
(5, 'Eve Black', 'eve@ils.edu', 'password123', 'student'),
(6, 'Mr. Steven Hawk', 'steven@ils.edu', 'password789', 'parent'),
(7, 'Ms. Jane Austin', 'jane@ils.edu', 'password456', 'teacher'),
(8, 'Ms. Zara Mane', 'zara@ils.edu', 'password321', 'counselor'),
(9, 'Mr. Peter Sanders', 'peter@ils.edu', 'password456', 'teacher');

-- Insert data into Counselors
INSERT INTO Counselors (counselorID, userID) VALUES
(1, 4),
(2, 8);

-- Insert data into Students
INSERT INTO Students (studentID, userID, gradeLevel, counselorID) VALUES
(1, 1, 4, 1),
(2, 5, 6, 2);

-- Insert data into Parents
INSERT INTO Parents (parentID, userID, studentID) VALUES
(1, 3, 1),
(2, 6, 2);

-- Insert data into Subjects
INSERT INTO Subjects (subjectID, subjectName) VALUES
(1, 'Mathematics'),
(2, 'Science'),
(3, 'English');

-- Insert data into Teachers
INSERT INTO Teachers (teacherID, userID, subjectID) VALUES
(1, 2, 1),
(2, 7, 2),
(3, 9, 3);

INSERT INTO Student_Subjects (studentID, subjectID) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3); 

INSERT INTO Student_Teachers (studentID, teacherID) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3);

-- Insert data into Assignments
INSERT INTO Assignments (assignmentID, subjectID, title, description, dueDate) VALUES
-- Math - Grade 4
(1, 1, 'Basic Algebra', 'Solve simple equations like 2x + 3 = 7', '2025-05-01'),
-- Math - Grade 6
(2, 1, 'Advanced Geometry', 'Solve problems on angles, triangles, and area', '2025-05-03'),
-- Math - Grade 4
(3, 1, 'Bar Graph Practice', 'Interpret bar graphs and answer questions', '2025-05-04'),
-- Science - Grade 4
(4, 2, 'Animal Classification', 'Classify animals into mammals, reptiles, etc.', '2025-05-05'),
-- English - Grade 6
(5, 3, 'Compare Two Poems', 'Write a short essay comparing themes in two poems', '2025-05-06');

-- Insert data into Student_Assignments
INSERT INTO Student_Assignments (studentID, assignmentID) VALUES
(1, 1),
(2, 2),
(1, 3),
(1, 4),
(2, 5);

-- Insert into Submissions
INSERT INTO Submissions (submissionID, assignmentID, studentID, uploadsFileName) VALUES
(1, 1, 1, 'file1.pdf'),
(2, 2, 2, 'file2.pdf');

-- Insert into Feedback
INSERT INTO Feedback (submissionID, grade, feedback) VALUES
(1, 85.0, 'Good work'),
(2, 90.0, 'Excellent report');

-- Insert data into Progress_reports
INSERT INTO Progress_reports (reportID, studentID, generatedDate, details) VALUES
(1, 1, '2025-02-15', 'Progress is good.'),
(2, 2, '2025-02-16', 'Needs improvement in some areas.');

-- Insert data into Assessments
INSERT INTO Assessments (assessmentID, studentID, counselorID, results) VALUES
(1, 1, 1, 'Assessment results are satisfactory.'),
(2, 2, 1, 'Needs additional practice.');

-- Insert data into Learning_plans
INSERT INTO Learning_plans (learningPlanID, studentID, adaptiveFeatures, progressSummary) VALUES
(1, 1, 'Adaptive learning enabled', 'Shows steady progress'),
(2, 2, 'Needs personalized content', 'Requires improvement in problem-solving');

-- Insert data into Quizzes
INSERT INTO Quizzes (quizID, title, description, learningPlanID) VALUES
(1, 'Math Quiz', 'Basic algebra', 1),
(2, 'Science Quiz', 'Physics basics', 2);

-- Insert data into Alerts
INSERT INTO Alerts (alertID, userID, message, dateCreated) VALUES
(1, 1, 'New assignment added', '2025-02-10 10:00:00'),
(2, 2, 'Quiz results updated', '2025-02-11 14:00:00');

-- Insert chat rooms for one-on-one conversations
-- INSERT INTO Chat_rooms (chatRoomID, user1ID, user2ID) VALUES
-- (1, 1, 2),  -- Student (Alice) <-> Teacher (Bob)
-- (2, 1, 4),  -- Student (Alice) <-> Counselor (Dana)
-- (3, 3, 2),  -- Parent (Charlie) <-> Teacher (Bob)
-- (4, 3, 4),  -- Parent (Charlie) <-> Counselor (Dana)
-- (5, 5, 2),  -- Student (Eve) <-> Teacher (Bob)
-- (6, 5, 4);  -- Student (Eve) <-> Counselor (Dana)

-- -- Insert messages exchanged in different chat rooms
-- INSERT INTO Messages (messageID, chatRoomID, userID, content, timestamp) VALUES
-- (1, 1, 1, "Hello, Professor! I have a question about the homework.", '2025-02-12 09:30:00'),
-- (2, 1, 2, "Sure, Alice! What do you need help with?", '2025-02-12 09:31:00'),
-- (3, 2, 1, "Hi Counselor Dana, I need some advice.", '2025-02-12 10:00:00'),
-- (4, 2, 4, "Of course, Alice! What is on your mind?", '2025-02-12 10:02:00'),
-- (5, 3, 3, "Hello, Mr. Bob. How is my child doing in math?", '2025-02-12 10:45:00'),
-- (6, 3, 2, "Hi Charlie! Your child is making good progress but needs some extra practice.", '2025-02-12 10:50:00'),
-- (7, 4, 3, "Counselor Dana, do you think my child needs extra support?", '2025-02-13 08:30:00'),
-- (8, 4, 4, "Yes, we should discuss an adaptive learning plan.", '2025-02-13 08:35:00'),
-- (9, 5, 5, "Hey Professor, I need help with the physics lab.", '2025-02-14 15:00:00'),
-- (10, 5, 2, "Sure Eve, let us go through it together.", '2025-02-14 15:05:00'),
-- (11, 6, 5, "Counselor Dana, I struggle with time management.", '2025-02-14 16:30:00'),
-- (12, 6, 4, "That is okay, Eve. We can create a personalized plan for you.", '2025-02-14 16:35:00');