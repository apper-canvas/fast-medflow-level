import patientSchema from "@/apper/metadata/tables/patient_c.json";
import doctorSchema from "@/apper/metadata/tables/doctor_c.json";
import bedSchema from "@/apper/metadata/tables/bed_c.json";
import appointmentSchema from "@/apper/metadata/tables/appointment_c.json";
import medicalRecordSchema from "@/apper/metadata/tables/medical_record_c.json";
import secrets from "@/apper/metadata/edge-functions/secrets.json";
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const doctorService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialty_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('doctor_c', params);
      
      if (!response?.success) {
        console.error("Error fetching doctors:", response?.message || "Unknown error");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(doctor => ({
        ...doctor,
        name: doctor.name_c,
        specialty: doctor.specialty_c,
        phone: doctor.phone_c,
        email: doctor.email_c,
        schedule: doctor.schedule_c ? doctor.schedule_c.split(',') : [],
        availability: doctor.availability_c ? JSON.parse(doctor.availability_c || '{}') : {},
        currentPatients: doctor.current_patients_c ? doctor.current_patients_c.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : []
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialty_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('doctor_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Doctor not found");
      }
      
      const doctor = response.data;
      return {
        ...doctor,
        name: doctor.name_c,
        specialty: doctor.specialty_c,
        phone: doctor.phone_c,
        email: doctor.email_c,
        schedule: doctor.schedule_c ? doctor.schedule_c.split(',') : [],
        availability: doctor.availability_c ? JSON.parse(doctor.availability_c || '{}') : {},
        currentPatients: doctor.current_patients_c ? doctor.current_patients_c.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : []
      };
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error?.response?.data?.message || error);
      throw new Error("Doctor not found");
    }
  },

  async create(doctorData) {
    try {
      const params = {
        records: [{
          name_c: doctorData.name_c || doctorData.name,
          specialty_c: doctorData.specialty_c || doctorData.specialty,
          phone_c: doctorData.phone_c || doctorData.phone,
          email_c: doctorData.email_c || doctorData.email,
          schedule_c: doctorData.schedule_c || (doctorData.schedule ? doctorData.schedule.join(',') : ''),
          availability_c: doctorData.availability_c || (doctorData.availability ? JSON.stringify(doctorData.availability) : '{}'),
          current_patients_c: doctorData.current_patients_c || (doctorData.currentPatients ? doctorData.currentPatients.join(',') : '')
        }]
      };
      
      const response = await apperClient.createRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create doctor:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating doctor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, doctorData) {
    try {
      const updateData = {};
      if (doctorData.name_c !== undefined || doctorData.name !== undefined) {
        updateData.name_c = doctorData.name_c || doctorData.name;
      }
      if (doctorData.specialty_c !== undefined || doctorData.specialty !== undefined) {
        updateData.specialty_c = doctorData.specialty_c || doctorData.specialty;
      }
      if (doctorData.phone_c !== undefined || doctorData.phone !== undefined) {
        updateData.phone_c = doctorData.phone_c || doctorData.phone;
      }
      if (doctorData.email_c !== undefined || doctorData.email !== undefined) {
        updateData.email_c = doctorData.email_c || doctorData.email;
      }
      if (doctorData.schedule_c !== undefined || doctorData.schedule !== undefined) {
        updateData.schedule_c = doctorData.schedule_c || (doctorData.schedule ? doctorData.schedule.join(',') : '');
      }
      if (doctorData.availability_c !== undefined || doctorData.availability !== undefined) {
        updateData.availability_c = doctorData.availability_c || (doctorData.availability ? JSON.stringify(doctorData.availability) : '{}');
      }
      if (doctorData.current_patients_c !== undefined || doctorData.currentPatients !== undefined) {
        updateData.current_patients_c = doctorData.current_patients_c || (doctorData.currentPatients ? doctorData.currentPatients.join(',') : '');
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update doctor:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating doctor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete doctor:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting doctor:", error?.response?.data?.message || error);
      throw error;
}
  }
};