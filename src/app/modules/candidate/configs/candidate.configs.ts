export const candidateControl = {
    firstName: {
        value: '',
        key: 'firstName',
        label: 'First Name',
        required: true,
        requiredErrMsg: 'First name is required',
        inputType: 'text',
        displayIcon: false,
    },
    fatherName: {
        value: '',
        key: 'fatherName',
        label: 'Middle Name',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    lastName: {
        value: '',
        key: 'lastName',
        label: 'Last Name',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    email: {
        value: '',
        key: 'email',
        label: 'Email Address',
        required: true,
        requiredErrMsg: 'Email is required',
        patternErrMsg: 'Email is not valid',
        inputType: 'text',
        displayIcon: false,
    },
    phoneNumber: {
        value: '',
        key: 'phoneNumber',
        label: 'Contact No.',
        required: true,
        requiredErrMsg: 'Contact No. is required',
        patternErrMsg: 'Please enter valid 10 digit number',
        inputType: 'text',
        displayIcon: false,
    },
    gender: {
        value: '',
        key: 'gender',
        label: 'Gender',
        inputType: 'select'
    },
    group: {
        value: '',
        key: 'groupId',
        label: 'Group',
        inputType: 'select',
        requiredErrMsg: 'Group is required',
    },
    college: {
        value: '',
        key: 'collegeId',
        label: 'College',
        inputType: 'select',
        requiredErrMsg: 'College is required',
    },
    status: {
        value: 'Active',
        key: 'status',
        label: 'Status',
        inputType: 'select'
    },
}

export const selectOptionsForGender = [
    {
        id: 1,
        key: 'Male',
        value: 'Male',
    },
    {
        id: 2,
        key: 'Female',
        value: 'Female',
    },
];

export const selectOptionsForStatus = [
    {
        id: 1,
        key: 'Active',
        value: 'Active',
    },
    {
        id: 2,
        key: 'Inactive',
        value: 'Inactive',
    },
];