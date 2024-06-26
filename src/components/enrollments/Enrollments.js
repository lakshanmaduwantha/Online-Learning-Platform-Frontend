import React, { useEffect, useState } from 'react';
import axios from '../../axios'; // Adjust the import path as needed
import { CreateEnrollment } from './CreateEnrollment';
import { UpdateEnrollment } from './UpdateEnrollment';
import { DeleteEnrollment } from './DeleteEnrollment';
import '../Css/enrollments/Enrollments.css'; // Import your CSS file here

export function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/enrollments');
        setEnrollments(response.data.enrollments || []); // Ensure to handle empty array if no enrollments
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchData();
  }, []);

  const handleApiError = (error) => {
    if (error.response) {
      setErrorMessage(error.response.data.message);
    } else if (error.request) {
      setErrorMessage('No response received from the server. Please try again later.');
    } else {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleEnrollmentCreated = (newEnrollment) => {
    setEnrollments([...enrollments, newEnrollment]);
  };

  const handleEnrollmentUpdated = (updatedEnrollment) => {
    setEnrollments(
      enrollments.map((enrollment) =>
        enrollment.id === updatedEnrollment.id ? { ...enrollment, ...updatedEnrollment } : enrollment
      )
    );
  };

  const handleEnrollmentDeleted = (deletedEnrollmentId) => {
    setEnrollments(enrollments.filter((enrollment) => enrollment.id !== deletedEnrollmentId));
  };

  return (
    <div className="enrollments-container">
      <h1>Enrollments</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <CreateEnrollment onEnrollmentCreated={handleEnrollmentCreated} />
      <table className="enrollments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>{enrollment.id}</td>
              <td>{enrollment.user ? `${enrollment.user.first_name} ${enrollment.user.last_name}` : 'Unknown User'}</td>
              <td>{enrollment.course ? enrollment.course.name : 'Unknown Course'}</td>
              <td className="enrollments-actions">
                <UpdateEnrollment enrollmentId={enrollment.id} onUpdate={handleEnrollmentUpdated} />
                <DeleteEnrollment enrollmentId={enrollment.id} onDelete={handleEnrollmentDeleted} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
