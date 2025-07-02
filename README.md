# Angular Socket Location Tracker 🌍📍

A real-time location tracking application built using **Angular**, **Socket.io**, and **Leaflet.js**.  
It allows users to share and view each other’s live locations on a map interface in real time.

---

## 🚀 Features

- 📡 Real-time location updates using Socket.io  
- 🗺️ Interactive map with Leaflet.js  
- 🧭 Current user's location shown with a blue marker  
- 👥 Other users shown with red markers  
- 🧠 Each user gets a unique Socket ID  
- 🛡️ Lightweight and efficient data transmission  

---

## 🛠️ Tech Stack

### Frontend
- Angular  
- Leaflet.js  
- RxJS  
- Socket.io-client  

### Backend
- Node.js  
- Express.js  
- Socket.io  

---

## 📁 Folder Structure

```
realtime-location-tracker/
├── backend/               # Express + Socket.io server
│   └── index.js
├── frontend/              # Angular frontend app
│   └── src/
├── .gitignore
├── README.md
```

---

## 📦 Installation & Running

### Step 1: Clone the Repository

```bash
git clone https://github.com/SatishBytes/angular-socket-location-tracker.git
cd angular-socket-location-tracker
```

### Step 2: Start the Backend Server

```bash
cd backend
npm install
node index.js
```

> 🚀 Server will start on `http://localhost:8080`

### Step 3: Start the Angular Frontend

```bash
cd ../frontend
npm install
ng serve
```

> 🌐 App will run on `http://localhost:4200`

---

## 📸 Demo Screenshot

> _(Add a screenshot here showing live map with blue/red markers)_

---

## 🌐 Live Demo

> _(Add your deployed link here if hosting it on Vercel, Netlify, or Render)_

---

## 🙌 Author

Made with ❤️ by [Satish Yadav](https://github.com/SatishBytes)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
