import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectCreateSinglePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "pm";
  const tier = queryParams.get("tier") || "1";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    budget: "",
    budgetUsed: "0",
    currentStage: "initial",
    teamMembers: [{ name: "", email: "", skills: "", hoursPerWeek: "", hourlyWage: "" }],
    stakeholders: [{ name: "", email: "", role: "" }],
    techStack: "",
    buffer: "",
    risks: [{ description: "", impact: "medium", mitigation: "" }],
    objectives: "",
    successCriteria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const addArrayItem = (type, newItem) => {
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  const removeArrayItem = (type, index) => {
    const updated = [...formData[type]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const transformBeforeSubmit = () => {
    return {
      project_name: formData.name,
      description: formData.description,
      team_members: formData.teamMembers.map(m => ({
        name: m.name,
        email: m.email,
        skills: m.skills.split(',').map(s => s.trim()).filter(Boolean),
        hours_per_week: parseInt(m.hoursPerWeek),
        hourly_wage: parseFloat(m.hourlyWage)
      })),
      stakeholders: formData.stakeholders.map(s => `${s.name} (${s.role})`),
      start_date: formData.startDate,
      deadline: formData.deadline,
      buffer_days: parseInt(formData.buffer),
      budget: parseFloat(formData.budget),
      budget_used: parseFloat(formData.budgetUsed),
      tech_stack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      current_stage: formData.currentStage,
      additional_info: `${formData.objectives}. ${formData.successCriteria}`
    };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = transformBeforeSubmit();
  
    try {
      const res = await fetch("http://localhost:8000/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await res.json();
  
      if (result.status === "ok") {
        navigate(`/project-success?role=${role}&tier=${tier}`);
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Backend error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B19] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0B0B19] bg-scales"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700 opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-700 opacity-20 blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-amber-400 text-shadow-gold">
          Create New Project
        </h1>
        <p className="text-gray-400 mb-8">
          Fill all details for your AI teammate to begin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Fields */}
          <div>
            <label className="block mb-1 text-sm">Project Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30 mb-2" placeholder="Project Name" />
            <label className="block mb-1 text-sm">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30 mb-2" placeholder="Project Description" />
            <label className="block mb-1 text-sm">Objectives</label>
            <textarea name="objectives" value={formData.objectives} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30 mb-2" placeholder="Goals/Objectives" />
            <label className="block mb-1 text-sm">Success Criteria</label>
            <textarea name="successCriteria" value={formData.successCriteria} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30" placeholder="Define success" />
          </div>

          {/* Dates & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Start Date</label>
              <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Deadline</label>
              <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Stage</label>
              <select name="currentStage" value={formData.currentStage} onChange={handleChange} className="w-full p-2 rounded bg-[#0B0B19] border border-amber-500/30">
                <option value="initial">Initial</option>
                <option value="notStarted">Not Started</option>
                <option value="someProgress">Some Progress</option>
              </select>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h2 className="text-lg font-bold mb-3">Team Members</h2>
            {formData.teamMembers.map((m, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-4">
                <input placeholder="Name" value={m.name} onChange={(e) => handleArrayChange("teamMembers", i, "name", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Email" value={m.email} onChange={(e) => handleArrayChange("teamMembers", i, "email", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Skills" value={m.skills} onChange={(e) => handleArrayChange("teamMembers", i, "skills", e.target.value)} className="col-span-2 p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Hours/week" value={m.hoursPerWeek} onChange={(e) => handleArrayChange("teamMembers", i, "hoursPerWeek", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Hourly Wage" value={m.hourlyWage} onChange={(e) => handleArrayChange("teamMembers", i, "hourlyWage", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                {formData.teamMembers.length > 1 && <button type="button" onClick={() => removeArrayItem("teamMembers", i)} className="text-red-500 text-sm">Remove</button>}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("teamMembers", { name: "", email: "", skills: "", hoursPerWeek: "", hourlyWage: "" })} className="text-amber-400 border border-amber-500 px-3 py-1 rounded mt-2">+ Add Member</button>
          </div>

          {/* Stakeholders */}
          <div>
            <h2 className="text-lg font-bold mb-3">Stakeholders</h2>
            {formData.stakeholders.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-4">
                <input placeholder="Name" value={s.name} onChange={(e) => handleArrayChange("stakeholders", i, "name", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Email" value={s.email} onChange={(e) => handleArrayChange("stakeholders", i, "email", e.target.value)} className="p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                <input placeholder="Role" value={s.role} onChange={(e) => handleArrayChange("stakeholders", i, "role", e.target.value)} className="col-span-2 p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
                {formData.stakeholders.length > 1 && <button type="button" onClick={() => removeArrayItem("stakeholders", i)} className="text-red-500 text-sm">Remove</button>}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("stakeholders", { name: "", email: "", role: "" })} className="text-amber-400 border border-amber-500 px-3 py-1 rounded mt-2">+ Add Stakeholder</button>
          </div>

          {/* Final Details */}
          <div>
            <h2 className="text-lg font-bold mb-3">Other Details</h2>
            <input placeholder="Tech Stack" name="techStack" value={formData.techStack} onChange={handleChange} className="w-full p-2 bg-[#0B0B19] border border-amber-500/30 rounded mb-2" />
            <input placeholder="Buffer (days)" name="buffer" value={formData.buffer} onChange={handleChange} className="w-full p-2 bg-[#0B0B19] border border-amber-500/30 rounded mb-2" />
            <input placeholder="Budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 bg-[#0B0B19] border border-amber-500/30 rounded mb-2" />
            <input placeholder="Budget Used" name="budgetUsed" value={formData.budgetUsed} onChange={handleChange} className="w-full p-2 bg-[#0B0B19] border border-amber-500/30 rounded" />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-6 py-3 rounded-full shadow-lg hover-glow">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateSinglePage;
