
import React, { useState } from 'react';
import { VideoProject } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_VIDEOS: VideoProject[] = [
  { id: '1', title: '10 Life Hacks for Better Sleep', status: 'Published', thumbnailUrl: 'https://picsum.photos/seed/sleep/320/180', createdAt: '2023-10-01', views: 1240 },
  { id: '2', title: 'Why AI is Changing Everything', status: 'Published', thumbnailUrl: 'https://picsum.photos/seed/ai/320/180', createdAt: '2023-10-02', views: 890 },
  { id: '3', title: 'Top 5 Cities to Visit in 2024', status: 'Ready', thumbnailUrl: 'https://picsum.photos/seed/travel/320/180', createdAt: '2023-10-03', views: 0 },
  { id: '4', title: 'How to Build a SaaS in 24 Hours', status: 'Generating', thumbnailUrl: 'https://picsum.photos/seed/saas/320/180', createdAt: '2023-10-04', views: 0 },
];

const MOCK_DATA = [
  { name: 'Mon', views: 400 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 600 },
  { name: 'Thu', views: 800 },
  { name: 'Fri', views: 500 },
  { name: 'Sat', views: 900 },
  { name: 'Sun', views: 1100 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Creator</h1>
          <p className="text-gray-500">Your channel is currently on autopilot.</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Channel Connected: @HealthyHabits
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-sm text-gray-500 font-medium">Total Views</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">24.5k</span>
            <span className="text-green-600 text-xs font-semibold">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-sm text-gray-500 font-medium">Subscribers</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">1,892</span>
            <span className="text-green-600 text-xs font-semibold">+4.5%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-sm text-gray-500 font-medium">Auto-Videos Created</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">128</span>
            <span className="text-gray-400 text-xs font-medium">This month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6">Views Growth</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#4f46e5" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Daily Queue</h2>
          <div className="space-y-4">
            {MOCK_VIDEOS.map(video => (
              <div key={video.id} className="flex space-x-3 items-center">
                <img src={video.thumbnailUrl} alt={video.title} className="w-20 h-12 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{video.title}</p>
                  <p className="text-xs text-gray-500">{video.status}</p>
                </div>
                {video.status === 'Published' && (
                  <span className="text-xs font-medium text-gray-400">{video.views} views</span>
                )}
              </div>
            ))}
            <button className="w-full mt-4 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-all">
              + Generate More Clips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
