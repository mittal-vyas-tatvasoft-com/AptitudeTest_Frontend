export const FilterControls = {
  searchQuery: {
    value: '',
    key: 'searchQuery',
    label: 'Search Candidate',
  },
  test: {
    value: '',
    key: 'test',
    label: 'Test',
  },
  group: {
    value: '',
    key: 'group',
    label: 'Group',
  },
  college: {
    value: '',
    key: 'college',
    label: 'College',
  },
};

export const AdminApproveControls = {
  remainingTimeInMinutes: {
    value: '',
    key: 'remainingTimeInMinutes',
    label: 'Remaining Time In Minutes',
    requiredErrMsg: 'Duration is required',
    maxLimitErrMsg: 'Max allowed duration is: ',
    maxLength: 3,
  },
};

export const UpdateTestTimeCOntrols = {
  timeToBeAdded: {
    value: '',
    key: 'timeToBeAdded',
    label: 'Time To Be Added In Minutes',
    requiredErrMsg: 'Time is Required',
  },
};
