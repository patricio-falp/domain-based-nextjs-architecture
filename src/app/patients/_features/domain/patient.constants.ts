// [Imports
import type { PatientStatus } from './patient.interface';

// [Const]
const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  active: 'Activo',
  discharged: 'Alta',
  pending: 'Pendiente',
};

export { PATIENT_STATUS_LABELS };
