import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetTestQuery } from 'src/api/examplesApi';
import * as accountSlice from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';
import { redirectUrl, rootUrl } from 'src/util/constants/app';

interface LoginData {
  loginId: string;
  loginPw: string;
  loginType: accountSlice.LoginType;
}

interface HookMember {
  loginData: LoginData;

  debugText: string;

  onClickLogin: () => void;
  onChangeLoginData: (type: 'loginId' | 'loginPw', value: string) => void;
}

export function useLoginScreen(): HookMember {
  const dispatch = useDispatch<Dispatch<any>>();
  const router = useRouter();

  const userType = useTypedSelector((state) => state.account.user?.userType);

  const {data:testServer} = useGetTestQuery();

  const [loginData, setLoginData] = useState<LoginData>({
    loginId: '',
    loginPw: '',
    loginType: 'LOCAL',
  });


  useEffect(() => {
    console.log(`test text: ${testServer?.text}`);
  }, [testServer]);

  useEffect(() => {
    if (userType === 'ADMIN') {
      router.push('/admin');
    } else if(userType) {
      router.push('/');
    }
  }, [userType]);

  const onChangeLoginData = (type: 'loginId' | 'loginPw', value: string) => {
    let clone = { ...loginData };
    clone[type] = value;
    setLoginData(clone);
  };

  const onClickLogin = () => {
    // id,pw를 가져오고 슬라이스의 로그인으로 넘김
    dispatch(accountSlice.login(loginData));
  };

  return {
    loginData,

    debugText:testServer?.text ?? "-----",

    onClickLogin,
    onChangeLoginData,
  };
}
