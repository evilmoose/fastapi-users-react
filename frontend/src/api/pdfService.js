import axios from 'axios';

/**
 * Service for interacting with the PDF API endpoints.
 */
const pdfService = {
  /**
   * Upload a PDF file.
   * 
   * @param {File} file - The PDF file to upload
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The uploaded PDF document
   */
  uploadPdf: async (file, authHeaders) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `/api/v1/pdfs/upload`,
      formData,
      {
        headers: {
          ...authHeaders,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Get all PDF documents for the current user.
   * 
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Array>} - The list of PDF documents
   */
  getPdfs: async (authHeaders) => {
    const response = await axios.get(
      `/api/v1/pdfs/`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Get a PDF document by ID.
   * 
   * @param {number} pdfId - The ID of the PDF document
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The PDF document
   */
  getPdf: async (pdfId, authHeaders) => {
    const response = await axios.get(
      `/api/v1/pdfs/${pdfId}`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Get a presigned URL for a PDF document.
   * 
   * @param {number} pdfId - The ID of the PDF document
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The presigned URL
   */
  getPdfUrl: async (pdfId, authHeaders) => {
    const response = await axios.get(
      `/api/v1/pdfs/${pdfId}/url`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Delete a PDF document.
   * 
   * @param {number} pdfId - The ID of the PDF document
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The success message
   */
  deletePdf: async (pdfId, authHeaders) => {
    const response = await axios.delete(
      `/api/v1/pdfs/${pdfId}`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Get OCR results for a PDF document.
   * 
   * @param {number} pdfId - The ID of the PDF document
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The OCR results
   */
  getPdfOcr: async (pdfId, authHeaders) => {
    const response = await axios.get(
      `/api/v1/pdfs/${pdfId}/ocr`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
};

export default pdfService; 