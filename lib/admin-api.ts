/**
 * Admin API Service - Centralized API Communication Layer
 * Handles all admin dashboard API calls with proper error handling and type safety
 */

// Ensure API_URL always has the /api/v1 prefix
const getApiUrl = () => {
  // Production: Use Render backend
  // Development: Use localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== "undefined" && window.location.hostname === "localhost" 
      ? "http://localhost:8000/api/v1"
      : "https://appoinment-backend-gy1s.onrender.com/api/v1")
  
  // If the URL doesn't end with /api/v1, append it
  if (!baseUrl.includes("/api/v1")) {
    return `${baseUrl}/api/v1`.replace(/\/+/g, "/").replace(":/", "://")
  }
  
  return baseUrl
}

const API_URL = getApiUrl()

// Log API URL for debugging
if (typeof window !== "undefined") {
  console.log("Admin API_URL configured as:", API_URL)
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DashboardStats {
  total_users: number
  active_users: number
  total_appointments: number
  confirmed_appointments: number
  pending_appointments: number
  pending_messages: number
  total_doctors: number
  total_departments: number
  total_services: number
  month_appointments: number
  week_appointments: number
  timestamp: string
}

export interface AppointmentStats {
  by_status: Record<string, number>
  [key: string]: any
}

export interface UserStats {
  total_users: number
  active_users: number
  admin_users: number
  doctor_users: number
  patient_users: number
  timestamp: string
}

export interface MessageStats {
  by_status: Record<string, number>
  timestamp: string
}

export interface SystemHealth {
  api_status: string
  database_status: string
  timestamp: string
}

export interface Doctor {
  id: number
  user: {
    full_name: string
    phone?: string
    email?: string
  }
  specialty: string
  bio?: string
  profile_image_url?: string
  years_of_experience?: number
  department_id: number
}

export interface Department {
  id: number
  name: string
  description: string
  image_url?: string
  is_active?: boolean
}

export interface Service {
  id: number
  name: string
  description: string
  price?: number
  is_active?: boolean
}

export interface AmbulanceService {
  id: number
  name: string
  description?: string
  phone: string
  location?: string
  latitude?: string
  longitude?: string
  available_24_7: boolean
  ambulance_count: number
  is_active?: boolean
}

export interface EyeProduct {
  id: number
  name: string
  description?: string
  category: string
  brand?: string
  price?: string
  image_url?: string
  stock_quantity: number
  is_available: boolean
  is_active?: boolean
}

export interface BloodBank {
  id: number
  name: string
  description?: string
  phone: string
  location?: string
  latitude?: string
  longitude?: string
  available_24_7: boolean
  is_active?: boolean
  blood_group_o_positive: number
  blood_group_o_negative: number
  blood_group_a_positive: number
  blood_group_a_negative: number
  blood_group_b_positive: number
  blood_group_b_negative: number
  blood_group_ab_positive: number
  blood_group_ab_negative: number
}

export interface Appointment {
  id: number
  patient_name?: string
  patient_email?: string
  patient_phone?: string
  doctor_id?: number
  department_id: number
  appointment_date: string
  appointment_time: string
  status: string
  notes?: string
  created_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  created_at: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function apiCall<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
      signal: AbortSignal.timeout(20000), // 20-second timeout for Render cold-start
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || error.message || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

// ============================================================================
// ADMIN STATISTICS
// ============================================================================

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(token: string): Promise<DashboardStats> {
  return apiCall<DashboardStats>("/admin/dashboard", token)
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats(
  token: string,
  days: number = 30
): Promise<AppointmentStats> {
  return apiCall<AppointmentStats>(`/admin/appointments/stats?days=${days}`, token)
}

/**
 * Get user statistics
 */
export async function getUserStats(token: string): Promise<UserStats> {
  return apiCall<UserStats>("/admin/users/stats", token)
}

/**
 * Get message statistics
 */
export async function getMessageStats(token: string): Promise<MessageStats> {
  return apiCall<MessageStats>("/admin/messages/stats", token)
}

/**
 * Get system health status
 */
export async function getSystemHealth(token: string): Promise<SystemHealth> {
  return apiCall<SystemHealth>("/admin/system/health", token)
}

// ============================================================================
// DOCTORS MANAGEMENT
// ============================================================================

/**
 * Get all doctors with pagination
 */
export async function getDoctorsList(
  token: string,
  skip: number = 0,
  limit: number = 10,
  departmentId?: number
): Promise<Doctor[]> {
  let url = `/doctors?skip=${skip}&limit=${limit}`
  if (departmentId) {
    url += `&department_id=${departmentId}`
  }
  return apiCall<Doctor[]>(url, token)
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(token: string, doctorId: number): Promise<Doctor> {
  return apiCall<Doctor>(`/doctors/${doctorId}`, token)
}

/**
 * Create new doctor
 */
export async function createDoctor(
  token: string,
  data: {
    user_id: number
    specialty: string
    bio?: string
    profile_image_url?: string
    years_of_experience?: number
    department_id: number
  }
): Promise<Doctor> {
  return apiCall<Doctor>("/doctors", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update doctor
 */
export async function updateDoctor(
  token: string,
  doctorId: number,
  data: Partial<Doctor>
): Promise<Doctor> {
  return apiCall<Doctor>(`/doctors/${doctorId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete doctor
 */
export async function deleteDoctor(token: string, doctorId: number): Promise<void> {
  await apiCall<void>(`/doctors/${doctorId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// DEPARTMENTS MANAGEMENT
// ============================================================================

/**
 * Get all departments
 */
export async function getDepartmentsList(
  token: string,
  skip: number = 0,
  limit: number = 10
): Promise<Department[]> {
  return apiCall<Department[]>(`/departments?skip=${skip}&limit=${limit}`, token)
}

/**
 * Get department by ID
 */
export async function getDepartmentById(token: string, deptId: number): Promise<Department> {
  return apiCall<Department>(`/departments/${deptId}`, token)
}

/**
 * Create new department
 */
export async function createDepartment(
  token: string,
  data: {
    name: string
    description: string
    image_url?: string
  }
): Promise<Department> {
  return apiCall<Department>("/departments", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update department
 */
export async function updateDepartment(
  token: string,
  deptId: number,
  data: Partial<Department>
): Promise<Department> {
  return apiCall<Department>(`/departments/${deptId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete department
 */
export async function deleteDepartment(token: string, deptId: number): Promise<void> {
  await apiCall<void>(`/departments/${deptId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// SERVICES MANAGEMENT
// ============================================================================

/**
 * Get all services
 */
export async function getServicesList(
  token: string,
  skip: number = 0,
  limit: number = 10
): Promise<Service[]> {
  return apiCall<Service[]>(`/services?skip=${skip}&limit=${limit}`, token)
}

/**
 * Get service by ID
 */
export async function getServiceById(token: string, serviceId: number): Promise<Service> {
  return apiCall<Service>(`/services/${serviceId}`, token)
}

/**
 * Create new service
 */
export async function createService(
  token: string,
  data: {
    name: string
    description: string
    price?: number
  }
): Promise<Service> {
  return apiCall<Service>("/services", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update service
 */
export async function updateService(
  token: string,
  serviceId: number,
  data: Partial<Service>
): Promise<Service> {
  return apiCall<Service>(`/services/${serviceId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete service
 */
export async function deleteService(token: string, serviceId: number): Promise<void> {
  await apiCall<void>(`/services/${serviceId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// APPOINTMENTS MANAGEMENT
// ============================================================================

/**
 * Get all appointments
 */
export async function getAppointmentsList(
  token: string,
  skip: number = 0,
  limit: number = 10
): Promise<Appointment[]> {
  return apiCall<Appointment[]>(`/appointments?skip=${skip}&limit=${limit}`, token)
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(token: string, appointmentId: number): Promise<Appointment> {
  return apiCall<Appointment>(`/appointments/${appointmentId}`, token)
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  token: string,
  appointmentId: number,
  status: string
): Promise<Appointment> {
  return apiCall<Appointment>(`/appointments/${appointmentId}`, token, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

/**
 * Delete appointment
 */
export async function deleteAppointment(token: string, appointmentId: number): Promise<void> {
  await apiCall<void>(`/appointments/${appointmentId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// MESSAGES MANAGEMENT
// ============================================================================

/**
 * Get all contact messages
 */
export async function getMessagesList(
  token: string,
  skip: number = 0,
  limit: number = 10
): Promise<ContactMessage[]> {
  return apiCall<ContactMessage[]>(`/contacts?skip=${skip}&limit=${limit}`, token)
}

/**
 * Get message by ID
 */
export async function getMessageById(token: string, messageId: number): Promise<ContactMessage> {
  return apiCall<ContactMessage>(`/contacts/${messageId}`, token)
}

/**
 * Update message status
 */
export async function updateMessageStatus(
  token: string,
  messageId: number,
  status: string
): Promise<ContactMessage> {
  return apiCall<ContactMessage>(`/contacts/${messageId}`, token, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

/**
 * Delete message
 */
export async function deleteMessage(token: string, messageId: number): Promise<void> {
  await apiCall<void>(`/contacts/${messageId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// AMBULANCE SERVICES MANAGEMENT
// ============================================================================

/**
 * Get all ambulance services
 */
export async function getAmbulanceServicesList(
  token: string,
  skip: number = 0,
  limit: number = 10,
  available24_7: boolean = false
): Promise<AmbulanceService[]> {
  let url = `/ambulance-services?skip=${skip}&limit=${limit}`
  if (available24_7) {
    url += `&available_24_7=true`
  }
  return apiCall<AmbulanceService[]>(url, token)
}

/**
 * Get ambulance service by ID
 */
export async function getAmbulanceServiceById(token: string, serviceId: number): Promise<AmbulanceService> {
  return apiCall<AmbulanceService>(`/ambulance-services/${serviceId}`, token)
}

/**
 * Create new ambulance service
 */
export async function createAmbulanceService(
  token: string,
  data: {
    name: string
    description?: string
    phone: string
    location?: string
    latitude?: string
    longitude?: string
    available_24_7?: boolean
    ambulance_count?: number
  }
): Promise<AmbulanceService> {
  return apiCall<AmbulanceService>("/ambulance-services", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update ambulance service
 */
export async function updateAmbulanceService(
  token: string,
  serviceId: number,
  data: Partial<AmbulanceService>
): Promise<AmbulanceService> {
  return apiCall<AmbulanceService>(`/ambulance-services/${serviceId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete ambulance service
 */
export async function deleteAmbulanceService(token: string, serviceId: number): Promise<void> {
  await apiCall<void>(`/ambulance-services/${serviceId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// EYE PRODUCTS MANAGEMENT
// ============================================================================

/**
 * Get all eye products
 */
export async function getEyeProductsList(
  token: string,
  skip: number = 0,
  limit: number = 10,
  category?: string,
  brand?: string
): Promise<EyeProduct[]> {
  let url = `/eye-products?skip=${skip}&limit=${limit}`
  if (category) {
    url += `&category=${category}`
  }
  if (brand) {
    url += `&brand=${brand}`
  }
  return apiCall<EyeProduct[]>(url, token)
}

/**
 * Get eye product by ID
 */
export async function getEyeProductById(token: string, productId: number): Promise<EyeProduct> {
  return apiCall<EyeProduct>(`/eye-products/${productId}`, token)
}

/**
 * Create new eye product
 */
export async function createEyeProduct(
  token: string,
  data: {
    name: string
    description?: string
    category: string
    brand?: string
    price?: string
    image_url?: string
    stock_quantity?: number
    is_available?: boolean
  }
): Promise<EyeProduct> {
  return apiCall<EyeProduct>("/eye-products", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update eye product
 */
export async function updateEyeProduct(
  token: string,
  productId: number,
  data: Partial<EyeProduct>
): Promise<EyeProduct> {
  return apiCall<EyeProduct>(`/eye-products/${productId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete eye product
 */
export async function deleteEyeProduct(token: string, productId: number): Promise<void> {
  await apiCall<void>(`/eye-products/${productId}`, token, {
    method: "DELETE",
  })
}

// ============================================================================
// BLOOD BANKS MANAGEMENT
// ============================================================================

/**
 * Get all blood banks
 */
export async function getBloodBanksList(
  token: string,
  skip: number = 0,
  limit: number = 10,
  available24_7: boolean = false,
  bloodGroup?: string
): Promise<BloodBank[]> {
  let url = `/blood-banks?skip=${skip}&limit=${limit}`
  if (available24_7) {
    url += `&available_24_7=true`
  }
  if (bloodGroup) {
    url += `&blood_group=${bloodGroup}`
  }
  return apiCall<BloodBank[]>(url, token)
}

/**
 * Get blood bank by ID
 */
export async function getBloodBankById(token: string, bankId: number): Promise<BloodBank> {
  return apiCall<BloodBank>(`/blood-banks/${bankId}`, token)
}

/**
 * Create new blood bank
 */
export async function createBloodBank(
  token: string,
  data: {
    name: string
    description?: string
    phone: string
    location?: string
    latitude?: string
    longitude?: string
    available_24_7?: boolean
    blood_group_o_positive?: number
    blood_group_o_negative?: number
    blood_group_a_positive?: number
    blood_group_a_negative?: number
    blood_group_b_positive?: number
    blood_group_b_negative?: number
    blood_group_ab_positive?: number
    blood_group_ab_negative?: number
  }
): Promise<BloodBank> {
  return apiCall<BloodBank>("/blood-banks", token, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Update blood bank
 */
export async function updateBloodBank(
  token: string,
  bankId: number,
  data: Partial<BloodBank>
): Promise<BloodBank> {
  return apiCall<BloodBank>(`/blood-banks/${bankId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Delete blood bank
 */
export async function deleteBloodBank(token: string, bankId: number): Promise<void> {
  await apiCall<void>(`/blood-banks/${bankId}`, token, {
    method: "DELETE",
  })
}
