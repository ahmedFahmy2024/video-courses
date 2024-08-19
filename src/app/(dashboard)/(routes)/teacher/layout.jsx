import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const TeacherLayout = ({ children }) => {
    const { userId } = auth();

    if (!isTeacher(userId)) {
        redirect('/')
    }

  return <div>{children}</div>;
};

export default TeacherLayout;
