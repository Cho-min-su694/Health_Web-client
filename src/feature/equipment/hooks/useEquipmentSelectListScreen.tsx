import { useEffect, useState } from "react";
import { Equipment, useFindPagingAllEquipmentsMutation } from "src/api/equipmentsApi"

interface HookMember {

    table: Equipment[] | [];
    onClickSelect:(id:Equipment) => void;
  
    page: number;
    totalCount: number;
    setPage: (page:number)=>void;
  
    searchText: string;
    searchType: string;
  
    onChangeSearchType: (val:string)=>void;
    onChangeSearchText: (val:string) =>void;
    onClickSearch: ()=>void;
}

export function useEquipmentSelectListScreen({
    setEquipment,
    take
}:{
    setEquipment:(data:Equipment) => void;
    take:number;
}): HookMember {

    const [findPagingAllGymEquipment] = useFindPagingAllEquipmentsMutation();

    const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);

    //***  페이징?? */
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const [searchType, setSearchType] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        setSearchType('이름');
        resetData();
    }, []);

    const resetData = async () => {
        let result: any = await findPagingAllGymEquipment({ page, take });
        console.log(result)
        if (result.data) {
            result = result.data;
            setEquipmentData(result.data);
            setTotalCount(result.count);
        }
    };

    useEffect(() => {
        if (page) changePageAndSearchUser(page);
    }, [page]);


    async function changePageAndSearchUser(page: number, item?: whereQuery) {
        let where = {
            searchType: item?.searchType || searchType,
            searchText: item?.searchText || searchText,
        };
        let result: any = await findPagingAllGymEquipment({ page, take, ...where, isDisable:false });

        if (result.data) {
            result = result.data;
            if (result.data?.length === 0 && page - 1 > 0) {
                changePageAndSearchUser(page - 1, item);
            } else {
                setPage(page);
                setEquipmentData(result.data);
                setTotalCount(result.count);
            }
        }
    }

    const onClickSearch = async () => {
        changePageAndSearchUser(1, { searchType, searchText });
    }
    //***페이징 */

    const onClickSelect = (data:Equipment) => {
        setEquipment(data)
    }

    useEffect(() => {
        if (equipmentData) {
            setTable(equipmentData);
        }
    }, [equipmentData]);

    const [table, setTable] = useState<Equipment[]>([]);

    return {
        table,

        page,
        totalCount,
        setPage,

        searchText,
        searchType,

        onChangeSearchType: (val: string) => {
            setSearchType(val);
        },
        onChangeSearchText: (val: string) => {
            setSearchText(val);
        },
        onClickSearch,

        onClickSelect,
    }
}

interface whereQuery {
    searchType?: string;
    searchText?: string;
}