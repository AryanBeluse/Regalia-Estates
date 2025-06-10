import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdvAnalyticsBroker = ({ preferences }) => {
    const [cityCounts, setCityCounts] = useState({});
    const [typeCounts, setTypeCounts] = useState({});
    const [listingTypeCounts, setListingTypeCounts] = useState({ sell: 0, rent: 0 });
    const [budgetDistribution, setBudgetDistribution] = useState({});

    useEffect(() => {
        const cityMap = {}, typeMap = { Apartment: 0, Villa: 0, Commercial: 0, Land: 0 }, listingMap = { sell: 0, rent: 0 }, budgetMap = { 'Under 30L': 0, '30L-50L': 0, '50L-1Cr': 0, '1Cr+': 0 };
        preferences.forEach(p => {
            p.preferredCities?.forEach(c => cityMap[c] = (cityMap[c] || 0) + 1);
            p.propertyTypes?.forEach(t => typeMap[t] = (typeMap[t] || 0) + 1);
            p.listingType?.forEach(t => listingMap[t]++);
            const avg = (p.minPrice + p.maxPrice) / 2;
            if (avg < 3000000) budgetMap['Under 30L']++;
            else if (avg <= 5000000) budgetMap['30L-50L']++;
            else if (avg <= 10000000) budgetMap['50L-1Cr']++;
            else budgetMap['1Cr+']++;
        });
        setCityCounts(cityMap); setTypeCounts(typeMap); setListingTypeCounts(listingMap); setBudgetDistribution(budgetMap);
    }, [preferences]);

    const getMaxValue = vals => {
        if (!vals || vals.length === 0) return 5;
        const max = Math.max(...vals);
        return max < 5 ? 5 : max + 1;
    };



    return (
        <div>
            <h2>Explore the detailed breakdown of user preferences to better understand market trends.</h2>
            <div className="flex flex-wrap justify-between gap-4 mt-6">
                {/* Most Preferred Cities */}
                <div title="Most Preferred Cities" className="hover:shadow-lg bg-white rounded-xl shadow p-4 w-[23%] min-w-[220px] h-[270px] flex flex-col items-center">
                    <h3 className="text-gray-700 font-semibold text-sm mb-2 text-center">Most Preferred Cities</h3>
                    <div className="w-full h-[200px]">
                        <Bar
                            data={{
                                labels: Object.keys(cityCounts),
                                datasets: [{ label: 'Users', data: Object.values(cityCounts), backgroundColor: '#3b82f6' }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { font: { size: 10 } } },
                                    y: { min: 0, max: getMaxValue(Object.values(cityCounts)), ticks: { stepSize: 1, font: { size: 10 } }, beginAtZero: true },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Sell vs Rent */}
                <div title="Sell vs Rent Preferences" className="hover:shadow-lg bg-white rounded-xl shadow p-4 w-[23%] min-w-[220px] h-[270px] flex flex-col items-center">
                    <h3 className="text-gray-700 font-semibold text-sm mb-2 text-center">Sell vs Rent Preferences</h3>
                    <div className="w-full h-[200px] flex justify-center items-center">
                        <Pie
                            data={{
                                labels: ['Sell', 'Rent'],
                                datasets: [{ data: [listingTypeCounts.sell, listingTypeCounts.rent], backgroundColor: ['#10b981', '#3b82f6'] }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } },
                            }}
                        />
                    </div>
                </div>

                {/* Budget Distribution */}
                <div title="Budget Distribution" className="hover:shadow-lg bg-white rounded-xl shadow p-4 w-[23%] min-w-[220px] h-[270px] flex flex-col items-center">
                    <h3 className="text-gray-700 font-semibold text-sm mb-2 text-center">Budget Distribution</h3>
                    <div className="w-full h-[200px] flex justify-center items-center">
                        <Doughnut
                            data={{
                                labels: Object.keys(budgetDistribution),
                                datasets: [{ data: Object.values(budgetDistribution), backgroundColor: ['#facc15', '#fb923c', '#6366f1', '#ef4444'] }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } },
                            }}
                        />
                    </div>
                </div>

                {/* Preferred Property Types */}
                <div title="Preferred Property Types" className="hover:shadow-lg bg-white rounded-xl shadow p-4 w-[23%] min-w-[220px] h-[270px] flex flex-col items-center">
                    <h3 className="text-gray-700 font-semibold text-sm mb-2 text-center">Preferred Property Types</h3>
                    <div className="w-full h-[200px]">
                        <Bar
                            data={{
                                labels: Object.keys(typeCounts),
                                datasets: [{ label: 'Users', data: Object.values(typeCounts), backgroundColor: ['#a855f7', '#3b82f6', '#f43f5e', '#10b981'] }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { font: { size: 10 }, maxRotation: 0, minRotation: 0, autoSkip: false } },
                                    y: { min: 0, max: getMaxValue(Object.values(typeCounts)), ticks: { stepSize: 1, font: { size: 10 } }, beginAtZero: true },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6  grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <div className="bg-blue-100 border text-center border-blue-400  rounded-md p-4">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Most Preferred City</h4>
                    <p className="text-gray-700 font-semibold text-md">{Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}</p>
                </div>
                <div className="bg-green-100 border text-center border-green-400 rounded-md p-4">
                    <h4 className="font-semibold text-green-800 text-sm mb-1">Trending Property Type</h4>
                    <p className="text-gray-700 font-semibold text-md">{Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}</p>
                </div>
                <div className="bg-orange-100 border text-center border-orange-400 rounded-md p-4">
                    <h4 className="font-semibold text-orange-900 text-sm mb-1">Most Popular Budget Range</h4>
                    <p className="text-gray-700 font-semibold text-md">
                        {Object.entries(budgetDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </p>
                </div>

                <div className="bg-indigo-100 border text-center border-indigo-400 rounded-md p-4">
                    <h4 className="font-semibold text-indigo-900 text-sm mb-1">Most Chosen Listing Type</h4>
                    <p className="text-gray-700 font-semibold text-md">{listingTypeCounts.sell >= listingTypeCounts.rent ? 'Sell' : 'Rent'}</p>
                </div>

            </div>
        </div>
    )

};

export default AdvAnalyticsBroker;
