// import { is } from 'immer/dist/internal';
import { Selection } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'; import { Address } from 'react-daum-postcode';
import { BodyPart, useFindAllBodyPartsQuery } from 'src/api/bodyPartsApi';
import { Equipment, useFindDuplicateEquipmentDataMutation, useFindEquipmentQuery, useUpdateEquipmentMutation, useUpsertEquipmentImageMutation } from 'src/api/equipmentsApi';
import { imageResizer } from 'src/common/imageResizer/imageResizer';
import { useTypedSelector } from 'src/store';
import { rootUrl } from 'src/util/constants/app';

interface hookMember {
  data: Equipment | undefined;

  duplicateCode: boolean;
  name: string;
  code: string;
  brandName: string;
  isDisable: boolean | undefined;

  equipmentPreviewPhoto:any,

  onClickRouterBack: () => void;

  onClickDuplicateCode: () => void;
  onChangeDuplicateCode: () => void;

  isSameCode: () => boolean;

  selectedKeys: Set<number>;
  onSetSelectedKeys: (key: number) => void;
  selectedValue:string;

  bodyPartList: BodyPart[] | undefined;

  onChangeName: (name: string) => void;
  onChangeCode: (code: string) => void;
  onChangeBrandName: (brandName: string) => void;

  onToggleIsDisable:()=>void;

  onChangeEquipmentPhoto: (e: ChangeEvent<HTMLInputElement>) => void;

  onClickRouterList: () => void;
  onClickSave: () => void;

  onClickUpdate: () => void;

  modalDisplayState: 'flex' | 'none';
  onClickCompleted: () => void;
  selectModalDisplayState: 'flex' | 'none';
  onClickSelectCompleted: () => void;
  onClickSelectBox: () => void;
  modalContent: any;
}

