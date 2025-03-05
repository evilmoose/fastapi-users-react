import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const PdfUploader = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    // Reset states
    setError(null);
    setSuccess(false);
    
    // Validate file
    const file = acceptedFiles[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    
    // Upload file
    try {
      setUploading(true);
      await onUpload(file);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-neutral-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
            <p className="text-neutral-600">Uploading your PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-neutral-400 mb-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            
            <p className="text-lg font-medium text-neutral-700 mb-1">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </p>
            <p className="text-neutral-500 mb-2">or click to browse files</p>
            <p className="text-xs text-neutral-400">Only PDF files are accepted</p>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mt-3 text-sm text-green-600">
          PDF uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default PdfUploader; 