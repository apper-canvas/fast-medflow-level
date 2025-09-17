const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const medicalRecordService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response?.success) {
        console.error("Error fetching medical records:", response?.message || "Unknown error");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(record => ({
        ...record,
        patientId: record.patient_id_c?.Id || record.patient_id_c,
        visitDate: record.visit_date_c,
        doctorId: record.doctor_id_c?.Id || record.doctor_id_c,
        diagnosis: record.diagnosis_c,
        treatment: record.treatment_c,
        prescriptions: record.prescriptions_c ? record.prescriptions_c.split(',') : [],
        notes: record.notes_c,
        followUpDate: record.follow_up_date_c
      }));
    } catch (error) {
      console.error("Error fetching medical records:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('medical_record_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Medical record not found");
      }
      
      const record = response.data;
      return {
        ...record,
        patientId: record.patient_id_c?.Id || record.patient_id_c,
        visitDate: record.visit_date_c,
        doctorId: record.doctor_id_c?.Id || record.doctor_id_c,
        diagnosis: record.diagnosis_c,
        treatment: record.treatment_c,
        prescriptions: record.prescriptions_c ? record.prescriptions_c.split(',') : [],
        notes: record.notes_c,
        followUpDate: record.follow_up_date_c
      };
    } catch (error) {
      console.error(`Error fetching medical record ${id}:`, error?.response?.data?.message || error);
      throw new Error("Medical record not found");
    }
  },

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ],
        where: [{
          "FieldName": "patient_id_c",
          "Operator": "ExactMatch",
          "Values": [parseInt(patientId)],
          "Include": true
        }]
      };
      
      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response?.success) {
        console.error("Error fetching medical records by patient:", response?.message || "Unknown error");
        return [];
      }
      
      return response.data?.map(record => ({
        ...record,
        patientId: record.patient_id_c?.Id || record.patient_id_c,
        visitDate: record.visit_date_c,
        doctorId: record.doctor_id_c?.Id || record.doctor_id_c,
        diagnosis: record.diagnosis_c,
        treatment: record.treatment_c,
        prescriptions: record.prescriptions_c ? record.prescriptions_c.split(',') : [],
        notes: record.notes_c,
        followUpDate: record.follow_up_date_c
      })) || [];
    } catch (error) {
      console.error("Error fetching medical records by patient:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(recordData) {
    try {
      const params = {
        records: [{
          patient_id_c: parseInt(recordData.patient_id_c || recordData.patientId),
          visit_date_c: recordData.visit_date_c || recordData.visitDate || new Date().toISOString().split("T")[0],
          doctor_id_c: parseInt(recordData.doctor_id_c || recordData.doctorId),
          diagnosis_c: recordData.diagnosis_c || recordData.diagnosis,
          treatment_c: recordData.treatment_c || recordData.treatment,
          prescriptions_c: recordData.prescriptions_c || (recordData.prescriptions ? recordData.prescriptions.join(',') : ''),
          notes_c: recordData.notes_c || recordData.notes,
          follow_up_date_c: recordData.follow_up_date_c || recordData.followUpDate
        }]
      };
      
      const response = await apperClient.createRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create medical record:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating medical record:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, recordData) {
    try {
      const updateData = {};
      if (recordData.patient_id_c !== undefined || recordData.patientId !== undefined) {
        updateData.patient_id_c = parseInt(recordData.patient_id_c || recordData.patientId);
      }
      if (recordData.visit_date_c !== undefined || recordData.visitDate !== undefined) {
        updateData.visit_date_c = recordData.visit_date_c || recordData.visitDate;
      }
      if (recordData.doctor_id_c !== undefined || recordData.doctorId !== undefined) {
        updateData.doctor_id_c = parseInt(recordData.doctor_id_c || recordData.doctorId);
      }
      if (recordData.diagnosis_c !== undefined || recordData.diagnosis !== undefined) {
        updateData.diagnosis_c = recordData.diagnosis_c || recordData.diagnosis;
      }
      if (recordData.treatment_c !== undefined || recordData.treatment !== undefined) {
        updateData.treatment_c = recordData.treatment_c || recordData.treatment;
      }
      if (recordData.prescriptions_c !== undefined || recordData.prescriptions !== undefined) {
        updateData.prescriptions_c = recordData.prescriptions_c || (recordData.prescriptions ? recordData.prescriptions.join(',') : '');
      }
      if (recordData.notes_c !== undefined || recordData.notes !== undefined) {
        updateData.notes_c = recordData.notes_c || recordData.notes;
      }
      if (recordData.follow_up_date_c !== undefined || recordData.followUpDate !== undefined) {
        updateData.follow_up_date_c = recordData.follow_up_date_c || recordData.followUpDate;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update medical record:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating medical record:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete medical record:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting medical record:", error?.response?.data?.message || error);
      throw error;
throw error;
  }
};