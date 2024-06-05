import axios from 'axios';

// Replace with your actual mock API URL
const API_URL = 'https://run.mocky.io/v3/b9b642dd-5bb5-4640-8549-47e30ae9b1ae';

export const fetchData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data', error);
        return null;
    }
};
