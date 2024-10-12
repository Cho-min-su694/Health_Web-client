import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useFindGymEquipmentUserHistoryByGymIdQuery } from "src/api/equipmentsApi";
import { Gym, useFindGymQuery, useFindPublicGymsQuery } from "src/api/gymsApi";
import { rootUrl } from "src/util/constants/app";

interface HookMember {
    gymData: Gym | undefined;
    equipmentHistoryMap: Map<number, number[]> | undefined;

    gymPreviewPhoto: any;
    refetchEquipmentsRef:any;

    onClickSignin: ()=>void;
}

export default function useGymIntroScreen({
    gymId
}: {
    gymId: number
}): HookMember {

    const { data: gymData, refetch: refetchGymData } = useFindPublicGymsQuery({ id: gymId });

    const [gymPreviewPhoto, setGymPreviewPhoto] = useState<any>(null);

    const [equipmentHistoryMap, setEquipmentHistroyMap] = useState<Map<number, number[]>>();

    const { data: equipmentHistoryList, refetch: refetchEquipmentHistoryList } = useFindGymEquipmentUserHistoryByGymIdQuery({ gymId: gymId});

    const router = useRouter();

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

    useEffect(() => {
        if (gymData && gymData?.GymImage) {
            setGymPreviewPhoto(gymData.GymImage[0].url?.replace(/^/, `${rootUrl}/`) || '')
        }
    }, [gymData])

    const refetchEquipmentsRef = useRef<any>();

    const onClickSignin = () => {
        router.push('/login');
    }
    return {
        gymData,
        gymPreviewPhoto,
        equipmentHistoryMap,
        refetchEquipmentsRef,
        onClickSignin
    }
}