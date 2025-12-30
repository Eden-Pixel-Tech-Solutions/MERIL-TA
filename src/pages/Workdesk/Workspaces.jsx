import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, Circle, Plus, Upload, FolderOpen, BarChart3, MessageSquare, LayoutDashboard, Users, X, Download, Trash2, ShoppingCart, Tag, Edit2, Wand2 } from 'lucide-react';


import WorkspaceOverview from "./WorkspaceOverview";
import WorkspaceTasks from "./WorkspaceTasks";
import WorkspaceDiscussion from "./WorkspaceDiscussion";
import WorkspaceAnalytics from "./WorkspaceAnalytics";
import WorkspaceProducts from "./WorkspaceProducts";




const TenderWorkspace = () => {
  // Capture the wildcard path, which corresponds to the full tender ID (e.g. GEM/2025/B/xxxx)
  const { "*": tenderId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([
    { id: 2, name: 'Finance', color: '#059669', icon: '💰', tasks: 8, files: 15 },
    { id: 3, name: 'Legal', color: '#7c3aed', icon: '⚖️', tasks: 6, files: 20 },
    { id: 4, name: 'Operations', color: '#dc2626', icon: '🔧', tasks: 10, files: 12 },
    { id: 5, name: 'HR', color: '#db2777', icon: '👥', tasks: 5, files: 7 }
  ]);

  // files: persisted uploaded files per dept
  const [files, setFiles] = useState({});
  // tasks persisted per dept
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');
  const [selectedTag, setSelectedTag] = useState('step');

  // Environment variables needed for fetching
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://192.168.1.3:5006';

  // Fetch tender details to populate initial tasks from Required Documents
  React.useEffect(() => {
    if (!tenderId) return;

    const fetchTenderData = async () => {
      try {
        // 1. Get JSON path
        const pathRes = await fetch(`${API_BASE_URL}/tenders/${encodeURIComponent(tenderId)}/documents/path`);
        if (!pathRes.ok) throw new Error('Failed to fetch path');
        const pathData = await pathRes.json();

        if (!pathData.json_path) return;

        let jsonPath = pathData.json_path;
        if (jsonPath.startsWith('"') && jsonPath.endsWith('"')) {
          jsonPath = jsonPath.slice(1, -1);
        }
        if (/^[a-zA-Z]:/.test(jsonPath) || jsonPath.includes('\\')) {
          const fileName = jsonPath.split(/[/\\]/).pop();
          jsonPath = `${JSON_SERVER_URL}/${fileName}`;
        }

        // 2. Fetch JSON
        const jsonRes = await fetch(jsonPath);
        const json = await jsonRes.json();

        // 3. Extract Required Documents
        let documentRequired = "N/A";
        json.pages?.forEach(page => {
          page.tables?.forEach(table => {
            table.forEach(([key, value]) => {
              if (key?.toLowerCase().includes("document required")) {
                documentRequired = value;
              }
            });
          });
        });

        // 4. Create tasks if documents are found and tasks are empty for 'Operations'
        if (documentRequired !== "N/A") {
          const docs = documentRequired.split(',').map(d => d.trim()).filter(Boolean);

          // We'll add these to the "Operations" department (id: 4) as a default location
          // Only add if we haven't already (simple check)
          const deptId = 4;

          setTasks(prev => {
            // If we already have tasks for this dept, maybe don't overwrite? 
            // But for this demo, we'll assume we want to ensure these exist.
            const titleSet = new Set(prev[deptId]?.map(t => t.title) || []);
            const newTasks = [];

            docs.forEach(doc => {
              const title = `Upload ${doc}`;
              if (!titleSet.has(title)) {
                newTasks.push({
                  id: Date.now() + Math.random(),
                  title: title,
                  status: 'not-done',
                  createdAt: new Date().toLocaleDateString(),
                  tags: ['doc']
                });
              }
            });

            if (newTasks.length > 0) {
              return {
                ...prev,
                [deptId]: [...(prev[deptId] || []), ...newTasks]
              };
            }
            return prev;
          });
        }

      } catch (err) {
        console.error("Error populating workspace tasks:", err);
      }
    };

    fetchTenderData();
  }, [tenderId, API_BASE_URL, JSON_SERVER_URL]);

  // tempUploads holds files chosen via input but not yet 'uploaded' (per dept)
  // structure: { [deptId]: [ { tempId, file, name, size, selectedAt, description:'', tags:'' } ] }
  const [tempUploads, setTempUploads] = useState({});

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
    if (!files[dept.id]) {
      setFiles(prev => ({ ...prev, [dept.id]: [] }));
    }
    if (!tasks[dept.id]) {
      setTasks(prev => ({ ...prev, [dept.id]: [] }));
    }
    if (!tempUploads[dept.id]) {
      setTempUploads(prev => ({ ...prev, [dept.id]: [] }));
    }
  };

  // When user selects files from input, store them in tempUploads for that dept (and allow description/tags before final upload)
  const handleFileSelect = (e, deptId) => {
    const selected = Array.from(e.target.files).map(file => ({
      tempId: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      selectedAt: new Date().toLocaleDateString(),
      description: '',
      tags: '' // comma-separated tags string
    }));

    setTempUploads(prev => ({
      ...prev,
      [deptId]: [...(prev[deptId] || []), ...selected]
    }));

    // clear the input value so same file can be selected again if needed
    e.target.value = null;
  };

  // confirm upload of a single temp file (index)
  const handleConfirmUpload = (deptId, tempId) => {
    const tempList = tempUploads[deptId] || [];
    const item = tempList.find(t => t.tempId === tempId);
    if (!item) return;

    const uploadedFile = {
      id: Date.now() + Math.random(),
      name: item.name,
      size: item.size,
      uploadedAt: item.selectedAt,
      description: item.description,
      tags: item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    setFiles(prev => ({
      ...prev,
      [deptId]: [...(prev[deptId] || []), uploadedFile]
    }));

    // remove from tempUploads
    setTempUploads(prev => ({
      ...prev,
      [deptId]: prev[deptId].filter(t => t.tempId !== tempId)
    }));
  };

  // upload all temp files for dept (if any)
  const handleConfirmUploadAll = (deptId) => {
    const tempList = tempUploads[deptId] || [];
    if (tempList.length === 0) return;

    const uploaded = tempList.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      size: item.size,
      uploadedAt: item.selectedAt,
      description: item.description,
      tags: item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }));

    setFiles(prev => ({
      ...prev,
      [deptId]: [...(prev[deptId] || []), ...uploaded]
    }));

    setTempUploads(prev => ({
      ...prev,
      [deptId]: []
    }));
  };

  // on-change handlers for description/tags in tempUploads
  const updateTempUploadField = (deptId, tempId, field, value) => {
    setTempUploads(prev => ({
      ...prev,
      [deptId]: (prev[deptId] || []).map(item =>
        item.tempId === tempId ? { ...item, [field]: value } : item
      )
    }));
  };

  // existing file delete (uploaded)
  const deleteFile = (deptId, fileId) => {
    setFiles(prev => ({
      ...prev,
      [deptId]: prev[deptId].filter(file => file.id !== fileId)
    }));
  };

  const handleAddTask = (deptId) => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [deptId]: [...(prev[deptId] || []), {
          id: Date.now(),
          title: newTask,
          status: 'not-done',
          createdAt: new Date().toLocaleDateString(),
          tags: [selectedTag]
        }]
      }));
      setNewTask('');
    }
  };

  const toggleTaskStatus = (deptId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [deptId]: prev[deptId].map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'not-done' : 'done' }
          : task
      )
    }));
  };

  const deleteTask = (deptId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [deptId]: prev[deptId].filter(task => task.id !== taskId)
    }));
  };

  // New: Done button -> confirm popup -> remove the task if confirmed
  const handleTaskDone = (deptId, taskId) => {
    const confirmed = window.confirm('Are you sure you are done?');
    if (confirmed) {
      // remove task
      deleteTask(deptId, taskId);
    }
  };

  // Editing logic
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', tag: '', deptId: null });

  const startEditing = (deptId, task) => {
    setEditingTaskId(task.id);
    setEditForm({
      title: task.title,
      tag: task.tags && task.tags.length > 0 ? task.tags[0] : 'step',
      deptId: deptId
    });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditForm({ title: '', tag: '', deptId: null });
  };

  const saveEditing = (originalDeptId, taskId) => {
    const { title, tag, deptId: newDeptId } = editForm;
    if (!title.trim()) return;

    // 1. Remove from original department
    const originalTasks = tasks[originalDeptId] || [];
    const taskIndex = originalTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const taskToUpdate = {
      ...originalTasks[taskIndex],
      title,
      tags: [tag] // Assuming single tag for now based on UI
    };

    // If department changed
    if (Number(newDeptId) !== Number(originalDeptId)) {
      setTasks(prev => {
        const sourceList = prev[originalDeptId].filter(t => t.id !== taskId);
        const targetList = [...(prev[newDeptId] || []), taskToUpdate];
        return {
          ...prev,
          [originalDeptId]: sourceList,
          [newDeptId]: targetList
        };
      });
    } else {
      // Same department, just update
      setTasks(prev => ({
        ...prev,
        [originalDeptId]: prev[originalDeptId].map(t =>
          t.id === taskId ? taskToUpdate : t
        )
      }));
    }

    setEditingTaskId(null);
  };


  // ---------------- DOC GENERATION WIZARD ----------------
  const [isDocWizardOpen, setIsDocWizardOpen] = useState(false);
  const [docWizardStep, setDocWizardStep] = useState(1); // 1: Select Task, 2: Editor
  const [selectedTaskForDoc, setSelectedTaskForDoc] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const openDocWizard = (deptId) => {
    setIsDocWizardOpen(true);
    setDocWizardStep(1);
    setSelectedTaskForDoc(null);
    setGeneratedContent('');
  };

  const handleDocTaskSelect = (task) => {
    // Navigate to the full page document editor
    // We encode the tenderId if needed, though react-router handles URL params well.
    // tenderId here is "GEM/..." from splat, we might need to double check path matching
    // Route is /workspace/:tenderId/doc-editor/:taskId
    // Workspaces is at /workspace/* so tenderId is the * part.
    // If we simply use navigate, we should be careful about relative paths.
    // The App.jsx route is /workspace/:tenderId/doc-editor/:taskId
    // Workspaces "tenderId" from splat is "GEM/2025/..."

    // We need to match the route definition in App.jsx
    // Wait, App.jsx defines /workspace/* for Workspaces. 
    // AND /workspace/:tenderId/doc-editor/:taskId separately.
    // So we need to construct the full path.
    const encodedId = encodeURIComponent(tenderId);
    navigate(`/workspace/${encodedId}/doc-editor/${task.id}`);
  };

  const generateAIContent = async () => {
    if (!selectedTaskForDoc) return;
    setIsGenerating(true);
    // SIMULATED GPT CALL
    // In a real app, you'd call: await fetch('/api/generate-doc', { task: selectedTaskForDoc.title })
    setTimeout(() => {
      setGeneratedContent(`
<h1>${selectedTaskForDoc.title}</h1>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<hr/>
<h2>1. Introduction</h2>
<p>This document addresses the requirements for <em>${selectedTaskForDoc.title}</em>. Based on the tender analysis, the following points are critical.</p>
<h2>2. Details</h2>
<ul>
  <li>Requirement A: Compliant</li>
  <li>Requirement B: Pending Review</li>
  <li>Timeline: Immediate</li>
</ul>
<h2>3. Conclusion</h2>
<p>Generated by AI Assistant.</p>
      `);
      setIsGenerating(false);
    }, 1500);
  };

  const saveGeneratedDoc = () => {
    if (!selectedTaskForDoc || !selectedDepartment) return;

    const newFile = {
      id: Date.now(),
      name: `${selectedTaskForDoc.title}.html`, // Saving as HTML for now
      size: '2 KB',
      uploadedAt: new Date().toLocaleDateString(),
      description: `Generated from task: ${selectedTaskForDoc.title}`,
      tags: ['generated', 'doc']
    };

    setFiles(prev => ({
      ...prev,
      [selectedDepartment.id]: [...(prev[selectedDepartment.id] || []), newFile]
    }));

    setIsDocWizardOpen(false);
  };

  const renderWorkspace = () => {
    if (selectedDepartment) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '8px',
                background: selectedDepartment.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {selectedDepartment.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>{selectedDepartment.name}</h2>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Department Management</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDepartment(null)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <X style={{ width: '1.5rem', height: '1.5rem', color: '#6b7280' }} />
            </button>
          </div>

          {/* File Management */}
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderOpen style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                File Management
              </h3>
              <button
                onClick={() => openDocWizard(selectedDepartment.id)}
                style={{
                  padding: '0.65rem 1rem',
                  background: '#7c3aed',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  marginRight: '1rem'
                }}
              >
                <Wand2 size={16} /> Generate Doc
              </button>

              <label style={{
                padding: '0.65rem 1rem',
                background: '#2563eb',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s',
                border: 'none'
              }}
                onMouseEnter={(e) => e.target.style.background = '#1e40af'}
                onMouseLeave={(e) => e.target.style.background = '#2563eb'}>
                <Upload style={{ width: '1rem', height: '1rem' }} />
                Select Files
                <input
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e, selectedDepartment.id)}
                />
              </label>
            </div>

            {/* TEMP UPLOAD AREA: show selected files with description & tags inputs and Upload buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {(tempUploads[selectedDepartment.id] || []).length > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151' }}>{tempUploads[selectedDepartment.id].length} file(s) selected</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleConfirmUploadAll(selectedDepartment.id)}
                        style={{
                          padding: '0.6rem 0.9rem',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#1e40af'}
                        onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                      >
                        Upload All
                      </button>
                    </div>
                  </div>

                  {(tempUploads[selectedDepartment.id] || []).map(item => (
                    <div key={item.tempId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                        <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: '500', color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{item.size} • {item.selectedAt}</p>

                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                              type="text"
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateTempUploadField(selectedDepartment.id, item.tempId, 'description', e.target.value)}
                              style={{
                                flex: 2,
                                minWidth: '200px',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.9rem'
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Tags (comma separated)"
                              value={item.tags}
                              onChange={(e) => updateTempUploadField(selectedDepartment.id, item.tempId, 'tags', e.target.value)}
                              style={{
                                flex: 1,
                                minWidth: '160px',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.9rem'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <button
                                onClick={() => handleConfirmUpload(selectedDepartment.id, item.tempId)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  background: '#059669',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#047857'}
                                onMouseLeave={(e) => e.target.style.background = '#059669'}
                              >
                                <Upload style={{ width: '0.9rem', height: '0.9rem' }} /> Upload
                              </button>
                              <button
                                onClick={() => setTempUploads(prev => ({ ...prev, [selectedDepartment.id]: prev[selectedDepartment.id].filter(t => t.tempId !== item.tempId) }))}
                                style={{
                                  padding: '0.45rem 0.6rem',
                                  background: 'transparent',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#ffffff'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                <X style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {files[selectedDepartment.id]?.length > 0 ? (
                files[selectedDepartment.id].map(file => (
                  <div key={file.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontWeight: '500', color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{file.size} • {file.uploadedAt}</p>
                        {file.description && <p style={{ fontSize: '0.85rem', color: '#374151', margin: '0.5rem 0 0 0' }}><strong>Description:</strong> {file.description}</p>}
                        {file.tags?.length > 0 && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {file.tags.map((t, idx) => (
                              <span key={idx} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '999px', background: '#eef2ff', color: '#3730a3' }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                        onMouseEnter={(e) => e.target.style.background = '#ffffff'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        <Download style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                      <button
                        onClick={() => deleteFile(selectedDepartment.id, file.id)}
                        style={{
                          padding: '0.5rem',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#ffffff'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                        <Trash2 style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0', margin: 0 }}>No files uploaded yet</p>
              )}
            </div>
          </div>

          {/* Task Management */}
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
              Task Management
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  transition: 'border-color 0.2s'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask(selectedDepartment.id)}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="step">Step</option>
                <option value="doc">Doc</option>
                <option value="request">Request</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                onClick={() => handleAddTask(selectedDepartment.id)}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#047857'}
                onMouseLeave={(e) => e.target.style.background = '#059669'}>
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Add Task
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tasks[selectedDepartment.id]?.length > 0 ? (
                tasks[selectedDepartment.id].map(task => (
                  <div key={task.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>

                    {editingTaskId === task.id ? (
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
                        />
                        <select
                          value={editForm.tag}
                          onChange={e => setEditForm({ ...editForm, tag: e.target.value })}
                          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                          <option value="step">Step</option>
                          <option value="doc">Doc</option>
                          <option value="request">Request</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <select
                          value={editForm.deptId}
                          onChange={e => setEditForm({ ...editForm, deptId: e.target.value })}
                          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                        <button onClick={() => saveEditing(selectedDepartment.id, task.id)} style={{ padding: '5px 10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                        <button onClick={cancelEditing} style={{ padding: '5px 10px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                          <button
                            onClick={() => toggleTaskStatus(selectedDepartment.id, task.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              flexShrink: 0
                            }}>
                            {task.status === 'done' ? (
                              <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                            ) : (
                              <Circle style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                            )}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontWeight: '500',
                              color: task.status === 'done' ? '#6b7280' : '#1f2937',
                              textDecoration: task.status === 'done' ? 'line-through' : 'none',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {task.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{task.createdAt}</p>
                            {task.tags && task.tags.length > 0 && (
                              <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                {task.tags.map((tag, idx) => (
                                  <span key={idx} style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: '#e0f2fe',
                                    color: '#0284c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}>
                                    <Tag size={10} /> {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                          {/* Edit Button */}
                          <button
                            onClick={() => startEditing(selectedDepartment.id, task)}
                            style={{
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <Edit2 style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                          </button>

                          {/* New Done button (green) with confirm -> remove on Yes */}
                          <button
                            onClick={() => handleTaskDone(selectedDepartment.id, task.id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#047857'}
                            onMouseLeave={(e) => e.target.style.background = '#059669'}
                          >
                            Done
                          </button>

                          <button
                            onClick={() => deleteTask(selectedDepartment.id, task.id)}
                            style={{
                              padding: '0.5rem',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#ffffff'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                            <Trash2 style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0', margin: 0 }}>No tasks added yet</p>
              )}
            </div>
          </div>



          {/* ---------------- DOC GENERATOR WIZARD MODAL ---------------- */}
          {
            isDocWizardOpen && selectedDepartment && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999
              }}>
                <div style={{
                  background: 'white', width: '800px', height: '600px', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Header */}
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                      {docWizardStep === 1 ? 'Select a Task to Generate Doc' : 'AI Document Editor'}
                    </h2>
                    <button onClick={() => setIsDocWizardOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#f9fafb' }}>
                    {docWizardStep === 1 ? (
                      // STEP 1: SELECT TASK
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {/* Static Options */}
                        <div
                          onClick={() => {
                            const encodedId = encodeURIComponent(tenderId);
                            navigate(`/workspace/${encodedId}/rep-editor`);
                          }}
                          style={{
                            padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#bbf7d0'}
                        >
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>Representation Letter</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#15803d' }}>Generate official representation letter</p>
                          </div>
                          <div style={{ background: '#dcfce7', color: '#166534', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            Template
                          </div>
                        </div>

                        {/* Dynamic Tasks */}
                        {tasks[selectedDepartment.id]?.filter(t => t.tags?.includes('doc')).length > 0 ? (
                          tasks[selectedDepartment.id]
                            .filter(t => t.tags?.includes('doc'))
                            .map(task => (
                              <div key={task.id}
                                onClick={() => handleDocTaskSelect(task)}
                                style={{
                                  padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb',
                                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                              >
                                <div>
                                  <p style={{ margin: 0, fontWeight: 600 }}>{task.title}</p>
                                  <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666' }}>ID: {task.id}</p>
                                </div>
                                <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                  Doc Task
                                </div>
                              </div>
                            ))
                        ) : (
                          <div style={{ textAlign: 'center', color: '#666', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
                            No specific doc tasks found. Select "Representation Letter" above or add a task with 'doc' tag.
                          </div>
                        )}
                      </div>
                    ) : (
                      // STEP 2: EDITOR
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600 }}>Editing: {selectedTaskForDoc?.title}</span>
                          <button
                            onClick={generateAIContent} disabled={isGenerating}
                            style={{
                              background: isGenerating ? '#cbd5e1' : '#7c3aed', color: 'white', border: 'none',
                              padding: '0.5rem 1rem', borderRadius: '6px', cursor: isGenerating ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                          >
                            <Wand2 size={16} /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                          </button>
                        </div>
                        <textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          style={{
                            flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb',
                            fontSize: '1rem', lineHeight: '1.6', fontFamily: 'monospace', resize: 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    {docWizardStep === 2 && (
                      <>
                        <button onClick={() => setDocWizardStep(1)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>Back</button>
                        <button onClick={saveGeneratedDoc} style={{ padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Document</button>
                      </>
                    )}
                    {docWizardStep === 1 && (
                      <button onClick={() => setIsDocWizardOpen(false)} style={{ padding: '0.5rem 1rem', background: '#ccc', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            )
          }
        </div >
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => handleDepartmentClick(dept)}
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
            }}>
            <div style={{ height: '4px', background: dept.color }}></div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '10px',
                  background: dept.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}>
                  {dept.icon}
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>{dept.name}</h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#059669' }} />
                  <span>{tasks[dept.id]?.length || 0} tasks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FileText style={{ width: '1rem', height: '1rem', color: '#2563eb' }} />
                  <span>{files[dept.id]?.length || 0} files</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <WorkspaceOverview
            departments={departments}
            tasks={tasks}
            files={files}
          />
        );

      case 'workspace':
        return renderWorkspace();
      case 'task':
        return (
          <WorkspaceTasks
            departments={departments}
            tasks={tasks}
          />
        );

      case 'products':
        return <WorkspaceProducts tenderId={tenderId} />;

      case 'discussion':
        return <WorkspaceDiscussion />;

      case 'analytics':
        return <WorkspaceAnalytics />;

      default:
        return renderWorkspace();
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'workspace', label: 'Workspace', icon: FolderOpen },
    { id: 'task', label: 'Tasks', icon: CheckCircle2 },
    { id: 'products', label: 'Products', icon: ShoppingCart },
    { id: 'discussion', label: 'Discussion', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f6fb' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{
          width: '100%',
          maxWidth: '16rem',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          minHeight: '100vh'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Tender Hub
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{tenderId || 'Project Management'}</p>
          </div>

          <nav style={{ padding: '1rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedDepartment(null);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive ? '#2563eb' : 'transparent',
                    color: isActive ? '#ffffff' : '#1f2937',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.background = 'transparent';
                  }}>
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {renderContent()}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .sidebar { width: 100% !important; min-height: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default TenderWorkspace;
