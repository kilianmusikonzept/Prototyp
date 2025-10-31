
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { getCourses } from '../services/mockApi';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-surface rounded-card shadow-card border border-gray-200/80 overflow-hidden animate-fade-in transition-all hover:shadow-card-hover hover:-translate-y-1 flex flex-col">
        <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-base font-bold text-text-primary">{course.title}</h3>
            <p className="text-xs text-text-secondary mt-1">von {course.author}</p>
            <p className="text-sm text-text-secondary my-2 flex-grow">{course.description}</p>
            <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-primary">{course.price}</span>
                <button className="bg-secondary text-secondary-content px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-focus transition-colors">
                    Details
                </button>
            </div>
        </div>
    </div>
);


const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const data = await getCourses();
            setCourses(data);
            setIsLoading(false);
        };
        fetchCourses();
    }, []);

    return (
         <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Expertenkurse</h2>
            <p className="text-text-secondary mb-6">Vertiefe dein Wissen mit angeleiteten Programmen.</p>
            {isLoading ? (
                <p className="text-text-secondary">Lade Kurse...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
            )}
        </div>
    );
};

export default Courses;
