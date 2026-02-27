// Domain model
type PatientStatus = 'active' | 'discharged' | 'pending';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  rut: string;
  dateOfBirth: string;
  status: PatientStatus;
  diagnosis: string;
  lastVisit: string;
  treatingPhysician: string;
}

// Raw API response shape (snake_case, as returned by the server)
interface IPatientApiResponse {
  id: string;
  first_name: string;
  last_name: string;
  rut: string;
  date_of_birth: string;
  status: PatientStatus;
  diagnosis: string;
  last_visit: string;
  treating_physician: string;
}

// Pagination metadata
interface IMeta {
  total: number;
  page: number;
  limit: number;
}

// Return type of getPatients
interface IGetPatientsResult {
  patients: Patient[];
  meta: IMeta;
}

export type { IMeta, IGetPatientsResult, IPatientApiResponse, Patient, PatientStatus };
