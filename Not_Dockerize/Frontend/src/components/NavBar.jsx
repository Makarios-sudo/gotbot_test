import React , { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'

const NavBar = () => {
    const { user } = useContext(AuthContext);
    return (
      <React.Fragment>
        <nav className='navbar'>
          <li> Koto Shop </li>
          <li> <span> Welcome </span> {user ? `${user.FirstName} ${user.LastName}` : 'Guest'} </li>
        </nav>
      </React.Fragment>
    );
}

export default NavBar