import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { userRegister } from '../store/actions/authAction';
import { useAlert } from 'react-alert'; 
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from '../store/types/authType';

const Register = () => {

  const navigate = useNavigate();
  const alert = useAlert();
  const {loading, authenticate, error, successMessage, myInfo} = useSelector(state=>state.auth);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword:'',
    image:''
  })

  const [loadImage, setLoadImage] = useState('');
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name] : e.target.value
    })

  }

  const fileHandle = e =>{
    if(e.target.files.length !== 0){
      setState({
        ...state,
        [e.target.name] : e.target.files[0]
      })
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLoadImage(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const register = e => {
    const {userName, email, password, confirmPassword, image} = state; 
    e.preventDefault();
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('image', image);

    dispatch(userRegister(formData));
  }

  useEffect(() => {
    if(authenticate){
      navigate('/')
    }
    if(successMessage){
      alert.success(successMessage);
      dispatch({type: SUCCESS_MESSAGE_CLEAR})
    }
    if(error){
      error.map(err=>alert.error(err));
      dispatch({type: ERROR_CLEAR});
    }

  }, [successMessage, error])


  return (
    <div className='register'>
      <div className='card'>
        <div className='card-header'>
          <h3>Register</h3>
        </div>
        <div className='card-body'>
          <form onSubmit={register}>
              <div className='form-group'>
                <label htmlFor='username'>User Name</label>
                <input name="userName" onChange={inputHandle} value={state.userName} type="text" className='form-control' placeholder='user name' id='username' />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input name="email" onChange={inputHandle} value={state.email} type="email" className='form-control' placeholder='email' id='email' />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input name="password" onChange={inputHandle} value={state.password} type="password" className='form-control' placeholder='Password' id='password' />
              </div>
              <div className='form-group'>
                <label htmlFor='confirmpassword'>Confirm Password</label>
                <input name="confirmPassword" onChange={inputHandle} value={state.confirmPassword} type="password" className='form-control' placeholder='confirm password' id='confirmpassword' />
              </div>
                <div className='form-group'>
                  <div className='file-image'>
                    <div className='image'>
                      {loadImage ? <img src={loadImage} /> : ''}
                    </div>
                    <div className='file'>
                      <label htmlFor='image'>Select Images</label>
                      <input onChange={fileHandle} name="image" type='file' className='form-control' id='image' />
                    </div>
                  </div>
                  <div className='form-group'>
                    <input type='submit' value='register' className='btn' />
                  </div>
                </div>
                <div className='form-group'>
                  <span><Link to="/messanger/login"> Login Your Account</Link></span>
                </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register