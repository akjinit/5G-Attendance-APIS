import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function App() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Form states
  const [userForm, setUserForm] = useState({ name: '', model_id: '' });
  const [userFormStatus, setUserFormStatus] = useState({ type: '', message: '' });

  const [attendanceForm, setAttendanceForm] = useState({ model_id: '' });
  const [attendanceFormStatus, setAttendanceFormStatus] = useState({ type: '', message: '' });

  const fetchAttendance = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-todays-attendance`);
      const data = await response.json();
      if (data.success) {
        setAttendanceData(data.attendanceData || []);
      } else {
        setFetchError(data.message || 'Error fetching attendance');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFetchError('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserFormStatus({ type: '', message: '' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/add-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setUserFormStatus({ type: 'success', message: 'User added successfully!' });
        setUserForm({ name: '', model_id: '' });
        fetchAttendance(); // Refresh table
      } else {
        setUserFormStatus({ type: 'error', message: data.message || 'Failed to add user' });
      }
    } catch (error) {
      setUserFormStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setAttendanceFormStatus({ type: '', message: '' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/add-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model_id: attendanceForm.model_id,
          date: new Date().toISOString()
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setAttendanceFormStatus({ type: 'success', message: 'Attendance marked!' });
        setAttendanceForm({ model_id: '' });
        fetchAttendance(); // Refresh table
      } else {
        setAttendanceFormStatus({ type: 'error', message: data.message || 'Failed to mark attendance' });
      }
    } catch (error) {
      setAttendanceFormStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>5G Attendance</h1>
        <p>Smart attendance tracking system</p>
      </header>

      <div className="main-content">
        <div className="sidebar">
          {/* Add User Panel */}
          <div className="glass-panel">
            <h2 className="panel-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Add New User
            </h2>
            
            {userFormStatus.message && (
              <div className={`alert ${userFormStatus.type}`}>
                {userFormStatus.message}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Jane Doe"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Model ID (Unique)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 1001"
                  value={userForm.model_id}
                  onChange={(e) => setUserForm({...userForm, model_id: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="primary-button">Register User</button>
            </form>
          </div>

          {/* Mark Attendance Panel */}
          <div className="glass-panel">
            <h2 className="panel-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Mark Attendance
            </h2>

            {attendanceFormStatus.message && (
              <div className={`alert ${attendanceFormStatus.type}`}>
                {attendanceFormStatus.message}
              </div>
            )}

            <form onSubmit={handleMarkAttendance}>
              <div className="form-group">
                <label>Model ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter Model ID"
                  value={attendanceForm.model_id}
                  onChange={(e) => setAttendanceForm({...attendanceForm, model_id: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="primary-button">Mark Present</button>
            </form>
          </div>
        </div>

        {/* Dashboard Panel */}
        <div className="glass-panel">
          <div className="dashboard-actions">
            <h2 className="panel-title" style={{ marginBottom: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Today's Attendance
            </h2>
            <button className="refresh-button" onClick={fetchAttendance} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? "spinning" : ""}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {fetchError && (
             <div className="alert error">{fetchError}</div>
          )}

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Model ID</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      {loading ? 'Loading data...' : 'No users registered yet.'}
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.name}</td>
                      <td>{record.model_id}</td>
                      <td>{record.status === 'Present' ? record.time : '-'}</td>
                      <td>
                        <span className={`status-badge ${record.status === 'Present' ? 'present' : 'absent'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
{/* extra global style for spinner just in case */}
<style>{`
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
`}</style>
    </div>
  );
}

export default App;
