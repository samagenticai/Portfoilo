import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout'
import AdminLayout from '../components/admin/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import PageLoader from '../components/ui/PageLoader'

const Home = lazy(() => import('../pages/Home'))
const Projects = lazy(() => import('../pages/Projects'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Login = lazy(() => import('../pages/admin/Login'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const ProjectsManage = lazy(() => import('../pages/admin/ProjectsManage'))
const ProjectEditor = lazy(() => import('../pages/admin/ProjectEditor'))
const SkillsManage = lazy(() => import('../pages/admin/SkillsManage'))
const SkillEditor = lazy(() => import('../pages/admin/SkillEditor'))
const ProfileManage = lazy(() => import('../pages/admin/ProfileManage'))
const ResumeManage = lazy(() => import('../pages/admin/ResumeManage'))
const MessagesManage = lazy(() => import('../pages/admin/MessagesManage'))
const SettingsManage = lazy(() => import('../pages/admin/SettingsManage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsManage />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/:id/edit" element={<ProjectEditor />} />
          <Route path="skills" element={<SkillsManage />} />
          <Route path="skills/new" element={<SkillEditor />} />
          <Route path="skills/:id/edit" element={<SkillEditor />} />
          <Route path="messages" element={<MessagesManage />} />
          <Route path="profile" element={<ProfileManage />} />
          <Route path="resume" element={<ResumeManage />} />
          <Route path="settings" element={<SettingsManage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
