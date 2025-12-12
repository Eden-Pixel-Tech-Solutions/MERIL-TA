// WorkspaceOverview.jsx
import React from "react";
import { Users, CheckCircle2, FileText } from "lucide-react";

const WorkspaceOverview = ({ departments, tasks, files }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ====== Top Stats Section ====== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Departments Count */}
        <div
          style={{
            background: '#2563eb',
            borderRadius: '10px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>Total Departments</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                {departments.length}
              </p>
            </div>
            <Users style={{ width: '3rem', height: '3rem', opacity: 0.8 }} />
          </div>
        </div>

        {/* Tasks Count */}
        <div
          style={{
            background: '#059669',
            borderRadius: '10px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>Total Tasks</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                {Object.values(tasks).reduce((acc, arr) => acc + arr.length, 0)}
              </p>
            </div>
            <CheckCircle2 style={{ width: '3rem', height: '3rem', opacity: 0.8 }} />
          </div>
        </div>

        {/* Files Count */}
        <div
          style={{
            background: '#7c3aed',
            borderRadius: '10px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>Total Files</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                {Object.values(files).reduce((acc, arr) => acc + arr.length, 0)}
              </p>
            </div>
            <FileText style={{ width: '3rem', height: '3rem', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* ====== Tender Information ====== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 1rem 0'
          }}
        >
          Tender Information
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          <div style={{ borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
              Tender ID
            </p>
            <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>TND-2024-001</p>
          </div>

          <div style={{ borderLeft: '4px solid #059669', paddingLeft: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
              Status
            </p>
            <p style={{ fontWeight: '600', color: '#059669', margin: 0 }}>In Progress</p>
          </div>

          <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
              Deadline
            </p>
            <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>Dec 31, 2025</p>
          </div>

          <div style={{ borderLeft: '4px solid #7c3aed', paddingLeft: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
              Budget
            </p>
            <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>$2,500,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceOverview;
