import { PreferredLocations } from 'src/app/shared/common/enums';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';

export const DragDropInput =
  'Drag & Drop or <span class="link-primary ml-4p">Browse</span>';

export const dropzoneConfig = {
  acceptedFiles: '.csv', // Accepted file types (e.g., images)
  addRemoveLinks: true, // Show remove links for uploaded files
  maxFiles: 1, // Limit the number of files to 1 for single file upload
};

export const importCandidateSampleFilePath =
  '/assets/import-sample/Candidate Import Sample.csv';
export const importCandidateSampleFileName = 'Candidate Import Sample.csv';

export const defaultSelectOption = {
  id: '',
  key: 'Select',
  value: 'Select',
};

export const preferredLocations: SelectOption[] = [
  { value: 'Only Ahmedabad', id: PreferredLocations.OnlyAhmedabad },
  { value: 'Preferred Rajkot', id: PreferredLocations.PreferredRajkot },
  { value: 'Only Rajkot', id: PreferredLocations.OnlyRajkot },
];

export const OtherCollegeName = 'Others';
