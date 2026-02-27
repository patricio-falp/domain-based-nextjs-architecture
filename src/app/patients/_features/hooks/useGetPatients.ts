/*
  This hook is reusable in other components within the patients 
  domain that need the list of patients (e.g., an autocomplete, a select, 
  a dashboard widget) — they all share the same React Query cache automatically
*/

// [Imports]
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../infrastructure/getPatients.api';

// [Const]
const PATIENTS_QUERY_KEY = 'patients';

// [Methods]
function useGetPatients() {
  return useQuery({
    queryKey: [PATIENTS_QUERY_KEY],
    queryFn: getPatients,
  });
}

export { useGetPatients };
