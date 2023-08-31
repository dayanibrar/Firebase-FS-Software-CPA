import React, { useEffect, useState } from 'react'
import { authClasses } from './authClasses'
import { useForm } from 'react-hook-form';
import { AuthForm } from '../../models/Forms';
import {yupResolver} from "@hookform/resolvers/yup"
import { authFormSchema } from '../../models/Forms';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification} from "firebase/auth"
import { auth, database } from '../../firebase';
import {setDoc, doc} from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { login } from '../../features/authSlice';
import ResetPassword from '../../components/ResetPassword/ResetPassword';
import { useNavigate } from 'react-router-dom';
const firebase = require("firebase/app");
require("firebase/auth");

const Auth = () => {
    function getErrorMessageFromCode(errorCode: string): string {
        switch (errorCode) {
            case "auth/user-not-found":
                return "Email not found. Please check the email or register.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            case "auth/email-already-in-use":
                return "Email already in use. Please choose a different email.";
            // Add more cases for other error codes you want to handle
            default:
                return "An error occurred. Please try again later.";
        }
    }
    
    // states to handle authentication type
    const [authType, setAuthType] = useState<"login" | "sign-up">("login")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const [resetPassword, setResetPassword] = useState(false);
    const [resetPasswordEmail, setResetPasswordEmail] = useState("");
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState<string | null>(null);
    const [resetPasswordError, setResetPasswordSuccessError] = useState<string | null>(null);

     // Managing role based authentication
    const {user} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Redirects user back to the homepage once signed in.
    // lets the application decline any access to authentication page once signed in.
    useEffect(() => {
        if(Boolean(user)) {
            navigate("/");
        }
    }, [user, navigate]);

    // destructure components and classes "export a const and create the class-name and dd the tailwind css classnames to the class and destructure them here to use it"
    const {container, form, button, input, text, link, hr, forgotPasswordButton} = authClasses;

    const handlePasswordReset = async () => {
        if (!resetPasswordEmail.length) return;
        try {
            await sendPasswordResetEmail(auth, resetPasswordEmail);
            setResetPasswordSuccess("Password reset email have been sent. Please check your inbox.");
            setResetPasswordSuccessError(null);
        } catch (error: any) {
            setErrorMessage(error.message);
            setResetPasswordSuccess(null);
        }
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
           const {user} = await signInWithPopup(auth, provider);
           if (user && user.email)
           dispatch(
            login({
               email: user.email,
               id: user.uid,
               photoUrl: user.photoURL || null,
             })
           );
           
        } catch (error) {
            console.log("sign in access denied")
        }
    }
    // Handles the submitting of data to authenticate a user
    const handleFormSubmit = async (data: AuthForm) => {
        setErrorMessage(null)
        setLoading(true)
        const {email, password} = data;
        console.log(data);
        try {
            if (authType === "sign-up") {
                const {user} = await createUserWithEmailAndPassword(auth, email, password,);
                await sendEmailVerification(user);
                // test data
                console.log(user);
                await setDoc(doc(database, "users", user.uid), {email});
                setLoading(false)
                
               
            } else {
                //sign in
                const {user} = await signInWithEmailAndPassword(auth, email, password);
                setLoading(false)
                if (user && user.email)
                dispatch(
                 login({
                    email: user.email,
                    id: user.uid,
                    photoUrl: user.photoURL || null,
                  })
                );
                console.log("Sign in access granted")
            }
        } catch (error: any) {
            // display error messages
            setLoading(false)
            const errorCode = error.code
            const errorMessage = getErrorMessageFromCode(errorCode);
            setErrorMessage(errorMessage);
            console.log(error)
        }


    }

    const {register, handleSubmit, formState: {errors} } = useForm<AuthForm>({
        resolver: yupResolver(authFormSchema),
    });

    // handles the auth state type
    const handleAuthType = () => {
        /*  Whats going on ? the set auth type function is checking the previous auth type and checking if the previous auth type
        is equal to login and if not then the auth type shows sign up otherwise it will keep on with login */
        setAuthType(previousAuthType => previousAuthType === "login" ? "sign-up" : "login");
        console.log(authType)
    };
 
 return (
    <>
     <ResetPassword
        resetPasswordEmail={resetPasswordEmail}
        resetPasswordSuccess={resetPasswordSuccess}
        resetPasswordError={resetPasswordError}
        setResetPasswordEmail={setResetPasswordEmail}
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        handlePasswordReset={handlePasswordReset}
      />

    <div className={container}>
    <div className='w-full max-w-sm rounded-lg bg-slate-700/30 shadow'>
        {/* if any error in auth, display the message over here */}
        {errorMessage && <p className='bg-red-400 px-3 py-2 text-center rounded-t-md text-white'>{errorMessage}</p>}
        <form onSubmit={handleSubmit(handleFormSubmit)} className={form}>
            <div className='grid gap-y-3'>
                <button className={button} type='button' onClick={signInWithGoogle}>Google Auth</button>
            </div>

            <div className='my-3 flex items-center px-3'>
                <hr className={hr} />
                <span className={text}>or</span>
                <hr className={hr} />
            </div>

            <div className='grid gap-y-3'>
                <div>
                    <input type='email' placeholder='Enter your email' className={input} {...register("email")} />
                    {errors.email ? <span className='text-red-600'>{errors.email.message}</span> : <></>}
                </div>
                <div>
                    <input type='password' placeholder='Enter your password' className={input} {...register("password")} />
                    {errors.password ? <span className='text-red-600'>{errors.password.message}</span> : <></>}
                </div>
                <div>
                    <input type='password' placeholder='confirm your password' className={input} {...register("confirmPassword")}/>
                    {errors.confirmPassword ? <span className='text-red-600'>{errors.confirmPassword.message}</span> : <></>}
                </div>

                {/* <button className={button} type='submit'>Sign {authType === "login" ? "in" : "up"} with email</button> */}

                <button className={button} disabled={loading} type="submit">
                    {authType === "login" ? "Login with email" : "Sign up with email"}
                </button>

            </div>

             <div className='text-sm font-light py-4'>
                 {authType === "login" ? (
                     <span className={text}>
                         Don&apos;t have an account yet?{"."}
                         <span className={link} onClick={handleAuthType}>Sign up</span>
                     </span>
                 ) : (<span className={text}>
                     Already have an account?{""}
                     <span onClick={handleAuthType} className='font-medium cursor-pointer text-primary-600 hover:underline dark:text-primary'>
                         Sign in
                     </span>
                 </span>)}
             </div>

            <div className='my-3 flex items-center px-3'>
                <hr className={hr} />
                <button onClick={() => setResetPassword(true)} className={forgotPasswordButton}
                type='button'>
                    Forgot password
                </button>
                <hr className={hr}/>
            </div>
        </form>
    </div>
 </div>
    </>
 )
}

export default Auth
