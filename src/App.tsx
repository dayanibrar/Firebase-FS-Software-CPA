import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home/Home";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/Profile/Profile";
import { useAppDispatch } from "./hooks/storeHook";
import { useEffect } from "react";
import { auth } from "./firebase";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoute";
const App = () => {

  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user?.photoURL || null,
          })
        );
    });
    return () => unsubscribe();
  },[dispatch]);

  return <Routes>
    <Route element={<AuthRoutes/>}>
    <Route path='profile' element={<Profile />} />
    </Route>
    <Route path="/" element={<Home />} />
    <Route path='auth' element={<Auth />} />
  </Routes>;
}


export default App;
