import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tiers = [
  {
    label: 'Tier 1',
    years: '2 Years of Experience',
    desc: 'Junior teammate — focused, fast learner',
    level: 1,
  },
  {
    label: 'Tier 2',
    years: '5 Years of Experience',
    desc: 'Mid-level — confident & consistent',
    level: 2,
  },
  {
    label: 'Tier 3',
    years: '10 Years of Experience',
    desc: 'Senior strategist — proactive & polished',
    level: 3,
  },
];

const roleThemes = {
  pm: '#3B82F6', // blue
  sales: '#EF4444', // red
  marketing: '#22C55E', // green
};

const ExperienceSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'pm';
  const bgColor = roleThemes[role] || '#E75A5A';

  const handleSelect = (tier) => {
    navigate(`/chat?role=${role}&tier=${tier}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={{ backgroundColor: bgColor }}>
      <div className="backdrop-blur-md bg-white/30 rounded-3xl p-10 shadow-2xl max-w-4xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          How experienced should your AI teammate be?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(tier.level)}
              className="bg-white rounded-2xl p-6 cursor-pointer shadow-lg hover:scale-105 transition-all border border-white hover:border-opacity-80"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{tier.label}</h3>
              <p className="text-sm text-gray-500 mb-1">{tier.years}</p>
              <p className="text-sm text-gray-600">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSelect;
