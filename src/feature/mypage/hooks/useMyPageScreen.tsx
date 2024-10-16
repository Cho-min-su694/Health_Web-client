import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFindSpecGymEquipmentUserHistoryQuery, useFindValidGymEquipmentUserHistoryQuery } from 'src/api/equipmentsApi';
import { useGetTestQuery } from 'src/api/examplesApi';
import { GymMembership, useFindGymAccessHistoryListQuery, useFindGymMembershipByUserIdQuery, useFindUserGymMembershipQuery, useFindValidGymAccessHistoryQuery } from 'src/api/gymMembershipsApi';
import { Gym, useFindAllGymsQuery, useFindTestGymQuery } from 'src/api/gymsApi';
import { dateFormater } from 'src/common/gymFunction';
import * as accountSlice from 'src/data/accountSlice';
import { useTypedSelector } from 'src/store';
import { redirectUrl, rootUrl } from 'src/util/constants/app';

interface HookMember {
  user: accountSlice.User | undefined;
  onClickLogout(): void;
  onClickBack(): void;
  onClickDate: (arg: { date: Date }) => void;

  calanderEvents: ICalendarElement[];
  calendarContent:string[];
}

interface ICalendarElement {
  title: string,
  start: string,
  end: string,
  color: string,
}

const membershipColor = '#789DBC';
const equipmentColor = '#FFE3E3';
const accessColor = '#C9E9D2';

export function useMyPageScreen(): HookMember {
  const user = useTypedSelector((state) => state.account.user);
  const router = useRouter();

  const dispatch = useDispatch<Dispatch<any>>();

  const [gymId, setGymId] = useState<number>();

  const { data: gymMembershipList, refetch: refetchGymMembershipList } = useFindUserGymMembershipQuery({ userId: user?.id as number, gymId: gymId ?? -1, all: true }, { skip: !(user?.id && gymId != undefined) })
  const { data: gymEquipmentHistoryList, refetch: refetchGymEquipmentHistoryList } = useFindSpecGymEquipmentUserHistoryQuery({ userId: user?.id as number, gymId: gymId ?? -1 }, { skip: !(user?.id && gymId != undefined) })
  const { data: gymAccessHistoryList, refetch: refetchGymAccessHistoryList } = useFindGymAccessHistoryListQuery({ userId: user?.id as number, gymId: gymId ?? -1 }, { skip: !(user?.id && gymId != undefined) })

  const [calanderEvents, setCalanderEvents] = useState<ICalendarElement[]>([]);

  const [calendarContent, setCalendarContent] = useState<string[]>([]);

  const [dateMap, setDateMap] = useState<Map<string, ICalendarElement[]>>(new Map());

  useEffect(() => {
    let sessionUserData = sessionStorage.getItem('userData');
    if (sessionUserData) {
      let userData: { user: accountSlice.User; accessToken: string } =
        JSON.parse(sessionUserData);

      dispatch(accountSlice.saveUserDataInSession(userData));
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (gymAccessHistoryList && gymEquipmentHistoryList && gymMembershipList) {
      const membershipElements: ICalendarElement[] = [];
      gymMembershipList.forEach(membership => {
        if (!membership) return;
        const endDay = dateFormater('yyyy-MM-DD', new Date(membership.endDay));
        const startDay = dateFormater('yyyy-MM-DD', new Date(membership.startDay));

        const prev = membershipElements.find(e => e.start == endDay);

        if (prev) {
          prev.start = startDay;
        } else {
          membershipElements.push({
            title: '멤버쉽',
            start: startDay,
            end: endDay,
            color: membershipColor
          })
        }
      });

      const aHistory: { minutes: number, day: string }[] = [];
      gymAccessHistoryList.forEach(access => {
        if (!access || !access.exitAt) return;
        const today = dateFormater('yyyy-MM-DD', new Date(access.entryAt));
        const duringMinutes = Math.ceil((new Date(access.exitAt).getTime() - new Date(access.entryAt).getTime()) / (1000 * 60));
        aHistory.push({
          minutes: duringMinutes,
          day: today
        })
      });


      const dMap = new Map<string, ICalendarElement[]>();

      let accessElements: ICalendarElement[] = aHistory.reduce<typeof aHistory>((acc, cur, index, arr) => {
        const prev = acc.find(e => e.day == cur.day);
        if (prev) {
          prev.minutes = prev.minutes + cur.minutes;
        } else {
          acc.push(cur);
        }

        return acc;
      }, []).map(e => ({ title: `출석 ${e.minutes}분`, start: e.day, end: e.day, color: accessColor }));

      accessElements.forEach(e => {
        const f = dMap.get(e.start);
        if (f) {
          f.push(e);
        } else {
          dMap.set(e.start, [e])
        }

      })

      const eHistory: { title: string, id: number, minutes: number, day: string }[] = [];
      gymEquipmentHistoryList.forEach(equipments => {
        if (!equipments || !equipments.endAt) return;
        const today = dateFormater('yyyy-MM-DD', new Date(equipments.usedAt));
        const duringMinutes = Math.ceil((new Date(equipments.endAt).getTime() - new Date(equipments.usedAt).getTime()) / (1000 * 60));
        eHistory.push({
          id: equipments.GymEuquipmentsOnGyms?.gymEquipmentId as number,
          title: equipments.GymEuquipmentsOnGyms?.GymEquipment?.name ?? "",
          minutes: duringMinutes,
          day: today
        })
      });

      let equipmentElements: ICalendarElement[] = eHistory.reduce<typeof eHistory>((acc, cur, index, arr) => {
        const prev = acc.find(e => e.id == cur.id);
        if (prev) {
          prev.minutes = prev.minutes + cur.minutes;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []).map(e => ({ title: `${e.title} ${e.minutes}분`, start: e.day, end: e.day, color: equipmentColor }));

      equipmentElements.forEach(e => {
        const f = dMap.get(e.start);
        if (f) {
          f.push(e);
        } else {
          dMap.set(e.start, [e])
        }
      })

      setDateMap(dMap);

      console.log(membershipElements.concat(equipmentElements, accessElements));

      setCalanderEvents(membershipElements.concat(equipmentElements, accessElements));
    }
  }, [gymMembershipList, gymEquipmentHistoryList, gymAccessHistoryList])

  useEffect(() => {
    if (router.query.id) {
      setGymId(Number(router.query.id));
    }
  }, [router])

  const onClickLogout = () => {
    // id,pw를 가져오고 슬라이스의 로그인으로 넘김
    dispatch(accountSlice.logout());
    router.push("/");
  };

  const onClickDate = (arg: { date: Date }) => {
    const compare = dateFormater('yyyy-MM-DD', arg.date);

    console.log(compare);

    const find = dateMap.get(compare);

    if (find) {
      setCalendarContent(
        find.map(e =>
          e.title
        )
      )
    } else {
      setCalendarContent(
        []
      )
    }
  }

  const onClickBack = () => {
    router.back();
  }
  return {
    user,
    onClickLogout,
    onClickBack,
    onClickDate,

    calanderEvents,
    calendarContent,
  };
}
