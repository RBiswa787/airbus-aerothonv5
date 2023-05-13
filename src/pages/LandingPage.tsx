import React  from 'react'

const LandingPage = ()=> {
  return (
  <div>
        <h1>Landing Page</h1>
        <br/>
        <p>You are not logged in</p>
        <div className='Button Span'>
            <a href='/login'><button>Login</button></a>
            <a href='/register'><button>Register</button></a>
        </div>
    </div>
  );
};

export default LandingPage 
