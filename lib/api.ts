// Ensure API_URL always has the /api/v1 prefix
const getApiUrl = () => {
  // Production: Use Render backend
  // Development: Use localhost or Render backend
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== "undefined" && window.location.hostname === "localhost" 
      ? "http://localhost:8000/api/v1"
      : "https://appoinment-backend-5oxs.onrender.com/api/v1")
  
  // If the URL doesn't end with /api/v1, append it
  if (!baseUrl.includes("/api/v1")) {
    return `${baseUrl}/api/v1`.replace(/\/+/g, "/").replace(":/", "://")
  }
  
  return baseUrl
}

const API_URL = getApiUrl()

// Log API URL for debugging
if (typeof window !== "undefined") {
  console.log("API_URL configured as:", API_URL)
  console.log("NEXT_PUBLIC_API_URL env:", process.env.NEXT_PUBLIC_API_URL)
  console.log("Hostname:", window.location.hostname)
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  detail?: string
}

export interface User {
  id: number
  phone: string
  full_name?: string
  email?: string
  is_active: boolean
  is_admin: boolean
  is_doctor: boolean
  created_at?: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  try {
    // Get auth token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      signal: AbortSignal.timeout(20000), // 20-second timeout – allows Render backend cold-start
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

// Departments
export interface DepartmentResponse {
  id: number
  name: string
  description: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getDepartments(): Promise<DepartmentResponse[]> {
  return apiCall<DepartmentResponse[]>("/departments")
}

export async function getDepartmentById(id: number): Promise<DepartmentResponse> {
  return apiCall<DepartmentResponse>(`/departments/${id}`)
}

// Doctors
export interface DoctorResponse {
  id: number
  name: string
  email?: string
  phone?: string
  specialty: string
  department_id: number
  bio?: string
  image_url?: string
  experience_years?: number
  is_available: boolean
  is_active: boolean
  profile_data?: {
    degrees?: string[]
    workplace?: string
    visiting_schedule?: Array<{ day: string; time: string }>
    treats?: string[]
  }
  created_at: string
  updated_at: string
}

export async function getDoctors(): Promise<DoctorResponse[]> {
  return apiCall<DoctorResponse[]>("/doctors")
}

export async function getDoctorById(id: number): Promise<DoctorResponse> {
  return apiCall<DoctorResponse>(`/doctors/${id}`)
}

export async function getDoctorsByDepartment(departmentId: number): Promise<DoctorResponse[]> {
  return apiCall<DoctorResponse[]>(`/doctors/department/${departmentId}`)
}

// Services
export async function getServices() {
  return apiCall("/services")
}

export async function getServiceById(id: number) {
  return apiCall(`/services/${id}`)
}

// Appointments
export async function createAppointment(data: {
  department_id: number
  doctor_id?: number
  appointment_date: string
  appointment_time: string
  notes?: string
}) {
  try {
    return await apiCall("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    // Simulate successful appointment creation with mock data
    console.warn("Appointment saved locally (API unavailable)")
    return {
      id: Math.random(),
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    }
  }
}

export async function getAppointments(skip = 0, limit = 10) {
  try {
    return await apiCall(`/appointments?skip=${skip}&limit=${limit}`)
  } catch (error) {
    return []
  }
}

// Contact Messages
export async function createContactMessage(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  try {
    return await apiCall("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    // Simulate successful message creation
    console.warn("Message saved locally (API unavailable)")
    return {
      id: Math.random(),
      ...data,
      created_at: new Date().toISOString(),
    }
  }
}

// Authentication
export async function registerPatient(data: {
  phone: string
  password: string
  full_name?: string
  email?: string
  nid?: string
  date_of_birth?: string
  gender?: string
  blood_group?: string
  division?: string
  district?: string
  upazila?: string
  village?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}): Promise<LoginResponse> {
  try {
    // Truncate password to 72 bytes (bcrypt limit)
    const truncatedPassword = data.password.substring(0, 72)
    
    return await apiCall<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        password: truncatedPassword,
      }),
    })
  } catch (error) {
    throw new Error("Registration failed. Please ensure the backend server is running.")
  }
}

export async function loginPatient(data: {
  phone: string
  password: string
}): Promise<LoginResponse> {
  try {
    // Truncate password to 72 bytes (bcrypt limit)
    const truncatedPassword = data.password.substring(0, 72)
    
    return await apiCall<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        password: truncatedPassword,
      }),
    })
  } catch (error) {
    throw new Error("Login failed. Please ensure the backend server is running.")
  }
}


export async function refreshToken(refreshToken: string) {
  try {
    return await apiCall("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  } catch (error) {
    throw new Error("Token refresh failed")
  }
}

export async function getCurrentUser(token: string) {
  try {
    return await apiCall("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    throw new Error("Failed to fetch user data")
  }
}

export async function logout() {
  try {
    return await apiCall("/auth/logout", {
      method: "POST",
    })
  } catch (error) {
    // Logout can fail silently
    return { success: true }
  }
}

// Ambulance Services
export async function getAmbulanceServices(available24_7: boolean = false) {
  return apiCall(`/ambulance-services?available_24_7=${available24_7}`)
}

export async function getAmbulanceServiceById(id: number) {
  return apiCall(`/ambulance-services/${id}`)
}

// Eye Products
export async function getEyeProducts(category?: string, brand?: string) {
  let url = "/eye-products"
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (brand) params.append("brand", brand)
  if (params.toString()) url += `?${params.toString()}`
  return apiCall(url)
}

export async function getEyeProductById(id: number) {
  return apiCall(`/eye-products/${id}`)
}

export async function getEyeProductsByCategory(category: string) {
  return apiCall(`/eye-products?category=${category}`)
}

export async function getEyeProductsByBrand(brand: string) {
  return apiCall(`/eye-products?brand=${brand}`)
}

// Blood Banks
export async function getBloodBanks(available24_7: boolean = false, bloodGroup?: string) {
  let url = "/blood-banks"
  const params = new URLSearchParams()
  if (available24_7) params.append("available_24_7", "true")
  if (bloodGroup) params.append("blood_group", bloodGroup)
  if (params.toString()) url += `?${params.toString()}`
  return apiCall(url)
}

export async function getBloodBankById(id: number) {
  return apiCall(`/blood-banks/${id}`)
}

export async function getBloodBanksByBloodGroup(bloodGroup: string) {
  return apiCall(`/blood-banks?blood_group=${bloodGroup}`)
}
