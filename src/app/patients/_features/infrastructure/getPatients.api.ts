// [Imports]
import { map, startCase, toLower } from 'lodash';
import type { IGetPatientsResult, IPatientApiResponse, Patient } from '../domain/patient.interface';
import mockData from './patients.mock.json';

// Maps a raw API response record to the Patient domain model.
// Uses lodash startCase + toLower to normalise names stored in UPPERCASE by the API.
function mapPatient(raw: IPatientApiResponse): Patient {
  return {
    id: raw.id,
    firstName: startCase(toLower(raw.first_name)),
    lastName: startCase(toLower(raw.last_name)),
    rut: raw.rut,
    dateOfBirth: raw.date_of_birth,
    status: raw.status,
    diagnosis: raw.diagnosis,
    lastVisit: raw.last_visit,
    treatingPhysician: raw.treating_physician,
  };
}

export async function getPatients(): Promise<IGetPatientsResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  const patients: Patient[] = map(mockData.data as IPatientApiResponse[], mapPatient);

  return {
    patients,
    meta: { total: patients.length, page: 1, limit: patients.length },
  };
}
