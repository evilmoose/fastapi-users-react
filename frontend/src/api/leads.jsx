import axios from 'axios';

/**
 * Service for interacting with the leads API endpoints.
 */
const leadsService = {
  /**
   * Submit a new lead
   * 
   * @param {Object} leadData - The lead data
   * @param {string} leadData.name - Full name
   * @param {string} leadData.email - Email address
   * @param {string} leadData.company - Company name (optional)
   * @param {string} leadData.message - Message (optional)
   * @returns {Promise<Object>} - The created lead
   */
  submitLead: async (leadData) => {
    const response = await axios.post(
      `/api/v1/leads`,
      leadData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Get all leads (admin only)
   * 
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Array>} - The list of leads
   */
  getLeads: async (authHeaders) => {
    const response = await axios.get(
      `/api/v1/leads`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Get a lead by ID (admin only)
   * 
   * @param {number} leadId - The ID of the lead
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The lead
   */
  getLead: async (leadId, authHeaders) => {
    const response = await axios.get(
      `/api/v1/leads/${leadId}`,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
  
  /**
   * Update a lead status (admin only)
   * 
   * @param {number} leadId - The ID of the lead
   * @param {Object} updateData - The data to update
   * @param {Object} authHeaders - The authentication headers
   * @returns {Promise<Object>} - The updated lead
   */
  updateLead: async (leadId, updateData, authHeaders) => {
    const response = await axios.patch(
      `/api/v1/leads/${leadId}`,
      updateData,
      {
        headers: authHeaders,
      }
    );
    
    return response.data;
  },
};

export default leadsService;
