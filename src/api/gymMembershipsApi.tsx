import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchCompatBaseQuery } from 'src/util/fetchCompatBaseQuery';
import { User } from './usersApi';
import { Gym } from './gymsApi';

// NOTE Api 이름은 무조건 복수명으로 한다. (NestJS와 동일)
export const gymMembershipsApi = createApi({
  // reducerPath 이름은 파일명과 동일하게 맞춘다.
  reducerPath: 'gymMembershipsApi',
  // baseQuery 인자는 Nest의 컨트롤러 이름처럼 모든 요청 url의 첫마디를 결정한다.
  baseQuery: fetchCompatBaseQuery('gymmemberships'),
  // FIXME 태그 이름은 fetch반환된 데이터 interface명과 같게 하기
  tagTypes: [''],
  endpoints: (builder) => ({
    //
    createGymMembership: builder.mutation<
      unknown,
      {
        body: CreateGymMembershipDto;
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: ``,
        body: arg.body,
      }),
    }),
    extendGymMembership: builder.mutation<
      unknown,
      {
        gymId: number;
        type: string;
        add: number;
        body: { userId: number, assignBy: number }
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `extend/${arg.gymId}?type=${arg.type}&add=${arg.add}`,
        body: arg.body,
      }),
    }),
    cancelGymMembership: builder.mutation<
      unknown,
      {
        membershipId: number;
        body: GymMembershipCancellation
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `cancel/${arg.membershipId}`,
        body: arg.body,
      }),
    }),

    findMembershipByGymId: builder.query<
      GymMembership[],
      {
        gymId: number
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `gym/${arg.gymId}`
      })
    }),

    findUserGymMembership: builder.query<
      GymMembership[],
      {
        gymId: number;
        userId: number;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `gym/${arg.gymId}/${arg.userId}`
      })
    }),

    findGymMembershipByUserId: builder.query<
      GymMembership[],
      {
        userId: number;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `user/${arg.userId}`
      })
    }),

    findPagingAllGymMemberships: builder.mutation<
      { count: number; activeCount: number; totalCount: number; data: GymMembership[]; },
      {
        page: number;
        take: number;
        searchType?: string;
        searchText?: string;
        isDisable?: boolean;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `paging?page=${arg.page}&take=${arg.take}&searchType=${arg.searchType}&searchText=${arg.searchText}&isDisable=${arg.isDisable ?? ""}`,
      }),
    }),

    findPagingGymMemberships: builder.mutation<
      { count: number; activeCount: number; totalCount: number; data: GymMembership[]; },
      {
        gymId: number;
        page: number;
        take: number;
        searchType?: string;
        searchText?: string;
        isDisable?: boolean;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `paging/${arg.gymId}?page=${arg.page}&take=${arg.take}&searchType=${arg.searchType}&searchText=${arg.searchText}&isDisable=${arg.isDisable ?? ""}`,
      }),
    }),

    // Gym 입장

    createGymAccessHistory: builder.mutation<
      unknown,
      {
        gymId: number;
        body: { userId: number }
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `access/${arg.gymId}`,
        body: arg.body,
      }),
    }),

    findValidGymAccessHistory: builder.query<
      GymAccessHistory,
      {
        gymId: number,
        userId: number
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `access/valid/${arg.gymId}/${arg.userId}`
      })
    }),

    updateGymAccessHistory: builder.mutation<
      GymAccessHistory,
      {
        id: number;
        body: UpdateGymAccessHistoryDto
      }
    >({
      query: (arg) => ({
        method: 'PATCH',
        url: `access/${arg.id}`,
        body: arg.body,
      }),
    }),

    exitGym: builder.mutation<
      GymAccessHistory,
      {
        id: number;
      }
    >({
      query: (arg) => ({
        method: 'PATCH',
        url: `access/exit/${arg.id}`,
      }),
    }),

  }),

});

export const { useCancelGymMembershipMutation, useCreateGymMembershipMutation, useExtendGymMembershipMutation, useFindPagingAllGymMembershipsMutation, useFindMembershipByGymIdQuery, useFindUserGymMembershipQuery, useFindPagingGymMembershipsMutation, useFindGymMembershipByUserIdQuery, useCreateGymAccessHistoryMutation, useFindValidGymAccessHistoryQuery, useUpdateGymAccessHistoryMutation, useExitGymMutation } = gymMembershipsApi;

export type CreateGymMembershipDto = {
  createdAt?: Date | string;
  userId: number;
  gymId: number;
  assignBy: number;
  startDay?: Date | string;
  endDay: Date | string;
  gymMembershipCancellationId?: number | null;
}

export type UpdateGymMembershipDto = Partial<CreateGymMembershipDto>

export type GymMembership = {
  id?: number
  createdAt?: Date | string
  userId: number
  gymId: number
  assignBy: number
  startDay: Date | string
  endDay: Date | string
  gymMembershipCancellationId?: number | null

  User?: User
  Gym?: Gym
  assignUser?: User
  GymMembershipCancellation?: GymMembershipCancellation | null;
}

export type GymMembershipCancellation = {
  id?: number
  createdAt?: Date | string
  reason?: string
  assignBy: number

  assignUser?: User

  GymMembership?: GymMembership[]
}

export type GymAccessHistory = {
  id?: number;
  createdAt?: Date | string
  gymId: number;
  userId: number;
  entryAt: Date | string
  exitAt?: Date | string

  Gym?: Gym;
  User?: User;
}

export type CreatGymAccessHistoryDto = {
  gymId: number;
  userId: number;
  entryAt: Date | string;
}

export type UpdateGymAccessHistoryDto = Partial<CreatGymAccessHistoryDto>