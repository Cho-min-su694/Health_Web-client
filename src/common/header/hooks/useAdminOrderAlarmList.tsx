import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrderAlarm, useFindAllOrderAlaramsMutation, useFindOrderAlaramQuery, useUpdateViewOrderAlarmMutation } from "src/api/orderAlarmsApi";
import * as accountSlice from 'src/data/accountSlice'

interface hookMember {
    displayList:boolean;
    orderAlarmList: OrderAlarm[];
    orderAlaramCount: number;

    setOnClickOpenList: () => void;
    setOnClickCloseList: () => void;
    setOnClickGoURL:(item:OrderAlarm) => void;
    setOnClickViewed: (item:OrderAlarm) => void;
}

export function useAdminOrderAlarmList(
    userType: accountSlice.UserType | undefined
): hookMember {

    const router = useRouter();

    const [findAllOrderAlarams] = useFindAllOrderAlaramsMutation();
    const [updateViewOrderAlarm] = useUpdateViewOrderAlarmMutation();

    const [displayList, setDisplayList] = useState<boolean>(false);

    const [orderAlarmList, setOrderAlaramList] = useState<OrderAlarm[]>([]);
    const [orderAlaramCount, setOrderAlaramCount] = useState<number>(0);

    useEffect(()=>{
        refetchOrderAlarmList();
    },[userType])

    const setOnClickOpenList = ()=>{
        refetchOrderAlarmList();
        setDisplayList(true);
    }

    const setOnClickCloseList = ()=>{
        setDisplayList(false);
    }

    const setOnClickGoURL = (item:OrderAlarm) => {
        const orderTypeName = (item.orderType === 'BidTempOrder') ? '입찰' : '';
        viewdAlarm(item);
        router.push(
            `/admin/payment/detail/${
                orderTypeName
            }/${item.orderId}`
        );

        setDisplayList(false);
    }

    const setOnClickViewed = (item:OrderAlarm) => {
        viewdAlarm(item);
    }

    const viewdAlarm = async (item:OrderAlarm) => {
        if(item.id === undefined) return;

        await updateViewOrderAlarm({
            id:item.id
        });
        await refetchOrderAlarmList();
    }

    const refetchOrderAlarmList = async () => {
        const result:any = await findAllOrderAlarams();
        const orderAlarms = result.data as OrderAlarm[];
        if(orderAlarms) {
            setOrderAlaramList(orderAlarms);
            setOrderAlaramCount(orderAlarms.filter(e=>!e.isViewed).length);
        }
    }

    return {
        displayList,
        orderAlarmList,
        orderAlaramCount,

        setOnClickCloseList,
        setOnClickGoURL,
        setOnClickOpenList,
        setOnClickViewed

    };
}