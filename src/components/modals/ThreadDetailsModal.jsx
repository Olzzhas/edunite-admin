import { useState } from "react";
import { FiX, FiUser, FiCalendar, FiClock, FiMapPin, FiBook, FiCheckCircle, FiXCircle } from "react-icons/fi";

const ThreadDetailsModal = ({ isOpen, onClose, thread, course, semester, teacher }) => {
   const [activeTab, setActiveTab] = useState("overview");

   // Mock data for students
   const mockStudents = [
      {
         id: 1,
         name: "John Doe",
         email: "john.doe@example.com",
         registrationDate: "2023-09-01T10:30:00Z",
         attendance: [
            { date: "2023-09-05", status: "present" },
            { date: "2023-09-12", status: "present" },
            { date: "2023-09-19", status: "absent" },
            { date: "2023-09-26", status: "present" },
         ],
         assignments: [
            { id: 1, title: "Assignment 1", grade: 85, maxGrade: 100, submittedAt: "2023-09-10T14:25:00Z" },
            { id: 2, title: "Assignment 2", grade: 92, maxGrade: 100, submittedAt: "2023-09-17T16:45:00Z" },
            { id: 3, title: "Assignment 3", grade: 78, maxGrade: 100, submittedAt: "2023-09-24T11:30:00Z" },
         ],
      },
      {
         id: 2,
         name: "Jane Smith",
         email: "jane.smith@example.com",
         registrationDate: "2023-09-02T14:15:00Z",
         attendance: [
            { date: "2023-09-05", status: "present" },
            { date: "2023-09-12", status: "present" },
            { date: "2023-09-19", status: "present" },
            { date: "2023-09-26", status: "absent" },
         ],
         assignments: [
            { id: 1, title: "Assignment 1", grade: 90, maxGrade: 100, submittedAt: "2023-09-09T10:15:00Z" },
            { id: 2, title: "Assignment 2", grade: 88, maxGrade: 100, submittedAt: "2023-09-16T13:20:00Z" },
            { id: 3, title: "Assignment 3", grade: 95, maxGrade: 100, submittedAt: "2023-09-23T09:45:00Z" },
         ],
      },
      {
         id: 3,
         name: "Michael Johnson",
         email: "michael.johnson@example.com",
         registrationDate: "2023-09-03T09:45:00Z",
         attendance: [
            { date: "2023-09-05", status: "absent" },
            { date: "2023-09-12", status: "present" },
            { date: "2023-09-19", status: "present" },
            { date: "2023-09-26", status: "present" },
         ],
         assignments: [
            { id: 1, title: "Assignment 1", grade: 75, maxGrade: 100, submittedAt: "2023-09-11T17:30:00Z" },
            { id: 2, title: "Assignment 2", grade: 82, maxGrade: 100, submittedAt: "2023-09-18T14:10:00Z" },
            { id: 3, title: "Assignment 3", grade: 88, maxGrade: 100, submittedAt: "2023-09-25T16:20:00Z" },
         ],
      },
   ];

   // Mock data for assignments
   const mockAssignments = [
      {
         id: 1,
         title: "Assignment 1",
         description: "Introduction to the subject",
         dueDate: "2023-09-12T23:59:59Z",
         maxGrade: 100,
         averageGrade: 83.3,
         submissionCount: 3,
      },
      {
         id: 2,
         title: "Assignment 2",
         description: "Advanced concepts and applications",
         dueDate: "2023-09-19T23:59:59Z",
         maxGrade: 100,
         averageGrade: 87.3,
         submissionCount: 3,
      },
      {
         id: 3,
         title: "Assignment 3",
         description: "Final project implementation",
         dueDate: "2023-09-26T23:59:59Z",
         maxGrade: 100,
         averageGrade: 87.0,
         submissionCount: 3,
      },
   ];

   // Mock data for class sessions
   const mockSessions = [
      {
         date: "2023-09-05",
         topic: "Introduction to the Course",
         attendanceRate: "66.7%",
         notes: "Covered syllabus and basic concepts",
      },
      {
         date: "2023-09-12",
         topic: "Core Principles",
         attendanceRate: "100%",
         notes: "Discussed fundamental theories and applications",
      },
      {
         date: "2023-09-19",
         topic: "Advanced Applications",
         attendanceRate: "66.7%",
         notes: "Explored real-world case studies",
      },
      {
         date: "2023-09-26",
         topic: "Final Review",
         attendanceRate: "66.7%",
         notes: "Reviewed all material and prepared for final assessment",
      },
   ];

   // Format date
   const formatDate = (dateString) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   // Format time
   const formatTime = (dateString) => {
      const options = { hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleTimeString(undefined, options);
   };

   // Format date and time
   const formatDateTime = (dateString) => {
      return `${formatDate(dateString)} at ${formatTime(dateString)}`;
   };

   if (!isOpen || !thread) return null;

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
               &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">Thread Details: {thread.title}</h3>
                     <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
                        <FiX size={24} />
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-4">
                     <nav className="-mb-px flex space-x-8">
                        <button
                           className={`${
                              activeTab === "overview"
                                 ? "border-primary-500 text-primary-600"
                                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                           onClick={() => setActiveTab("overview")}
                        >
                           Overview
                        </button>
                        <button
                           className={`${
                              activeTab === "students"
                                 ? "border-primary-500 text-primary-600"
                                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                           onClick={() => setActiveTab("students")}
                        >
                           Students
                        </button>
                        <button
                           className={`${
                              activeTab === "attendance"
                                 ? "border-primary-500 text-primary-600"
                                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                           onClick={() => setActiveTab("attendance")}
                        >
                           Attendance
                        </button>
                        <button
                           className={`${
                              activeTab === "assignments"
                                 ? "border-primary-500 text-primary-600"
                                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                           onClick={() => setActiveTab("assignments")}
                        >
                           Assignments
                        </button>
                     </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-4">
                     {/* Overview Tab */}
                     {activeTab === "overview" && (
                        <div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                 <h4 className="text-base font-medium text-gray-900 mb-3">Thread Information</h4>
                                 <div className="space-y-2">
                                    <div className="flex items-start">
                                       <FiBook className="mt-1 mr-2 text-gray-500" />
                                       <div>
                                          <p className="text-sm font-medium text-gray-700">Course</p>
                                          <p className="text-sm text-gray-600">{course?.title || "Unknown Course"}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-start">
                                       <FiCalendar className="mt-1 mr-2 text-gray-500" />
                                       <div>
                                          <p className="text-sm font-medium text-gray-700">Semester</p>
                                          <p className="text-sm text-gray-600">
                                             {semester?.name || `Semester #${thread.semester_id}`}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex items-start">
                                       <FiUser className="mt-1 mr-2 text-gray-500" />
                                       <div>
                                          <p className="text-sm font-medium text-gray-700">Teacher</p>
                                          <p className="text-sm text-gray-600">
                                             {teacher ? `${teacher.name} ${teacher.surname}` : "No teacher assigned"}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex items-start">
                                       <FiUser className="mt-1 mr-2 text-gray-500" />
                                       <div>
                                          <p className="text-sm font-medium text-gray-700">Students</p>
                                          <p className="text-sm text-gray-600">
                                             {mockStudents.length} / {thread.max_students || "Unlimited"}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                 <h4 className="text-base font-medium text-gray-900 mb-3">Schedule</h4>
                                 <div className="space-y-3">
                                    {thread.schedules?.map((schedule, index) => (
                                       <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                                          <div className="flex items-center mb-1">
                                             <FiCalendar className="mr-2 text-gray-500" />
                                             <p className="text-sm font-medium text-gray-700">
                                                {
                                                   ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
                                                      schedule.day_of_week - 1
                                                   ]
                                                }
                                             </p>
                                          </div>
                                          <div className="flex items-center mb-1 ml-6">
                                             <FiClock className="mr-2 text-gray-500" />
                                             <p className="text-sm text-gray-600">
                                                {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                                             </p>
                                          </div>
                                          <div className="flex items-center ml-6">
                                             <FiMapPin className="mr-2 text-gray-500" />
                                             <p className="text-sm text-gray-600">{schedule.location}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-base font-medium text-gray-900 mb-3">Recent Activity</h4>
                              <div className="space-y-3">
                                 <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                       <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                          <FiUser className="h-5 w-5 text-green-600" />
                                       </div>
                                    </div>
                                    <div className="ml-3">
                                       <p className="text-sm text-gray-700">Jane Smith submitted Assignment 3</p>
                                       <p className="text-xs text-gray-500">Yesterday at 9:45 AM</p>
                                    </div>
                                 </div>
                                 <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                       <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <FiCalendar className="h-5 w-5 text-blue-600" />
                                       </div>
                                    </div>
                                    <div className="ml-3">
                                       <p className="text-sm text-gray-700">Class session completed</p>
                                       <p className="text-xs text-gray-500">Sep 26, 2023 at 10:30 AM</p>
                                    </div>
                                 </div>
                                 <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                       <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                          <FiBook className="h-5 w-5 text-purple-600" />
                                       </div>
                                    </div>
                                    <div className="ml-3">
                                       <p className="text-sm text-gray-700">New assignment added: Final Project</p>
                                       <p className="text-xs text-gray-500">Sep 24, 2023 at 2:15 PM</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Students Tab */}
                     {activeTab === "students" && (
                        <div>
                           <div className="mb-4">
                              <h4 className="text-base font-medium text-gray-900 mb-2">
                                 Registered Students ({mockStudents.length})
                              </h4>
                              <p className="text-sm text-gray-600">Manage students enrolled in this thread</p>
                           </div>

                           <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                 <thead className="bg-gray-50">
                                    <tr>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Student
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Registration Date
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Attendance
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Average Grade
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Actions
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody className="bg-white divide-y divide-gray-200">
                                    {mockStudents.map((student) => {
                                       // Calculate attendance rate
                                       const attendanceRate =
                                          (student.attendance.filter((a) => a.status === "present").length /
                                             student.attendance.length) *
                                          100;

                                       // Calculate average grade
                                       const totalGrade = student.assignments.reduce(
                                          (sum, assignment) => sum + assignment.grade,
                                          0
                                       );
                                       const averageGrade = totalGrade / student.assignments.length;

                                       return (
                                          <tr key={student.id}>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                   <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                                                      {student.name.charAt(0)}
                                                   </div>
                                                   <div className="ml-4">
                                                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                      <div className="text-sm text-gray-500">{student.email}</div>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                   {formatDate(student.registrationDate)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                   {formatTime(student.registrationDate)}
                                                </div>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{attendanceRate.toFixed(0)}%</div>
                                                <div className="text-sm text-gray-500">
                                                   {student.attendance.filter((a) => a.status === "present").length} /{" "}
                                                   {student.attendance.length} sessions
                                                </div>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{averageGrade.toFixed(1)}</div>
                                                <div className="text-sm text-gray-500">out of 100</div>
                                             </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                   View Details
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">Remove</button>
                                             </td>
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     )}

                     {/* Attendance Tab */}
                     {activeTab === "attendance" && (
                        <div>
                           <div className="mb-4">
                              <h4 className="text-base font-medium text-gray-900 mb-2">Class Sessions</h4>
                              <p className="text-sm text-gray-600">Track attendance for each class session</p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {mockSessions.map((session, index) => (
                                 <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                       <div>
                                          <h5 className="text-sm font-medium text-gray-900">{formatDate(session.date)}</h5>
                                          <p className="text-sm text-gray-600">{session.topic}</p>
                                       </div>
                                       <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                          {session.attendanceRate} Attendance
                                       </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{session.notes}</p>

                                    <h6 className="text-xs font-medium text-gray-700 mb-2">Student Attendance:</h6>
                                    <div className="space-y-2">
                                       {mockStudents.map((student) => {
                                          const attendance = student.attendance.find((a) => a.date === session.date);
                                          return (
                                             <div key={student.id} className="flex justify-between items-center">
                                                <div className="text-xs text-gray-800">{student.name}</div>
                                                <div
                                                   className={`flex items-center text-xs ${
                                                      attendance?.status === "present" ? "text-green-600" : "text-red-600"
                                                   }`}
                                                >
                                                   {attendance?.status === "present" ? (
                                                      <>
                                                         <FiCheckCircle className="mr-1" /> Present
                                                      </>
                                                   ) : (
                                                      <>
                                                         <FiXCircle className="mr-1" /> Absent
                                                      </>
                                                   )}
                                                </div>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Assignments Tab */}
                     {activeTab === "assignments" && (
                        <div>
                           <div className="mb-4">
                              <h4 className="text-base font-medium text-gray-900 mb-2">Assignments</h4>
                              <p className="text-sm text-gray-600">Manage and grade assignments for this thread</p>
                           </div>

                           <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                 <thead className="bg-gray-50">
                                    <tr>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Assignment
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Due Date
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Submissions
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Average Grade
                                       </th>
                                       <th
                                          scope="col"
                                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                       >
                                          Actions
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody className="bg-white divide-y divide-gray-200">
                                    {mockAssignments.map((assignment) => (
                                       <tr key={assignment.id}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                             <div className="text-sm text-gray-500">{assignment.description}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="text-sm text-gray-900">{formatDate(assignment.dueDate)}</div>
                                             <div className="text-sm text-gray-500">{formatTime(assignment.dueDate)}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="text-sm text-gray-900">{assignment.submissionCount}</div>
                                             <div className="text-sm text-gray-500">out of {mockStudents.length} students</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="text-sm text-gray-900">{assignment.averageGrade.toFixed(1)}</div>
                                             <div className="text-sm text-gray-500">out of {assignment.maxGrade}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                             <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                View Submissions
                                             </button>
                                             <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           <div className="mt-6">
                              <h5 className="text-sm font-medium text-gray-900 mb-3">Student Performance</h5>
                              <div className="overflow-x-auto">
                                 <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                       <tr>
                                          <th
                                             scope="col"
                                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                          >
                                             Student
                                          </th>
                                          {mockAssignments.map((assignment) => (
                                             <th
                                                key={assignment.id}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                             >
                                                {assignment.title}
                                             </th>
                                          ))}
                                          <th
                                             scope="col"
                                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                          >
                                             Average
                                          </th>
                                       </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                       {mockStudents.map((student) => {
                                          // Calculate student's average grade
                                          const totalGrade = student.assignments.reduce(
                                             (sum, assignment) => sum + assignment.grade,
                                             0
                                          );
                                          const averageGrade = totalGrade / student.assignments.length;

                                          return (
                                             <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                   <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </td>
                                                {mockAssignments.map((assignment) => {
                                                   const studentAssignment = student.assignments.find(
                                                      (a) => a.id === assignment.id
                                                   );
                                                   return (
                                                      <td key={assignment.id} className="px-6 py-4 whitespace-nowrap">
                                                         <div className="text-sm text-gray-900">
                                                            {studentAssignment
                                                               ? `${studentAssignment.grade}/${studentAssignment.maxGrade}`
                                                               : "N/A"}
                                                         </div>
                                                         {studentAssignment && (
                                                            <div className="text-xs text-gray-500">
                                                               Submitted: {formatDate(studentAssignment.submittedAt)}
                                                            </div>
                                                         )}
                                                      </td>
                                                   );
                                                })}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                   <div className="text-sm font-medium text-gray-900">
                                                      {averageGrade.toFixed(1)}
                                                   </div>
                                                </td>
                                             </tr>
                                          );
                                       })}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                     type="button"
                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                     onClick={onClose}
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ThreadDetailsModal;
