const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const patientService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "bed_number_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response?.success) {
        console.error("Error fetching patients:", response?.message || "Unknown error");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(patient => ({
        ...patient,
        firstName: patient.first_name_c,
        lastName: patient.last_name_c,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        phone: patient.phone_c,
        email: patient.email_c,
        address: patient.address_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',') : [],
        currentStatus: patient.current_status_c,
        admissionDate: patient.admission_date_c,
        bedNumber: patient.bed_number_c
      }));
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "bed_number_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('patient_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Patient not found");
      }
      
      const patient = response.data;
      return {
        ...patient,
        firstName: patient.first_name_c,
        lastName: patient.last_name_c,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        phone: patient.phone_c,
        email: patient.email_c,
        address: patient.address_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',') : [],
        currentStatus: patient.current_status_c,
        admissionDate: patient.admission_date_c,
        bedNumber: patient.bed_number_c
      };
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      throw new Error("Patient not found");
    }
  },

  async create(patientData) {
    try {
      const params = {
        records: [{
          first_name_c: patientData.first_name_c || patientData.firstName,
          last_name_c: patientData.last_name_c || patientData.lastName,
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth,
          gender_c: patientData.gender_c || patientData.gender,
          phone_c: patientData.phone_c || patientData.phone,
          email_c: patientData.email_c || patientData.email,
          address_c: patientData.address_c || patientData.address,
          emergency_contact_c: patientData.emergency_contact_c || patientData.emergencyContact,
          blood_type_c: patientData.blood_type_c || patientData.bloodType,
          allergies_c: patientData.allergies_c || (patientData.allergies ? patientData.allergies.join(',') : ''),
          current_status_c: patientData.current_status_c || patientData.currentStatus || "Stable",
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || new Date().toISOString(),
          bed_number_c: patientData.bed_number_c || patientData.bedNumber
        }]
      };
      
      const response = await apperClient.createRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create patient:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, patientData) {
    try {
      const updateData = {};
      if (patientData.first_name_c !== undefined || patientData.firstName !== undefined) {
        updateData.first_name_c = patientData.first_name_c || patientData.firstName;
      }
      if (patientData.last_name_c !== undefined || patientData.lastName !== undefined) {
        updateData.last_name_c = patientData.last_name_c || patientData.lastName;
      }
      if (patientData.date_of_birth_c !== undefined || patientData.dateOfBirth !== undefined) {
        updateData.date_of_birth_c = patientData.date_of_birth_c || patientData.dateOfBirth;
      }
      if (patientData.gender_c !== undefined || patientData.gender !== undefined) {
        updateData.gender_c = patientData.gender_c || patientData.gender;
      }
      if (patientData.phone_c !== undefined || patientData.phone !== undefined) {
        updateData.phone_c = patientData.phone_c || patientData.phone;
      }
      if (patientData.email_c !== undefined || patientData.email !== undefined) {
        updateData.email_c = patientData.email_c || patientData.email;
      }
      if (patientData.address_c !== undefined || patientData.address !== undefined) {
        updateData.address_c = patientData.address_c || patientData.address;
      }
      if (patientData.emergency_contact_c !== undefined || patientData.emergencyContact !== undefined) {
        updateData.emergency_contact_c = patientData.emergency_contact_c || patientData.emergencyContact;
      }
      if (patientData.blood_type_c !== undefined || patientData.bloodType !== undefined) {
        updateData.blood_type_c = patientData.blood_type_c || patientData.bloodType;
      }
      if (patientData.allergies_c !== undefined || patientData.allergies !== undefined) {
        updateData.allergies_c = patientData.allergies_c || (patientData.allergies ? patientData.allergies.join(',') : '');
      }
      if (patientData.current_status_c !== undefined || patientData.currentStatus !== undefined) {
        updateData.current_status_c = patientData.current_status_c || patientData.currentStatus;
      }
      if (patientData.admission_date_c !== undefined || patientData.admissionDate !== undefined) {
        updateData.admission_date_c = patientData.admission_date_c || patientData.admissionDate;
      }
      if (patientData.bed_number_c !== undefined || patientData.bedNumber !== undefined) {
        updateData.bed_number_c = patientData.bed_number_c || patientData.bedNumber;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update patient:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete patient:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async searchPatients(query) {
    try {
      const searchTerm = query.toLowerCase();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "current_status_c"}},
          {"field": {"Name": "blood_type_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [searchTerm]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [searchTerm]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "phone_c", "operator": "Contains", "values": [searchTerm]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "email_c", "operator": "Contains", "values": [searchTerm]}
              ],
              "operator": ""
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response?.success) {
        console.error("Error searching patients:", response?.message || "Unknown error");
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }
};