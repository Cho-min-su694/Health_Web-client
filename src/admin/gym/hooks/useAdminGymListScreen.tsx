import moment from 'moment';
import router from 'next/router';
import { useRef } from 'react';
import { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { Gym, useFindAdminAllGymsMutation, useRemoveGymByAdminMutation } from 'src/api/gymsApi';
import { useFindAdminAllUsersMutation } from 'src/api/usersApi';
import { setUser } from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';

interface hookMember {
  // user: User[];
  // general: User[];
  // business: User[];
  tableTitle: string;
  table: Gym[] | [];
  onClickRouterDetail: (id: number) => void;
  onClickRouteCreate: () => void;
  onClickChangeTable: (cate: string) => void;

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

export function useAdminGymListScreen(): hookMember {
  // const { data: userData, refetch: userRefetch } = useFindAllUserQuery();
  const adminId = Number(useTypedSelector((state) => state.account.user?.id || -1));
  const [findAdminAllGym] = useFindAdminAllGymsMutation();
  const [removeGymByAdmin] = useRemoveGymByAdminMutation();

  const [gymData, setGymData] = useState<Gym[]>([]);

  const [userTypeCount, setUserTypeCount] = useState<{[key:string]:number}>({});
  // const { data: generalData } = useFindUserByTypeQuery({ userType: 'GENERAL' });
  // const { data: businessData } = useFindUserByTypeQuery({
  //   userType: 'BUSINESS',
  // });


    //***  페이징?? */
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const take: number = 10;
   
    const [searchType, setSearchType] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
  
    useEffect(() => {
      setSearchType('헬스장명');
      resetData();
    }, []);
  
    const resetData = async () => {
      let result: any = await findAdminAllGym({ page, take });
      console.log(result)
      if (result.data) {
        result = result.data;
        setGymData(result.data);
        setTotalCount(result.count);
      }
    };
  
    useEffect(() => {
      if (page) changePageAndSearchUser(page);
    }, [page]);

    useEffect(() => {
      console.log(userTypeCount,'hey')
    }, [userTypeCount]);
  
    async function changePageAndSearchUser(page: number, item?:whereQuery) {
      let where = {
        searchType: item?.searchType || searchType,
        searchText: item?.searchText || searchText,
      };
      let result: any = await findAdminAllGym({ page, take, ...where });
  
      if (result.data) {
        result = result.data;
        if(result.data?.length === 0 && page-1 > 0) {
          changePageAndSearchUser(page-1, item);
        } else {
          setPage(page);
          setGymData(result.data);
          setTotalCount(result.count);
          setUserTypeCount(result.userCount);
        }
      }
    }

    const onClickSearch = async () => {
      changePageAndSearchUser(1, { searchType, searchText });
    }
    //***페이징 */

  useEffect(() => {
    if (gymData) {
      console.log('success');
      // setUser(userData);
      setTable(gymData);
    }
  }, [gymData]);

  const [tableTitle, setTableTitle] = useState<string>('user');
  const [table, setTable] = useState<Gym[]>([]);

  return {
    tableTitle,
    table,
    onClickRouterDetail: (id: number) => {
      router.push(`/admin/gym/${id}`);
    },
    onClickRouteCreate: () => {
      router.push(`/admin/gym/create`);
    },
    onClickChangeTable: (cate: string) => {
      // ChangeTable(cate);
      setTableTitle(cate);
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