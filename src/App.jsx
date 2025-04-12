import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RoleSelect from "./pages/RoleSelect"
import ExperienceSelect from "./pages/ExperienceSelect"
import Project from "./pages/Project"
import ProjectCreate from "./Pages/ProjectCreate"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roles" element={<RoleSelect />} />
        <Route path="/experience" element={<ExperienceSelect />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/project/create" element={<ProjectCreate />} />
      </Routes>
    </Router>
  )
}

export default App
