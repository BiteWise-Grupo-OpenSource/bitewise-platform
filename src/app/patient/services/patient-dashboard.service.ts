import { computed, inject, Injectable } from '@angular/core';
import { PatientDashboard } from '../model/patient-dashboard.models';
import { AuthService } from '../../iam/services/auth.service';

@Injectable({ providedIn: 'root' })
export class PatientDashboardService {
  private readonly auth = inject(AuthService);

  readonly firstName = computed(() => {
    const displayName = this.auth.user()?.displayName ?? '';
    return displayName.split(' ').filter(Boolean)[0] ?? '';
  });

  readonly dashboard = computed<PatientDashboard>(() => ({
    metrics: [
      {
        labelKey: 'patient.dashboard.metrics.calories',
        value: '1,420',
        helperKey: 'patient.dashboard.metrics.caloriesHelper',
        progress: 71,
        tone: 'patient'
      },
      {
        labelKey: 'patient.dashboard.metrics.protein',
        value: '88 g',
        helperKey: 'patient.dashboard.metrics.proteinHelper',
        progress: 59,
        tone: 'protein'
      },
      {
        labelKey: 'patient.dashboard.metrics.streak',
        value: '9',
        helperKey: 'patient.dashboard.metrics.streakHelper',
        tone: 'success'
      },
      {
        labelKey: 'patient.dashboard.metrics.goal',
        value: '73%',
        helperKey: 'patient.dashboard.metrics.goalHelper',
        progress: 73,
        tone: 'success'
      }
    ],
    macros: [
      {
        labelKey: 'patient.dashboard.macros.protein',
        value: '88 g',
        progress: 59,
        tone: 'protein'
      },
      {
        labelKey: 'patient.dashboard.macros.carbs',
        value: '142 g',
        progress: 75,
        tone: 'carbs'
      },
      {
        labelKey: 'patient.dashboard.macros.fat',
        value: '44 g',
        progress: 62,
        tone: 'fat'
      },
      {
        labelKey: 'patient.dashboard.macros.fiber',
        value: '12 g',
        progress: 48,
        tone: 'success'
      }
    ],
    meals: [
      {
        iconLabel: 'AM',
        nameKey: 'patient.dashboard.meals.breakfast',
        detailKey: 'patient.dashboard.meals.breakfastDetail',
        statusKey: 'patient.dashboard.status.done',
        tone: 'success'
      },
      {
        iconLabel: 'MD',
        nameKey: 'patient.dashboard.meals.lunch',
        detailKey: 'patient.dashboard.meals.lunchDetail',
        statusKey: 'patient.dashboard.status.done',
        tone: 'success'
      },
      {
        iconLabel: 'PM',
        nameKey: 'patient.dashboard.meals.dinner',
        detailKey: 'patient.dashboard.meals.dinnerDetail',
        statusKey: 'patient.dashboard.status.review',
        tone: 'warning'
      },
      {
        iconLabel: '--',
        nameKey: 'patient.dashboard.meals.snack',
        detailKey: 'patient.dashboard.meals.snackDetail',
        statusKey: 'patient.dashboard.status.pending',
        tone: 'muted'
      }
    ],
    quickActions: [
      {
        route: '/patient/plan',
        iconLabel: 'PL',
        labelKey: 'patient.nav.plan',
        descriptionKey: 'patient.dashboard.actions.plan'
      },
      {
        route: '/patient/log',
        iconLabel: '+',
        labelKey: 'patient.nav.log',
        descriptionKey: 'patient.dashboard.actions.log'
      },
      {
        route: '/patient/recipes',
        iconLabel: 'RC',
        labelKey: 'patient.nav.recipes',
        descriptionKey: 'patient.dashboard.actions.recipes'
      },
      {
        route: '/patient/messages',
        iconLabel: 'CM',
        labelKey: 'patient.nav.messages',
        descriptionKey: 'patient.dashboard.actions.messages'
      },
      {
        route: '/patient/settings',
        iconLabel: 'CF',
        labelKey: 'patient.nav.settings',
        descriptionKey: 'patient.dashboard.actions.settings'
      }
    ],
    week: [
      { dayKey: 'patient.dashboard.week.mon', calories: 1880 },
      { dayKey: 'patient.dashboard.week.tue', calories: 2010 },
      { dayKey: 'patient.dashboard.week.wed', calories: 1760 },
      { dayKey: 'patient.dashboard.week.thu', calories: 1910 },
      { dayKey: 'patient.dashboard.week.fri', calories: 1420 },
      { dayKey: 'patient.dashboard.week.sat', calories: 0 },
      { dayKey: 'patient.dashboard.week.sun', calories: 0 }
    ],
    waterCups: 5,
    waterGoal: 8
  }));
}
