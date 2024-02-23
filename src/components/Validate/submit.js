import axios from 'axios';

const submit = async (gtfile, predfile, setHistory, note='') => {
    console.log('gtfile:', gtfile, 'predfile:', predfile, 'note:', note);
    try {
        if (gtfile === undefined || predfile === undefined) {
            throw new Error('Both files are required');
        }
        const formData = new FormData();
        formData.append('file1', gtfile);
        formData.append('file2', predfile);
        formData.append('note', note);
        console.log(formData)
        const response = await axios.post('http://localhost:8000/submit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            const data = response.data;
            setHistory(data.history);
            console.log(data);
        } else {
            throw new Error(`Failed to submit data. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error submitting data:', error.message);
    }
};

export default submit;
