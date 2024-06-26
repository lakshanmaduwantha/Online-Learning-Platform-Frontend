import React, { useEffect, useState } from 'react';
import axios from '../../axios'; // Adjust the import path as needed
import { CreateCourse } from './CreateCourse';
import { UpdateCourse } from './UpdateCourse';
import { DeleteCourse } from './DeleteCourse';
import '../Css/courses/Courses.css'; // Import your CSS file here

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/courses');
        setCourses(response.data); // Assuming response.data is an array of courses
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else if (error.request) {
          setErrorMessage('No response received from the server. Please try again later.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      }
    };

    fetchData();
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
      )
    );
  };

  const handleCourseDeleted = (deletedCourseId) => {
    setCourses(courses.filter((course) => course.id !== deletedCourseId));
  };

  return (
    <div className="courses-container">
      <h1>Courses</h1>
      <CreateCourse onCourseCreated={handleCourseCreated} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  <div className="actions">
                    <UpdateCourse courseId={course.id} onUpdate={handleCourseUpdated} />
                    <DeleteCourse courseId={course.id} onDelete={handleCourseDeleted} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
