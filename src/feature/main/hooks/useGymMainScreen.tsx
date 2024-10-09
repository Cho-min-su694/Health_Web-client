import { useEffect, useRef, useState } from "react";
import { GymEquipmentUserHistory, useCreateGymEquipmentUserHistoryMutation, useEndGymEquipmentUserHistoryByUserIdMutation, useFindGymEquipmentUserHistoryByGymIdQuery, useFindValidGymEquipmentUserHistoryQuery } from "src/api/equipmentsApi";
import { GymAccessHistory, GymMembership, useCreateGymAccessHistoryMutation, useExitGymMutation, useFindGymMembershipByUserIdQuery, useFindValidGymAccessHistoryQuery, useUpdateGymAccessHistoryMutation } from "src/api/gymMembershipsApi";
import { Gym, useFindGymByUserIdQuery } from "src/api/gymsApi"
import { User } from "src/api/usersApi"
import { getCalculatedEndDay } from "src/common/gymFunction";
import { rootUrl } from "src/util/constants/app";

interface hookMember {
    gymMembership: GymMembership | undefined
    gymAccessHistory: GymAccessHistory | undefined
    myEquipmentHistory: GymEquipmentUserHistory | undefined,

    equipmentHistoryMap: Map<number, number[]> | undefined

    gymPreviewPhoto: any;

    timer: number;
    equipmentTimer: number;

    onClickAccessGym: () => void;
    onClickExitGym: () => void;

    refetchEquipmentsRef: any;

    daysLeft: number | undefined;

    onClickEndEquipment: () => void;
    onClickUseEquipment: (gymEuquipmentsOnGymsId: number | undefined) => void;
}

