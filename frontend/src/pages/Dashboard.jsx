import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserPreferencesTable from '../components/UserPreferencesTable';
import InterestedUsersBroker from '../components/InterestedUsersBroker';
import AdvAnalyticsBroker from '../components/AdvAnalyticsBroker';

const Dashboard = () => {
    const [preferences, setPreferences] = useState([]);
    const [interestedUsers, setInterestedUsers] = useState([]);
    const [loadingPreferences, setLoadingPreferences] = useState(true);
    const [loadingInterested, setLoadingInterested] = useState(true);
    const [activeSection, setActiveSection] = useState('preferences');

    const { token, currentUser } = useSelector((state) => state.user);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchPreferences = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/user/get-all-preferences`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) setPreferences(res.data.preferences);
        } catch (err) {
            console.error('Failed to fetch preferences:', err);
        } finally {
            setLoadingPreferences(false);
        }
    };

    const fetchInterestedUsers = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/user/get-interested-users/${currentUser._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) setInterestedUsers(res.data.data);
            console.log(res.data.data);

        } catch (err) {
            console.error('Failed to fetch interested users:', err);
        } finally {
            setLoadingInterested(false);
        }
    };

    useEffect(() => {
        fetchPreferences();
        fetchInterestedUsers();
    }, []);

    console.log("pref", preferences);


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveSection('preferences')}
                    className={`px-4 py-2 rounded-3xl font-medium ${activeSection === 'preferences' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All Preferences
                </button>
                <button
                    onClick={() => setActiveSection('interested')}
                    className={`px-4 py-2 rounded-3xl font-medium ${activeSection === 'interested' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Interested Users
                </button>
                <button
                    onClick={() => setActiveSection('analytics')}
                    className={`px-4 py-2 rounded-3xl font-medium ${activeSection === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Analytics
                </button>
            </div>

            <div>
                {activeSection === 'preferences' && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">All Users & Preferences</h2>
                        <UserPreferencesTable preferences={preferences} loading={loadingPreferences} />
                    </section>
                )}

                {activeSection === 'interested' && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Users Interested In Your Listings</h2>
                        <InterestedUsersBroker data={interestedUsers} loading={loadingInterested} />
                    </section>
                )}

                {activeSection === 'analytics' && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Advanced Analytics</h2>
                        <AdvAnalyticsBroker preferences={preferences} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
