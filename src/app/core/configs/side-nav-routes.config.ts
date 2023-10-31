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
    ],
    label: 'Manage Master',
    icon: '	manage_accounts',
  },

  Questions: {
    label: 'Questions',
    path: `./${Navigation.Questions}`,
  },
};
