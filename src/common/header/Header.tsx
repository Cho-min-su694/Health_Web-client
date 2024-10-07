import React, { useEffect } from 'react';
import { Flex } from '../styledComponents';
import { appContentWidth } from 'src/util/constants/style';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import * as accountSlice from 'src/data/accountSlice';
import { useRouter } from 'next/router';

interface HeaderProps {
  LeftComponent?: React.ReactElement;
  CenterComponent?: React.ReactElement;
  RightComponent?: React.ReactElement;
  hasBorder?: boolean;
  transparent?: boolean;
  gray?: boolean;
  userType?:accountSlice.UserType
}

const Header = ({
  LeftComponent,
  CenterComponent,
  RightComponent,
  hasBorder = false,
  transparent = false,
  gray = false,
  userType
}: HeaderProps) => {

  const grayColor = gray ? { backgroundColor: '#ddd' } : {};

  const dispatch = useDispatch<Dispatch<any>>();
  const router = useRouter();

  useEffect(() => {
    if(userType===undefined) return;
    let sessionUserData = sessionStorage.getItem('userData');
    if (sessionUserData) {
      let userData: { user: accountSlice.User; accessToken: string } =
        JSON.parse(sessionUserData);
      if (userData.user.userType === userType) {
        dispatch(accountSlice.saveUserDataInSession(userData));
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [userType]);

  return (
    <div
      css={{ ...grayColor }}
    >
      <Flex
        css={{
          backgroundColor: transparent ? 'transparent' : 'white',
          zIndex: transparent ? 10 : 0,
          maxWidth: appContentWidth,
          margin: '0 auto',
          position: 'relative',
          ...grayColor
        }}>
        <Flex
          css={{
            flexDirection: 'row',
            paddingLeft: 20,
            paddingRight: 20,
            justifyContent: 'space-between',
            height: 50,
            alignItems: 'center',
          }}>
          {LeftComponent || <Flex css={{ width: 24, height: 24 }} />}

          <Flex
            css={{
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',

              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}>
            {CenterComponent || <Flex css={{ width: 24, height: 24 }} />}
          </Flex>
          {RightComponent || <Flex css={{ width: 24, height: 24 }} />}
        </Flex>
      </Flex>

      {/* Divider */}
      {hasBorder && (
        <Flex
          css={{
            width: '100%',
            height: 1,
            backgroundColor: '#eee',
          }}
        />
      )}
    </div>
  );
};

export default Header;
