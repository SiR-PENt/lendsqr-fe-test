import hero from './assets/loginHero.png';
import logo from './assets/logo.png';
import { useState } from 'react'
import Input from './components/login-auth/Input';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {  useNavigate } from 'react-router-dom'
import { auth } from './components/login-auth/firebaseConfig';

export default function LoginAuth() {
  
  const navigate = useNavigate()
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('')
  const [ hide, setHide ] = useState<boolean>(true)
  const [ helperText, setHelperText ] = useState<string>('')
  const [ signUp, setSignUp ] = useState<boolean>(true)
  const [ error, setError ] = useState<boolean>(false)

  const handleSignUp = (e: React.FormEvent<HTMLButtonElement> ) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
     .then(() => {
      setHelperText('Congrats!, you can now Sign In')
      setTimeout(() => setHelperText(''), 2000)
      setSignUp(!signUp)
      setError(false)
      // const userId = auth.currentUser?.uid
     }) 
   .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setError(true)
    console.log(errorCode, errorMessage)
   });
 }

  const handleSignIn = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      setError(false)
      navigate('/dashboard/users')
     })
   .catch((error) => {
   const errorCode = error.code;
   (errorCode === 'auth/user-not-found!') ?
    setHelperText('Email is not registered!') :
    setHelperText('Invalid password')
    setError(true)
    setTimeout(() => setHelperText(''), 2000)
  });
}

    return (
        <div className='login-container'>
          <div className='hero-container'>
          {/* <img src={logo} alt='lendsqr-logo'/> */}
          <img src={hero} alt='hero'/>
          </div>
          <form className='login-form'>
            <div>
            <h1>Welcome!</h1>
            <p>Enter details to {signUp ? "login" : 'sign up'}.</p>   
            <div>
            <p className={`${error ? 'error' : 'success'}`}>{helperText}</p>
              <div className='input-container'>
              <Input type='email' placeholder={'Email'} value={email} onChange={setEmail}/>
              </div>
              <div className='input-container'>
              <Input type={hide ? "password" : 'text'} placeholder={'Password'} value={password} onChange={setPassword}/>
              <span  className='show' onClick={() => setHide(!hide)}>{hide ? "Show": "Hide"}</span>
              </div>
            </div>
              <p>Forgot Password?</p>
              <p>Don't have an account? <span onClick={() => setSignUp(!signUp)}>Sign Up</span></p>
               <button type='submit' onClick={!signUp ? handleSignUp : handleSignIn}>
                  {signUp ? ' Log In' : ' Sign Up'} 
               </button>
            </div>
          </form>
        </div>
    )
} 