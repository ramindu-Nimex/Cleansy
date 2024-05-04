import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchAllAnnouncements();
    }, []);

    const fetchAllAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error.message);
        }
    };

    const handleAnnouncementClick = (announcementID) => {
        // Handle click event for announcement
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredAnnouncements = announcements.filter((announcement) =>
        announcement.Title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === '' || announcement.Category_ID === selectedCategory) &&
        (filterDate === '' || new Date(announcement.Create_At).toLocaleDateString() === new Date(filterDate).toLocaleDateString())
    );

    return (
        <div>
            <div className="text-center mb-4 "> {/* Centering the title and search/filter options */}
                <h1 className="text-2xl font-bold mb-4">All Announcements</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={handleDateChange}
                        className="ml-2 p-2 border border-gray-300 rounded dark:text-slate-700"
                    />
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="ml-2 p-2 border border-gray-300 rounded dark:text-slate-700"
                    >
                        <option value="">All Categories</option>
                        <option value="staff">Staff</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap justify-center dark:text-slate-700"> {/* Centering the announcement cards */}
                {filteredAnnouncements.map((announcement) => (
                    <div key={announcement._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-2">
                        <a
                            href="#"
                            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                            onClick={() => handleAnnouncementClick(announcement._id)}
                        >
                            <h2 className="text-lg font-bold mb-2 text-center">{announcement.Title}</h2>
                            <p className="text-gray-700 mb-4">{announcement.Content}</p>
                            <p className="text-center font-bold">{announcement.Category_ID}</p>
                            <p className="text-sm text-gray-500">Created at - {new Date(announcement.Create_At).toLocaleString()}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllAnnouncements;
