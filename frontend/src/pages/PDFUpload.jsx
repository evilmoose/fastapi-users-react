import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PdfUploader from '../components/PdfUploader';
import PDFDocumentList from '../components/PDFDocumentList';
import pdfService from '../api/pdfService';
import LayoutWithScroll from '../components/LayoutWithScroll';

const PDFUpload = () => {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [uploadError, setUploadError] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleUpload = async (file) => {
    try {
      // Pass the file directly to pdfService.uploadPdf
      const response = await pdfService.uploadPdf(file, getAuthHeaders());
      
      // Trigger a refresh of the document list
      setRefreshList(prev => prev + 1);
      
      // Navigate to the PDF viewer page with the new PDF ID
      navigate(`/pdf-viewer/${response.id}`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadError('Failed to upload PDF. Please try again.');
      throw error; // Re-throw to be caught by the uploader component
    }
  };

  return (
    <LayoutWithScroll>
      <h1 className="text-3xl font-bold mb-6">PDF Documents</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
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
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                <li>Text extraction and OCR for scanned documents</li>
                <li>Automatic identification of key information</li>
                <li>Interactive document viewer</li>
                <li>Secure document storage</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <PDFDocumentList key={refreshList} showTitle={true} />
          </div>
        </div>
      </div>
    </LayoutWithScroll>
  );
};

export default PDFUpload; 