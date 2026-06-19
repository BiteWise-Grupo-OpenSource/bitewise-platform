# BiteWise Frontend Agent Guide

Este repositorio es el frontend Angular de BiteWise. Cualquier implementacion futura debe tratarlo como una aplicacion frontend-only: no agregar backend, documentacion externa obligatoria ni README obligatorio salvo que el usuario lo pida explicitamente.

## Referencias Permanentes

- Arquitectura base: `../Frontend-web-main`.
- Mockup y prototipo interactivo: `../bitewise_dual_role_app.html`.

Antes de crear pantallas, rutas, dominios o patrones nuevos, revisar estas referencias y mantener compatibilidad conceptual con ellas. `Frontend-web-main` define la organizacion esperada por dominios y `bitewise_dual_role_app.html` define el comportamiento visual e interactivo de la experiencia dual.

## Stack Obligatorio

- Angular con componentes standalone, rutas Angular, servicios inyectables y modelos TypeScript tipados.
- Angular Material/CDK como unico sistema UI.
- `@ngx-translate/core` para i18n.
- CSS global centralizado en `src/styles.css` para tema, tokens y variables visuales compartidas.

No mezclar Bootstrap, Tailwind, PrimeNG, Ionic, Nebular, Ant Design u otro framework visual. Usar componentes y patrones Material como `mat-*`, `MatIcon`, `MatDialog`, `MatSidenav`, `MatToolbar`, `MatButton`, `MatCard`, `MatFormField`, `MatInput`, `MatSelect`, `MatTabs`, `MatProgressBar`, menus, snackbars, steppers, chips y controles CDK cuando correspondan.

## Dependencias Previstas

Cuando se implemente funcionalidad real, agregar y configurar las dependencias necesarias:

- `@angular/material`
- `@angular/cdk`
- `@angular/animations`, si Angular Material lo requiere para la version instalada
- `@ngx-translate/core`
- `@ngx-translate/http-loader`

La configuracion publica de la app debe vivir en `app.config.ts` e incluir `provideRouter`, `provideHttpClient` y `provideTranslateService` o la configuracion equivalente vigente de `@ngx-translate/core`.

Las traducciones deben cargarse desde:

- `public/assets/i18n/en.json`
- `public/assets/i18n/es.json`

## i18n

La internacionalizacion ingles/espanol es obligatoria. Ningun texto visible debe quedar hardcodeado en templates o componentes, salvo datos mock temporales claramente reemplazables. Botones, titulos, labels, placeholders, mensajes de error, estados vacios, tooltips, navegacion y textos de accesibilidad deben usar claves de traduccion.

Mantener las claves consistentes por dominio, por ejemplo:

- `iam.login.title`
- `mealPlan.week.title`
- `tracking.logMeal.action`
- `nutritionist.patients.emptyState`

## Arquitectura Por Dominios

Organizar `src/app` con DDD/frontend por bounded contexts. Seguir la referencia `../Frontend-web-main` y usar estos dominios base:

- `iam`
- `public`
- `profiles`
- `meal-plan`
- `recipes`
- `ingredients`
- `tracking`
- `recommendations`

Crear nuevos dominios solo si representan una capacidad real del negocio, no por conveniencia tecnica. Cada dominio debe mantener carpetas consistentes:

- `pages`
- `components`
- `model`
- `services`

Los componentes compartidos entre dominios deben vivir en `shared`. No duplicar componentes cross-domain dentro de dominios especificos.

## Patron De Implementacion

Usar un solo patron principal:

- Componentes standalone.
- Rutas Angular.
- Servicios inyectables.
- Modelos tipados.
- Estado local simple o servicios de dominio cuando sea suficiente.

Evitar mezclar modulos Angular legacy salvo que se migre codigo de referencia que lo requiera temporalmente. Si se introduce un modulo legacy por compatibilidad, dejarlo acotado y no convertirlo en el patron dominante.

La app debe partir de `router-outlet`, tener layout autenticado y definir rutas por rol. La navegacion debe usar Router de Angular, no cambios manuales de pantalla con estado ad hoc.

## Roles Y Experiencias

Mantener dos experiencias principales segun `../bitewise_dual_role_app.html`.

Paciente:

- Dashboard.
- Plan semanal.
- Registrar comida.
- Recetas.
- Progreso.
- Mensajes.
- Configuracion.

Nutricionista:

- Resumen.
- Pacientes.
- Mensajes.
- Ficha de paciente.
- Planes nutricionales.
- Analytics.
- Configuracion.

Login y registro deben contemplar los roles `patient` y `nutritionist`. El onboarding de paciente debe seguir el flujo del prototipo, incluyendo captura progresiva de informacion necesaria para personalizar recomendaciones y planes.

## Modelos Base

Definir tipos base antes de expandir pantallas complejas:

```ts
export type UserRole = 'patient' | 'nutritionist';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}
```

Cada dominio debe definir sus propios modelos en `model` y sus servicios API o mock services por recurso en `services`. Mantener nombres explicitos como `Recipe`, `MealPlan`, `Ingredient`, `TrackingEntry`, `Recommendation`, `PatientProfile` y `NutritionistProfile`.

## Tema Visual

Centralizar el tema en `src/styles.css` con tokens CSS inspirados en el prototipo:

- Fondos claro y oscuro.
- Acento naranja para experiencia de paciente.
- Acento verde para experiencia de nutricionista.
- Estados `success`, `warning`, `error` e `info`.
- Espaciado, radios, sombras, tipografia y colores semanticos reutilizables.

No crear paletas o estilos aislados por componente si pertenecen al sistema visual general. Los componentes pueden tener estilos propios solo para layout local o detalles especificos.

## Accesibilidad Y Responsive

Todo componente nuevo debe ser responsive y accesible:

- Usar controles Angular Material con labels correctos.
- Agregar `aria-label` o `aria-labelledby` cuando un control no tenga texto visible suficiente.
- Mantener estados de foco visibles.
- Evitar textos que se corten o se superpongan en mobile.
- Usar navegacion real con router links y estados activos.
- Verificar formularios con mensajes de error traducidos y asociados al campo.

## Reglas De Alcance

- No implementar backend dentro de este repositorio.
- No introducir otra libreria UI.
- No dejar textos visibles sin traduccion.
- No crear dominios tecnicos si pueden pertenecer a un bounded context existente.
- No copiar pantallas del prototipo como HTML plano; reinterpretarlas en Angular con Material, rutas, servicios y modelos tipados.
- No ejecutar cambios de implementacion solo para cumplir esta guia. Esta guia prepara las reglas persistentes del proyecto.
