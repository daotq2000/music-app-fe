import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { saveUser } from '../../redux/userReducer';
import RegisterImage from '../../resource/images/register_img.png';
import history from '../../router/history';

const schema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'username is required',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'email is required',
        }),
    password: Joi.string().required().messages({
        'string.empty': 'password is required',
    }),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            'string.empty': 'confirm password is required',
            'any.only': 'confirm password does not match password',
        }),
});

const Register = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        resolver: joiResolver(schema),
    });

    const onSumit = (data) => {
        dispatch(saveUser({ user: data }));
    };

    const userReducer = useSelector((state) => {
        return state.userReducer;
    });

    useEffect(() => {
        let flag = userReducer.isSuccess;
        showPopUp(flag);
    }, [userReducer.isSuccess]);

    const showPopUp = (flag) => {
        if (flag != undefined || flag != null) {
            let anchorOrigin = { horizontal: 'center', vertical: 'bottom' };
            let config = { variant: 'success', anchorOrigin: anchorOrigin };
            if (flag) {
                enqueueSnackbar('Đăng ký thành công. hãy thực hiện đăng nhập', config);
                history.push(`/login`);
            } else {
                enqueueSnackbar(userReducer.message, config);
            }
        }
    };

    return (
        <div className='ms_profile_wrapper'>
            <div style={{ width: '100%' }} className='ms_profile_box'>
                <div style={{ padding: '10px' }} className='ms_register_img'>
                    <img src={RegisterImage} alt='' className='img-fluid' />
                </div>
                <div style={{ padding: '10px' }} className='ms_register_form'>
                    <h2>Đăng ký / Đăng Nhập</h2>

                    <div className='form-group'>
                        <input
                            name='username'
                            type='text'
                            placeholder='Tên tài khoản'
                            className='form-control'
                            {...register('username')}
                        />
                        <span className='form_icon'>
                            <i className='fa_icon form-user' aria-hidden='true' />
                        </span>
                        {errors?.username?.message && (
                            <span className='text-error'>{errors?.username?.message}</span>
                        )}
                    </div>
                    <div className='form-group'>
                        <input
                            {...register('email')}
                            name='email'
                            type='text'
                            placeholder='Email'
                            className='form-control'
                        />
                        <span className='form_icon'>
                            <i className='fa_icon form-user' aria-hidden='true' />
                        </span>
                        {errors?.email?.message && (
                            <span className='text-error'>{errors?.email.message}</span>
                        )}
                    </div>
                    <div className='form-group'>
                        <input
                            name='password'
                            type='password'
                            placeholder='Mật khẩu'
                            className='form-control'
                            {...register('password')}
                        />
                        <span className='form_icon'>
                            <i className='fa_icon form-lock' aria-hidden='true' />
                        </span>
                        {errors?.password?.message && (
                            <span className='text-error'>{errors?.password?.message}</span>
                        )}
                    </div>
                    <div className='form-group'>
                        <input
                            name='confirmPassword'
                            type='password'
                            placeholder='Xác nhận mật khẩu'
                            className='form-control'
                            {...register('confirmPassword')}
                        />
                        <span className='form_icon'>
                            <i className=' fa_icon form-lock' aria-hidden='true' />
                        </span>
                        {errors?.confirmPassword?.message && (
                            <span className='text-error'>{errors?.confirmPassword?.message}</span>
                        )}
                        <br />
                    </div>
                    <a className='ms_btn' type='submit' onClick={handleSubmit(onSumit)} >
                        Đăng ký ngay
                    </a>
                    <p>
                        Đã có tài khoản?{' '}
                        <Link
                            to={`/login`}
                            data-toggle='modal'
                            className='ms_modal hideCurrentModel'
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Register;
