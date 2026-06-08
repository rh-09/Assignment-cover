import { AssignmentCoverPageData, ElementStyle } from './types';
import { DEFAULT_KUET_LOGO_BASE64 } from './defaultLogoBase64';

export const defaultStyle = (overrides?: Partial<ElementStyle>): ElementStyle => ({
  fontSize: 14,
  fontWeight: 'normal',
  fontStyle: 'normal',
  marginTop: 10,
  marginBottom: 10,
  color: '#1e293b',
  alignment: 'center',
  textTransform: 'none',
  ...overrides,
});

export const initialCoverPageData: AssignmentCoverPageData = {
  universityName: 'Khulna University of Engineering & Technology',
  logoUrl: DEFAULT_KUET_LOGO_BASE64, // Default high-resolution official logo
  logoWidth: 150,
  departmentName: 'Department of Electrical and Electronic Engineering',
  assignmentNo: '01',
  assignmentTopic: 'Topic Name',
  date: 'June 08, 2026',
  
  submittedToLabel: 'Submitted To',
  teacher: {
    name: 'Mr. X',
    designation: 'Professor',
    department: 'Department of Electrical and Electronic Engineering',
    university: 'Khulna University of Engineering & Technology',
  },

  submittedByLabel: 'Submitted By',
  student: {
    name: 'Mr. Y',
    roll: '-----',
    department: 'EEE',
    section: 'A',
    year: '---',
    term: '---',
  },

  primaryFont: 'serif',
  pageBorder: 'none',
  pageBorderColor: '#00a651',
  accentColor: '#00a651',
  tableBorder: 'all',
  tableBorderColor: '#334155',
  tablePadding: 10,

  styleUniversity: defaultStyle({
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 8,
    color: '#0f172a',
    textTransform: 'uppercase',
  }),
  styleDepartment: defaultStyle({
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#334155',
  }),
  styleTopic: defaultStyle({
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#0f172a',
  }),
  styleAssignmentNo: defaultStyle({
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    color: '#334155',
  }),
  styleDate: defaultStyle({
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 25,
    color: '#475569',
  }),
  styleTableLabels: defaultStyle({
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
    color: '#0f172a',
    alignment: 'center',
  }),
  styleTableTexts: defaultStyle({
    fontSize: 13,
    fontWeight: 'normal',
    marginTop: 4,
    marginBottom: 4,
    color: '#334155',
    alignment: 'left',
  }),
};

export interface PagePreset {
  id: string;
  name: string;
  description: string;
  primaryFont: string;
  pageBorder: 'none' | 'single' | 'double' | 'fancy';
  pageBorderColor: string;
  accentColor: string;
  tableBorder: 'all' | 'horizontal' | 'none';
  tableBorderColor: string;
  tablePadding: number;
  styleUniversityOverrides: Partial<ElementStyle>;
  styleDepartmentOverrides: Partial<ElementStyle>;
  styleTopicOverrides: Partial<ElementStyle>;
  styleAssignmentNoOverrides: Partial<ElementStyle>;
  styleDateOverrides: Partial<ElementStyle>;
  styleTableLabelsOverrides: Partial<ElementStyle>;
  styleTableTextsOverrides: Partial<ElementStyle>;
}

