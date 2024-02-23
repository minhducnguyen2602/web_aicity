import axios from 'axios';

const ProcessBboxes = async (fileLabel, checkedClasses, setBboxes) => {
    if (fileLabel) {
        try {
            const formData = new FormData();
            formData.append('file', fileLabel);

            // Append the JSON data with the key 'checklist'
            formData.append('checklist', JSON.stringify(checkedClasses));

            console.log(formData);

            const response = await axios.post('http://localhost:8000/process_bboxes/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
            setBboxes(response.data.processed_content);            ;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    } else {
        console.log(fileLabel);
    }
};

export default ProcessBboxes;
