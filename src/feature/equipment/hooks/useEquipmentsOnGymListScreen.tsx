import { useEffect, useState } from "react";
import { Equipment, GymEuquipmentsOnGyms, useFindEquipmentsOnGymsQuery } from "src/api/equipmentsApi"

export interface EquipmentCollection {
    equipment: Equipment,
    idList: number[]
}

interface hookMember {
    equipmentsCollection: EquipmentCollection[];

    page: number;
    take: number;
    totalCount: number;
    setPage: (page: number) => void;
}

export function useEquipmentsOnGymListScreen({
    gymId,
    takeCount,
    bindRefetchData
}: {
    gymId: number;
    takeCount: number;
    bindRefetchData:(event:()=>void)=>void;
}): hookMember {

    const { data: equipmentsData, refetch: refetchEquipmentsOnGyms } = useFindEquipmentsOnGymsQuery({ gymId, isDisable:false });

    const [equipmentsCollection, setEquipmentsCollection] = useState<EquipmentCollection[]>([]);

    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const take: number = takeCount;

    useEffect(() => {
        if(equipmentsData == undefined) return;
        const collection = equipmentsData?.reduce<EquipmentCollection[]>((acc: EquipmentCollection[], cur, index, array) => {
            if(cur.id == undefined) return acc;
            const { gymEquipmentId } = cur;
            const ele = acc.find(value => value.equipment.id == gymEquipmentId);
            if (ele) ele.idList.push(cur.id);
            else if (cur.GymEquipment) acc.push({
                equipment: cur.GymEquipment,
                idList: [cur.id]
            })
            return acc;
        }, []) ?? [];
        setEquipmentsCollection(collection);
        setTotalCount(collection.length);
    }, [equipmentsData])

    const refetchData = ()=> {
        refetchEquipmentsOnGyms();
        console.log('refetchData');
    }

    useEffect(()=>{
        bindRefetchData(refetchData);
        console.log('ready refetchData');
    },[]);


    return {
        equipmentsCollection,

        page,
        take,
        setPage,
        totalCount,
    }
}