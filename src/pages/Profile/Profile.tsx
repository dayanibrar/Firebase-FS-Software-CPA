import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../../firebase";

import Header from "../../components/Header/Header";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { logout } from "../../features/authSlice";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const [resetPassword, setResetPassword] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    toast.success("Sign out successful!" , { theme: "dark" });
  };

  const handlePasswordReset = async () => {
    if (!resetPasswordEmail.length) return;
    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      setResetPasswordSuccess(
        "Password reset email sent. Please check your inbox."
      );
      setResetPasswordError(null);
    } catch (error: any) {
      setResetPasswordError(error.message);
      setResetPasswordSuccess(null);
    }
  };

  // useEffect(() => {
  //   if (Boolean(!user)) {
  //     navigate("/auth");
  //   }
  // }, [navigate, user]);

  return (
    <>
      <Header />
      <ResetPassword
        handlePasswordReset={handlePasswordReset}
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        resetPasswordEmail={resetPasswordEmail}
        resetPasswordError={resetPasswordError}
        resetPasswordSuccess={resetPasswordSuccess}
        setResetPasswordEmail={setResetPasswordEmail}
      />
      <ToastContainer
      theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {user && (
        <ProfileCard
          setResetPassword={() => setResetPassword(true)}
          user={user}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Profile;