export function useAdminEquipmentDetailScreen(): hookMember {
  const router = useRouter();

  //  회사정보 중복관련 mutation
  const [duplicateEquipmentData] = useFindDuplicateEquipmentDataMutation();

  const adminUserId = useTypedSelector((state) => state.account.user?.id || -1);

  const { data: data, refetch: dataRefetch } = useFindEquipmentQuery({
    id: Number(router.query.id),
  }, {skip:!(router.query && router.query.id != undefined)});

  const { data: bodyPartList, refetch: bodyPartListRefetch} = useFindAllBodyPartsQuery();
  const [bodyPartMap, setBodyPartMap] = useState(new Map<number, BodyPart>());

  useEffect(() => {
    if(bodyPartList)
      setBodyPartMap(new Map(bodyPartList.map(bodyPart=>[bodyPart.id ?? -1, bodyPart])));
  }, [bodyPartList]);

  const [upsertEquipmentImage] = useUpsertEquipmentImageMutation();

  const [updateEquipment] = useUpdateEquipmentMutation();

  const [modalDisplayState, setModalDisplayState] = useState<'flex' | 'none'>(
    'none',
  );

  const [selectModalDisplayState, setSelectModalDisplayState] = useState<'flex' | 'none'>(
    'none',
  );
  const [modalContent, setModalContent] = useState<any>(<div></div>);

  const onClickCompleted = () => {
    setModalDisplayState('none');
  };

  const onClickSelectCompleted = () => {
    setSelectModalDisplayState('none');
  };

  const onClickSelectBox = () => {
    setSelectModalDisplayState('flex');
  };

  const [selectedKeys, setSelectedKeys] = useState(new Set<number>([]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).map(key=>bodyPartMap.get(key)?.name ?? "--").join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const onSetSelectedKeys = (key: number) => {
    if(!bodyPartMap.has(key)) return;

    const add = !selectedKeys.has(key);

    if(add) {
      setSelectedKeys((prev)=>new Set(prev).add(key));
    } else {
      setSelectedKeys((prev)=>{
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
    
  }

  // s: input

  const [duplicateCode, setDuplicateCode] =
    useState<boolean>(true);
  // 입력 데이터 state

  // const [duplicateBusinessNumber, setDuplicateBussinessNumber] =
  // useState<boolean>(false);
  // 입력 데이터 state
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');

  const [isDisable, setIsDisable] = useState<boolean>();

  // 헬스장 이미지 state
  const [equipmentPhoto, setEquipmentPhoto] = useState<
    File | undefined
  >(undefined);
  const [equipmentPreviewPhoto, setEquipmentPreviewPhoto] =
    useState<any>('');

  const [equipmentPhotoId, setEquipmentPhotoId] = useState<number>();

  const isSameCode = () => {
    return data == undefined || data.code == code;
  }
  // 회사정보 중복관련 fnc
  const onClickDuplicateCode = async () => {

    if(data && code == data.code) {
      return;
    }

    const result: any = await duplicateEquipmentData({
      type: 'code',
      content: code,
    });
    //
    if (!result?.data || code.length < 3) {
      setModalDisplayState('flex');
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>코드명 중복 확인</span>
          <br />
          중복된 코드명 또는 사용 불가 코드명입니다.
        </div>,
      );
      setDuplicateCode(true);
    } else {
      setDuplicateCode(false);
      setModalDisplayState('flex');
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>코드명 중복 확인</span>
          <br />
          사용가능한 코드명입니다.
        </div>,
      );
    }
  };
  const onChangeDuplicateCode = () => {
    setDuplicateCode(true);
  };
  // 입력 데이터 fnc
  const onChangeName = (name: string) => {
    setName(name);
  };
  const onChangeCode = (code: string) => {
    setCode(code);
  };
  const onChangeBrandName = (brandName: string) => {
    setBrandName(brandName);
  };

  const onToggleIsDisable = ()=>{
    setIsDisable(!isDisable);
  }

  // 헬스장 이미지 fnc
  const onChangeEquipmentPhoto = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressedFile = await imageResizer(file);
      if (!compressedFile) return;
      setEquipmentPhoto(compressedFile);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = function (e) {
        setEquipmentPreviewPhoto(reader.result);
      };
    }
  };

  // e: input


  useEffect(() => {
    if(router.query && router.query.id != undefined) dataRefetch();
  }, [router.query?.id]);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setCode(data.code);
      setBrandName(data.brandName);
      setDuplicateCode(true);
      setIsDisable(data.isDisable);

      if(data.bodyParts) setSelectedKeys(new Set(data.bodyParts.map(part=>part.id as number)));

      setEquipmentPhoto(undefined);
      if(data.GymEquipmentImage && data.GymEquipmentImage[0]) {
        setEquipmentPreviewPhoto(
          data.GymEquipmentImage[0].url?.replace(/\\/g, '/').replace (/^/,`${rootUrl}/`) || ''
        );
      }

    }
  }, [data]);

  // 뒤로가기
  const onClickRouterBack = () => {
    router.back();
  };


  const onClickUpdate = async () => {
    //
    let isModified = false;
    // NOTE 코드명
    if (code === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>코드명</span>
          <br />
          코드명을 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    if (data && code != data.code && duplicateCode) {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>코드명</span>
          <br />
          코드명 중복확인을 해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }
    
    // NOTE 이름
    if (name === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>기구 이름</span>
          <br />
          이름를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    } // NOTE 브랜드
    if (brandName  === '') {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>브랜드</span>
          <br />
          브랜드를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }

    if (selectedKeys.size == 0) {
      setModalContent(
        <div css={{ textAlign: 'center' }}>
          <span css={{ fontWeight: 'bold' }}>운동부위</span>
          <br />
          운동부위를 입력해주세요.
        </div>,
      );
      setModalDisplayState('flex');
      return;
    }

    if (adminUserId && data?.id != undefined) {
      updateEquipment({
        id: data.id,
        body:{
          code,
          name,
          brandName,
          isDisable,
          bodyPartIds: Array.from(selectedKeys.values())
        }
      }).then(async (equipmentInfo:any)=>{
        const equipmentInfoId: number = equipmentInfo.data?.id ?? -1;
        if (equipmentInfoId>=0) {
          
          if (equipmentPhoto) {
  
            const form = new FormData();
            form.append('equipmentImage', equipmentPhoto);
            const result:any = await upsertEquipmentImage({
              gymEquipmentId:equipmentInfoId,
              form:form
            });
  
            if(result && result.data) {
              isModified = true;
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
    data,

    modalDisplayState,
    modalContent,
    onClickCompleted,

    selectModalDisplayState,
    onClickSelectCompleted,
    onClickSelectBox,

    onClickRouterList: () => {
      router.push(`/admin/equipment/`);
    },
    onClickSave: () => {
      console.log(data);
    },

    onClickUpdate,

    duplicateCode,
    name,
    brandName,
    code,
    isDisable,
    equipmentPreviewPhoto,

    selectedKeys,
    onSetSelectedKeys,
    selectedValue,
    bodyPartList,

    onClickDuplicateCode,
    onChangeDuplicateCode,

    isSameCode,

    onChangeName,
    onChangeCode,
    onChangeBrandName,
    onToggleIsDisable,

    onChangeEquipmentPhoto,
    onClickRouterBack,


  };
}
