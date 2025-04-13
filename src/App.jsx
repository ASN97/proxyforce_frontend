import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RoleSelect from "./pages/RoleSelect"
import ExperienceSelect from "./pages/ExperienceSelect"
import ChatPage from "./pages/ChatPage" // Fixed casing in import path
import ProjectsPage from "./pages/ProjectsPage"
import NewProjectPage from "./pages/NewProjectPage"
import ProjectSuccessPage from "./pages/ProjectSuccessPage"
import ProjectDashboardPage from "./pages/ProjectDashboardPage"

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
