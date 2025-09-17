const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const appointmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.success) {
        console.error("Error fetching appointments:", response?.message || "Unknown error");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(appointment => ({
        ...appointment,
        patientId: appointment.patient_id_c?.Id || appointment.patient_id_c,
        doctorId: appointment.doctor_id_c?.Id || appointment.doctor_id_c,
        date: appointment.date_c,
        time: appointment.time_c,
        duration: appointment.duration_c,
        reason: appointment.reason_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('appointment_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Appointment not found");
      }
      
      const appointment = response.data;
      return {
        ...appointment,
        patientId: appointment.patient_id_c?.Id || appointment.patient_id_c,
        doctorId: appointment.doctor_id_c?.Id || appointment.doctor_id_c,
        date: appointment.date_c,
        time: appointment.time_c,
        duration: appointment.duration_c,
        reason: appointment.reason_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      };
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      throw new Error("Appointment not found");
    }
  },

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          patient_id_c: parseInt(appointmentData.patient_id_c || appointmentData.patientId),
          doctor_id_c: parseInt(appointmentData.doctor_id_c || appointmentData.doctorId),
          date_c: appointmentData.date_c || appointmentData.date,
          time_c: appointmentData.time_c || appointmentData.time,
          duration_c: parseInt(appointmentData.duration_c || appointmentData.duration || 30),
          reason_c: appointmentData.reason_c || appointmentData.reason,
          status_c: appointmentData.status_c || appointmentData.status || "Scheduled",
          notes_c: appointmentData.notes_c || appointmentData.notes
        }]
      };
      
      const response = await apperClient.createRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create appointment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, appointmentData) {
    try {
      const updateData = {};
      if (appointmentData.patient_id_c !== undefined || appointmentData.patientId !== undefined) {
        updateData.patient_id_c = parseInt(appointmentData.patient_id_c || appointmentData.patientId);
      }
      if (appointmentData.doctor_id_c !== undefined || appointmentData.doctorId !== undefined) {
        updateData.doctor_id_c = parseInt(appointmentData.doctor_id_c || appointmentData.doctorId);
      }
      if (appointmentData.date_c !== undefined || appointmentData.date !== undefined) {
        updateData.date_c = appointmentData.date_c || appointmentData.date;
      }
      if (appointmentData.time_c !== undefined || appointmentData.time !== undefined) {
        updateData.time_c = appointmentData.time_c || appointmentData.time;
      }
      if (appointmentData.duration_c !== undefined || appointmentData.duration !== undefined) {
        updateData.duration_c = parseInt(appointmentData.duration_c || appointmentData.duration);
      }
      if (appointmentData.reason_c !== undefined || appointmentData.reason !== undefined) {
        updateData.reason_c = appointmentData.reason_c || appointmentData.reason;
      }
      if (appointmentData.status_c !== undefined || appointmentData.status !== undefined) {
        updateData.status_c = appointmentData.status_c || appointmentData.status;
      }
      if (appointmentData.notes_c !== undefined || appointmentData.notes !== undefined) {
        updateData.notes_c = appointmentData.notes_c || appointmentData.notes;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update appointment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete appointment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "ExactMatch",
          "Values": [date],
          "Include": true
        }]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.success) {
        console.error("Error fetching appointments by date:", response?.message || "Unknown error");
        return [];
      }
      
      return response.data?.map(appointment => ({
        ...appointment,
        patientId: appointment.patient_id_c?.Id || appointment.patient_id_c,
        doctorId: appointment.doctor_id_c?.Id || appointment.doctor_id_c,
        date: appointment.date_c,
        time: appointment.time_c,
        duration: appointment.duration_c,
        reason: appointment.reason_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      })) || [];
    } catch (error) {
      console.error("Error fetching appointments by date:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDoctor(doctorId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "doctor_id_c",
          "Operator": "ExactMatch",
          "Values": [parseInt(doctorId)],
          "Include": true
        }]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.success) {
        console.error("Error fetching appointments by doctor:", response?.message || "Unknown error");
        return [];
      }
      
      return response.data?.map(appointment => ({
        ...appointment,
        patientId: appointment.patient_id_c?.Id || appointment.patient_id_c,
        doctorId: appointment.doctor_id_c?.Id || appointment.doctor_id_c,
        date: appointment.date_c,
        time: appointment.time_c,
        duration: appointment.duration_c,
        reason: appointment.reason_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      })) || [];
    } catch (error) {
      console.error("Error fetching appointments by doctor:", error?.response?.data?.message || error);
      return [];
    }
  }
};