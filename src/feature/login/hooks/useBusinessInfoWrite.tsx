import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { Address } from 'react-daum-postcode';
import {
  createGymData,
  createGymImage,
  useFindDuplicateGymDataMutation,
} from 'src/api/gymsApi';
import {
  AccessToken,
  createUser,
  useFindDuplicateUserDataMutation,
  User,
} from 'src/api/usersApi';
import { imageResizer } from 'src/common/imageResizer/imageResizer';
import { GeneralUserData } from './useSignupScreen';

interface hookMember {
  confirmModalDisplayState: 'flex' | 'none';
  confirmModalContent: any;
  basicModalDisplayState: 'flex' | 'none';
  basicModalContent: any;
  postcodeDisplayState: 'flex' | 'none';
  duplicateCompanyName: boolean;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  postCode: string;
  mainAddress: string;
  subAddress: string;
  companyPhone: string;
  companyCellPhone: string;
  companyFax: string;
  companyEmail: string;
  gymPreviewPhoto: any;

  confirmModalConfirmBtn: () => void;
  onClickCloseConfirmModal: () => void;
  basicModalConfirmBtn: () => void;
  onClickPostCode: () => void;
  onCompletePostCode: (data: Address) => void;
  onClickRouterBack: () => void;

  onClickDuplicateCompanyName: () => void;
  onChangeDuplicateCompanyName: () => void;

  onChangeCompanyName: (companyName: string) => void;
  onChangeCeoName: (ceoName: string) => void;
  onChangeBusinessNumber: (businessNumber: string) => void;
  onChangeSubAddress: (subAddress: string) => void;
  onChangeCompanyPhone: (companyPhone: string) => void;
  onChangeCompanyCellPhone: (companyCellPhone: string) => void;
  onChangeCompanyFax: (companyFax: string) => void;
  onChangeCompanyEmail: (companyEmail: string) => void;

  onChangeGymPhoto: (e: ChangeEvent<HTMLInputElement>) => void;

  onClickSignup: () => void;
}

