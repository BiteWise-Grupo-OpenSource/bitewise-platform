import { Route, Routes } from '@angular/router';

/**
 * Routes for the communication bounded context.
 *
 * These route objects are mounted from the host contexts so messaging lives at
 * role-appropriate URLs while staying defined here:
 * - `patientMessagesRoute` -> `/patient/messages` (patient shell child)
 * - `nutritionistMessagesRoute` -> `/clinical/messages`
 *
 * Both inherit the host route guards (`authGuard` + `roleGuard`), so cross-role
 * access is already blocked by patient/clinical.
 */
export const patientMessagesRoute: Route = {
  path: 'messages',
  loadComponent: () =>
    import('./pages/patient-messages/patient-messages.page').then((m) => m.PatientMessagesPage)
};

export const nutritionistMessagesRoute: Route = {
  path: 'messages',
  loadComponent: () =>
    import('./pages/nutritionist-messages/nutritionist-messages.page').then((m) => m.NutritionistMessagesPage)
};

export const communicationRoutes: Routes = [patientMessagesRoute, nutritionistMessagesRoute];

export default communicationRoutes;
