import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore database instance

// Placeholder Icons (Using lucide-react names)
const Building = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="2" width="18" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="10"/><line x1="15" y1="22" x2="15" y2="10"/></svg>;
const Mail = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const User = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example structure of a department document
  const dummyDepartments = [
    { id: '1', name: 'Computer Science', head: 'Dr. A. Sharma', email: 'cs_head@dsatm.edu.in', courses: 15, block: 'A-Block' },
    { id: '2', name: 'Mechanical Engineering', head: 'Prof. S. Kumar', email: 'mech_head@dsatm.edu.in', courses: 12, block: 'B-Block' },
    { id: '3', name: 'Electrical & Electronics', head: 'Dr. V. Reddy', email: 'eee_head@dsatm.edu.in', courses: 10, block: 'C-Block' },
    { id: '4', name: 'Civil Engineering', head: 'Prof. M. Patel', email: 'civil_head@dsatm.edu.in', courses: 8, block: 'D-Block' },
  ];

  useEffect(() => {
    // Fetches data once upon component mount
    const fetchDepartments = async () => {
      try {
        const deptCollectionRef = collection(db, 'departments');
        const deptSnapshot = await getDocs(deptCollectionRef);
        
        const deptList = deptSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Use real data if available, otherwise fallback to dummy data
        setDepartments(deptList.length > 0 ? deptList : dummyDepartments);
        
      } catch (error) {
        console.error("Error fetching departments:", error);
        // Fallback on error
        setDepartments(dummyDepartments); 
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-indigo-200 pb-3 text-center">
          Academic Departments 🏛️
        </h1>

        {loading ? (
          <p className="text-xl text-indigo-600 text-center">Loading department directory...</p>
        ) : (
          <div className="space-y-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-xl shadow-xl p-6 border-l-8 border-indigo-500 transition duration-300 hover:shadow-2xl">
                
                <h2 className="text-2xl font-extrabold text-indigo-700 mb-2">
                  {dept.name || 'Untitled Department'}
                </h2>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {dept.courses ? `${dept.courses} major courses offered.` : 'Department details available soon.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center text-sm">
                    <User className="w-5 h-5 mr-3 text-indigo-500" />
                    <span className="font-semibold">Head of Dept:</span> 
                    <span className="ml-2">{dept.head || 'Staff Name N/A'}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Mail className="w-5 h-5 mr-3 text-indigo-500" />
                    <span className="font-semibold">Contact:</span> 
                    <span className="ml-2 truncate">{dept.email || 'N/A'}</span>
                  </div>

                  {dept.block && (
                    <div className="flex items-center text-sm">
                      <Building className="w-5 h-5 mr-3 text-indigo-500" />
                      <span className="font-semibold">Location:</span> 
                      <span className="ml-2">{dept.block}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center p-4 bg-gray-100 rounded-lg text-gray-600">
          <p className="text-sm">
            Note: This data is fetched from the 'departments' Firestore collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Departments;
