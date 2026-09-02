import React, { useState } from 'react';
import { List, Accessibility, Clock } from 'lucide-react';
import { Station } from '@/lib/mockData';

interface StationInfoPanelProps {
  station: Station;
}

export default function StationInfoPanel({ station }: StationInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'accessibility' | 'hours'>('features');

  const features = [
    "Kamar Mandi / Toilet",
    "Tidak Ada WiFi",
    "Tidak ada ruang tunggu eksekutif (Lounge)",
    "Tidak ada ATM",
    "Tidak ada mesin tiket mandiri",
    "Tiba minimal 30 menit sebelum keberangkatan."
  ];

  const accessibility = [
    "Lift kursi roda",
    "Peron ramah disabilitas",
    "Toilet ramah disabilitas",
    "Parkir harian ramah disabilitas",
    "Parkir inap ramah disabilitas",
    "Tidak ada ruang tunggu disabilitas",
    "Tidak ada peron tinggi",
    "Tidak tersedia kursi roda"
  ];

  const hours = [
    { day: "Senin - Jumat", times: ["12:00 - 00:15", "04:40 - 05:40", "23:15 - 23:59"] },
    { day: "Sabtu - Minggu", times: ["13:00 - 01:15", "05:30 - 06:45", "22:00 - 23:30"] }
  ];

  return (
    <div className="flex border-t border-gray-100 bg-gray-50/50 rounded-b-xl overflow-hidden text-sm max-h-[300px]">
      {/* Vertical Icon Tabs */}
      <div className="flex flex-col bg-gray-100 border-r border-gray-200 p-1">
        <button 
          onClick={() => setActiveTab('features')}
          className={`p-3 rounded-lg transition-colors cursor-pointer ${activeTab === 'features' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Fasilitas"
        >
          <List size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('accessibility')}
          className={`p-3 rounded-lg transition-colors cursor-pointer ${activeTab === 'accessibility' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Aksesibilitas"
        >
          <Accessibility size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('hours')}
          className={`p-3 rounded-lg transition-colors cursor-pointer ${activeTab === 'hours' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Jam Operasional"
        >
          <Clock size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'features' && (
          <div className="animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <List size={16} className="text-gray-400" /> Fasilitas
            </h4>
            <ul className="space-y-1.5 text-gray-600">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span className={feature.toLowerCase().includes("tidak") ? "text-gray-400" : ""}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Accessibility size={16} className="text-gray-400" /> Aksesibilitas
            </h4>
            <ul className="space-y-1.5 text-gray-600">
              {accessibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span className={item.toLowerCase().includes("tidak") ? "text-gray-400" : ""}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Jam Operasional
            </h4>
            <div className="space-y-3">
              {hours.map((schedule, idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-100 pb-2 last:border-0 gap-4">
                  <span className="font-semibold text-gray-700 whitespace-nowrap">{schedule.day}</span>
                  <div className="flex flex-col text-right text-gray-500">
                    {schedule.times.map((time, i) => (
                      <span key={i}>{time}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
