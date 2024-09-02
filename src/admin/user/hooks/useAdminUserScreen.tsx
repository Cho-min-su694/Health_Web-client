import moment from 'moment';
import router from 'next/router';
import { useRef } from 'react';
import { RefObject } from 'react';
import { useEffect, useState } from 'react';
import {
  User,
  useFindAllUserQuery,
  useFindUserByTypeQuery,
  useFindAdminAllUsersMutation,
  useRemoveUserByAdminMutation,
  UserType,
} from 'src/api/usersApi';
import { setUser } from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';

interface hookMember {
  // user: User[];
  // general: User[];
  // business: User[];
  tableTitle: string;
  table: User[] | [];
  onClickRouterDetail: (id: number) => void;
  onClickRouteCreate: () => void;
  onClickChangeTable: (cate: string) => void;

  page: number;
  take: number;
  totalCount: number;
  setPage: (page:number)=>void;

  searchText: string;
  searchType: string;
  userType: UserType|'전체';

  onClickRemoveUser: (id:number)=>void;
  onClickCheckItem: (notice: User) => void;
  onClickCheckAll: () => void;
  onClickDeleteChecked: () => void;
  deleteUserArray: User[];

  userTypeCount: {[key:string]:number};

  onChangeSearchType: (val:string)=>void;
  onChangeSearchText: (val:string) =>void;
  onClickSearch: ()=>void;
  onClickReset:()=>void;
  onClickUserType: (item:SearchUserType) =>void;

}

export function useAdminUserScreen(): hookMember {
  // const { data: userData, refetch: userRefetch } = useFindAllUserQuery();
  const adminId = Number(useTypedSelector((state) => state.account.user?.id || -1));
  const [findAdminAllUser] = useFindAdminAllUsersMutation();
  const [removeUserByAdmin] = useRemoveUserByAdminMutation();

  const [userData, setUserData] = useState<User[]>([]);

  const [userTypeCount, setUserTypeCount] = useState<{[key:string]:number}>({});
  // const { data: generalData } = useFindUserByTypeQuery({ userType: 'GENERAL' });
  // const { data: businessData } = useFindUserByTypeQuery({
  //   userType: 'BUSINESS',
  // });


    //***  페이징?? */
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const take: number = 10;
   
    const [userType, setUserType] = useState<SearchUserType>('전체');
    const [searchType, setSearchType] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
  
    useEffect(() => {
      setSearchType('닉네임');
      resetData();
    }, []);
  
    const resetData = async () => {
      let result: any = await findAdminAllUser({ page, take });
      console.log(result)
      if (result.data) {
        result = result.data;
        setUserData(result.data);
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
        userType: item?.userType || userType,
        searchType: item?.searchType || searchType,
        searchText: item?.searchText || searchText,
      };
      let result: any = await findAdminAllUser({ page, take, ...where });
  
      if (result.data) {
        result = result.data;
        if(result.data?.length === 0 && page-1 > 0) {
          changePageAndSearchUser(page-1, item);
        } else {
          setPage(page);
          setUserData(result.data);
          setTotalCount(result.count);
          setUserTypeCount(result.userCount);
        }
      }
    }

    const onClickUserType = async (userType: SearchUserType) => {
      setUserType(userType);
  
      changePageAndSearchUser(1, { userType });
    };

    const onClickSearch = async () => {
      changePageAndSearchUser(1, { searchType, searchText });
    }

    const onClickReset = () => {
      setUserType('전체');
    };

    //***페이징 */

  useEffect(() => {
    if (userData) {
      console.log('success');
      // setUser(userData);
      setTable(userData);
    }
  }, [userData]);

  const [tableTitle, setTableTitle] = useState<string>('user');
  const [table, setTable] = useState<User[]>([]);

  const [deleteUserArray, setDeleteUserArray] = useState<User[]>([]);

  // const ChangeTable = (cate: string) => {
  //   if (cate === 'user') {
  //     setTable(user);
  //   } else if (cate === 'general') {
  //     setTable(general);
  //   } else if (cate === 'business') {
  //     setTable(business);
  //   }
  // };

  const onClickCheckAll = () => {
    const array: User[] = [];
    if (table) {
      if (deleteUserArray.length === table.length) {
        setDeleteUserArray([]);
      } else {
        table?.map((item, index) => {
          array.push(item);
        });
        setDeleteUserArray(array);
      }
    }
  };

  const onClickCheckItem = (user: User) => {
    if(user.userType==='GENERAL' ||
      user.userType === 'MANAGER' ||
      user.userType ==='ADMIN'
    ) return;

    const clone = [...deleteUserArray];
    console.log(clone.includes(user));
    if (clone.includes(user)) {
      const idx = clone.indexOf(user);
      if (idx > -1) clone.splice(idx, 1);
    } else {
      clone.push(user);
    }
    setDeleteUserArray(clone);
  };

  const onClickDeleteChecked = async () => {
    console.log(deleteUserArray);
    
    await Promise.all(
      deleteUserArray.map(async (item, index) => {
        if(item.userType==='GENERAL' ||
          item.userType === 'MANAGER' ||
          item.userType ==='ADMIN'
        ) return;
        console.log(item.nickname);
        if(item.id) await removeUserByAdmin({adminId: adminId, id: item.id });
      }),
    );
    setDeleteUserArray([]);
    // noticeRefetch();
    if (page) changePageAndSearchUser(page);
  };

  return {
    // user,
    // general,
    // business,
    tableTitle,
    table,
    onClickRouterDetail: (id: number) => {
      router.push(`/admin/user/${id}`);
    },
    onClickRouteCreate: () => {
      router.push(`/admin/user/create`);
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
    userType,

    onClickCheckItem,
    onClickCheckAll,
    onClickDeleteChecked,
    deleteUserArray,
    onClickRemoveUser: async (id: number) => {
      await removeUserByAdmin({ adminId, id });
      // noticeRefetch();
      if (page) changePageAndSearchUser(page);
    },
    onClickUserType,
    onChangeSearchType: (val: string) => {
      setSearchType(val);
    },
    onChangeSearchText: (val: string) => {
      setSearchText(val);
    },
    onClickReset,
    onClickSearch,


    userTypeCount,
  };
}

interface whereQuery {
  userType?: UserType|'전체';
  searchType?: string;
  searchText?: string;
}

export type SearchUserType = UserType | '전체';

export const SearchUserTypeArray: SearchUserType[] = [
  '전체',
  'ADMIN',
  'MANAGER',
  'GENERAL'
];