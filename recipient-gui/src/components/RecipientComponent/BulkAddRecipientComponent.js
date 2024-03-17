import React, { useState } from 'react';
import axios from 'axios';
import FileReader from 'react-file-reader';

const BulkAddRecipientComponent = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Send File to the server
        axios.post('http://localhost:3001/users/bulk-add', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Successfully Upload the file:', response.data);
        })
        .catch(error => {
            console.error('File Upload Failed:', error);
        });
    };

    // handle file selection
    const handleFileChange = (files) => {
    setSelectedFile(files[0]);
    };

    return (
    <div>
        <h3 style={{display: 'inline-block'}}>Add recipients in bulk</h3>
        <div style={{display: 'inline-block', marginLeft: '15px'}}>
            <FileReader
            fileTypes={'.xlsx'} // Accepted file
            handleFiles={handleFileChange}
            
            >
            <button>Choose xlsx file</button>
            </FileReader>
            
        </div>
        <button style={{display: 'inline-block'}} onClick={handleFileUpload}>Upload</button>
      </div>
    );
};

export default BulkAddRecipientComponent;
