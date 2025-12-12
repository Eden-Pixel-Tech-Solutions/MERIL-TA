import React, { useState } from 'react';
import { FileText, CheckCircle2, Circle, Plus, Upload, FolderOpen, BarChart3, MessageSquare, LayoutDashboard, Users, X, Download, Trash2 } from 'lucide-react';


import WorkspaceOverview from "./WorkspaceOverview";
import WorkspaceTasks from "./WorkspaceTasks";
import WorkspaceDiscussion from "./WorkspaceDiscussion";
import WorkspaceAnalytics from "./WorkspaceAnalytics";




const TenderWorkspace = () => {
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', color: '#2563eb', icon: '⚙️', tasks: 12, files: 8 },
    { id: 2, name: 'Finance', color: '#059669', icon: '💰', tasks: 8, files: 15 },
    { id: 3, name: 'Legal', color: '#7c3aed', icon: '⚖️', tasks: 6, files: 20 },
    { id: 4, name: 'Operations', color: '#dc2626', icon: '🔧', tasks: 10, files: 12 },
    { id: 5, name: 'HR', color: '#db2777', icon: '👥', tasks: 5, files: 7 },
    { id: 6, name: 'Marketing', color: '#0891b2', icon: '📢', tasks: 9, files: 18 }
  ]);

  // files: persisted uploaded files per dept
  const [files, setFiles] = useState({});
  // tasks persisted per dept
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');

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
          createdAt: new Date().toLocaleDateString()
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
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
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
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0', margin: 0 }}>No tasks added yet</p>
              )}
            </div>
          </div>
        </div>
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
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Project Management</p>
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
