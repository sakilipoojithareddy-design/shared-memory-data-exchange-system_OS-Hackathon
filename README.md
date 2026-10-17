# Shared Memory Based Data Exchange System

An OS Hackathon project demonstrating how processes can exchange data through shared memory while coordinating access for data consistency.

## Project Overview

This project uses a C program to demonstrate data exchange between a parent and child process. The child writes a message into shared memory, and the parent reads it. A POSIX semaphore coordinates access.

The demo is connected to a React frontend and an Express.js backend. Users can run the demo from the webpage and view its output.

## Technologies Used

- **C** — process creation and shared memory
- **POSIX shared memory** — `shm_open()` and `mmap()`
- **POSIX semaphore** — access coordination
- **Node.js and Express.js** — backend API
- **React and Vite** — frontend

## Project Structure

```text
shared-memory-project/
├── c_program/
│   └── shared_memory.c
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── style.css
```

## How It Works

1. The C program creates a shared memory region.
2. `fork()` creates a child process.
3. The child writes a message into shared memory.
4. A semaphore coordinates access.
5. The parent reads the message and displays the result.
6. The frontend sends a request to the backend to run the C demo and show its output.

## Running the Project

Run the C demo:

```bash
cd c_program
gcc shared_memory.c -o shared_memory -pthread
./shared_memory
```

To use the web interface, install dependencies in the `backend` and `frontend` folders, start the backend and frontend development servers, and open the frontend in your browser.

## Demonstration

The demo shows a message written by the child process and read by the parent process through shared memory.

## Future Scope

- Support data exchange between more processes.
- Add a more interactive demonstration of synchronization.
- Extend the interface to display shared-memory updates in real time.
