import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import UpdateProblem from "./components/UpdateProblem";
function App() {
  // here i will have to write a code for checking isAuthenticated

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Homepage></Homepage> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}
        ></Route>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}
        ></Route>
 <Route
  path="/admin"
  element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/"/>}
/>

<Route
  path="/admin/create"
  element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/"/>}
/>

 <Route
  path="/admin/delete"
  element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/"/>}
/> 
 { <Route
  path="/admin/update"
  element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/"/>}
/>  }

 <Route
  path="/admin/update/:problemId"
  element={isAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/"/>}
/> 
      <Route path ="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>

      </Routes>
    </>
  );
}

export default App;
