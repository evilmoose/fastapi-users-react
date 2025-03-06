import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useAuth } from '../contexts/AuthContext';
import pdfService from '../api/pdfService';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const { pdfId } = useParams();
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  
  const [pdf, setPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [scale, setScale] = useState(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // Fetch PDF data
  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        setLoading(true);
        
        // Get PDF document
        const pdfData = await pdfService.getPdf(pdfId, getAuthHeaders());
        setPdf(pdfData);
        
        // Get PDF URL
        const urlData = await pdfService.getPdfUrl(pdfId, getAuthHeaders());
        setPdfUrl(urlData.url);
        
        // Get OCR data if available
        try {
          const ocrResult = await pdfService.getPdfOcr(pdfId, getAuthHeaders());
          setOcrData(ocrResult);
        } catch (ocrErr) {
          console.log('OCR data not available yet:', ocrErr);
        }
        
      } catch (err) {
        console.error('Error fetching PDF data:', err);
        setError('Failed to load PDF document. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (pdfId) {
      fetchPdfData();
    }
  }, [pdfId, getAuthHeaders]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle page load success
  const onPageLoadSuccess = (page) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);
    
    // Adjust scale to fit container width
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40; // Subtract padding
      const newScale = Math.min(containerWidth / viewport.width, 1); // Limit scale to 1 to prevent too large PDFs
      setScale(newScale);
    }
  };

  // Handle page navigation
  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
  };

  // Handle back button
  const handleBack = () => {
    navigate('/pdf-upload');
  };

  // Render bounding boxes
  const renderBoundingBoxes = () => {
    if (!ocrData || !ocrData.bounding_boxes || !showBoundingBoxes) {
      return null;
    }

    return ocrData.bounding_boxes
      .filter(box => box.page === pageNumber)
      .map((box, index) => {
        const x = box.x * pageWidth * scale;
        const y = box.y * pageHeight * scale;
        const width = box.width * pageWidth * scale;
        const height = box.height * pageHeight * scale;

        return (
          <React.Fragment key={index}>
            <Rect
              x={x}
              y={y}
              width={width}
              height={height}
              stroke="#2563eb"
              strokeWidth={1}
              fill="rgba(37, 99, 235, 0.1)"
            />
            <Text
              x={x}
              y={y - 15}
              text={box.text.length > 20 ? box.text.substring(0, 20) + '...' : box.text}
              fontSize={12}
              fill="#2563eb"
            />
          </React.Fragment>
        );
      });
  };

  // Render structured data
  const renderStructuredData = () => {
    if (!ocrData || !ocrData.structured_data) {
      return (
        <div className="text-center py-8 text-neutral-500">
          No structured data available yet.
        </div>
      );
    }

    // Check if there's an error in the structured data
    if (ocrData.structured_data.error) {
      return (
        <div className="text-center py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Error processing document:</strong> {ocrData.structured_data.error}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  This document format may not be supported by our OCR system. Please try uploading a different PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(ocrData.structured_data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-3 gap-4 border-b border-neutral-100 pb-2">
            <div className="font-medium text-neutral-700">{key}</div>
            <div className="col-span-2 text-neutral-600">{typeof value === 'object' ? JSON.stringify(value) : value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-104px)] bg-neutral-100 overflow-hidden">
      <div className="h-full overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <button
                  onClick={handleBack}
                  className="flex items-center text-primary hover:text-primary-dark"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                  </svg>
                  Back to Documents
                </button>
              </div>
              <h1 className="text-2xl font-bold text-primary">PDF Viewer</h1>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBoundingBoxes}
                    onChange={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-neutral-700">Show Bounding Boxes</span>
                </label>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* PDF Viewer */}
            {!loading && pdfUrl && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PDF Document */}
                <div className="lg:col-span-2">
                  <div className="bg-neutral-800 rounded-lg overflow-hidden" ref={containerRef}>
                    <div className="overflow-auto p-4" style={{ maxHeight: "calc(100vh - 300px)" }}>
                      <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                          <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        }
                        error={
                          <div className="text-center py-12 text-white">
                            Failed to load PDF. Please try again later.
                          </div>
                        }
                      >
                        <div className="relative">
                          <Page
                            pageNumber={pageNumber}
                            onLoadSuccess={onPageLoadSuccess}
                            width={pageWidth * scale}
                            height={pageHeight * scale}
                          />
                          <div className="absolute top-0 left-0" style={{ width: pageWidth * scale, height: pageHeight * scale }}>
                            <Stage
                              ref={stageRef}
                              width={pageWidth * scale}
                              height={pageHeight * scale}
                            >
                              <Layer>
                                {renderBoundingBoxes()}
                              </Layer>
                            </Stage>
                          </div>
                        </div>
                      </Document>
                    </div>
                    
                    {/* Page Navigation */}
                    <div className="flex justify-between items-center p-4 text-white border-t border-neutral-700">
                      <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className={`px-3 py-1 rounded ${pageNumber <= 1 ? 'bg-neutral-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                      >
                        Previous
                      </button>
                      <p>
                        Page {pageNumber} of {numPages || '--'}
                      </p>
                      <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className={`px-3 py-1 rounded ${pageNumber >= numPages ? 'bg-neutral-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Extracted Data */}
                <div>
                  <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <h3 className="text-lg font-medium text-primary mb-4">Document Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 pb-2">
                        <div className="font-medium text-neutral-700">Filename</div>
                        <div className="col-span-2 text-neutral-600">{pdf?.filename}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 pb-2">
                        <div className="font-medium text-neutral-700">Pages</div>
                        <div className="col-span-2 text-neutral-600">{numPages || '--'}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 pb-2">
                        <div className="font-medium text-neutral-700">Status</div>
                        <div className="col-span-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ocrData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ocrData ? 'Processed' : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 500px)" }}>
                    <h3 className="text-lg font-medium text-primary mb-4 sticky top-0 bg-white">Extracted Data</h3>
                    {renderStructuredData()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer; 