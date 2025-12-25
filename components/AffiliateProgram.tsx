
import React from 'react';

const AffiliateProgram: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4">Earn 20% Lifetime Commission</h1>
          <p className="text-indigo-100 text-lg mb-8">Spread the word about AutoVid and get paid every time your referrals renew their subscription. Forever.</p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Your Referral Link</p>
            <div className="flex space-x-2">
              <input 
                readOnly 
                value="https://autovid.ai/ref/alex_89" 
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none"
              />
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Copy</button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
             <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="20" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Earned</p>
          <p className="text-3xl font-bold mt-1">$4,520.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending Payout</p>
          <p className="text-3xl font-bold mt-1 text-indigo-600">$840.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Referrals</p>
          <p className="text-3xl font-bold mt-1">248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
          <p className="text-3xl font-bold mt-1">12.4%</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold">Payout History</h2>
          <button className="text-indigo-600 font-semibold text-sm">Download Tax Forms</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Amount</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { date: 'Oct 01, 2023', amount: '$1,200.00', status: 'Paid', method: 'PayPal' },
              { date: 'Sep 01, 2023', amount: '$980.00', status: 'Paid', method: 'Stripe' },
              { date: 'Aug 01, 2023', amount: '$1,500.00', status: 'Paid', method: 'PayPal' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-4 text-sm font-medium text-gray-900">{p.date}</td>
                <td className="px-8 py-4 text-sm text-gray-600 font-semibold">{p.amount}</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm text-gray-400">{p.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Need a Custom Partnership?</h2>
          <p className="text-gray-400">Agencies and high-volume affiliates get dedicated support and higher caps.</p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default AffiliateProgram;
