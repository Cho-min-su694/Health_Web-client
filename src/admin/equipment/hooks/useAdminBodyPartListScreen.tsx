import { useEffect, useState } from "react";
import { BodyPart, useCreateBodyPartMutation, useFindAllBodyPartsQuery, useRemoveBodyPartMutation, useUpdateBodyPartMutation } from "src/api/bodyPartsApi";
import { useRemoveUserByAdminMutation } from "src/api/usersApi";

interface hookMember {
    detailDisplayState: 'flex' | 'none';
    confirmModalDisplayState: 'flex' | 'none';
    confirmModalContent: any;

    modifyData: Map<string,any>;

    isModifyAction:boolean;

    bodyParts:BodyPart[];

    confirmModalCloseBtn: () => void;
    confirmModalConfirmBtn: () => void;
    onClickDetailModal: () => void;

    onChangeModifyData: (data:Map<string,any>)=>void;
    onClickCreate: () => void;
    onClickUpdateDetail: (data: BodyPart) => void;
    onClickDelete: (id:number) => void;
}

export function useAdminBodyPartListScreen(): hookMember {


    const [confirmModalDisplayState, setConfirmModalDisplayStae] = useState<
        'flex' | 'none'
    >('none');
    const [confirmModalContent, setConfirmModalContent] = useState<any>();
    const [confirmModalConfirmBtn, setConfirmModalConfirmBtn] = useState<
        () => void
    >(() => {
        //
    });

    const [modifyData, setModifyData] = useState<Map<string, any>>(new Map());

    const [isModifyAction, setIsModifyAction] = useState<boolean>(false);

    const [detailDisplayState, setDetailDisplayState] = useState<'flex' | 'none'>(
        'none',
    );

    const { data: bodyParts, refetch: bodyPartsRefetch } =
    useFindAllBodyPartsQuery();

    const confirmModalCloseBtn = () => {
        setConfirmModalDisplayStae('none');
    };

    const [removeBodyPartMutaion] = useRemoveBodyPartMutation();
    const [updateBodyPartMutaion] = useUpdateBodyPartMutation();
    const [createBodyPartMutaion] = useCreateBodyPartMutation();

    const onClickDetailModal = () => {
        if (detailDisplayState === 'flex') {
            setDetailDisplayState('none');
        } else {
            setDetailDisplayState('flex');
        }
    };

    const onChangeModifyData = async (data:Map<string,any>) => {
        const dataProps = Object.fromEntries(data.entries());

        let newData:any;
        if(isModifyAction) {
            newData = await updateBodyPartMutaion({
                id:dataProps.id as number,
                body: {
                    name: dataProps.name,
                    code: dataProps.code,
                    category: dataProps.category
                }
            });
    
        } else {
            newData = await createBodyPartMutaion({
                body: {
                    name: dataProps.name,
                    code: dataProps.code,
                    category: dataProps.category
                }
            });

        }

        console.log(newData);

        if(newData && !newData.error) {
            bodyPartsRefetch();
            setDetailDisplayState('none');
        } else if(newData.error?.data?.message) {
            alert(newData.error.data.message);
        } else {
            alert('알수 없는 오류가 발생했습니다.');
        }


    }

    const onClickUpdateDetail = (data: BodyPart) => {
        const objectToMap = new Map(Object.entries(data))

        setIsModifyAction(true);
        setModifyData(objectToMap);
        setDetailDisplayState('flex');
    }

    const onClickCreate = () => {
        const emptyBodyPart:BodyPart = {
            name: '',
            code: '',
            category: ''
        };
        const objectToMap = new Map(Object.entries(emptyBodyPart));

        setIsModifyAction(false);
        setModifyData(objectToMap);
        setDetailDisplayState('flex');
    }

    const onClickDelete = async (id:number) => {

        setConfirmModalContent(<div>운동 부위를 삭제하시겠습니까?</div>);
        setConfirmModalConfirmBtn(() => async () => {
          const result: any = await removeBodyPartMutaion({ id });
          if (!result?.data) return;
          bodyPartsRefetch();
          setConfirmModalDisplayStae('none');
        });
    
        setConfirmModalDisplayStae('flex');

    }

    return {
        detailDisplayState,
        confirmModalDisplayState,
        confirmModalContent,

        modifyData,

        isModifyAction,

        bodyParts: bodyParts || [],

        confirmModalCloseBtn,
        confirmModalConfirmBtn,
        onClickDetailModal,

        onChangeModifyData,
        onClickCreate,
        onClickUpdateDetail,
        onClickDelete
    }
}