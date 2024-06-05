import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ChartContainer = styled.div`
    margin: 20px;
`;

const FilterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    input, select {
        margin: 0 10px;
        padding: 5px;
    }
`;

const Dashboard: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const getData = async () => {
            const result = await fetchData();
            setData(result.AuthorWorklog.rows);
            if (result.AuthorWorklog.rows.length > 0) {
                setSelectedUser(result.AuthorWorklog.rows[0].name);
            }
        };

        getData();
    }, []);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        const user = data.find(user => user.name.toLowerCase().includes(e.target.value.toLowerCase()));
        if (user) {
            setSelectedUser(user.name);
        }
    };

    const filteredData = data
        .filter(user => user.name === selectedUser)
        .flatMap(user =>
            user.dayWiseActivity.map((day: any) => ({
                date: day.date,
                ...day.items.children.reduce((acc: any, item: any) => {
                    acc[item.label] = Number(item.count);
                    return acc;
                }, {}),
            }))
        );

    const uniqueUsers = Array.from(new Set(data.map(user => user.name)));

    return (
        <Container>
            <h1>Developer Activity Dashboard</h1>
            <FilterContainer>
                <label>Search user: </label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter user email"
                />
                <label>Select user: </label>
                <select value={selectedUser} onChange={handleUserChange}>
                    {uniqueUsers.map(user => (
                        <option key={user} value={user}>
                            {user}
                        </option>
                    ))}
                </select>
                <label>Filter by activity: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Commits">Commits</option>
                    <option value="PR Open">PR Open</option>
                    <option value="PR Merged">PR Merged</option>
                    <option value="PR Reviewed">PR Reviewed</option>
                    <option value="PR Comments">PR Comments</option>
                    <option value="Incident Alerts">Incident Alerts</option>
                    <option value="Incidents Resolved">Incidents Resolved</option>
                </select>
            </FilterContainer>
            <ChartContainer>
                <LineChart width={800} height={400} data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {(filter === 'all' || filter === 'Commits') && <Line type="monotone" dataKey="Commits" stroke="#FAC76E" />}
                    {(filter === 'all' || filter === 'PR Open') && <Line type="monotone" dataKey="PR Open" stroke="#EF6B6B" />}
                    {(filter === 'all' || filter === 'PR Merged') && <Line type="monotone" dataKey="PR Merged" stroke="#61CDBB" />}
                    {(filter === 'all' || filter === 'PR Reviewed') && <Line type="monotone" dataKey="PR Reviewed" stroke="#C2528B" />}
                    {(filter === 'all' || filter === 'PR Comments') && <Line type="monotone" dataKey="PR Comments" stroke="#0396A6" />}
                    {(filter === 'all' || filter === 'Incident Alerts') && <Line type="monotone" dataKey="Incident Alerts" stroke="#5F50A9" />}
                    {(filter === 'all' || filter === 'Incidents Resolved') && <Line type="monotone" dataKey="Incidents Resolved" stroke="#8F3519" />}
                </LineChart>
            </ChartContainer>
        </Container>
    );
};

export default Dashboard;
