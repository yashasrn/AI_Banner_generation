import React, { useState } from 'react';

function ImageUploader({ onImageUpload }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onImageUpload(selectedFile);
        }
    };

    return (
        <div className="image-uploader">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile}>Upload Image</button>
        </div>
    );
}

export default ImageUploader;
