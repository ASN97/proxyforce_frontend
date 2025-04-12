import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelect from './pages/RoleSelect';
import ExperienceSelect from './pages/ExperienceSelect';
// import ChatPage from './pages/ChatPage'; // optional for future

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/experience" element={<ExperienceSelect />} />
        {/* <Route path="/chat" element={<ChatPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
