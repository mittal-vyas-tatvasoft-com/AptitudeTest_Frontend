import { Numbers } from "src/app/shared/common/enums";

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
        required: false,
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
    userGroup: {
        value: '',
        key: 'userGroup',
        label: 'Group',
        inputType: 'select',
        requiredErrMsg: 'Group is required',
    },
    userCollege: {
        value: '',
        key: 'userCollege',
        label: 'College',
        inputType: 'select',
        requiredErrMsg: 'College is required',
    },
    year: {
        value: '',
        key: 'year',
        label: 'Year Added',
        inputType: 'select'
    },
    status: {
        value: 'Active',
        key: 'status',
        label: 'Status',
        inputType: 'select'
    }, appliedThrough: {
        value: '',
        key: 'appliedThrough',
        label: 'Applied Through',
        inputType: 'select'
    },
    profiles: {
        value: '',
        key: 'technologyInterestedIn',
        label: 'Preferred Profile',
        inputType: 'select'
    },
    permanentAddress: {
        value: '',
        key: 'permanentAddress1',
        label: 'Permanent Address',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    cityName: {
        value: '',
        key: 'cityName',
        label: 'Town/City',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    pincode: {
        value: '',
        key: 'pincode',
        label: 'Pincode',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    state: {
        value: '',
        key: 'state',
        label: 'State',
        inputType: 'select'
    },
    dateOfBirth: {
        value: '',
        key: 'dateOfBirth',
        label: 'Date of Birth',
        inputType: 'text',
        require: false
    },
    acpcMeritRank: {
        value: '',
        key: 'acpcMeritRank',
        label: 'ACPC Merit Rank',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    gujcetScore: {
        value: '',
        key: 'gujcetScore',
        label: 'Gujcet Score (Out of 120)',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    jeeScore: {
        value: '',
        key: 'jeeScore',
        label: 'Jee Score (Percentile)',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    stream: {
        value: '',
        key: 'streamId',
        label: 'Stream',
        inputType: 'select'
    },
    grade: {
        value: '',
        key: 'grade',
        label: 'CGPA / Percentage',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    maths: {
        value: '',
        key: 'maths',
        label: 'Maths',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    physics: {
        value: '',
        key: 'physics',
        label: 'Physics',
        required: false,
        inputType: 'number',
        displayIcon: false,
    },
    University: {
        value: '',
        key: 'university',
        label: 'School/College/University',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    DegreeSpecialization: {
        value: '',
        key: 'degreeId',
        label: 'Degree Specialization',
        inputType: 'select'
    },
    HSCDiploma: {
        value: '',
        key: 'degreeId',
        label: 'Select HSC / Diploma',
        inputType: 'select'
    },
    bachelorDegree: {
        value: '',
        key: 'degreeId',
        label: "Select bachelor's degree",
        inputType: 'select'
    },
    masterDegree: {
        value: '',
        key: 'degreeId',
        label: "Select masters degree",
        inputType: 'select'
    },
    otherDegree: {
        value: '',
        key: 'degreeId',
        label: 'Select other degree',
        inputType: 'select'
    },
    familyPerson: {
        value: '',
        key: 'familyPerson',
        label: 'Relationship',
        inputType: 'select'
    },
    Qualification: {
        value: '',
        key: 'qualification',
        label: 'Qualification',
        required: false,
        inputType: 'text',
        displayIcon: false,
    },
    Occupation: {
        value: '',
        key: 'occupation',
        label: 'occupation',
        required: false,
        inputType: 'text',
        displayIcon: false,
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

export const selectOptionsForAppliedThrough = [
    {
        id: 1,
        key: 'Individual',
        value: 'Individual',
    },
    {
        id: 2,
        key: 'College',
        value: 'College',
    },
];

export const selectOptionsForStream = [
    {
        id: 1,
        key: 'English',
        value: 'English',
    },
    {
        id: 2,
        key: 'Hindi',
        value: 'Hindi',
    },
    {
        id: 3,
        key: 'Gujarati',
        value: 'Gujarati',
    }
];

export const selectOptionsForRelationship = [
    {
        id: 1,
        key: 'Father',
        value: 'Father',
    },
    {
        id: 2,
        key: 'Mother',
        value: 'Mother',
    },
    {
        id: 3,
        key: 'Brother',
        value: 'Brother',
    },
    {
        id: 4,
        key: 'Sister',
        value: 'Sister',
    }
];

