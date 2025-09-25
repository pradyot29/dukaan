import api from './api';

export const billService = {
  getAllBills: () => api.get('/bills'),
  getBillById: (id) => api.get(`/bills/${id}`),
  createBill: (data) => api.post('/bills', data),
  updateBill: (id, data) => api.put(`/bills/${id}`, data),
  deleteBill: (id) => api.delete(`/bills/${id}`)
};