import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import pdfService from '../api/pdfService';

const PDFDocumentList = ({ limit = 0, showTitle = true }) => {
  const { getAuthHeaders } = useAuth();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const data = await pdfService.getPdfs(getAuthHeaders());
        setPdfs(limit > 0 ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Error fetching PDFs:', err);
        setError('Failed to load PDF documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [getAuthHeaders, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-500">
        No PDF documents found. Upload a PDF to get started.
      </div>
    );
  }

  return (
    <div>
      {showTitle && <h2 className="text-xl font-semibold mb-4">Your PDF Documents</h2>}
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6">
                Filename
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Date Uploaded
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {pdfs.map((pdf) => (
              <tr key={pdf.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                  {pdf.filename}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                  {new Date(pdf.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pdf.ocr_data 
                      ? (pdf.ocr_data.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800') 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pdf.ocr_data 
                      ? (pdf.ocr_data.error ? 'Error' : 'Processed') 
                      : 'Processing'}
                  </span>
                </td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link 
                    to={`/pdf-viewer/${pdf.id}`}
                    className="text-accent-blue hover:text-accent-blue-dark"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {limit > 0 && pdfs.length >= limit && (
        <div className="mt-4 text-right">
          <Link to="/pdf-upload" className="text-accent-blue hover:underline font-medium">
            View All Documents
          </Link>
        </div>
      )}
    </div>
  );
};

export default PDFDocumentList; 