export function useBusinessInfoWrite({
  checkSignUpInform,
  generalUserData
}: {
  checkSignUpInform: () => boolean;
  generalUserData: GeneralUserData;
}): hookMember {
  const router = useRouter();
  //  회사정보 중복관련 mutation
  const [duplicateGymData] = useFindDuplicateGymDataMutation();

  const [confirmModalDisplayState, setConfirmModalDisplayState] = useState<
    'flex' | 'none'
  >('none');
  const [confirmModalContent, setConfirmModalContent] = useState<any>();
  const [confirmModalConfirmBtn, setConfirmModalConfirmBtn] = useState<
    () => void
  >(() => {
    //
  });

  //basicModal에 사용할 state
  const [basicModalDisplayState, setBasicModalDisplayState] = useState<
    'flex' | 'none'
  >('none');
  const [basicModalContent, setBasicModalContent] = useState<any>();
  // 우편번호 검색에 사용할 state
  const [postcodeDisplayState, setPostcodeDisplayState] = useState<
    'flex' | 'none'
  >('none');
  const [postCode, setPostCode] = useState<string>('');
  const [mainAddress, setMainAddress] = useState<string>('');

  const [duplicateCompanyName, setDuplicateCompanyName] =
    useState<boolean>(false);
  // 입력 데이터 state

  // const [duplicateBusinessNumber, setDuplicateBussinessNumber] =
  // useState<boolean>(false);
  // 입력 데이터 state
  const [companyName, setCompanyName] = useState<string>('');
  const [ceoName, setCeoName] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [subAddress, setSubAddress] = useState<string>('');
  const [companyPhone, setCompanyPhone] = useState<string>('');
  const [companyCellPhone, setCompanyCellPhone] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyFax, setCompanyFax] = useState<string>('');
  // 헬스장 이미지 state
  const [gymPhoto, setGymPhoto] = useState<
    File | undefined
  >(undefined);
  const [gymPreviewPhoto, setGymPreviewPhoto] =
    useState<any>(null);

  // confirmModal에 사용할 fnc
  const onClickCloseConfirmModal = () => {
    setConfirmModalDisplayState('none');
  };
  //basicModal에 사용할 fnc
  const basicModalConfirmBtn = () => {
    if (basicModalDisplayState === 'flex') {
      setBasicModalDisplayState('none');
    } else {
      setBasicModalDisplayState('flex');
    }
  };
  // 우편번호 검색에 사용할 fnc
  const onClickPostCode = () => {
    if (postcodeDisplayState === 'flex') {
      setPostcodeDisplayState('none');
    } else {
      setPostcodeDisplayState('flex');
    }
  };
  const onCompletePostCode = (data: Address) => {
    setPostCode(data.zonecode);
    setMainAddress(data.address);
    setPostcodeDisplayState('none');
  };
  // 뒤로가기
  const onClickRouterBack = () => {
    router.back();
  };

  // 회사정보 중복관련 fnc
  const onClickDuplicateCompanyName = async () => {
    const result: any = await duplicateGymData({
      type: 'companyName',
      content: companyName,
    });
    //
    if (!result?.data || companyName.length < 3) {
      setBasicModalDisplayState('flex');
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명 중복 확인</span>
          <br />
          중복된 회사명 또는 사용 불가 회사명입니다.
        </div>,
      );
      setDuplicateCompanyName(true);
    } else {
      setDuplicateCompanyName(false);
      setBasicModalDisplayState('flex');
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명 중복 확인</span>
          <br />
          사용가능한 회사명입니다.
        </div>,
      );
    }
  };
  const onChangeDuplicateCompanyName = () => {
    setDuplicateCompanyName(true);
  };
  // 입력 데이터 fnc
  const onChangeCompanyName = (companyName: string) => {
    setCompanyName(companyName);
  };
  const onChangeCeoName = (ceoName: string) => {
    setCeoName(ceoName);
  };
  const onChangeBusinessNumber = (businessNumber: string) => {
    setBusinessNumber(businessNumber);
  };
  const onChangeSubAddress = (subAddress: string) => {
    setSubAddress(subAddress);
  };
  const onChangeCompanyPhone = (compnayPhone: string) => {
    setCompanyPhone(compnayPhone);
  };
  const onChangeCompanyCellPhone = (companyCellPhone: string) => {
    setCompanyCellPhone(companyCellPhone);
  };
  const onChangeCompanyEmail = (companyEmail: string) => {
    setCompanyEmail(companyEmail);
  };
  const onChangeCompanyFax = (companyEmail: string) => {
    setCompanyFax(companyEmail);
  };
  // 헬스장 이미지 fnc
  const onChangeGymPhoto = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressedFile = await imageResizer(file);
      if (!compressedFile) return;
      setGymPhoto(compressedFile);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = function (e) {
        setGymPreviewPhoto(reader.result);
      };
    }
  };
  // 회원가입
  const onClickSignup = async () => {

    if (!checkSignUpInform()) return;

    // NOTE 회사명 중복검사...
    if (companyName === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명</span>
          <br />
          회사명을 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    if (duplicateCompanyName) {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명</span>
          <br />
          회사명 중복확인을 해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 대표자명 중복검사...
    if (ceoName === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>대표자명</span>
          <br />
          대표자명을 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 사업자 등록증 이미지 검사
    if (!gymPhoto) {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>헬스장 이미지</span>
          <br />
          이미지를 등록해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 우편번호
    if (postCode === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          우편번호를 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 메인주소
    if (mainAddress === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          주소를 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 상세주소
    if (subAddress === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          상세주소를 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }
    // NOTE 대표전화
    if (companyPhone === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>대표전화</span>
          <br />
          대표전화를 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    } // NOTE 긴급전화
    if (companyCellPhone === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>긴급전화</span>
          <br />
          긴급전화를 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    } // NOTE 이메일
    if (companyEmail === '') {
      setBasicModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>이메일</span>
          <br />
          이메일을 입력해주세요.
        </div>,
      );
      setBasicModalDisplayState('flex');
      return;
    }

    const createdUser: { accessToken: AccessToken; user: User } =
      await createUser({
        loginId: generalUserData.userId,
        loginPw: generalUserData.password,
        username: generalUserData.username,
        loginType: 'LOCAL',
        userType: 'BUSINESS',
        nickname: generalUserData.nickname,
        phone: generalUserData.phone
      });

    const accessToken = createdUser.accessToken;
    const createdUserId = createdUser.user?.id;
    if (createdUserId) {
      const companyInfo: any = await createGymData(
        createdUserId,
        accessToken,
        {
          ceoName,
          companyName,
          businessNumber,
          phone: companyPhone,
          cellPhone: companyCellPhone,
          fax: companyFax,
          email: companyEmail,
          mainAddress,
          subAddress,
          postcode: postCode,
        },
      );

      if(companyInfo) {
        if (gymPhoto) {
          const companyInfoId:number = companyInfo.id as number;

          const form = new FormData();
          form.append('gymImage', gymPhoto);
          await createGymImage(companyInfoId, accessToken, form);
        }
  
        // FIXME 세션스토리지에 저장은 모든 가입 절차가 완료 되었을때 저장되어야지 버그가 안생김..
        await sessionStorage.setItem('userData', JSON.stringify(createdUser));
  
        // 다음화면으로 넘기기
        // onClickNextTest(); 신규 화면으로 만들기...
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      }

    }
  }

  return {
    confirmModalDisplayState,
    confirmModalContent,
    basicModalDisplayState,
    basicModalContent,
    postcodeDisplayState,
    duplicateCompanyName,
    postCode,
    mainAddress,
    subAddress,
    companyName,
    businessNumber,
    ceoName,
    companyPhone,
    companyCellPhone,
    companyFax,
    companyEmail,
    gymPreviewPhoto,

    confirmModalConfirmBtn,
    onClickCloseConfirmModal,
    basicModalConfirmBtn,
    onClickPostCode,
    onCompletePostCode,
    onClickRouterBack,

    onClickDuplicateCompanyName,
    onChangeDuplicateCompanyName,

    onChangeCompanyName,
    onChangeCeoName,
    onChangeBusinessNumber,
    onChangeSubAddress,
    onChangeCompanyPhone,
    onChangeCompanyCellPhone,
    onChangeCompanyFax,
    onChangeCompanyEmail,

    onChangeGymPhoto,

    onClickSignup
  };
}
