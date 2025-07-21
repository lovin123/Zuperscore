# Real-Time Note Taking App

This is a collaborative, real-time note-taking application that allows multiple users to join a session and edit a document simultaneously. It features a rich text editor, live chat, and typing indicators to create a seamless collaborative experience.

**Live Demo:** [**https://zuperscore-ashy.vercel.app/**](https://zuperscore-nine.vercel.app/)

---

## Features

- **Real-Time Collaboration:** Multiple users can join the same document session and see changes live.
- **Rich Text Editor:** A powerful editor that supports various text formatting options.
- **Live Chat:** A chat window for users to communicate within the session.
- **Typing Indicators:** See who is currently typing to avoid conflicts.
- **Session-Based:** Create or join unique sessions using a session ID.
- **Responsive Design:** Works smoothly on both desktop and mobile devices.

---

## Technology Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Real-Time Communication:** [Socket.IO Client](https://socket.io/docs/v4/client-installation/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Text Editor:** [Tiptap](https://tiptap.dev/)

### Backend

- **Framework:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Real-Time Communication:** [Socket.IO](https://socket.io/)

---

## Project Structure

The application is organized into two main parts within the `Real-Time-Note-Taking` directory:

- **/Frontend:** Contains the Next.js application, including all UI components, pages, and client-side logic.
- **/Backend:** Contains the Node.js/Express server that powers the real-time WebSocket communication via Socket.IO.

---

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or later)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>/Real-Time-Note-Taking
```

### 2. Install Dependencies

You'll need to install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 3. Set Up Environment Variables

The frontend requires a connection to the backend server.

1. In the `Frontend` directory, create a new file named `.env.local`.
2. Add the following line to the file:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 4. Run the Backend Server

```bash
cd Backend
npm start
```

The backend server will start on `http://localhost:4000`.

### 5. Run the Frontend Application

In a separate terminal, run the frontend:

```bash
cd Frontend
npm run dev
```

The frontend development server will start. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## How It Works

The application uses Socket.IO to establish a persistent, bidirectional connection between the client (frontend) and the server (backend).

1.  When a user joins a session, they are added to a "room" on the server specific to that session ID.
2.  Any changes to the text editor, chat messages, or typing status are emitted as events from the client to the server.
3.  The server then broadcasts these events to all other users in the same room, ensuring that everyone's view is synchronized in real-time.
4.  The backend holds the session state (document content, chat history) in memory. When a new user joins, the server sends them the current state.
