// import { is } from 'immer/dist/internal';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react'; import { Address } from 'react-daum-postcode';
import { Gym, useFindDuplicateGymDataMutation, useFindGymQuery, useUpdateGymByIdMutation, useUpsertGymImageMutation } from 'src/api/gymsApi';
;
import {
  useFindUserQuery,
  User,
  UserType,
  useUpdateUserByAdminMutation,
} from 'src/api/usersApi';
import { imageResizer } from 'src/common/imageResizer/imageResizer';
import { setUser } from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';
import { rootUrl } from 'src/util/constants/app';

interface hookMember {
  gym: Gym | undefined;

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

  onClickRouterGym: () => void;
  onClickSaveGym: () => void;

  onClickUpdateGym: () => void;

  modalDisplayState: 'flex' | 'none';
  onClickCompleted: () => void;
  modalContent: any;
}

export function useAdminGymDetailScreen(): hookMember {
  const router = useRouter();

  //  회사정보 중복관련 mutation
  const [duplicateGymData] = useFindDuplicateGymDataMutation();

  const adminUserId = useTypedSelector((state) => state.account.user?.id || -1);

  const { data: gym, refetch: gymRefetch } = useFindGymQuery({
    id: Number(router.query.id),
  });

  const [upsertGymImage] = useUpsertGymImageMutation();

  const [updateGymByAdmin] = useUpdateGymByIdMutation();

  const [modalDisplayState, setModalDisplayState] = useState<'flex' | 'none'>(
    'none',
  );
  const [modalContent, setModalContent] = useState<any>(<div></div>);

  const onClickCompleted = () => {
    setModalDisplayState('none');
  };

  const [postcodeDisplayState, setPostcodeDisplayState] = useState<
    'flex' | 'none'
  >('none');

  // s: input

  const [userId, setUserId] = useState<number>();
  const [gymId, seteGymId] = useState<number>();

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
    useState<any>('');

  const [gymPhotoId, setGymPhotoId] = useState<number>();

  // 회사정보 중복관련 fnc
  const onClickDuplicateCompanyName = async () => {
    const result: any = await duplicateGymData({
      type: 'companyName',
      content: companyName,
    });
    //
    if (!result?.data || companyName.length < 3) {
      setModalDisplayState('flex');
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명 중복 확인</span>
          <br />
          중복된 회사명 또는 사용 불가 회사명입니다.
        </div>,
      );
      setDuplicateCompanyName(true);
    } else {
      setDuplicateCompanyName(false);
      setModalDisplayState('flex');
      setModalContent(
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

  // e: input


  useEffect(() => {
    gymRefetch();
  }, []);


  useEffect(() => {
    if (router.query.id) {
      const gymId = Number(router.query.id);
      console.log(userId, 'router!!')
      seteGymId(gymId)
    }
  }, [router])

  useEffect(() => {
    if (gym) {
      setCeoName(gym.ceoName);
      setCompanyName(gym.companyName);
      setBusinessNumber(gym.businessNumber);
      setCompanyPhone(gym.phone);
      setCompanyCellPhone(gym.cellPhone);
      setCompanyFax(gym.fax);
      setCompanyEmail(gym.email);
      setMainAddress(gym.mainAddress);
      setSubAddress(gym.subAddress);
      setPostCode(gym.postcode);

      if (gym.GymImage && gym.GymImage[0]) {
        setGymPreviewPhoto(
          gym.GymImage[0].url?.replace(/^/, `${rootUrl}/`) || ''
        );
      }

    }
  }, [gym]);

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


  const onClickUpdateGym = async () => {
    //
    let isModified = false;

    // // NOTE 회사명 중복검사...
    // if (companyName === '') {
    //   setModalContent(
    //     <div css={{ textAlign: 'center' }}>
    //       <span css={{ fontWeight: 'bold' }}>회사명</span>
    //       <br />
    //       회사명을 입력해주세요.
    //     </div>,
    //   );
    //   setModalDisplayState('flex');
    //   return;
    // }
    if (duplicateCompanyName) {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>회사명</span>
          <br />
          회사명 중복확인을 해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    // NOTE 대표자명 중복검사...
    if (ceoName === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>대표자명</span>
          <br />
          대표자명을 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    // // NOTE 헬스장 이미지 검사
    // if (!gymPhoto) {
    //   setModalContent(
    //     <div css={{ textAlign: 'center' }}>
    //       <span css={{ fontWeight: 'bold' }}>헬스장 이미지</span>
    //       <br />
    //       이미지를 등록해주세요.
    //     </div>,
    //   );
    //   setModalDisplayState('flex');
    //   return;
    // }
    // NOTE 우편번호
    if (postCode === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          우편번호를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    // NOTE 메인주소
    if (mainAddress === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          주소를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    // NOTE 상세주소
    if (subAddress === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>사업자주소</span>
          <br />
          상세주소를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    // NOTE 대표전화
    if (companyPhone === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>대표전화</span>
          <br />
          대표전화를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    } // NOTE 긴급전화
    if (companyCellPhone === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>긴급전화</span>
          <br />
          긴급전화를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    } // NOTE 이메일
    if (companyEmail === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>이메일</span>
          <br />
          이메일을 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }

    if (gymId) {
      updateGymByAdmin(
        {
          id: gymId,
          body: {
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
          }
        },
      ).then(async (companyInfo: any) => {

        const companyInfoId: number = companyInfo.data?.id ?? -1;
        if (companyInfoId >= 0) {
          if (gymPhoto) {

            const form = new FormData();
            form.append('gymImage', gymPhoto);
            const result: any = await upsertGymImage({
              gymId: companyInfoId,
              form: form
            });

            if (result?.data) {
              isModified = true;
            } else {
              alert("이미지 업로드 문제 발생");
            }

          } else {
            isModified = true;
          }

        }


        if (isModified) {
          if (confirm('수성되었습니다!(확인 시 목록으로)')) router.back();
        } else {
          alert("문제가 발생하였습니다.");
        }

      })
    }

  };

  return {
    gym,

    modalDisplayState,
    modalContent,
    onClickCompleted,

    onClickRouterGym: () => {
      router.push(`/admin/user/`);
    },
    onClickSaveGym: () => {
      console.log(gym);
    },

    onClickUpdateGym,

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

    onClickPostCode,
    onCompletePostCode,
    onClickRouterBack,


  };
}
