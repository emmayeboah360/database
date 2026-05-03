import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { CertificatePage } from "./pages/CertificatePage";
import { DbCoursePage } from "./pages/DbCoursePage";
import { DbLessonPage } from "./pages/DbLessonPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";

// Root layout wraps all routes
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const certificateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certificate",
  component: () => (
    <AuthGuard>
      <CertificatePage />
    </AuthGuard>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const dbCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/db-course",
  component: () => (
    <AuthGuard>
      <DbCoursePage />
    </AuthGuard>
  ),
});

const dbLessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/db-lesson/$lessonId",
  component: () => (
    <AuthGuard>
      <DbLessonPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  certificateRoute,
  profileRoute,
  dbCourseRoute,
  dbLessonRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
