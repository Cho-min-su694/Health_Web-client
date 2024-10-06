import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Equipment, useFindEquipmentsOnGymsQuery, useRegisterEquipmentsOnGymsMutation, useSetDisableGymEquipmentsOnGymsMutation } from 'src/api/equipmentsApi';
import { useGetTestQuery } from 'src/api/examplesApi';
import { Gym, useFindGymByUserIdQuery, useFindGymQuery } from 'src/api/gymsApi';
import * as accountSlice from 'src/data/accountSlice';
import { EquipmentCollection } from 'src/feature/equipment/hooks/useEquipmentsOnGymListScreen';
import { useTypedSelector } from 'src/store';
import { redirectUrl, rootUrl } from 'src/util/constants/app';

interface HookMember {
    user: accountSlice.User | undefined;
    gymData: Gym | undefined;
    onClickDelete: (data: EquipmentCollection) => void;

    modalDisplay: 'flex' | 'none';
    onClickAcitveModal: (active: boolean) => void;
    onSelectEquipment: (equipment: Equipment) => void;
    bindRefetchData:(event:()=>void)=>void;
}

export function useEquipmentManageScreen(): HookMember {
    const user = useTypedSelector((state) => state.account.user);
    const router = useRouter();

    const { data: gymData, refetch: gymDataRefetch } = useFindGymByUserIdQuery({
        userId: Number(user?.id),
    }, { skip: !(user && user.id != undefined) });

    const [refetchData, setRefetchData] = useState<()=>void>();

    const [setDisableEquipmentsOnGyms] = useSetDisableGymEquipmentsOnGymsMutation();

    const [registerEquipmentOnGym] = useRegisterEquipmentsOnGymsMutation();

    const dispatch = useDispatch<Dispatch<any>>();

    const onClickDelete = (data: EquipmentCollection) => {
        if (data.idList.length == 0) return;
        const result = setDisableEquipmentsOnGyms({ id: data.idList[0], isDisable: true });


        result.then((data)=>{
            setModalDisplay('none');
            refetchData?.();
        })
    }

    const [modalDisplay, setModalDisplay] = useState<'flex' | 'none'>('none');

    const onClickAcitveModal = (active: boolean) => {
        setModalDisplay(active ? 'flex' : 'none');
    }

    const onSelectEquipment = (equipment: Equipment) => {
        if (gymData?.id == undefined || user?.id == undefined || equipment?.id == undefined) return;
        const result = registerEquipmentOnGym({
            gymId: gymData.id,
            body: {
                equipmentIds: [equipment.id],
                assingBy: user.id
            }
        });

        result.then((data)=>{
            setModalDisplay('none');
            refetchData?.();
        })

    }

    useEffect(() => {
        let sessionUserData = sessionStorage.getItem('userData');
        if (sessionUserData) {
            let userData: { user: accountSlice.User; accessToken: string } =
                JSON.parse(sessionUserData);
            if (userData.user.userType === 'BUSINESS') {
                dispatch(accountSlice.saveUserDataInSession(userData));
            } else {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, []);

    const bindRefetchData = (event:()=>void) => {
        setRefetchData(event);
    }

    useEffect(() => {
        if(user?.id) gymDataRefetch();
    }, [user]);

    return {
        user,
        gymData,
        onClickDelete,
        modalDisplay,
        onClickAcitveModal,
        onSelectEquipment,

        bindRefetchData
    };
}
