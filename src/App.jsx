import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./Pages/LandingPage"
import RoleSelect from "./Pages/RoleSelect"
import ExperienceSelect from "./Pages/ExperienceSelect"
import ChatPage from "./Pages/ChatPage" // Fixed casing in import path
import ProjectsPage from "./Pages/ProjectsPage"
import NewProjectPage from "./Pages/NewProjectPage"
import ProjectSuccessPage from "./Pages/ProjectSuccessPage"
import ProjectDashboardPage from "./Pages/ProjectDashboardPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roles" element={<RoleSelect />} />
        <Route path="/experience" element={<ExperienceSelect />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/new-project" element={<NewProjectPage />} />
        <Route path="/project-success" element={<ProjectSuccessPage />} />
        <Route path="/project/:projectId" element={<ProjectDashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App
