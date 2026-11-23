/**
 * School identity for this independent SmartSchool installation.
 * When creating another school's repository, update this file only.
 */
export const schoolConfig = {
  appName: 'SmartSchool',
  schoolName: 'Sri Viswa Educational Institutions',
  shortName: 'Sri Viswa EM School',
  initials: 'SV',
  locationLabel: 'Palakollu',
  state: 'Andhra Pradesh',
  country: 'India',
  academicYear: '2026–27',
  // Add the supplied school logo at this path when the image asset is available.
  logoPath: '',
  logoAlt: 'Sri Viswa Educational Institutions logo',
  isDemo: true,
  theme: {
    blue: '#247db5',
    navy: '#12344f',
    green: '#278653',
    lightBlue: '#EAF4FC',
    lightNavy: '#EAF0F6',
    lightGreen: '#EAF6EE',
    background: '#F5F9FC',
  },
} as const
