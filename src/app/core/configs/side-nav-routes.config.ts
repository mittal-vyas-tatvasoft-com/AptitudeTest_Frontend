import { Navigation } from 'src/app/shared/common/enums';

export const navBarRoutes = {
  Candidates: {
    label: 'Candidates',
    path: `./${Navigation.Candidate}`,
    icon: 'perm_data_setting',
  },

  Masters: {
    Components: [
      {
        label: 'Degree',
        path: `./${Navigation.Masters}/${Navigation.Degree}`,
      },
      {
        label: 'College',
        path: `./${Navigation.Masters}/${Navigation.College}`,
      },
      {
        label: 'Profile',
        path: `./${Navigation.Masters}/${Navigation.Profile}`,
      },
      {
        label: 'Admin',
        path: `./${Navigation.Masters}/${Navigation.Admins}`,
      },
    ],
    label: 'Manage Master',
    icon: '	manage_accounts',
  },

  Questions: {
    label: 'Questions',
    path: `./${Navigation.Questions}`,
  },
  Tests: {
    label: 'Questions',
    path: `./${Navigation.Tests}`,
  },
};
