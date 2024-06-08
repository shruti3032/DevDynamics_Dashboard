import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';
import theme from '../theme/theme';
import Navbar from './navbar';
import GlobalStyle from '../globalStyles';

const StyledContainer = styled(Container)`
  background-color: #f5f6f8;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData();
        console.log('Fetched Data:', result); // Log the fetched data
        setData(result.AuthorWorklog?.rows || []);
        if (result.AuthorWorklog?.rows?.length > 0) {
          setSelectedUser(result.AuthorWorklog.rows[0].name);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value as string);
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
        }, {})
      }))
    );

  const uniqueUsers = Array.from(new Set(data.map(user => user.name)));

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar />
      <StyledContainer maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Developer Activity Dashboard
          </Typography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search user"
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Select user</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={handleUserChange}
                  label="Select user"
                >
                  {uniqueUsers.map(user => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Filter by activity</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filter by activity"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Commits">Commits</MenuItem>
                  <MenuItem value="PR Open">PR Open</MenuItem>
                  <MenuItem value="PR Merged">PR Merged</MenuItem>
                  <MenuItem value="PR Reviewed">PR Reviewed</MenuItem>
                  <MenuItem value="PR Comments">PR Comments</MenuItem>
                  <MenuItem value="Incident Alerts">Incident Alerts</MenuItem>
                  <MenuItem value="Incidents Resolved">Incidents Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <LineChart width={999} height={400} data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(filter === 'all' || filter === 'Commits') && (
                    <Line type="monotone" dataKey="Commits" stroke="#C5D70C" />
                  )}
                  {(filter === 'all' || filter === 'PR Open') && (
                    <Line type="monotone" dataKey="PR Open" stroke="#EF6B6B" />
                  )}
                  {(filter === 'all' || filter === 'PR Merged') && (
                    <Line type="monotone" dataKey="PR Merged" stroke="#61CDBB" />
                  )}
                  {(filter === 'all' || filter === 'PR Reviewed') && (
                    <Line type="monotone" dataKey="PR Reviewed" stroke="#C2528B" />
                  )}
                  {(filter === 'all' || filter === 'PR Comments') && (
                    <Line type="monotone" dataKey="PR Comments" stroke="#0396A6" />
                  )}
                  {(filter === 'all' || filter === 'Incident Alerts') && (
                    <Line type="monotone" dataKey="Incident Alerts" stroke="#5F50A9" />
                  )}
                  {(filter === 'all' || filter === 'Incidents Resolved') && (
                    <Line type="monotone" dataKey="Incidents Resolved" stroke="#8F3519" />
                  )}
                </LineChart>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
