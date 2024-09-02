import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetTestQuery } from 'src/api/examplesApi';
import * as accountSlice from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';
import { redirectUrl, rootUrl } from 'src/util/constants/app';

interface HookMember {
    user: accountSlice.User | undefined;
    onClickSignin(): void;
    onClickLogout(): void;
}

export function useMainScreen(): HookMember {
    const user = useTypedSelector((state) => state.account.user);
    const router = useRouter();

    const dispatch = useDispatch<Dispatch<any>>();

    useEffect(() => {
        let sessionUserData = sessionStorage.getItem('userData');
        if (sessionUserData) {
          let userData: { user: accountSlice.User; accessToken: string } =
            JSON.parse(sessionUserData);
            
            dispatch(accountSlice.saveUserDataInSession(userData));
        }
    }, []);

    const onClickSignin = () => {
        router.push('/login');
    };

    const onClickLogout = () => {
        // id,pw를 가져오고 슬라이스의 로그인으로 넘김
        dispatch(accountSlice.logout());
    };

    return {
        user,
        onClickSignin,
        onClickLogout
    };
}
