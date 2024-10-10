import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFindDuplicateUserDataMutation } from 'src/api/usersApi';
import * as accountSlice from 'src/data/accountSlice';

interface hookMember {
  loading: boolean;

  isBusiness:boolean;

  generalUserDataErrorDisplayState: 'flex' | 'none';
  generalUserData: GeneralUserData;
  errorMessage: any;
  duplicateId: boolean;
  duplicateNickname: boolean;
  duplicatePhonenumber: boolean;
  checkPassword: boolean | undefined;
  username: string;

  onClickHistoryBack: () => void;
  onClickRouterGeneralSignup: () => void;
  onClickRouterBusinessSignup: () => void;

  onClickDiplucateUserId: () => void;
  onClickDiplucateNickname: () => void;
  onClickDiplucatePhoneNumber: () => void;
  onChangeGeneralUserId: () => void;
  onChangeGeneralNickname: () => void;

  onChangeGeneralUserData: (
    item:
      | 'userId'
      | 'password'
      | 'repassword'
      | 'username'
      | 'nickname'
      | 'phone',
    value: string,
  ) => void;
  checkSignUpInform: () => boolean;
  onClickSignup: () => void;

  onClickGeneralUserDataErrorModal: () => void;
}

export function useSignupScreen(): hookMember {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch<any>>();

  const [loading, setLoading] = useState<boolean>(false);

  const [generalUserData, setGeneralUserData] = useState<GeneralUserData>({
    userId: '',
    password: '',
    repassword: '',
    username: '',
    nickname: '',
    phone: '',
  });

  const [isBusiness, setIsBussiness] = useState<boolean>(false);

  useEffect(() => {
    console.log(router.query.code);
    if (router.query.code) {
      setLoading(true);
    }
  }, [router.query.code]);

  useEffect(() => {
    if (router.query.business != undefined) {
      setIsBussiness(true);
    }
  }, [router.query.business]);

  const [
    generalUserDataErrorDisplayState,
    setGeneralUserDataErrorDisplayState,
  ] = useState<'flex' | 'none'>('none');

  const onClickGeneralUserDataErrorModal = () => {
    if (generalUserDataErrorDisplayState === 'flex') {
      setGeneralUserDataErrorDisplayState('none');
    } else {
      setGeneralUserDataErrorDisplayState('flex');
    }
  };

  const [duplicateId, setDuplicateId] = useState<boolean>(false);
  const [duplicateNickname, setDuplicateNickname] = useState<boolean>(false);
  const [duplicatePhonenumber, setDuplicatePhonenumber] =
    useState<boolean>(false);
  //
  const [checkPassword, setCheckPassword] = useState<boolean | undefined>(
    undefined,
  );

  const [username, setUsername] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<any>(<div></div>);

  const [duplicateMutaion] = useFindDuplicateUserDataMutation();

  const onChangeGeneralUserData = (
    item:
      | 'userId'
      | 'password'
      | 'repassword'
      | 'username'
      | 'nickname'
      | 'phone',
    value: string,
  ) => {
    let clone = { ...generalUserData };
    if (item === 'userId') {
      // eslint-disable-next-line no-useless-escape
      const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;

      if (regExp.test(value)) {
        clone[item] = '';
        setGeneralUserData(clone);
        return;
      }
    }
    if (item === 'password' || item === 'repassword') {
    }
    if (item === 'repassword') {
      if (generalUserData.password === value) {
        setCheckPassword(true);
      } else {
        setCheckPassword(false);
      }
    }
    clone[item] = value;
    setGeneralUserData(clone);
  };

  const checkSignUpInform = ():boolean => {
    // TODO 회원가입 검사 내용 필요
    // 아이디 중복 검사
    // 아이디 글자수 검사

    if (
      generalUserData.userId.length < 3 ||
      generalUserData.userId.length > 11
    ) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>아이디</span>
          <br />
          3자이상, 15자 이하로 작성해주세요.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');
      return false;
    }

    if (
      /[^a-zA-Z0-9-_]/g.test(generalUserData.userId)
    ) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>아이디</span>
          <br />
          영어와 숫자로 입력해주세요.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');
      return false;
    }

    if (duplicateId) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>아이디</span>
          <br />
          아이디 중복확인을 해주세요.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');
      return false;
    }
    // 비밀번호 글자수 검사
    // 비밀번호 특수문자 숫자 등 검사
    let pw = generalUserData.password;
    let checkNumber = pw.search(/[0-9]/g);
    let checkEnglish = pw.search(/[a-z]/gi);

    if (pw.length < 8 || pw.length > 16) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>비밀번호</span>
          <br />
          8자 이상, 16자 이하로 작성해주세요.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');
      return false;
    }
    else {
      console.log('통과')
    }

    pw = generalUserData.repassword;

    if (pw.length < 8 || pw.length > 16) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>비밀번호 확인</span>
          <br />
          8자 이상, 16자 이하로 작성해주세요.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');
      return false;
    }
    else {
      console.log('통과')
    }
    if (generalUserData.password !== generalUserData.repassword) {
      setErrorMessage(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>비밀번호 확인</span>
          <br />
          비밀번호와 비밀번호 확인이
          <br />
          일치하지 않습니다.
        </div>,
      );
      setGeneralUserDataErrorDisplayState('flex');

      return false;
    }

    return true;
  }

  const onClickSignup = async () => {

    if(!checkSignUpInform()) return;

    await dispatch(
      accountSlice.signup({
        loginId: generalUserData.userId,
        loginPw: generalUserData.password,
        username: generalUserData.username,
        nickname: generalUserData.nickname,
        loginType: 'LOCAL',
        userType: 'GENERAL',
        phone: generalUserData.phone || '',
      }),
    );

    router.push('/');

  }


  return {
    loading,

    isBusiness,

    generalUserData,
    generalUserDataErrorDisplayState,
    errorMessage,
    duplicateId,
    duplicateNickname,
    duplicatePhonenumber,
    checkPassword,
    username,

    onClickHistoryBack: () => {
      window.history.back();
    },
    onClickRouterGeneralSignup: () => {
      router.replace(`/signup/general`);
    },
    onClickRouterBusinessSignup: () => {
      router.replace(`/signup/business`);
    },
    onChangeGeneralUserData,

    onClickGeneralUserDataErrorModal,

    onClickDiplucateUserId: async () => {
      const result: any = await duplicateMutaion({
        type: 'loginId',
        content: generalUserData.userId,
      });
      if (!result?.data || generalUserData.userId.length < 3) {
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>아이디 중복 확인</span>
            <br />
            중복된 아이디 또는 사용 불가 아이디입니다.
          </div>,
        );
        setDuplicateId(true);
      } else {
        setDuplicateId(false);
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>아이디 중복 확인</span>
            <br />
            사용가능한 아이디입니다.
          </div>,
        );
      }
    },
    onClickDiplucateNickname: async () => {
      const result: any = await duplicateMutaion({
        type: 'nickname',
        content: generalUserData.nickname,
      });
      if (!result?.data || generalUserData.nickname.length < 2) {
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>닉네임 중복 확인</span>
            <br />
            이미 사용중이거나 사용불가한 닉네임입니다.
          </div>,
        );
        setDuplicateNickname(true);
      } else {
        setDuplicateNickname(false);
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>닉네임 중복 확인</span>
            <br />
            사용가능한 닉네임입니다.
          </div>,
        );
      }
    },
    onClickDiplucatePhoneNumber: async () => {
      const result: any = await duplicateMutaion({
        type: 'phone',
        content: generalUserData.phone,
      });
      if (!result?.data) {
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>휴대폰 번호 중복 확인</span>
            <br />
            이미 사용중이거나 사용불가한 휴대폰 번호입니다.
          </div>,
        );
        setDuplicatePhonenumber(true);
      } else {
        setDuplicatePhonenumber(false);
        setGeneralUserDataErrorDisplayState('flex');
        setErrorMessage(
          <div css={{ textAlign: 'center' }}>
            <span css={{ fontWeight: 'bold' }}>휴대폰 중복 확인</span>
            <br />
            사용가능한 휴대폰 번호입니다.
          </div>,
        );
      }
    },
    onChangeGeneralUserId: () => {
      setDuplicateId(true);
    },
    onChangeGeneralNickname: () => {
      setDuplicateNickname(true);
    },
    checkSignUpInform,
    onClickSignup,
  };
}

export interface GeneralUserData {
  userId: string;
  password: string;
  repassword: string;
  username: string;
  nickname: string;
  phone: string;
}