export default function useGymMainScreen({
    user
}: {
    user: User
}): hookMember {

    const [gymPreviewPhoto, setGymPreviewPhoto] = useState<any>(null);

    const { data: gymMembershipList, refetch: refetchGymMembershipList } = useFindGymMembershipByUserIdQuery({ userId: user.id as number }, { skip: !(user?.id) })

    const [gymMembership, setGymMebmership] = useState<GymMembership>();

    const { data: gymAccessHistory, refetch: refetchGymAccessHistory } = useFindValidGymAccessHistoryQuery({ userId: user.id as number, gymId: gymMembership?.gymId as number }, { skip: !(user.id && gymMembership?.gymId) });

    const [exitGym] = useExitGymMutation();

    const [createGymAccessHistory] = useCreateGymAccessHistoryMutation();

    const [timer, setTimer] = useState<number>(0);

    const [equipmentTimer, setEquipmentTimer] = useState<number>(0);

    const [daysLeft, setDaysLeft] = useState<number>();

    const { data: myEquipmentHistory, refetch: refetchMyEquipmentHistory } = useFindValidGymEquipmentUserHistoryQuery({ userId: user.id as number, gymId: gymMembership?.gymId as number }, { skip: !(user.id && gymMembership?.gymId) });
    const { data: equipmentHistoryList, refetch: refetchEquipmentHistoryList } = useFindGymEquipmentUserHistoryByGymIdQuery({ gymId: gymMembership?.gymId as number }, { skip: !(gymMembership?.gymId) });

    const [equipmentHistoryMap, setEquipmentHistroyMap] = useState<Map<number, number[]>>();

    const [createGymEquipmentUserHistory] = useCreateGymEquipmentUserHistoryMutation();
    const [endGymEquipmentUserHistoryByUserId] = useEndGymEquipmentUserHistoryByUserIdMutation();

    useEffect(() => {
        if (user?.id && gymMembershipList && gymMembershipList.length > 0) {
            setGymMebmership(gymMembershipList[0]);
            settingDaysLeft(gymMembershipList[0], gymMembershipList, user.id);
        }
    }, [gymMembershipList])

    useEffect(() => {
        if (gymMembership?.Gym?.GymImage && gymMembership?.Gym.GymImage[0]) {
            setGymPreviewPhoto(gymMembership.Gym.GymImage[0].url?.replace(/^/, `${rootUrl}/`) || '')
        }
    }, [gymMembership])

    useEffect(() => {
        if (!gymAccessHistory) return;

        setTimer(new Date().getTime() - new Date(gymAccessHistory.entryAt).getTime());

        const intervalID = setInterval(() => {
            setTimer((prevTimeLeft) => prevTimeLeft + 1000) // 1초마다 시간 감소
        }, 1000)

        return () => {
            clearInterval(intervalID);
        }
    }, [gymAccessHistory])

    useEffect(() => {
        if (!myEquipmentHistory) return;

        setEquipmentTimer(new Date().getTime() - new Date(myEquipmentHistory.usedAt).getTime());

        const intervalID = setInterval(() => {
            setEquipmentTimer((prevTimeLeft) => prevTimeLeft + 1000) // 1초마다 시간 감소
        }, 1000)

        return () => {
            clearInterval(intervalID);
        }
    }, [myEquipmentHistory])

    useEffect(() => {
        if (equipmentHistoryList) {
            const iter = equipmentHistoryList.reduce<[number, number[]][]>((acc: [number, number[]][], cur) => {
                if (cur.GymEuquipmentsOnGyms == undefined || cur.GymEuquipmentsOnGyms.gymEquipmentId == undefined) return acc;

                const equipmentId = cur.GymEuquipmentsOnGyms.gymEquipmentId;

                const targetAcc = acc.find(v => v[0] == equipmentId);
                if (targetAcc) {
                    targetAcc[1].push(cur.gymEuquipmentsOnGymsId);
                } else {
                    acc.push([equipmentId, [cur.gymEuquipmentsOnGymsId]])
                }
                return acc;
            }, []);
            setEquipmentHistroyMap(new Map(
                iter
            ));
        }
    }, [equipmentHistoryList])

    useEffect(()=>{
        if(gymMembership) {
            const intervalID = setInterval(() => {
                refetchEquipmentHistoryList();
            }, 5000)
    
            return () => {
                clearInterval(intervalID);
            }
        }
    },[gymMembership])

    const onClickAccessGym = async () => {
        if (!gymMembership || gymAccessHistory) return;

        if (!gymMembership.gymId || !user.id) return;

        const result: any = await createGymAccessHistory({ gymId: gymMembership.gymId, body: { userId: user.id } });

        if (result?.data) {
            refetchGymAccessHistory();
            refetchEquipmentHistoryList();
        }
    }

    const onClickExitGym = async () => {
        if (!gymMembership || !gymAccessHistory) return;

        if (!gymAccessHistory.id) return;

        const result: any = await exitGym({ id: gymAccessHistory.id });

        if (result?.data) {
            refetchGymAccessHistory();
            refetchMyEquipmentHistory();
        }
    }

    const settingDaysLeft = (memberShip: GymMembership, membershipList: GymMembership[], userId: number) => {
        const endDay = getCalculatedEndDay(membershipList, userId, memberShip.gymId)

        if (!endDay) {
            setDaysLeft(undefined);
            return;
        }
        const msDiff = (new Date(endDay).getTime() - new Date().getTime());
        setDaysLeft(Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
    }

    const onClickEndEquipment = async () => {
        if (!user?.id) return;
        const result = await endGymEquipmentUserHistoryByUserId({ userId: user.id });

        refetchMyEquipmentHistory();
        refetchEquipmentHistoryList();
    }

    const onClickUseEquipment = async (gymEuquipmentsOnGymsId: number | undefined) => {
        if(!gymEuquipmentsOnGymsId) return;
        if (!user?.id) return;
        const result: any = await createGymEquipmentUserHistory({ gymEuquipmentsOnGymsId, userId: user?.id });

        if (result.error) {
            alert(result.error.data?.message);
        }


        refetchMyEquipmentHistory();
        refetchEquipmentHistoryList();
    }


    const refetchEquipmentsRef = useRef<any>();

    return {
        gymMembership,
        gymAccessHistory,
        myEquipmentHistory: myEquipmentHistory,
        equipmentHistoryMap,

        gymPreviewPhoto,

        timer,
        equipmentTimer,

        onClickAccessGym,
        onClickExitGym,
        refetchEquipmentsRef,

        daysLeft,

        onClickEndEquipment,
        onClickUseEquipment
    }
}