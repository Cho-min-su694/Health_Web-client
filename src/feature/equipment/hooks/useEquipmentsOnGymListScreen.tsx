import { useEffect, useState } from "react";
import { useFindAllBodyPartsQuery, useFindBodyPartCategoriesQuery } from "src/api/bodyPartsApi";
import { Equipment, GymEuquipmentsOnGyms, useFindEquipmentsOnGymsQuery } from "src/api/equipmentsApi"

export interface EquipmentCollection {
    equipment: Equipment,
    idList: number[]
}

interface hookMember {
    equipmentsCollection: EquipmentCollection[];
    dataList: EquipmentCollection[];

    page: number;
    take: number;
    totalCount: number;
    setPage: (page: number) => void;
    refetchData: ()=>void;

    bodyPartCategory:string;
    onChangeBodyPartCategory:(category:string)=>void;
    bodyPartCategoryList:string[];
}

export function useEquipmentsOnGymListScreen({
    gymId,
    takeCount,
}: {
    gymId: number;
    takeCount: number;
}): hookMember {

    const { data: equipmentsData, refetch: refetchEquipmentsOnGyms } = useFindEquipmentsOnGymsQuery({ gymId, isDisable:false });

    const [equipmentsCollection, setEquipmentsCollection] = useState<EquipmentCollection[]>([]);

    const [dataList, setDataList] = useState<EquipmentCollection[]>([]);

    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const take: number = takeCount;

    const {data:categoryList} = useFindBodyPartCategoriesQuery();

    const [bodyPartCategory, setBodyPartCategory] = useState<string>('전체');

    const [bodyPartCategoryList, setBodyPartCategoryList] = useState<string[]>([]);

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

    useEffect(()=>{
        if(equipmentsCollection.length > 0) {
            const filter = bodyPartCategory != '전체'? equipmentsCollection.filter(v=>v.equipment.bodyParts?.find(b=>b.category==bodyPartCategory)) : equipmentsCollection;
            setTotalCount(filter.length);
            setDataList(filter.slice(page * takeCount, (page + 1) * takeCount))
        }
    }, [page, takeCount, bodyPartCategory, equipmentsCollection])

    useEffect(()=>{
        if(categoryList) {
            const list = ['전체']
            setBodyPartCategoryList(list.concat(categoryList.map(cate=>cate.category)));
        }
    },[categoryList]);

    const refetchData = ()=> {
        refetchEquipmentsOnGyms();
        console.log('refetchData');
    }

    const onChangeBodyPartCategory = (category:string) => {
        setBodyPartCategory(category);
    }

    useEffect(()=>{
        console.log('ready refetchData');
    },[]);


    return {
        equipmentsCollection,
        dataList,

        page,
        take,
        setPage,
        totalCount,
        refetchData,
        
        bodyPartCategory,
        onChangeBodyPartCategory,
        
        bodyPartCategoryList
    }
}