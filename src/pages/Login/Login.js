import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
import Joi from 'joi';
import { useSnackbar } from 'notistack';
import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RegisterImage from '../../resource/images/register_img.png';
import history from '../../router/history';
import { loginAPI } from '../../services/auth';

const login_schema = Joi.object().keys({
  username: Joi.string().required().messages({
    'string.empty': 'tài khoản không được để trống',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'mật khẩu không được để trống',
  }),
});

// TODO: use axios interceptor
// TODO: responsive
const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [config, setConfig] = useState(null);
  const [anchorOrigin, setAnchorOrigin] = useState({
    horizontal: 'center',
    vertical: 'bottom',
  });

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

  const mutaion = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      const token = data.headers.authorization;
      localStorage.setItem('Authorization', token);
      setConfig({ variant: 'success', anchorOrigin: anchorOrigin });
      enqueueSnackbar('Đăng nhập thành công', config);
      history.push(`/admin/album`);
    },
    onError: (error) => {
      setConfig({ variant: 'error', anchorOrigin: anchorOrigin });
      let errors = error.response;
      if (errors.status == 401) {
        enqueueSnackbar('Tên tài khoản hoặc mật khẩu không chính xác', config);
      }
    },
  });

  const onSubmit = (data) => {
    mutaion.mutate(data);
  };

  return (
    <>
      <div className='ms_profile_wrapper'>
        <div style={{ width: '75%' }} className='ms_profile_box'>
          <div style={{ padding: '10px' }} className='ms_register_img'>
            <img src={RegisterImage} alt='' className='img-fluid' />
          </div>
          <div style={{ padding: '10px' }} className='ms_register_form'>
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
            <a
              className='ms_btn'
              target='_blank'
              onClick={handleSubmit(onSubmit)}
            >
              Đăng nhập ngay
            </a>
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
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
