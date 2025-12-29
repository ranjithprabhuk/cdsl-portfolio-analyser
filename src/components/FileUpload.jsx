import React, { useState, useRef } from 'react';
import { parseMultipleFiles, isValidCSVFile } from '../utils/csvParser';

function FileUpload({ onFilesUploaded, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    // Validate file types
    const csvFiles = files.filter(isValidCSVFile);
    
    if (csvFiles.length === 0) {
      onError('Please upload valid CSV files only.');
      return;
    }

    if (csvFiles.length !== files.length) {
      onError('Some files were skipped because they are not CSV files.');
    }

    setIsProcessing(true);

    try {
      const results = await parseMultipleFiles(csvFiles);
      
      const successfulUploads = [];
      const errors = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulUploads.push({
            id: Date.now() + index,
            ...result.value,
          });
        } else {
          errors.push(result.reason);
        }
      });

      if (successfulUploads.length > 0) {
        setUploadedFiles(prev => [...prev, ...successfulUploads]);
        onFilesUploaded(successfulUploads);
      }

      if (errors.length > 0) {
        const errorMessages = errors.map(e => e.fileName + ': ' + e.error).join('\n');
        onError(`Failed to parse ${errors.length} file(s):\n${errorMessages}`);
      }
    } catch (error) {
      onError('An error occurred while processing files: ' + error.message);
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container mb-4">
      <div
        className={`file-upload-zone ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-cloud-upload mb-3 text-primary"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
            />
            <path
              fillRule="evenodd"
              d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
            />
          </svg>
          
          <h5>Upload CDSL Portfolio CSV Files</h5>
          <p className="text-muted mb-2">
            Drag and drop CSV files here, or click to browse
          </p>
          <p className="text-muted small">
            You can upload multiple files for different family members
          </p>
          
          {isProcessing && (
            <div className="mt-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Processing...</span>
              </div>
              <span className="ms-2">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-3">
          <h6 className="mb-2">Uploaded Files ({uploadedFiles.length}):</h6>
          <div className="d-flex flex-wrap gap-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="uploaded-file-badge">
                <span className="fw-semibold">{file.metadata?.holderName || file.fileName}</span>
                <span className="text-muted small ms-2">
                  ({file.holdings?.length || 0} holdings)
                </span>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
