# ILS
This is the github repository for the senior design project, Individualized Learning System
For starting the website:
1. Change database details in the env file to the device's database details.
2. In MySQL Workbench, run the createDB.sql file to create the database.
3. Open command prompt and navigate to the project location.
4. Once you're in the ILS directory, enter the command "node server.js".
5. Once the code is running, open a browser and navigate to http://localhost:4000 
6. Click Login

For logging in as a student:
1. Input the email: alice@ils.edu and password: password123
2. Once you press login, you will see the student dashboard. You can see your progress in completing all your assignments, your list of activities to do and the subjects you are enrolled in. There is also a mood board to select a depiction of what you are feeling at the moment.
3. Select an emoji in the mood board to best depict your feeling at the moment.
4. Click the chatbot on the bottom right corner to watch a fun video or listen to calming music as a quick break from studies. 
5. Once you are done with the chatbot, close it.
6. Click the chatbox on the left of the chatbot to communicate with your subject teachers and counselors.
7. Once you are done with the chatbox, close it.
8. View an activity to complete by either clicking one of the red activities in the Task List or by clicking the respective subject.
9. If you clicked on the subject, you will see that there is one pending activity. Click the section that says "Click here to complete."
10. Once you are at the activity, you will see the activity description.
11. You can also click the whiteboard option to write or draaw any thought while working on the activity.
12. To submit the assignment, go to submissions from the nav bar and select the activity that has no "Already uploaded" tag under it.
13. Choose the file you want to submit and click submit to complete the submission.
14. To check the feedback from your teachers, select the feedback tab from the nav bar.
15. Once all the student tasks are done, you can click the back button on the top left to return to dashboard and you will see the progress bar is full with a congratulations message.
16. To log out, press the settings dropdown on the top right and click logout.

For signing in as a teacher:
1. Input the email: bob@ils.edu and password: password456
2. Once you press login, you will see the teacher dashboard. You can see the name of the teacher displayed and the list of students they teach.
3. Click on a student name - Alice Johnson
4. you will be direct to a student status page that tells you the assignments Alice has completed and assignments that Alice did not complete.
5. On the navbar at the top you will see three options student status, Uploads and Learning plan. Student status is where you are cuurently
6. Next, click on uploads.
7. You will be redirected to a page that shows the assignments that the teacher uploaded.
8. Next, when you click learning plan in the navbar, you will be redirected to a page that says "coming soon"
9. To log out, press the settings dropdown on the top right and click logout.

For logging in as a counsellor:
1. Input the email: zara@ils.edu and password: password321
2. Once you press login, you will see your personal platform with your name displayed at the top.
3. Use the Reminder Checklist to mark off tasks as you complete them. You can check or uncheck items based on your current progress.
4. You will also see a list of children you are a counselor for, displayed as buttons.
5. Click on a child’s name to view their detailed progress report.
6. On this screen, click the chat icon to view your conversations with that child.
7. To view the suggested learning plans for the student, click the Learning Plan button.
8. Once your tasks are done, you can click the back or home button in the learning plan and progress report pages on the top header to return to your dashboard.

For logging in as a parent:
1. Input the email: steven@ils.edu and password: password789
2. Once you press login, you will see your personal platform with your name at the top and your child’s name displayed as well.
3. On the same screen, you can view your child's progress through the Tableau dashboard screenshot embedded on the page.
4. To ask questions or get support, click the chatbot icon on the screen. The chatbot conversation can be refreshed using the refresh icon on the chatbot       header. Clicking the icon again will reduce the chatbot to not be seen anymore.
5. To review assignment feedback, click the Feedback button.
6. You will then see all assignments assigned to your child along with the corresponding feedback from teachers.
7. Once you're done reviewing, click the back or dashboard button on the top header to return to the dashboard.
8. To log out, press the settings dropdown on the top right and click logout.