export const PRESETS: PagePreset[] = [
  {
    id: 'kuet-classic-green',
    name: 'KUET Classic Emerald',
    description: 'The standard KUET layout styled with the official deep green and a clean double table layout.',
    primaryFont: 'serif',
    pageBorder: 'none',
    pageBorderColor: '#00a651',
    accentColor: '#00a651',
    tableBorder: 'all',
    tableBorderColor: '#334155',
    tablePadding: 10,
    styleUniversityOverrides: { fontSize: 18, fontWeight: 'bold', color: '#001a08', marginTop: 0, marginBottom: 8, alignment: 'center' },
    styleDepartmentOverrides: { fontSize: 15, fontWeight: 'bold', color: '#004d1a', marginTop: 18, marginBottom: 12, alignment: 'center' },
    styleTopicOverrides: { fontSize: 20, fontWeight: 'bold', color: '#001a08', marginTop: 24, marginBottom: 35, alignment: 'center' },
    styleAssignmentNoOverrides: { fontSize: 13, fontWeight: 'bold', color: '#334155', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleDateOverrides: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginTop: 5, marginBottom: 25, alignment: 'center' },
    styleTableLabelsOverrides: { fontSize: 14, fontWeight: 'bold', color: '#004d1a', marginTop: 4, marginBottom: 8, alignment: 'center' },
    styleTableTextsOverrides: { fontSize: 12, fontWeight: 'normal', color: '#1e293b', marginTop: 4, marginBottom: 4, alignment: 'left' },
  },
  {
    id: 'modern-navy-minimalist',
    name: 'Modern Navy Minimalist',
    description: 'A sharp, clean, high-contrast digital look with professional dark navy accents and fine borders.',
    primaryFont: 'sans',
    pageBorder: 'single',
    pageBorderColor: '#eceff1',
    accentColor: '#1e3a8a',
    tableBorder: 'horizontal',
    tableBorderColor: '#94a3b8',
    tablePadding: 12,
    styleUniversityOverrides: { fontSize: 17, fontWeight: 'bold', color: '#111827', marginTop: 10, marginBottom: 10, alignment: 'center', textTransform: 'uppercase' },
    styleDepartmentOverrides: { fontSize: 14, fontWeight: 'bold', color: '#475569', marginTop: 15, marginBottom: 15, alignment: 'center' },
    styleTopicOverrides: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a', marginTop: 30, marginBottom: 40, alignment: 'center' },
    styleAssignmentNoOverrides: { fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleDateOverrides: { fontSize: 12, fontWeight: 'normal', color: '#64748b', marginTop: 5, marginBottom: 30, alignment: 'center' },
    styleTableLabelsOverrides: { fontSize: 13, fontWeight: 'bold', color: '#1e3a8a', marginTop: 6, marginBottom: 6, alignment: 'left' },
    styleTableTextsOverrides: { fontSize: 11, fontWeight: 'normal', color: '#334155', marginTop: 3, marginBottom: 3, alignment: 'left' },
  },
  {
    id: 'formal-academic-double',
    name: 'Formal Academic Double-Border',
    description: 'Traditional academic style with an elegant thin-and-thick double boundary frame and solid borders.',
    primaryFont: 'serif',
    pageBorder: 'double',
    pageBorderColor: '#1e293b',
    accentColor: '#000000',
    tableBorder: 'all',
    tableBorderColor: '#000000',
    tablePadding: 8,
    styleUniversityOverrides: { fontSize: 19, fontWeight: 'bold', color: '#000000', marginTop: 15, marginBottom: 15, alignment: 'center', textTransform: 'uppercase' },
    styleDepartmentOverrides: { fontSize: 15, fontWeight: 'bold', color: '#222222', marginTop: 20, marginBottom: 20, alignment: 'center' },
    styleTopicOverrides: { fontSize: 21, fontWeight: 'bold', color: '#000000', marginTop: 25, marginBottom: 30, alignment: 'center' },
    styleAssignmentNoOverrides: { fontSize: 13, fontWeight: 'bold', color: '#111111', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleDateOverrides: { fontSize: 13, fontWeight: 'normal', color: '#333333', marginTop: 5, marginBottom: 20, alignment: 'center' },
    styleTableLabelsOverrides: { fontSize: 14, fontWeight: 'bold', color: '#111111', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleTableTextsOverrides: { fontSize: 12, fontWeight: 'normal', color: '#111111', marginTop: 5, marginBottom: 5, alignment: 'left' },
  },
  {
    id: 'technical-monochrome',
    name: 'Technical Mono',
    description: 'Clean coding-inspired layout using monospace fonts, ideal for Computer Science or IT labs.',
    primaryFont: 'mono',
    pageBorder: 'single',
    pageBorderColor: '#000000',
    accentColor: '#000000',
    tableBorder: 'all',
    tableBorderColor: '#000000',
    tablePadding: 10,
    styleUniversityOverrides: { fontSize: 15, fontWeight: 'bold', color: '#000000', marginTop: 10, marginBottom: 10, alignment: 'center', textTransform: 'none' },
    styleDepartmentOverrides: { fontSize: 13, fontWeight: 'bold', color: '#111111', marginTop: 15, marginBottom: 15, alignment: 'center' },
    styleTopicOverrides: { fontSize: 18, fontWeight: 'bold', color: '#000000', marginTop: 20, marginBottom: 25, alignment: 'center' },
    styleAssignmentNoOverrides: { fontSize: 12, fontWeight: 'normal', color: '#000000', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleDateOverrides: { fontSize: 12, fontWeight: 'normal', color: '#333333', marginTop: 5, marginBottom: 20, alignment: 'center' },
    styleTableLabelsOverrides: { fontSize: 12, fontWeight: 'bold', color: '#000000', marginTop: 5, marginBottom: 5, alignment: 'center' },
    styleTableTextsOverrides: { fontSize: 11, fontWeight: 'normal', color: '#000000', marginTop: 4, marginBottom: 4, alignment: 'left' },
  }
];
