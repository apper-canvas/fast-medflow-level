const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const bedService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_nurse_c"}},
          {"field": {"Name": "patient_id_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('bed_c', params);
      
      if (!response?.success) {
        console.error("Error fetching beds:", response?.message || "Unknown error");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_nurse_c"}},
          {"field": {"Name": "patient_id_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('bed_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Bed not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bed ${id}:`, error?.response?.data?.message || error);
      throw new Error("Bed not found");
    }
  },

  async create(bedData) {
    try {
      const params = {
        records: [{
          number_c: bedData.number_c || bedData.number,
          room_type_c: bedData.room_type_c || bedData.roomType,
          floor_c: bedData.floor_c || bedData.floor,
          status_c: bedData.status_c || bedData.status || "Available",
          assigned_nurse_c: bedData.assigned_nurse_c || bedData.assignedNurse,
          patient_id_c: bedData.patient_id_c || bedData.patientId || null
        }]
      };
      
      const response = await apperClient.createRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create bed:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating bed:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, bedData) {
    try {
      const updateData = {};
      if (bedData.number_c !== undefined || bedData.number !== undefined) {
        updateData.number_c = bedData.number_c || bedData.number;
      }
      if (bedData.room_type_c !== undefined || bedData.roomType !== undefined) {
        updateData.room_type_c = bedData.room_type_c || bedData.roomType;
      }
      if (bedData.floor_c !== undefined || bedData.floor !== undefined) {
        updateData.floor_c = bedData.floor_c || bedData.floor;
      }
      if (bedData.status_c !== undefined || bedData.status !== undefined) {
        updateData.status_c = bedData.status_c || bedData.status;
      }
      if (bedData.assigned_nurse_c !== undefined || bedData.assignedNurse !== undefined) {
        updateData.assigned_nurse_c = bedData.assigned_nurse_c || bedData.assignedNurse;
      }
      if (bedData.patient_id_c !== undefined || bedData.patientId !== undefined) {
        updateData.patient_id_c = bedData.patient_id_c || bedData.patientId;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update bed:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating bed:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete bed:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting bed:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async assignPatient(bedId, patientId) {
    try {
      return await this.update(bedId, {
        patient_id_c: parseInt(patientId),
        status_c: "Occupied"
      });
    } catch (error) {
      console.error("Error assigning patient to bed:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async releasePatient(bedId) {
    try {
      return await this.update(bedId, {
        patient_id_c: null,
        status_c: "Available"
      });
    } catch (error) {
      console.error("Error releasing patient from bed:", error?.response?.data?.message || error);
      throw error;
    }
  }
};