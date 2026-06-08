export interface ElementStyle {
  fontSize: number; // in pt
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  marginTop: number; // in mm or px
  marginBottom: number; // in mm or px
  color: string;
  alignment: 'left' | 'center' | 'right';
  textTransform: 'none' | 'uppercase' | 'capitalize';
}

export interface TeacherInfo {
  name: string;
  designation: string;
  department: string;
  university: string;
}

export interface StudentInfo {
  name: string;
  roll: string;
  department: string;
  section: string;
  year: string;
  term: string;
}

export interface AssignmentCoverPageData {
  universityName: string;
  logoUrl: string;
  logoWidth: number;
  departmentName: string;
  assignmentNo: string;
  assignmentTopic: string;
  date: string;
  
  // Submitted To
  submittedToLabel: string;
  teacher: TeacherInfo;

  // Submitted By
  submittedByLabel: string;
  student: StudentInfo;

  // Global styles
  primaryFont: string;
  pageBorder: 'none' | 'single' | 'double' | 'fancy';
  pageBorderColor: string;
  accentColor: string;
  tableBorder: 'all' | 'horizontal' | 'none';
  tableBorderColor: string;
  tablePadding: number; // in pt or px

  // Element styles
  styleUniversity: ElementStyle;
  styleDepartment: ElementStyle;
  styleTopic: ElementStyle;
  styleAssignmentNo: ElementStyle;
  styleDate: ElementStyle;
  styleTableLabels: ElementStyle;
  styleTableTexts: ElementStyle;
}
