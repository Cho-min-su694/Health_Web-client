import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'src/store';
import * as accountSlice from 'src/data/accountSlice';
import { useRouter } from 'next/router';
import { redirectUrl } from 'src/util/constants/app';
import { Dispatch } from '@reduxjs/toolkit';

interface hookMember {
  userType: accountSlice.UserType | undefined;
  adminName: string;
  confirmModal: 'flex' | 'none';

  onClickLogout: () => void;
  onClickMenu: (item: string) => void;
  onClickSubMenu: (active: string) => void;
  onClickAdminMain: () => void;
  onClickCloseConfirmModal: () => void;
  onClickRouterMain: () => void;

  onClickModify: () => void;
}

export const navArray = [
  // { title: '결제관리', name: '전체조회', url: '/admin/payment' },
  { title: '유저관리', name: '유저관리', url: '/admin/user' },
];

export function useAdminHeader(): hookMember {
  const userType = useTypedSelector((state) => state.account.user?.userType);
  const user = useTypedSelector((state) => state.account.user);

  const dispatch = useDispatch<Dispatch<any>>();
  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState<'flex' | 'none'>('none');

  useEffect(() => {
    let sessionUserData = sessionStorage.getItem('userData');
    if (sessionUserData) {
      let userData: { user: accountSlice.User; accessToken: string } =
        JSON.parse(sessionUserData);
      // if (userData.user.userType === 'ADMIN') {
      //   dispatch(accountSlice.saveUserDataInSession(userData));
      // } else if (userData.user.userType === 'HAPPYCALL') {
      //   dispatch(accountSlice.saveUserDataInSession(userData));
      // } else {
      //   router.push('/admin/login');
      // }
      if (userData.user.loginType === 'ADMIN') {
        dispatch(accountSlice.saveUserDataInSession(userData));
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  return {
    userType,
    adminName: user?.nickname || '',
    confirmModal,

    onClickLogout: () => {
      dispatch(accountSlice.logout());
      router.push('/login');
    },
    onClickMenu: (item) => {
      if (item === '유저관리') {
        router.push('/admin/user');
      }
    },
    onClickSubMenu: (active: string) => {
      navArray.map((item) => {
        if (item.name === active) router.push(item.url);
      });
    },
    onClickAdminMain: () => {
      router.push('/admin');
    },
    onClickCloseConfirmModal: () => {
      if (confirmModal === 'flex') {
        setConfirmModal('none');
      } else {
        setConfirmModal('flex');
      }
    },
    onClickRouterMain: () => {
      window.open(redirectUrl, '_blank');
    },

    onClickModify: () => {
      const userId = user?.id;
      if (userId) router.push('/admin/user/' + userId);
    },
  };
}
