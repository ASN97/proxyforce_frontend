// export const projectsAPI = {
//   getProjectById: async (projectId) => {
//     const res = await fetch(`http://localhost:8000/projects/${projectId}`);
//     if (!res.ok) throw new Error("Project not found");
//     return await res.json();
//   },
// }

// export const tasksAPI = {
//   createTask: async (projectId, taskData) => {
//     const res = await fetch(`http://localhost:8000/projects/${projectId}/add-task`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(taskData),
//     });
//     if (!res.ok) throw new Error("Failed to create task");
//     return await res.json();
//   },  
// }

// export const chatAPI = {
//   getProjectMessages: async (projectId) => {
//     // Placeholder implementation
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           { id: "1", content: "Hello!", sender: "ai", timestamp: new Date() },
//           { id: "2", content: "Hi there!", sender: "user", timestamp: new Date() },
//         ])
//       }, 200)
//     })
//   },
//   sendProjectMessage: async (projectId, messageData) => {
//     // Placeholder implementation
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ id: Date.now().toString(), content: "Acknowledged.", sender: "ai" })
//       }, 400)
//     })
//   },
// }

// export const riskAPI = {
//   generateRiskReport: async (projectId) => {
//     // Placeholder implementation
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           report: "Sample risk report",
//           risks: [
//             {
//               description: "Risk 1",
//               impact: "high",
//               probability: 70,
//               mitigation: "Mitigation 1",
//               contingency: "Contingency 1",
//             },
//             {
//               description: "Risk 2",
//               impact: "medium",
//               probability: 50,
//               mitigation: "Mitigation 2",
//               contingency: "Contingency 2",
//             },
//           ],
//           completionProbability: 85,
//         })
//       }, 600)
//     })
//   },
// }

// export const emailAPI = {
//   generateEmailTemplate: async (projectId, templateData) => {
//     // Placeholder implementation
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ content: "Sample email content", subject: "Sample Subject" })
//       }, 500)
//     })
//   },
//   sendEmail: async (projectId, emailTemplate) => {
//     // Placeholder implementation
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({})
//       }, 300)
//     })
//   },
// }
