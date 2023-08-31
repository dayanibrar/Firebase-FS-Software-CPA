import React from 'react'
import { headerClasses } from './headerClasses'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/storeHook';

const Header = () => {
    const {header, navContainer, navContent, linkHome, linkProfile, linkSignIn} = headerClasses;
    // Gets the state of the user eg signed in or not
    // Checks for the state of the auth.
    const {user} = useAppSelector((state) => state.auth);

  return (
    <header className={header}>
      <nav className={navContainer}>
        <div className={navContent}>
          <div className="flex items-center w-full">
            <Link to="/" className={linkHome}>
              Home
            </Link>
            {Boolean(!user) && (
              <Link to="/auth" className={linkSignIn}>
                Sign in
              </Link>
            )}
            {user ? (
              <Link to="/profile">
                {user?.photoUrl ? (
                  <img
                    className={linkProfile}
                    src={user.photoUrl}
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-16 h-16 mb-3 text-4xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg">
                  {user?.email.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header

