import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { GymMembership, useCancelGymMembershipMutation, useExtendGymMembershipMutation, useFindPagingAllGymMembershipsMutation, useFindPagingGymMembershipsMutation } from 'src/api/gymMembershipsApi';
import { Gym, useFindGymByUserIdQuery } from 'src/api/gymsApi';
import * as accountSlice from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';

interface HookMember {
    user: accountSlice.User | undefined;
    gymData: Gym | undefined;
    gymMembershipData: GymMembership[];

    modalDisplay: 'flex' | 'none';
    onClickAcitveModal: (active: boolean) => void;

    page: number;
    take: number;
    totalCount: number;
    activeMemberCount: number;
    totalMemberCount: number;
    setPage: (page: number) => void;

    searchText: string;
    searchType: string;

    onChangeSearchType: (val: string) => void;
    onChangeSearchText: (val: string) => void;
    onClickSearch: () => void;

    onClickSetCategory: (cate: 'none' | 'enable' | 'disable') => void;

    onClickDelete: (id: number) => void;
    onClickSelect: (id:number) => void;

    onChangeExtendType: (type:string) => void;
    onChangeExtendAmount: (amount:number) => void;

    extendType:string;
    extendAmount:number;
}

export function useMembershipManageScreen(): HookMember {

    const user = useTypedSelector((state) => state.account.user);
    const router = useRouter();

    const refetchRef = useRef<any>();

    const { data: gymData, refetch: gymDataRefetch } = useFindGymByUserIdQuery({
        userId: Number(user?.id),
    }, { skip: !(user && user.id != undefined) });

    const [modalDisplay, setModalDisplay] = useState<'flex' | 'none'>('none');

    const onClickAcitveModal = (active: boolean) => {
        setModalDisplay(active ? 'flex' : 'none');
    }

    const [extendType, setExtendType] = useState<string>('MONTH');
    const [extendAmount, setExtendAmount] = useState<number>(1);

    const onChangeExtendType = (type:string) => {
        setExtendType(type);
    }

    const onChangeExtendAmount = (amount:number) => {
        setExtendAmount(amount);
    }

    const [tableCategory, setTableCategory] = useState<'none' | 'enable' | 'disable'>('none');

    //***  페이징?? */
    const [totalCount, setTotalCount] = useState<number>(0);
    const [activeMemberCount, setActiveMemberCount] = useState<number>(0);
    const [totalMemberCount, setTotalMemberCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const take: number = 10;

    const [searchType, setSearchType] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');


    const [findPagingAllGymMemberships] = useFindPagingGymMembershipsMutation();
    const [gymMembershipData, setGymMembershipData] = useState<GymMembership[]>([]);

    const [cancelGymMembership] = useCancelGymMembershipMutation();
    const [extendGymMembership] = useExtendGymMembershipMutation();

    useEffect(() => {
        setSearchType('이름');
        resetData();
    }, [gymData]);

    const resetData = async () => {
        if(!gymData?.id) return;

        let result: any = await findPagingAllGymMemberships({ gymId:gymData?.id, page, take, searchText, searchType });
        console.log(result)
        if (result.data) {
            result = result.data;
            setGymMembershipData(result.data);
            setTotalCount(result.count);
            setActiveMemberCount(result.activeCount);
            setTotalMemberCount(result.totalCount);
        }
    };

    useEffect(() => {
        if (page) changePageAndSearchUser(page);
    }, [page]);


    async function changePageAndSearchUser(page: number, item?: whereQuery) {
        if(!gymData?.id) return;

        let where = {
            searchType: item?.searchType || searchType,
            searchText: item?.searchText || searchText,
        };
        let result: any = await findPagingAllGymMemberships({ gymId:gymData?.id, page, take, ...where });

        if (result.data) {
            result = result.data;
            if (result.data?.length === 0 && page - 1 > 0) {
                changePageAndSearchUser(page - 1, item);
            } else {
                setPage(page);
                setGymMembershipData(result.data);
                setTotalCount(result.count);
                setActiveMemberCount(result.activeCount);
                setTotalMemberCount(result.totalCount);
            }
        }
    }

    const onClickSearch = async () => {
        changePageAndSearchUser(1, { searchType, searchText });
    }

    const onClickDelete = async (id: number) => {

        if (!user?.id) return;

        const result: any = await cancelGymMembership({
            membershipId: id,
            body: {
                reason: "종료",
                assignBy: user?.id

            }
        })

        if (result?.data) {
            resetData();
        }
    }

    const onClickSelect = async (id:number) => {
        if(id<=0) return;
        if (!user?.id || !gymData?.id) return;

        if(extendAmount<=0) {
            alert("추가할 날을 입력하세요");
            return;
        }

        const result: any = await extendGymMembership({
            gymId: gymData?.id,
            type:extendType,
            add:extendAmount,
            body:{
                assignBy:user?.id,
                userId:id
            }
        })

        if (result?.data) {
            setModalDisplay('none');
            resetData();
        }
    }


    return {
        user,
        gymData,
        gymMembershipData,

        modalDisplay,
        onClickAcitveModal,

        page,
        take,
        totalCount,
        setPage,

        searchText,
        searchType,

        activeMemberCount,
        totalMemberCount,

        onChangeSearchType: (val: string) => {
            setSearchType(val);
        },
        onChangeSearchText: (val: string) => {
            setSearchText(val);
        },
        onClickSearch,

        onClickSetCategory: (val) => {
            setTableCategory(val);
        },

        onClickDelete,
        onClickSelect,

        onChangeExtendAmount,
        onChangeExtendType,

        extendAmount,
        extendType
    }
}

interface whereQuery {
    searchType?: string;
    searchText?: string;
}