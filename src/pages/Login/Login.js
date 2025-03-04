import { joiResolver } from '@hookform/resolvers/joi';
import axios from 'axios';
import Joi from 'joi';
import { useSnackbar } from 'notistack';
import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RegisterImage from '../../resource/images/register_img.png';
import history from '../../router/history';
import { API_ENDPOINT } from '../../utils/Constaints';

const login_schema = Joi.object().keys({
  username: Joi.string().required().messages({
    'string.empty': 'tài khoản không được để trống',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'mật khẩu không được để trống',
  }),
});

// TODO: fix button css
const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: joiResolver(login_schema),
    mode: 'onSubmit',
  });

  const [error, setError] = useState({
    txtUsername: false,
    txtPassword: false,
  });

  const onSubmit = (data) => {
    let config = null;
    let anchorOrigin = { horizontal: 'center', vertical: 'bottom' };
    axios
      .post(API_ENDPOINT + 'auth', data)
      .then((res) => {
        const token = res.headers.authorization;
        localStorage.setItem('Authorization', token);
        config = { variant: 'success', anchorOrigin: anchorOrigin };
        enqueueSnackbar('Đăng nhập thành công', config);
        history.push(`/admin/album`);
      })
      .catch((error) => {
        config = { variant: 'error', anchorOrigin: anchorOrigin };
        let errors = error.response;
        if (errors.status == 401) {
          enqueueSnackbar(
            'Tên tài khoản hoặc mật khẩu không chính xác',
            config
          );
        }
      });
  };

  return (
    <>
      <div className='ms_profile_wrapper'>
        <div style={{ width: '75%' }} className='ms_profile_box'>
          <div style={{ padding: '10px' }} className='ms_register_img'>
            <img src={RegisterImage} alt='' className='img-fluid' />
          </div>
          <form
            style={{ padding: '10px' }}
            className='ms_register_form'
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2>Đăng Nhập / Đăng Ký</h2>
            <div className='form-group'>
              <input
                {...register('username')}
                name='username'
                type='text'
                placeholder='Tài Khoản'
                className='form-control'
              />
              <span className='form_icon'>
                <i className='fa_icon form-envelope' aria-hidden='true' />
              </span>
              <br />
              {errors.username && (
                <span className='text-error'>{errors?.username.message}</span>
              )}
            </div>
            <div className='form-group'>
              <input
                {...register('password')}
                error={error.txtPassword}
                helperText='Không được để trống'
                name='password'
                type='password'
                placeholder='Mật Khẩu'
                className='form-control'
              />
              <span className='form_icon'>
                <i className='fa_icon form-lock' aria-hidden='true' />
              </span>
              <br />
              {errors.password && (
                <span className='text-error'>{errors?.password.message}</span>
              )}
            </div>
            <div className='remember_checkbox'>
              <label>
                Ghi nhớ đăng nhập
                <input type='checkbox' />
                <span className='checkmark' />
              </label>
            </div>
            <button className='ms_btn' target='_blank' type='submit'>
              Đăng nhập ngay
            </button>
            <div className='popup_forgot'>
              <a href='#'>Quên mật khẩu ?</a>
            </div>
            <p>
              Chưa có tài khoản?{' '}
              <Link
                to={`/register`}
                data-toggle='modal'
                className='ms_modal1 hideCurrentModel'
              >
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
