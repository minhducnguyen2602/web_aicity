import axios from 'axios';

const loadHistory = async (setHistory) => {
    try {
        const response = await axios.get('http://localhost:8000/history/');
        
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = response.data;
        setHistory(data.history);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

export default loadHistory;

