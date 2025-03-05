import { useState } from 'react';

const PdfList = ({ pdfs, onDelete, onView }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle delete confirmation
  const handleDeleteClick = (pdfId) => {
    setConfirmDelete(pdfId);
  };

  // Handle delete confirmation cancel
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Handle delete confirmation confirm
  const handleDeleteConfirm = (pdfId) => {
    onDelete(pdfId);
    setConfirmDelete(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Document
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Size
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {pdfs.map((pdf) => (
            <tr key={pdf.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-red-500 mr-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                    />
                  </svg>
                  <div className="text-sm font-medium text-neutral-900 truncate max-w-xs">
                    {pdf.original_filename}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {formatFileSize(pdf.file_size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {formatDate(pdf.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  pdf.extracted_data ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pdf.extracted_data ? 'Processed' : 'Processing'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {confirmDelete === pdf.id ? (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDeleteConfirm(pdf.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleDeleteCancel}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => onView(pdf.id)}
                      className="text-primary hover:text-primary-dark"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pdf.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PdfList; 