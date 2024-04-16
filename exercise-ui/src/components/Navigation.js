import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link className='home' to="/">Home</Link>
            <Link className= 'add' to="/add-exercise">Add</Link>

        </nav>
    );
  }
export default Navigation;