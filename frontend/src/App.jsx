import { Routes, Route, Navigate } from "react-router-dom";
//utils
import {RedirectIfAuthenticated} from "./util"

// User Components
import Login from "./userComponent/Login";
import Signup from "./userComponent/Signup";
import Profile from "./userComponent/Profile";
import About from "./userComponent/About";
import Game from "./userComponent/Game";
import History from "./userComponent/History";
import Writenote from "./userComponent/Writenote";
import Account from "./userComponent/Account";

// Front Page
import FrontPage from "./FrontViews/FrontPage";
import Explore from "./FrontViews/Explore";
import RequestAdmin from "./FrontViews/RequestAdmin";

// Admin Components
import AdminDashbord from "./adminComponent/AdminDashbord";
import AdminAccount from "./adminComponent/AdminAccount";
import Videos from "./adminComponent/Videos";

// Owner Components
import Alluser from "./owner/OwnerPage";
import SignupAdmin from "./owner/SignupAdmin";
import Noticication from "./owner/Noticication";

// Game Components
import Quiz from "./game/QuizGame";
import Flashcard from "./game/FlashCardGame";
import Memory from "./game/MemoryGame";

// Context
import StateManagement from "./context/Context";

//  ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.role || ![allowedRoles].flat().includes(user.role)) {
    localStorage.removeItem("user"); // Remove stale session
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <StateManagement>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<RedirectIfAuthenticated>
      <FrontPage />
    </RedirectIfAuthenticated>} />
        <Route path="/FrontPage" element={<RedirectIfAuthenticated>
      <FrontPage />
    </RedirectIfAuthenticated>} />
        <Route path="/Explore" element={<RedirectIfAuthenticated><Explore /></RedirectIfAuthenticated>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-admin" element={<RedirectIfAuthenticated><RequestAdmin /></RedirectIfAuthenticated>} />

        {/* Owner Protected Routes */}
        <Route
          path="/alluser"
          element={
            <ProtectedRoute allowedRoles="owner">
              <Alluser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddAdmin"
          element={
            <ProtectedRoute allowedRoles="owner">
              <SignupAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles="owner">
              <Noticication />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles="admin">
              <AdminDashbord />
            </ProtectedRoute>
          }
        >
          <Route path="account" element={<AdminAccount />} />
          <Route path="videos" element={<Videos />} />
        </Route>

        {/* User Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles="user">
              <Profile />
            </ProtectedRoute>
          }
        >
          <Route path="about" element={<About />} />
          <Route path="game" element={<Game />}>
            <Route path="quiz" element={<Quiz />} />
            <Route path="flash" element={<Flashcard />} />
            <Route path="memory" element={<Memory />} />
          </Route>
          <Route path="history" element={<History />} />
          <Route path="writenote" element={<Writenote />} />
          <Route path="personal" element={<Account />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </StateManagement>
  );
}

export default App;
