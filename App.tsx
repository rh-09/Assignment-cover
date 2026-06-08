import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Type, 
  Layout, 
  Maximize, 
  Minimize, 
  Table, 
  Check, 
  Eye, 
  Info, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Square,
  ChevronRight,
  User,
  GraduationCap,
  Calendar,
  Layers,
  HelpCircle,
  Settings
} from 'lucide-react';
import { KuetLogo } from './KuetLogo';
import { AssignmentCoverPageData, ElementStyle } from './types';
import { initialCoverPageData, PRESETS, defaultStyle } from './data';
import { exportToPdf } from './export';
import { DEFAULT_KUET_LOGO_BASE64 } from './defaultLogoBase64';

export default function App() {
  const [data, setData] = useState<AssignmentCoverPageData>(initialCoverPageData);
  const [scale, setScale] = useState<number>(1);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<
    'university' | 'department' | 'topic' | 'assignmentNo' | 'date' | 'tableLabels' | 'tableTexts' | null
  >(null);
  const [activeTab, setActiveTab] = useState<'content' | 'advanced'>('content');
  const [advancedSubTab, setAdvancedSubTab] = useState<'typography' | 'layout' | 'presets'>('typography');
  const [logoPreview, setLogoPreview] = useState<string>(''); // fallback base64 logo if uploaded
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showInPlaceTip, setShowInPlaceTip] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Auto-detect and dynamically adjust zoom/scale depending on loaded device (Desktop vs. Android / Mobile)
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroidDevice = /Android/i.test(ua);
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    setIsAndroid(isAndroidDevice);

    const handleResize = () => {
      if (isAndroidDevice || isMobileDevice) {
        // Dynamically scale virtual cover page design to fit Android screen perfectly
        const availableWidth = Math.min(window.innerWidth - 32, 794);
        const newScale = parseFloat((availableWidth / 794).toFixed(3));
        setScale(newScale);
      } else {
        // Desktop is kept in pristine full size fixed
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update a single style attribute for elements
  const updateStyleField = (
    field: 'university' | 'department' | 'topic' | 'assignmentNo' | 'date' | 'tableLabels' | 'tableTexts' | null,
    property: keyof ElementStyle,
    value: any
  ) => {
    if (!field) return;
    const styleKey = `style${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof AssignmentCoverPageData;
    setData(prev => ({
      ...prev,
      [styleKey]: {
        ...(prev[styleKey] as ElementStyle),
        [property]: value
      }
    }));
  };

  // Get active style object
  const getStyleForField = (
    field: 'university' | 'department' | 'topic' | 'assignmentNo' | 'date' | 'tableLabels' | 'tableTexts' | null
  ): ElementStyle | null => {
    if (!field) return null;
    const styleKey = `style${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof AssignmentCoverPageData;
    return data[styleKey] as ElementStyle;
  };

  // Apply visual preset
  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setData(prev => ({
      ...prev,
      primaryFont: preset.primaryFont,
      pageBorder: preset.pageBorder,
      pageBorderColor: preset.pageBorderColor,
      accentColor: preset.accentColor,
      tableBorder: preset.tableBorder,
      tableBorderColor: preset.tableBorderColor,
      tablePadding: preset.tablePadding,
      styleUniversity: { ...prev.styleUniversity, ...preset.styleUniversityOverrides },
      styleDepartment: { ...prev.styleDepartment, ...preset.styleDepartmentOverrides },
      styleTopic: { ...prev.styleTopic, ...preset.styleTopicOverrides },
      styleAssignmentNo: { ...prev.styleAssignmentNo, ...preset.styleAssignmentNoOverrides },
      styleDate: { ...prev.styleDate, ...preset.styleDateOverrides },
      styleTableLabels: { ...prev.styleTableLabels, ...preset.styleTableLabelsOverrides },
      styleTableTexts: { ...prev.styleTableTexts, ...preset.styleTableTextsOverrides },
    }));
  };

  // Handle logo image upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setData(prev => ({ ...prev, logoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setLogoPreview('');
    setData(prev => ({ ...prev, logoUrl: DEFAULT_KUET_LOGO_BASE64 }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // PDF Export Execution
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    const fileName = `${data.student.name.replace(/\s+/g, '_')}_Assignment_${data.assignmentNo}`;
    const success = await exportToPdf('cover-page-canvas', fileName);
    setIsExportingPdf(false);
  };

  // Helper styles generator
  const getCssStyle = (styleObj: ElementStyle) => {
    return {
      fontSize: `${styleObj.fontSize}pt`,
      fontWeight: styleObj.fontWeight,
      fontStyle: styleObj.fontStyle,
      marginTop: `${styleObj.marginTop}px`,
      marginBottom: `${styleObj.marginBottom}px`,
      color: styleObj.color,
      textAlign: styleObj.alignment as any,
      textTransform: styleObj.textTransform as any,
    };
  };

  // Label helper mapped cleanly
  const getFieldNameLabel = (field: string | null) => {
    if (!field) return 'None Selected';
    switch (field) {
      case 'university': return 'University Title';
      case 'department': return 'Department Banner';
      case 'topic': return 'Assignment Topic';
      case 'assignmentNo': return 'Assignment Meta Info';
      case 'date': return 'Submission Date';
      case 'tableLabels': return 'Table Labels ("Submitted To")';
      case 'tableTexts': return 'Table Credentials details';
      default: return field;
    }
  };

  const activeStyle = getStyleForField(selectedField);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans select-none overflow-x-hidden antialiased">
      {/* 1. Header Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 shadow-lg relative z-20">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-400/20 text-indigo-400 shadow-inner">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              Assignment Cover Page Architect
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider">KUET Edition</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Generate standardized cover sheets with real-time interactive formatting.</p>
          </div>
        </div>

        {/* Primary download bar */}
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex-1 md:flex-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-md shadow-indigo-505/10 cursor-pointer"
          >
            {isExportingPdf ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            Download PDF Cover
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col xl:flex-row h-full">
        
        {/* LEFT COLUMN: Controls & Form Console */}
        <div className="w-full xl:w-[450px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Main Console Tab Bar */}
          <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10 font-medium">
            {[
              { id: 'content', label: 'Form Input', icon: FileText },
              { id: 'advanced', label: 'Advanced Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all duration-150 border-b-2 font-semibold cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 flex-1 flex flex-col gap-6">
            
            {/* TAB CONTENT: CONTENT INPUTS */}
            {activeTab === 'content' && (
              <div className="flex flex-col gap-5 animate-fade-in text-slate-700">
                
                {/* Section A: Institutional */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Institution Details
                  </h3>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">University Name</label>
                      <input
                        type="text"
                        value={data.universityName}
                        onChange={e => setData(prev => ({ ...prev, universityName: e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Department Banner</label>
                      <input
                        type="text"
                        value={data.departmentName}
                        onChange={e => setData(prev => ({ ...prev, departmentName: e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Assignment Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Assignment Details
                  </h3>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Topic / Topic Name</label>
                      <textarea
                        value={data.assignmentTopic}
                        rows={2}
                        onChange={e => setData(prev => ({ ...prev, assignmentTopic: e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Assignment No.</label>
                        <input
                          type="text"
                          value={data.assignmentNo}
                          onChange={e => setData(prev => ({ ...prev, assignmentNo: e.target.value }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Submission Date</label>
                        <input
                          type="text"
                          value={data.date}
                          onChange={e => setData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Submitted To (Teacher Info) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Submitted To (Course Instructor)
                  </h3>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Section Title Label</label>
                      <input
                        type="text"
                        value={data.submittedToLabel}
                        onChange={e => setData(prev => ({ ...prev, submittedToLabel: e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 font-semibold focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Teacher Name</label>
                      <input
                        type="text"
                        value={data.teacher.name}
                        onChange={e => setData(prev => ({ ...prev, teacher: { ...prev.teacher, name: e.target.value } }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Designation</label>
                      <input
                        type="text"
                        value={data.teacher.designation}
                        onChange={e => setData(prev => ({ ...prev, teacher: { ...prev.teacher, designation: e.target.value } }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Teacher Department</label>
                      <input
                        type="text"
                        value={data.teacher.department}
                        onChange={e => setData(prev => ({ ...prev, teacher: { ...prev.teacher, department: e.target.value } }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Teacher University</label>
                      <input
                        type="text"
                        value={data.teacher.university}
                        onChange={e => setData(prev => ({ ...prev, teacher: { ...prev.teacher, university: e.target.value } }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                {/* Section D: Submitted By (Student Info) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Submitted By (Student Info)
                  </h3>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Section Title Label</label>
                      <input
                        type="text"
                        value={data.submittedByLabel}
                        onChange={e => setData(prev => ({ ...prev, submittedByLabel: e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 font-semibold focus:outline-none transition-all duration-150"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Student Name</label>
                        <input
                          type="text"
                          value={data.student.name}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, name: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Roll No.</label>
                        <input
                          type="text"
                          value={data.student.roll}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, roll: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Student Dept.</label>
                        <input
                          type="text"
                          value={data.student.department}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, department: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Section</label>
                        <input
                          type="text"
                          value={data.student.section}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, section: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Year</label>
                        <input
                          type="text"
                          value={data.student.year}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, year: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Term (or Semester)</label>
                        <input
                          type="text"
                          value={data.student.term}
                          onChange={e => setData(prev => ({ ...prev, student: { ...prev.student, term: e.target.value } }))}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-3 py-1.5 text-[12px] text-slate-800 focus:outline-none transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section E: Logo Image Controls */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Logo Upload & Scale
                  </h3>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs flex items-center justify-between">
                        <span className="truncate text-slate-650">
                          {data.logoUrl ? 'Custom Image Loaded' : 'Default KUET Vector Logo'}
                        </span>
                        {data.logoUrl && (
                          <button
                            onClick={handleResetLogo}
                            className="bg-red-500 hover:bg-red-600 font-semibold px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-white" />
                            Reset
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-705 px-3 py-2 rounded-lg text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-500">Logo Scale Width</label>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{data.logoWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="220"
                        step="5"
                        value={data.logoWidth}
                        onChange={e => setData(prev => ({ ...prev, logoWidth: parseInt(e.target.value) }))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: ADVANCED SETTINGS COLLAPSIBLE CONSOLE */}
            {activeTab === 'advanced' && (
              <div className="flex flex-col gap-5 animate-fade-in text-slate-700">
                {/* Secondary select buttons for Tuner / Borders / Presets */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-1">
                  {[
                    { id: 'typography', label: 'Tuner', icon: Type },
                    { id: 'layout', label: 'Borders', icon: Layout },
                    { id: 'presets', label: 'Presets', icon: Sparkles }
                  ].map(sub => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setAdvancedSubTab(sub.id as any)}
                        className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer ${
                          advancedSubTab === sub.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-550 hover:text-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tab Content: FINE-TUNE TYPOGRAPHY */}
                {advancedSubTab === 'typography' && (
                  <div className="flex flex-col gap-5 animate-fade-in text-slate-700">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Info className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-blue-805 uppercase tracking-wider mb-0.5">Quick Formatting Selection</h4>
                        <p className="text-xs text-blue-600">Select any line below or click elements directly on the cover preview map to configure them perfectly.</p>
                      </div>
                    </div>

                    {/* Element Selector Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Target Layer / Element Block</label>
                      <select
                        value={selectedField || ''}
                        onChange={e => setSelectedField(e.target.value ? (e.target.value as any) : null)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-blue-650 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled>-- No Block Selected --</option>
                        <option value="university">🏢 {getFieldNameLabel('university')}</option>
                        <option value="department">📚 {getFieldNameLabel('department')}</option>
                        <option value="topic">📖 {getFieldNameLabel('topic')}</option>
                        <option value="assignmentNo">📋 {getFieldNameLabel('assignmentNo')}</option>
                        <option value="date">📅 {getFieldNameLabel('date')}</option>
                        <option value="tableLabels">🏷️ {getFieldNameLabel('tableLabels')}</option>
                        <option value="tableTexts">✍️ {getFieldNameLabel('tableTexts')}</option>
                      </select>
                    </div>

                    {/* Typography controls block */}
                    {selectedField && activeStyle ? (
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-2 mb-2">
                          Style Tuning: <span className="text-blue-600 font-semibold">{getFieldNameLabel(selectedField)}</span>
                        </h4>

                        {/* Font Weight and Italic Toggle Button Bar */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Font Style Weight</span>
                            <div className="flex rounded-lg bg-white p-1 border border-slate-200 shadow-sm">
                              <button
                                onClick={() => updateStyleField(selectedField, 'fontWeight', 'normal')}
                                className={`flex-1 py-1.5 text-xs text-center rounded transition-all font-semibold cursor-pointer ${
                                  activeStyle.fontWeight === 'normal'
                                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                                    : 'text-slate-500 hover:text-slate-850'
                                }`}
                              >
                                Normal
                              </button>
                              <button
                                onClick={() => updateStyleField(selectedField, 'fontWeight', 'bold')}
                                className={`flex-1 py-1.5 text-xs text-center rounded transition-all font-bold cursor-pointer ${
                                  activeStyle.fontWeight === 'bold'
                                    ? 'bg-slate-800 text-white font-bold shadow-sm'
                                    : 'text-slate-500 hover:text-slate-850'
                                }`}
                              >
                                Bold
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Italic Accent</span>
                            <div className="flex rounded-lg bg-white p-1 border border-slate-200 shadow-sm">
                              <button
                                onClick={() => updateStyleField(selectedField, 'fontStyle', 'normal')}
                                className={`flex-1 py-1.5 text-xs text-center rounded transition-all font-semibold cursor-pointer ${
                                  activeStyle.fontStyle === 'normal'
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-500 hover:text-slate-850'
                                }`}
                              >
                                Normal
                              </button>
                              <button
                                onClick={() => updateStyleField(selectedField, 'fontStyle', 'italic')}
                                className={`flex-1 py-1.5 text-xs text-center rounded transition-all italic font-semibold cursor-pointer ${
                                  activeStyle.fontStyle === 'italic'
                                    ? 'bg-slate-800 text-white font-semibold'
                                    : 'text-slate-500 hover:text-slate-850'
                                }`}
                              >
                                Italic
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Font Alignment (Only if not table helper texts) */}
                        {selectedField !== 'tableTexts' && selectedField !== 'tableLabels' && (
                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Text Alignment</span>
                            <div className="flex rounded-lg bg-white p-1 border border-slate-200 shadow-sm">
                              {(['left', 'center', 'right'] as const).map(align => (
                                <button
                                  key={align}
                                  onClick={() => updateStyleField(selectedField, 'alignment', align)}
                                  className={`flex-1 py-1.5 text-xs text-center rounded transition-all capitalize font-semibold cursor-pointer ${
                                    activeStyle.alignment === align
                                      ? 'bg-slate-800 text-white font-semibold'
                                      : 'text-slate-500 hover:text-slate-850'
                                  }`}
                                >
                                  {align}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Uppercase conversion toggle */}
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 mb-1.5">Letter Casing</span>
                          <div className="flex rounded-lg bg-white p-1 border border-slate-200 shadow-sm">
                            {[
                              { id: 'none', label: 'As Typed' },
                              { id: 'uppercase', label: 'ALL CAPS' },
                              { id: 'capitalize', label: 'First Letters' }
                            ].map(caseOption => (
                              <button
                                key={caseOption.id}
                                onClick={() => updateStyleField(selectedField, 'textTransform', caseOption.id as any)}
                                className={`flex-1 py-1.5 text-[11px] text-center rounded transition-all font-semibold cursor-pointer ${
                                  activeStyle.textTransform === caseOption.id
                                    ? 'bg-slate-800 text-white font-semibold'
                                    : 'text-slate-500 hover:text-slate-850'
                                }`}
                              >
                                {caseOption.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Selector */}
                        <div>
                          <span className="block text-xs font-semibold text-slate-500 mb-1.5">Font Fill Color</span>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { color: '#000000', label: 'Solid Black' },
                              { color: '#00a651', label: 'KUET Green' },
                              { color: '#1e3a8a', label: 'Navy Blue' },
                              { color: '#334155', label: 'Slate Grey' },
                              { color: '#ed1c24', label: 'Flame Red' },
                              { color: '#475569', label: 'Dark Charcoal' }
                            ].map(palette => (
                              <button
                                key={palette.color}
                                onClick={() => updateStyleField(selectedField, 'color', palette.color)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-xs transition-all cursor-pointer ${
                                  activeStyle.color === palette.color
                                    ? 'border-slate-800 bg-slate-800 text-white font-semibold'
                                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/20 block shadow-sm shrink-0"
                                  style={{ backgroundColor: palette.color }}
                                ></span>
                                {palette.label.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font Size Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-slate-500">Font Size (in pt)</label>
                            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{activeStyle.fontSize}pt</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            value={activeStyle.fontSize}
                            onChange={e => updateStyleField(selectedField, 'fontSize', parseInt(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Margins Sliders */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-semibold text-slate-500">Top Space</label>
                              <span className="text-[10px] font-mono font-bold text-slate-600">{activeStyle.marginTop}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="80"
                              value={activeStyle.marginTop}
                              onChange={e => updateStyleField(selectedField, 'marginTop', parseInt(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-semibold text-slate-500">Bottom Space</label>
                              <span className="text-[10px] font-mono font-bold text-slate-600">{activeStyle.marginBottom}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="80"
                              value={activeStyle.marginBottom}
                              onChange={e => updateStyleField(selectedField, 'marginBottom', parseInt(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-slate-50/50 p-6 rounded-xl border border-dashed border-slate-350 text-center flex flex-col items-center justify-center gap-2">
                        <Type className="w-8 h-8 text-slate-300 animate-pulse" />
                        <p className="text-xs font-semibold text-slate-500">No block selected</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">Touch or click any text block directly on the cover page preview to tune its format, sizing, and spacing alignments.</p>
                      </div>
                    )}

                  </div>
                )}

                {/* Sub Tab Content: BORDERS & THEMES LAYOUT */}
                {advancedSubTab === 'layout' && (
                  <div className="flex flex-col gap-5 animate-fade-in text-slate-700">
                    
                    {/* Font Pairing Option */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Font Family Pairing
                      </h3>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3">
                        {[
                          { id: 'serif', name: 'Times / Merriweather Academic Serif', desc: 'The historic academic publishing look.' },
                          { id: 'sans', name: 'Inter Clean Modern Sans', desc: 'Sleek, highly readable high-contrast layout.' },
                          { id: 'display', name: 'Space Grotesk Display', desc: 'Bold, tech-forward, modern aesthetic.' },
                          { id: 'mono', name: 'JetBrains Technical Mono', desc: 'Monochrome coding & programming spec sheets.' }
                        ].map(font => (
                          <button
                            key={font.id}
                            onClick={() => setData(prev => ({ ...prev, primaryFont: font.id }))}
                            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                              data.primaryFont === font.id
                                ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="text-sm font-semibold text-slate-800">{font.name}</div>
                            <div className="text-xs text-slate-500">{font.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Page Outline Borders Frame */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Outer Page Border Frame
                      </h3>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'none', label: 'No Outline' },
                            { id: 'single', label: 'Single Thin' },
                            { id: 'double', label: 'Legal Double' },
                            { id: 'fancy', label: 'Ornate Corners' }
                          ].map(border => (
                            <button
                              key={border.id}
                              onClick={() => setData(prev => ({ ...prev, pageBorder: border.id as any }))}
                              className={`py-2 px-3 text-xs rounded-lg border font-semibold transition-all cursor-pointer ${
                                data.pageBorder === border.id
                                  ? 'border-blue-600 bg-blue-50/40 text-blue-600'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                              }`}
                            >
                              {border.label}
                            </button>
                          ))}
                        </div>

                        {data.pageBorder !== 'none' && (
                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Border Color</span>
                            <div className="flex flex-wrap gap-2">
                              {['#00a651', '#000000', '#1e3a8a', '#334155', '#475569'].map(color => (
                                <button
                                  key={color}
                                  onClick={() => setData(prev => ({ ...prev, pageBorderColor: color }))}
                                  className={`w-7 h-7 rounded-full border shadow transition-all ${
                                    data.pageBorderColor === color
                                      ? 'ring-2 ring-blue-500 scale-110'
                                      : 'border-slate-200 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: color }}
                                ></button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Table Style Controls */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Submitted Table Borders
                      </h3>
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-4">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'all', label: 'Full Quadrant' },
                            { id: 'horizontal', label: 'Lines Only' },
                            { id: 'none', label: 'No Borders' }
                          ].map(style => (
                            <button
                              key={style.id}
                              onClick={() => setData(prev => ({ ...prev, tableBorder: style.id as any }))}
                              className={`py-2 text-[10px] md:text-xs rounded-lg border font-semibold transition-all text-center cursor-pointer ${
                                data.tableBorder === style.id
                                  ? 'border-blue-600 bg-blue-50/40 text-blue-600 font-bold shadow-sm'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                              }`}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>

                        {/* Table Border Color block */}
                        {data.tableBorder !== 'none' && (
                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Grid Line Color</span>
                            <div className="flex flex-wrap gap-2">
                              {['#334155', '#000000', '#94a3b8', '#00a651', '#1e3a8a'].map(color => (
                                <button
                                  key={color}
                                  onClick={() => setData(prev => ({ ...prev, tableBorderColor: color }))}
                                  className={`w-6 h-6 rounded-full border shadow transition-all ${
                                    data.tableBorderColor === color
                                      ? 'ring-2 ring-blue-500 scale-110'
                                      : 'border-slate-200 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: color }}
                                ></button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cell padding scale */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-slate-500">Cell Inner Padding</label>
                            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{data.tablePadding}px</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="24"
                            value={data.tablePadding}
                            onChange={e => setData(prev => ({ ...prev, tablePadding: parseInt(e.target.value) }))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Sub Tab Content: INSTANT DESIGN PRESETS */}
                {advancedSubTab === 'presets' && (
                  <div className="flex flex-col gap-4 animate-fade-in text-slate-700">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-blue-805 uppercase tracking-wider mb-0.5">One-Click Presets</h4>
                        <p className="text-xs text-blue-600">Quickly change the overall layout mode, margins, typography style, and grid parameters.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset.id)}
                          className="w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-55/40 hover:bg-slate-100 hover:border-slate-300 transition-all duration-150 flex flex-col gap-1 text-slate-700 active:scale-[0.99] cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              {preset.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-105 rounded font-mono text-slate-500 uppercase tracking-wider">{preset.primaryFont}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed text-left">{preset.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer branding details */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-slate-200 text-center text-xs text-slate-400 font-semibold tracking-wide mt-auto">
            Assignment Cover Page Architect v2.0 • Elite Edition
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive page layout preview and formatting ribbon */}
        <div 
          onClick={() => setSelectedField(null)} 
          className="flex-1 bg-slate-100 flex flex-col items-center overflow-auto p-4 md:p-6 lg:p-8 relative"
        >
          
          {/* Active Formatting Ribbon (Centered floating helpers) */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-4xl bg-white border border-slate-200 shadow-sm rounded-2xl mb-6 p-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur"
          >
            {selectedField && activeStyle ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Active Block: <span className="text-blue-600 font-semibold">{getFieldNameLabel(selectedField)}</span>
                  </div>
                </div>

                {/* Editing Ribbon Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Bold Toggle Button */}
                  <button
                    onClick={() => updateStyleField(selectedField, 'fontWeight', activeStyle.fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`p-2 rounded-lg transition-all border cursor-pointer ${
                      activeStyle.fontWeight === 'bold'
                        ? 'bg-blue-50 text-blue-600 border-blue-200/50'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                    title="Toggle Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  {/* Italic Toggle Button */}
                  <button
                    onClick={() => updateStyleField(selectedField, 'fontStyle', activeStyle.fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`p-2 rounded-lg transition-all border cursor-pointer ${
                      activeStyle.fontStyle === 'italic'
                        ? 'bg-blue-50 text-blue-600 border-blue-200/50'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                    title="Toggle Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                  {/* Alignment Controls Buttons */}
                  {selectedField !== 'tableTexts' && selectedField !== 'tableLabels' && (
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateStyleField(selectedField, 'alignment', 'left')}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          activeStyle.alignment === 'left' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-450 hover:text-slate-700'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateStyleField(selectedField, 'alignment', 'center')}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          activeStyle.alignment === 'center' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-450 hover:text-slate-700'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateStyleField(selectedField, 'alignment', 'right')}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          activeStyle.alignment === 'right' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-450 hover:text-slate-700'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Quick Font Size control */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-550">Size</span>
                    <button
                      onClick={() => updateStyleField(selectedField, 'fontSize', Math.max(8, activeStyle.fontSize - 1))}
                      className="text-xs md:text-sm text-slate-500 hover:text-slate-805 font-bold px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-800 px-1">{activeStyle.fontSize}pt</span>
                    <button
                      onClick={() => updateStyleField(selectedField, 'fontSize', Math.min(36, activeStyle.fontSize + 1))}
                      className="text-xs md:text-sm text-slate-500 hover:text-slate-805 font-bold px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick Spacing control */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-550">Margin Y</span>
                    <button
                      onClick={() => updateStyleField(selectedField, 'marginTop', Math.max(0, activeStyle.marginTop - 4))}
                      className="text-xs md:text-sm text-slate-500 hover:text-slate-805 font-bold px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-805 px-1">{activeStyle.marginTop}px</span>
                    <button
                      onClick={() => updateStyleField(selectedField, 'marginTop', Math.min(120, activeStyle.marginTop + 4))}
                      className="text-xs md:text-sm text-slate-500 hover:text-slate-855 font-bold px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick in-place editor input */}
                <div className="w-full flex flex-wrap gap-2 border-t border-slate-100 pt-2 items-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest shrink-0">Modify Text inline:</span>
                  {selectedField === 'university' && (
                    <input
                      type="text"
                      value={data.universityName}
                      onChange={e => setData(prev => ({ ...prev, universityName: e.target.value }))}
                      className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  )}
                  {selectedField === 'department' && (
                    <input
                      type="text"
                      value={data.departmentName}
                      onChange={e => setData(prev => ({ ...prev, departmentName: e.target.value }))}
                      className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  )}
                  {selectedField === 'topic' && (
                    <input
                      type="text"
                      value={data.assignmentTopic}
                      onChange={e => setData(prev => ({ ...prev, assignmentTopic: e.target.value }))}
                      className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  )}
                  {selectedField === 'assignmentNo' && (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={data.assignmentNo}
                        onChange={e => setData(prev => ({ ...prev, assignmentNo: e.target.value }))}
                        placeholder="No."
                        className="w-16 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-805 focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                      <span className="text-slate-300 self-center">|</span>
                      <span className="text-xs text-slate-450 self-center">Date:</span>
                      <input
                        type="text"
                        value={data.date}
                        onChange={e => setData(prev => ({ ...prev, date: e.target.value }))}
                        className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-805 focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  )}
                  {selectedField === 'date' && (
                    <input
                      type="text"
                      value={data.date}
                      onChange={e => setData(prev => ({ ...prev, date: e.target.value }))}
                      className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-805 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  )}
                  {(selectedField === 'tableLabels' || selectedField === 'tableTexts') && (
                    <span className="text-xs text-slate-500 italic">💡 Select fields in "Form Input" tab on the left sidebar to edit credentials text values instantly.</span>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full text-center py-2 text-xs font-semibold text-slate-400 flex items-center justify-center gap-2 select-none">
                <Info className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>No text block selected. Click any element on the cover page below to format/edit it instantly.</span>
              </div>
            )}
          </div>

          {/* Tips Info Bar */}
          {showInPlaceTip && (
            <div className="w-full max-w-4xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs mb-5 flex items-center justify-between gap-2.5 animate-fade-in relative z-10">
              <span className="flex items-center gap-1.5 text-[11px] leading-relaxed">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-300" />
                <strong>Direct Editing Enabled:</strong> Click directly on any text block on the virtual paper preview below to immediately load its formatting controls! Double click inline forms to write.
              </span>
              <button onClick={() => setShowInPlaceTip(false)} className="text-emerald-500 hover:text-emerald-300 font-bold text-xs px-1 hover:scale-105 transition-all">✕</button>
            </div>
          )}

          {/* 3. Paper Container Wrapper (Scrollable and centers the document canvas) */}
          <div 
            className="flex-1 w-full flex justify-center items-start overflow-visible py-4"
            style={{ 
              minHeight: `${1123 * scale + 40}px`,
              height: `${1123 * scale + 40}px`
            }}
          >
            
            {/* Aspect target scaling matrix */}
            <div 
              style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-[794px] h-[1123px] relative shrink-0"
              id="paper-scale-container"
            >
              
              {/* VIRTUAL CANVAS (Simulates real physical A4 page: 794px x 1123px) */}
              <div
                id="cover-page-canvas"
                className={`w-full h-full bg-white text-black p-[25mm] shadow-paper hover:shadow-paper-hover transition-shadow duration-300 flex flex-col relative select-text border border-slate-300 leading-relaxed font-${data.primaryFont}`}
              >
                
                {/* Visual Borders Rendering based on selected state */}
                {data.pageBorder === 'single' && (
                  <div 
                    style={{ borderColor: data.pageBorderColor }}
                    className="absolute inset-[8mm] border-2 pointer-events-none"
                    data-ui-helper="border"
                  ></div>
                )}
                {data.pageBorder === 'double' && (
                  <div 
                    style={{ borderColor: data.pageBorderColor }}
                    className="absolute inset-[8mm] border-4 border-double pointer-events-none"
                    data-ui-helper="border"
                  ></div>
                )}
                {data.pageBorder === 'fancy' && (
                  <div 
                    style={{ borderColor: data.pageBorderColor }}
                    className="absolute inset-[8mm] border-2 pointer-events-none"
                    data-ui-helper="border"
                  >
                    {/* Corner accents */}
                    <div className="absolute top-[-2px] left-[-2px] w-4 h-4 border-b-2 border-r-2" style={{ borderColor: data.pageBorderColor }}></div>
                    <div className="absolute top-[-2px] right-[-2px] w-4 h-4 border-b-2 border-l-2" style={{ borderColor: data.pageBorderColor }}></div>
                    <div className="absolute bottom-[-2px] left-[-2px] w-4 h-4 border-t-2 border-r-2" style={{ borderColor: data.pageBorderColor }}></div>
                    <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-t-2 border-l-2" style={{ borderColor: data.pageBorderColor }}></div>
                  </div>
                )}

                {/* Cover Main Content Body (Structured vertically exactly like a KUET submission) */}
                <div className="h-full w-full flex flex-col justify-between items-stretch">
                  
                  {/* Top Block: University & Dept Name */}
                  <div className="flex flex-col items-center">
                    
                    {/* Inst logo */}
                    <div 
                      data-logo-container="true"
                      className="cursor-pointer hover:ring-2 hover:ring-indigo-500 rounded p-1 mb-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('university');
                        fileInputRef.current?.click();
                      }}
                      title="Click to replace university logo"
                    >
                      {data.logoUrl ? (
                        <img 
                          src={data.logoUrl} 
                          alt="Uploaded University Logo" 
                          style={{ width: `${data.logoWidth}px` }} 
                          className="mx-auto block"
                        />
                      ) : (
                        <KuetLogo size={data.logoWidth} />
                      )}
                    </div>

                    {/* University Name */}
                    <div
                      data-text-element="true"
                      style={getCssStyle(data.styleUniversity)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('university');
                      }}
                      className={`w-full cursor-pointer p-[3px] select-text transition-all ${
                        selectedField === 'university' 
                          ? 'ring-2 ring-indigo-500 ring-dashed rounded selected-outline bg-indigo-50/20' 
                          : 'hover:ring-1 hover:ring-slate-300 hover:rounded'
                      }`}
                    >
                      {data.universityName || 'KHULNA UNIVERSITY OF ENGINEERING & TECHNOLOGY'}
                    </div>

                    {/* Department Name */}
                    <div
                      data-text-element="true"
                      style={getCssStyle(data.styleDepartment)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('department');
                      }}
                      className={`w-full cursor-pointer p-[3px] select-text transition-all ${
                        selectedField === 'department' 
                          ? 'ring-2 ring-indigo-500 ring-dashed rounded selected-outline bg-indigo-50/20' 
                          : 'hover:ring-1 hover:ring-slate-300 hover:rounded'
                      }`}
                    >
                      {data.departmentName || 'Department of Electrical and Electronic Engineering'}
                    </div>

                  </div>

                  {/* Mid Block: Assignment Title & Topic */}
                  <div className="flex flex-col items-center py-6">
                    
                    {/* Heading tag */}
                    <div
                      data-text-element="true"
                      style={getCssStyle(data.styleTopic)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('topic');
                      }}
                      className={`w-full cursor-pointer p-[3px] select-text transition-all leading-tight ${
                        selectedField === 'topic' 
                          ? 'ring-2 ring-indigo-500 ring-dashed rounded selected-outline bg-indigo-50/20' 
                          : 'hover:ring-1 hover:ring-slate-300 hover:rounded'
                      }`}
                    >
                      <span className="font-semibold" style={{ color: data.accentColor }}>Assignment Topic:</span> {data.assignmentTopic || 'Factors Supporting the Moral Development of an Individual'}
                    </div>

                    {/* Assignment No */}
                    <div
                      data-text-element="true"
                      style={getCssStyle(data.styleAssignmentNo)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('assignmentNo');
                      }}
                      className={`w-full cursor-pointer p-[3px] select-text transition-all ${
                        selectedField === 'assignmentNo' 
                          ? 'ring-2 ring-indigo-500 ring-dashed rounded selected-outline bg-indigo-50/20' 
                          : 'hover:ring-1 hover:ring-slate-300 hover:rounded'
                      }`}
                    >
                      <span className="font-semibold">Assignment No:</span> {data.assignmentNo || '01'}
                    </div>

                    {/* Submission Date */}
                    <div
                      data-text-element="true"
                      style={getCssStyle(data.styleDate)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField('date');
                      }}
                      className={`w-full cursor-pointer p-[3px] select-text transition-all ${
                        selectedField === 'date' 
                          ? 'ring-2 ring-indigo-500 ring-dashed rounded selected-outline bg-indigo-50/20' 
                          : 'hover:ring-1 hover:ring-slate-300 hover:rounded'
                      }`}
                    >
                      <span className="font-semibold text-slate-500">Submission Date:</span> {data.date || 'June 08, 2026'}
                    </div>

                  </div>

                  {/* Bottom Block: Submitted To / Submitted By Split Grid Table */}
                  <div className="w-full mt-auto mb-10">
                    <table 
                      className="w-full"
                      style={{ 
                        borderColor: data.tableBorderColor,
                        borderStyle: data.tableBorder !== 'none' ? 'solid' : 'none',
                        borderWidth: data.tableBorder === 'all' ? '1px' : '0'
                      }}
                    >
                      <tbody>
                        {/* Table Header row (Labels like "Submitted To", "Submitted By") */}
                        <tr 
                          style={{ 
                            borderBottom: data.tableBorder !== 'none' ? `1px solid ${data.tableBorderColor}` : 'none'
                          }}
                        >
                          <td 
                            data-label-col="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField('tableLabels');
                            }}
                            className={`w-1/2 align-top cursor-pointer transition-all ${
                              selectedField === 'tableLabels'
                                ? 'ring-2 ring-indigo-500 ring-dashed rounded-sm selected-outline bg-indigo-50/20'
                                : 'hover:ring-1 hover:ring-slate-300'
                            }`}
                            style={{ 
                              padding: `${data.tablePadding}px`,
                              borderRight: data.tableBorder === 'all' ? `1px solid ${data.tableBorderColor}` : 'none',
                              ...getCssStyle(data.styleTableLabels)
                            }}
                          >
                            {data.submittedToLabel}
                          </td>
                          <td 
                            data-label-col="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField('tableLabels');
                            }}
                            className={`w-1/2 align-top cursor-pointer transition-all text-center ${
                              selectedField === 'tableLabels'
                                ? 'ring-2 ring-indigo-500 ring-dashed rounded-sm selected-outline bg-indigo-50/20'
                                : 'hover:ring-1 hover:ring-slate-300'
                            }`}
                            style={{ 
                              padding: `${data.tablePadding}px`,
                              ...getCssStyle(data.styleTableLabels)
                            }}
                          >
                            {data.submittedByLabel}
                          </td>
                        </tr>

                        {/* Table Content row (Credentials data lists) */}
                        <tr>
                          {/* Column A: Submitted To Teacher details */}
                          <td 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField('tableTexts');
                            }}
                            className={`w-1/2 align-top select-text cursor-pointer transition-all ${
                              selectedField === 'tableTexts'
                                ? 'ring-2 ring-indigo-500 ring-dashed rounded-sm selected-outline bg-indigo-50/20'
                                : 'hover:ring-1 hover:ring-slate-300'
                            }`}
                            style={{ 
                              padding: `${data.tablePadding}px`,
                              borderRight: data.tableBorder === 'all' ? `1px solid ${data.tableBorderColor}` : 'none',
                              ...getCssStyle(data.styleTableTexts)
                            }}
                          >
                            <div className="flex flex-col space-y-1.5 font-serif" style={{ fontFamily: data.primaryFont === 'serif' ? 'Merriweather, Times New Roman, Georgia' : undefined }}>
                              <p className="font-bold text-black" style={{ color: data.styleTableTexts.color }}>{data.teacher.name}</p>
                              <p className="text-slate-700" style={{ color: `${data.styleTableTexts.color}cc` }}>{data.teacher.designation},</p>
                              <p className="text-slate-700" style={{ color: `${data.styleTableTexts.color}cc` }}>{data.teacher.department},</p>
                              <p className="text-slate-700" style={{ color: `${data.styleTableTexts.color}cc` }}>{data.teacher.university}.</p>
                            </div>
                          </td>

                          {/* Column B: Submitted By Student details */}
                          <td 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField('tableTexts');
                            }}
                            className={`w-1/2 align-top select-text cursor-pointer transition-all ${
                              selectedField === 'tableTexts'
                                ? 'ring-2 ring-indigo-500 ring-dashed rounded-sm selected-outline bg-indigo-50/20'
                                : 'hover:ring-1 hover:ring-slate-300'
                            }`}
                            style={{ 
                              padding: `${data.tablePadding}px`,
                              ...getCssStyle(data.styleTableTexts)
                            }}
                          >
                            <table className="w-full border-none">
                              <tbody className="border-none">
                                {[
                                  { label: 'Name', val: data.student.name, highlight: true },
                                  { label: 'Roll', val: data.student.roll, highlight: true },
                                  { label: 'Department', val: data.student.department },
                                  { label: 'Section', val: data.student.section },
                                  { label: 'Year', val: data.student.year },
                                  { label: 'Term/Sem', val: data.student.term }
                                ].map((row, idx) => (
                                  <tr key={idx} className="border-none">
                                    <td 
                                      className="p-0.5 border-none w-1/3 font-semibold text-slate-500 shrink-0 select-text" 
                                      style={{ 
                                        fontFamily: data.primaryFont === 'serif' ? 'Merriweather, Times New Roman, Georgia' : undefined,
                                        fontSize: 'inherit'
                                      }}
                                    >
                                      {row.label}:
                                    </td>
                                    <td 
                                      className={`p-0.5 border-none w-2/3 select-text ${row.highlight ? 'font-bold text-black' : 'text-slate-700'}`} 
                                      style={{ 
                                        color: row.highlight ? data.styleTableTexts.color : `${data.styleTableTexts.color}e6`,
                                        fontFamily: data.primaryFont === 'serif' ? 'Merriweather, Times New Roman, Georgia' : undefined,
                                        fontSize: 'inherit'
                                      }}
                                    >
                                      {row.val}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
