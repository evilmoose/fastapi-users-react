import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PdfUploader from '../components/PdfUploader';
import pdfService from '../api/pdfService';

const PDFUpload = () => {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await pdfService.uploadPdf(formData, getAuthHeaders());
      
      // Navigate to the PDF viewer page with the new PDF ID
      navigate(`/pdf-viewer/${response.id}`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadError('Failed to upload PDF. Please try again.');
      throw error; // Re-throw to be caught by the uploader component
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Upload PDF Document</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-neutral-600 mb-6">
          Upload a PDF document to analyze its content. Our system will extract text, 
          identify key information, and allow you to interact with the document.
        </p>
        
        <PdfUploader onUpload={handleUpload} />
        
        {uploadError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {uploadError}
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600">
            <li>Text extraction and OCR for scanned documents</li>
            <li>Automatic identification of key information</li>
            <li>Interactive document viewer</li>
            <li>Secure document storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload; 