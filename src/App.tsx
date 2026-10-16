import { useState, useEffect } from "react";
import { User } from "./types";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import UsersManagement from "./components/UsersManagement";
import FactoriesManagement from "./components/FactoriesManagement";
import DepartmentsManagement from "./components/DepartmentsManagement";
import WorkersManagement from "./components/WorkersManagement";
import DriversManagement from "./components/DriversManagement";
import ShiftTemplates from "./components/ShiftTemplates";
import OvertimeRequests from "./components/OvertimeRequests";
import ActiveShifts from "./components/ActiveShifts";
import Reports from "./components/Reports";
import NotificationsCenter from "./components/NotificationsCenter";
import Settings from "./components/Settings";
import AuditLogs from "./components/AuditLogs";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    const savedUser = localStorage.getItem("aff_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem("aff_user");
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("aff_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("aff_user");
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={currentUser} />;
      case "users":
        return <UsersManagement userRole={currentUser.role} />;
      case "factories":
        return <FactoriesManagement userRole={currentUser.role} />;
      case "departments":
        return <DepartmentsManagement userRole={currentUser.role} userFactoryId={currentUser.factoryId} />;
      case "workers":
        return <WorkersManagement userRole={currentUser.role} userFactoryId={currentUser.factoryId} />;
      case "drivers":
        return <DriversManagement userRole={currentUser.role} />;
      case "shifts":
        return <ShiftTemplates userRole={currentUser.role} />;
      case "requests":
        return <OvertimeRequests userRole={currentUser.role} userFactoryId={currentUser.factoryId} />;
      case "active-shifts":
        return <ActiveShifts userRole={currentUser.role} />;
      case "reports":
        return <Reports userRole={currentUser.role} />;
      case "notifications":
        return <NotificationsCenter />;
      case "settings":
        return <Settings />;
      case "audit-logs":
        return <AuditLogs />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  if (!isAuthenticated || !currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <NotificationProvider>
      <Layout
        user={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderPage()}
      </Layout>
    </NotificationProvider>
  );
}