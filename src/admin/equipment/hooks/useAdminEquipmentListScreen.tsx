import moment from 'moment';
import router from 'next/router';
import { useRef } from 'react';
import { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { Equipment, useFindPagingAllEquipmentsMutation, useRemoveEquipmentByAdminMutation, useRemoveEquipmentMutation } from 'src/api/equipmentsApi';
import { useTypedSelector } from 'src/store';

interface hookMember {
  // user: User[];
  // general: User[];
  // business: User[];
  tableTitle: string;
  table: Equipment[] | [];
  onClickRouterDetail: (id: number) => void;
  onClickRouteCreate: () => void;
  onClickChangeTable: (cate: string) => void;
  onClickDelete:(id:number) => void;

  page: number;
  take: number;
  totalCount: number;
  setPage: (page:number)=>void;

  searchText: string;
  searchType: string;

  onChangeSearchType: (val:string)=>void;
  onChangeSearchText: (val:string) =>void;
  onClickSearch: ()=>void;

}

export function useAdminEquipmentListScreen(): hookMember {
  // const { data: userData, refetch: userRefetch } = useFindAllUserQuery();
  const adminId = Number(useTypedSelector((state) => state.account.user?.id || -1));
  const [findPagingAllGymEquipment] = useFindPagingAllEquipmentsMutation();
  const [removeGymEquipmentByAdmin] = useRemoveEquipmentByAdminMutation();

  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);

  const adminUserId = useTypedSelector((state) => state.account.user?.id || -1);

    //***  페이징?? */
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const take: number = 10;
   
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

  
    async function changePageAndSearchUser(page: number, item?:whereQuery) {
      let where = {
        searchType: item?.searchType || searchType,
        searchText: item?.searchText || searchText,
      };
      let result: any = await findPagingAllGymEquipment({ page, take, ...where });
  
      if (result.data) {
        result = result.data;
        if(result.data?.length === 0 && page-1 > 0) {
          changePageAndSearchUser(page-1, item);
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

  useEffect(() => {
    if (equipmentData) {
      console.log('success');
      // setUser(userData);
      setTable(equipmentData);
    }
  }, [equipmentData]);

  const [tableTitle, setTableTitle] = useState<string>('user');
  const [table, setTable] = useState<Equipment[]>([]);

  return {
    tableTitle,
    table,
    onClickRouterDetail: (id: number) => {
      router.push(`/admin/equipment/${id}`);
    },
    onClickRouteCreate: () => {
      router.push(`/admin/equipment/create`);
    },
    onClickChangeTable: (cate: string) => {
      // ChangeTable(cate);
      setTableTitle(cate);
    },
    onClickDelete: async (id:number)=>{
      if(adminUserId < 0 ) return;
      if(confirm("정말 삭제하시겠습니까?")) {
        await removeGymEquipmentByAdmin({
          adminId:adminUserId,
          id:id
        });

        resetData();

      }
    },

    page,
    take,
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

  };
}

interface whereQuery {
  searchType?: string;
  searchText?: string;
}