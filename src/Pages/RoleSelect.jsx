import React from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  {
    name: 'Project Manager',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'pm',
    color: 'blue-400',
    description: 'Break down projects, assign tasks, and track timelines.'
  },
  {
    name: 'Sales Executive',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'sales',
    color: 'red-400',
    description: 'Engage leads, draft cold emails, and log CRM updates.'
  },
  {
    name: 'Marketing Analyst',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'marketing',
    color: 'green-400',
    description: 'Create campaigns, generate SEO content, and analyze trends.'
  },
];

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/experience?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#E75A5A] flex items-center justify-center py-10 px-4">
      <div className="backdrop-blur-md bg-white/30 rounded-3xl p-10 shadow-2xl max-w-5xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-10">
          Choose your AI teammate to begin 🌸
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {roles.map((r, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(r.role)}
              className={`bg-white rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition-all duration-200 flex flex-col items-center p-6 border hover:border-${r.color}`}
            >
              <img
                src={r.img}
                alt={r.name}
                className={`w-32 h-32 object-cover rounded-full ring-4 ring-${r.color} mb-4`}
              />
              <p className={`text-lg font-semibold text-${r.color} mb-1`}>{r.name}</p>
              <p className="text-sm text-gray-500 text-center">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
