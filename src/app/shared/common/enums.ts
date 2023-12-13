export enum Navigation {
  //Common Navigation
  Admin = 'admin/candidate',
  CandidateUser = 'user',
  Edit = 'edit',

  //Auth Navigation
  ForgotPassword = 'forgot-password',
  ResetPassword = 'reset-password',
  Register = 'register',

  //Manage Masters Navigation
  Masters = 'masters',
  College = 'college',
  Location = 'location',
  Degree = 'degree',
  Stream = 'stream',
  Technology = 'technology',
  Profile = 'profile',
  Admins = 'admin',

  // Candidate Navigation
  Candidate = 'candidate',
  ImportCandidate = 'import-candidate',

  // Questions navigation
  Questions = 'questions',
  AddQuestion = 'add-question',
  ImportQuestion = 'import-question',

  //Role
  RoleAdmin = 'Admin',
  RoleUser = 'User',

  //Navigation
  AdminLogin = 'admin/login',

  //Test navigation
  Tests = 'tests',
  CreateTest = 'create',
  Groups = 'groups',

  //Setting navigation
  Setting = 'setting',

  //Results navigation
  Results = 'results',
  ResultsDetails = 'result-details',
}

export enum Type {
  Refund = 1,
  Return,
  ProductType,
}

export enum StyleType {
  Textbox = 0,
  Colorpicker = 1,
}

export enum Permissions {
  USER_LIST = 1,
  USER_CREATE = 2,
  USER_EDIT = 3,
  USER_DELETE = 4,

  ROLES_LIST = 5,
  ROLES_CREATE = 6,
  ROLES_EDIT = 7,
  ROLES_DELETE = 8,

  MESSAGES_LIST = 9,
  MESSAGES_CREATE = 10,
  MESSAGES_EDIT = 11,
  MESSAGES_DELETE = 12,
}

export enum Website {
  Client = 0,
  Portal = 1,
}

export enum DynamicFieldTypes {
  SERVICE_FIELDS = 1,
  BOOKING_FIELDS = 2,
}

export enum StatusCode {
  Success = 200,
  NotFound = 404,
  AlreadyExist = 409,
  BadRequest = 400,
  InternalServerError = 500,
  Unauthorized = 401,
  Forbidden = 403,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  RequestTimeout = 408,
  AlreadyLoggedIn = 430,
}

//Questions

export enum QuestionType {
  SingleAnswer = 1,
  MultiAnswer = 2,
}

export enum OptionType {
  Text = 1,
  Image = 2,
}

export enum QuestionTopic {
  Maths = 1,
  Reasoning = 2,
  Technical = 3,
}

export enum Numbers {
  Debounce = 500,
  Zero = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
}

export enum PaginationDefaultValues {
  DefaultIndex = 0,
  DefaultPageSize = 10,
}

export enum StaticMessages {
  //warning static message
  SelectRow = 'Please select atleast one row',
}

export enum TestStatus {
  Draft = 1,
  Active = 2,
  Completed = 3,
}

//Question Answered Status
export enum QuestionStatus {
  Unvisited = 0,
  Answered = 1,
  Skipped = 2,
}

export enum Status {
  Active = 1,
  Inactive = 0,
}
