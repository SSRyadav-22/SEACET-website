S.E.A College Website Setup Instructions
=======================================

Follow these steps to run the website locally:

1. **Prerequisites**
   - Install Node.js from https://nodejs.org (LTS version recommended)
   - Ensure you have a code editor like Visual Studio Code

2. **Setup Project**
   - Create a folder named `sea-college-website`
   - Organize files as per the directory roadmap:


3. **Install Server Dependencies**
- Open a terminal in the `sea-college-website` folder
- Navigate to the `server` folder: `cd server`
- Run: `npm init -y` to create a package.json
- Install dependencies: `npm install express cors`

4. **Run the Server**
- In the `server` folder, run: `node server.js`
- You should see: "Server running on http://localhost:3000"

5. **Serve the Website**
- Option 1: Open `index.html` directly in a browser (chatbot works, but email simulation won't)
- Option 2: Use a local server for full functionality:
- Install live-server: `npm install -g live-server`
- In the `sea-college-website` folder, run: `live-server`
- Open the URL shown (usually http://127.0.0.1:8080)

6. **Using the Chatbot**
- Existing students: Enter student ID (e.g., 1SP22AI047) to login, then ask for "marks", "attendance", "complaint", or "logout"
- Prospective students: Ask about "courses" or "cutoff"
- Type complaints, confirm submission with "yes" to simulate email
- Next-word prediction appears below the input as you type

7. **Troubleshooting**
- If the server doesn't start, ensure port 3000 is free
- If email simulation fails, check if `node server.js` is running
- For errors, check the browser console (F12) or terminal logs

8. **Customizing**
- Add more student data in `js/student.js`
- Update courses/fees in `courses.html`
- Modify cutoffs in `admissions.html`
- Expand `wordModel` in `js/chatbot.js` for better predictions