import React, { useState, useEffect } from "react";

// Single-file React component (default export) using TailwindCSS classes.
// Designed to be clean, white + green themed to match your mobile app.

export default function TeacherDashboard() {
  const [route, setRoute] = useState("dashboard");

  // sample students
  const initialStudents = [
    { id: 1, name: "Aarav Patel", present: true, points: 95 },
    { id: 2, name: "Bianca Singh", present: true, points: 88 },
    { id: 3, name: "Chetan Kumar", present: false, points: 72 },
    { id: 4, name: "Disha Mehta", present: true, points: 81 },
    { id: 5, name: "Emil Roy", present: false, points: 65 }
  ];

  const [students, setStudents] = useState(initialStudents);
  const [qrActive, setQrActive] = useState(false);
  const [qrTimer, setQrTimer] = useState(0);
  const [scanCount, setScanCount] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", deadline: "", assignTo: "class" });

  useEffect(() => {
    let timer;
    if (qrActive && qrTimer > 0) {
      timer = setTimeout(() => setQrTimer(qrTimer - 1), 1000);
    }
    if (qrActive && qrTimer === 0) {
      setQrActive(false);
    }
    return () => clearTimeout(timer);
  }, [qrActive, qrTimer]);

  // Manual attendance toggling
  function togglePresent(id) {
    setStudents((s) => s.map((st) => (st.id === id ? { ...st, present: !st.present } : st)));
  }

  function saveAttendance() {
    // in real app -> api call
    alert("Attendance saved for " + students.length + " students.");
  }

  // QR generator
  function generateQr() {
    setQrActive(true);
    setQrTimer(300); // 5 minutes
    setScanCount(0);
    // simulate scans while active (demo only)
    const scans = setInterval(() => {
      setScanCount((c) => Math.min(c + (Math.random() < 0.4 ? 1 : 0), students.length));
    }, 2000);
    setTimeout(() => clearInterval(scans), 310000);
  }

  // Tasks
  function createTask() {
    const id = Date.now();
    setTasks((t) => [...t, { id, ...taskForm, submitted: 0, total: students.length }]);
    setTaskForm({ title: "", description: "", deadline: "", assignTo: "class" });
  }

  // Leaderboard sorting
  const leaderboard = [...students].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-20 md:w-64 bg-white rounded-2xl shadow p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">PS</div>
              <div className="hidden md:block">
                <div className="font-semibold">Prof. Sharma</div>
                <div className="text-xs text-gray-500">Computer Science</div>
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              <NavButton active={route === "dashboard"} onClick={() => setRoute("dashboard")} label="Dashboard" />
              <NavButton active={route === "attendance"} onClick={() => setRoute("attendance")} label="Attendance" />
              <NavButton active={route === "tasks"} onClick={() => setRoute("tasks")} label="Tasks" />
              <NavButton active={route === "leaderboard"} onClick={() => setRoute("leaderboard")} label="Leaderboard" />
              <NavButton active={route === "settings"} onClick={() => setRoute("settings")} label="Settings" />
            </nav>

            <div className="text-xs text-gray-400 mt-4">v1.0 • Clean • White & Green</div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <header className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">TEACHERS DASHBOARD <br><br/>(Dummy Representation)</h1>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <div className="font-medium">Today</div>
                  <div>• CS-201: Data Structures</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white shadow text-green-700 font-semibold">Live • 10:00 - 11:00</div>
              </div>
            </header>

            {/* Content routing */}
            <div>
              {route === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Today's Schedule">
                      <ScheduleCard />
                    </Card>

                    <Card title={`Live: CS-201 - Data Structures`} badgeText={`Present: ${students.filter(s => s.present).length}/${students.length}`}>
                      <LiveAttendance students={students} />
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Quick Actions">
                      <div className="flex flex-col gap-3">
                        <button onClick={() => setRoute("attendance")} className="w-full px-3 py-2 rounded-lg bg-green-600 text-white font-medium">Manual Attendance</button>
                        <button onClick={() => { setRoute("attendance"); setQrActive(false); }} className="w-full px-3 py-2 rounded-lg border border-green-600 text-green-600 font-medium bg-white">QR Generator</button>
                        <button onClick={() => setRoute("tasks")} className="w-full px-3 py-2 rounded-lg bg-white border">Create Task</button>
                      </div>
                    </Card>

                    <Card title="Leaderboard">
                      <div className="space-y-2">
                        {leaderboard.slice(0, 5).map((s, i) => (
                          <div key={s.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{s.name.split(" ")[0][0]}</div>
                              <div>
                                <div className="font-medium">{s.name}</div>
                                <div className="text-xs text-gray-400">Rank {i + 1}</div>
                              </div>
                            </div>
                            <div className="font-semibold">{s.points}</div>
                          </div>
                        ))}

                        <div className="text-sm text-gray-500">View full leaderboard →</div>
                      </div>
                    </Card>

                    <Card title="Recent Tasks">
                      <div className="space-y-3">
                        {tasks.length === 0 && <div className="text-sm text-gray-500">No tasks yet — create one</div>}
                        {tasks.map(t => (
                          <div key={t.id} className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{t.title}</div>
                              <div className="text-xs text-gray-400">{t.deadline || "No deadline"}</div>
                            </div>
                            <div className="text-sm text-gray-500">{t.assignTo === 'class' ? 'Assigned to class' : `Assigned to ${t.assignTo}`}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {route === "attendance" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Manual Attendance">
                    <div className="space-y-3">
                      {students.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s.present ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{s.name.split(' ')[0][0]}</div>
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-gray-400">ID: {s.id}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button onClick={() => togglePresent(s.id)} className={`px-3 py-1 rounded-lg font-medium ${s.present ? 'bg-green-600 text-white' : 'bg-white border text-gray-700'}`}>{s.present ? 'Present' : 'Mark Present'}</button>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-3">
                        <button onClick={saveAttendance} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold">Save Attendance</button>
                        <button onClick={() => setStudents(initialStudents)} className="px-4 py-2 rounded-lg bg-white border">Reset</button>
                      </div>
                    </div>
                  </Card>

                  <Card title="QR Generator">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500">Generate a QR for students to scan and mark themselves present. QR valid for 5 minutes.</div>
                      <div className="flex gap-3 items-center">
                        <button onClick={generateQr} className="px-3 py-2 rounded-lg bg-green-600 text-white font-medium">Generate QR</button>
                        <div className="text-sm text-gray-500">{qrActive ? `Active • ${Math.floor(qrTimer/60)}:${String(qrTimer%60).padStart(2,'0')}` : 'Inactive'}</div>
                      </div>

                      <div className="w-full flex flex-col items-center py-6 bg-white rounded-lg shadow-sm">
                        {qrActive ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-40 h-40 bg-white grid place-items-center border rounded-lg">{/* placeholder QR */}
                              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="2" stroke="#10B981" strokeWidth="1.2" />
                                <rect x="5" y="5" width="4" height="4" fill="#10B981" />
                                <rect x="15" y="5" width="4" height="4" fill="#10B981" />
                                <rect x="5" y="15" width="4" height="4" fill="#10B981" />
                              </svg>
                            </div>
                            <div className="text-sm text-gray-600">Scans: {scanCount} / {students.length}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No QR active</div>
                        )}
                      </div>

                    </div>
                  </Card>
                </div>
              )}

              {route === "tasks" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Create Task">
                    <div className="space-y-3">
                      <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} placeholder="Title" className="w-full px-3 py-2 rounded-lg border" />
                      <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" rows={4} />
                      <input type="date" value={taskForm.deadline} onChange={e => setTaskForm({...taskForm, deadline: e.target.value})} className="w-full px-3 py-2 rounded-lg border" />

                      <select value={taskForm.assignTo} onChange={e => setTaskForm({...taskForm, assignTo: e.target.value})} className="w-full px-3 py-2 rounded-lg border">
                        <option value="class">Whole Class</option>
                        {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>

                      <div className="flex gap-3">
                        <button onClick={createTask} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold">Create</button>
                        <button onClick={() => setTaskForm({ title: "", description: "", deadline: "", assignTo: "class" })} className="px-4 py-2 rounded-lg bg-white border">Reset</button>
                      </div>
                    </div>
                  </Card>

                  <Card title="Task Submissions">
                    <div className="space-y-3">
                      {tasks.length === 0 && <div className="text-sm text-gray-500">No tasks created yet.</div>}
                      {tasks.map(t => (
                        <div key={t.id} className="p-3 bg-white rounded-lg shadow-sm flex items-center justify-between">
                          <div>
                            <div className="font-medium">{t.title}</div>
                            <div className="text-xs text-gray-400">{t.description}</div>
                          </div>
                          <div className="text-sm text-gray-500">{t.submitted}/{t.total}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {route === "leaderboard" && (
                <Card title="Full Leaderboard">
                  <div className="space-y-2">
                    {leaderboard.map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-semibold text-green-700">{i+1}</div>
                          <div>
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-gray-400">{s.present ? 'Present' : 'Absent'}</div>
                          </div>
                        </div>
                        <div className="font-semibold">{s.points}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {route === "settings" && (
                <Card title="Settings">
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-medium">Profile</div>
                      <div className="text-sm text-gray-500">Prof. Sharma • Computer Science</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-medium">Preferences</div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <div className="text-sm">Use QR by default</div>
                        </label>

                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <div className="text-sm">Show leaderboard publicly</div>
                        </label>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="font-medium">App Theme</div>
                      <div className="text-sm text-gray-500">White background with green accents to match mobile app.</div>
                    </div>
                  </div>
                </Card>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


function Card({ title, children, badgeText }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg">{title}</div>
        {badgeText && <div className="text-sm text-gray-500">{badgeText}</div>}
      </div>
      {children}
    </div>
  );
}

function NavButton({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
      <div className={`w-9 h-9 rounded-lg grid place-items-center ${active ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}>
        {/* simple icon placeholder */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/></svg>
      </div>
      <div className="hidden md:block">{label}</div>
    </button>
  );
}

function ScheduleCard() {
  const slots = [
    { time: '10:00 - 11:00', title: 'CS-201: Data Structures', room: 'B-203' },
    { time: '11:15 - 12:15', title: 'CS-202: Algorithms Lab', room: 'Lab-A' },
    { time: '14:00 - 15:00', title: 'Office Hours', room: 'F-102' }
  ];
  return (
    <div className="space-y-2">
      {slots.map((s,i) => (
        <div key={i} className={`p-3 rounded-lg ${i===0 ? 'bg-green-50' : 'bg-white'} flex items-center justify-between shadow-sm`}>
          <div>
            <div className="font-medium">{s.time}</div>
            <div className="text-sm text-gray-500">{s.title}</div>
          </div>
          <div className="text-sm text-green-600 font-medium">Room: {s.room}</div>
        </div>
      ))}
    </div>
  );
}

function LiveAttendance({ students }) {
  return (
    <div className="space-y-3">
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${(students.filter(s=>s.present).length/students.length)*100}%` }} />
      </div>

      {students.map(s => (
        <div key={s.id} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s.present ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{s.name.split(' ')[0][0]}</div>
          <div className="flex-1">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-400">{s.present ? 'Present' : 'Absent'}</div>
          </div>
          <div className={`text-sm font-semibold ${s.present ? 'text-green-600' : 'text-red-600'}`}>{s.present ? '✓' : '✕'}</div>
        </div>
      ))}
    </div>
  );
}
