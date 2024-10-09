import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchCompatBaseQuery } from 'src/util/fetchCompatBaseQuery';
import { User } from './usersApi';
import { ImageType } from 'src/common/commonType';
import fetchCompat from 'src/util/fetchCompat';
import { Equipment } from './equipmentsApi';

// NOTE Api 이름은 무조건 복수명으로 한다. (NestJS와 동일)
export const gymsApi = createApi({
  // reducerPath 이름은 파일명과 동일하게 맞춘다.
  reducerPath: 'gymsApi',
  // baseQuery 인자는 Nest의 컨트롤러 이름처럼 모든 요청 url의 첫마디를 결정한다.
  baseQuery: fetchCompatBaseQuery('gyms'),
  // FIXME 태그 이름은 fetch반환된 데이터 interface명과 같게 하기
  tagTypes: [''],
  endpoints: (builder) => ({
    //
    createGymInfo: builder.mutation<
      unknown,
      {
        userId: number;
        body: Gym;
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `user/${arg.userId}`,
        body: arg.body,
      }),
    }),
    //
    // NOTE 유저생성시 중복확인 // 아이디, 닉네임, 상호명 등등
    findDuplicateGymData: builder.mutation<
      unknown,
      {
        type: string;
        content: string;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `duplicate?type=${arg.type}&content=${arg.content}`,
      }),
    }),
    //
    updateGymById: builder.mutation<
      unknown,
      {
        id: number;
        body: GymUpdateInput;
      }
    >({
      query: (arg) => ({
        method: 'PATCH',
        url: `${arg.id}/update`,
        body: arg.body,
      }),
    }),

    upsertGymImage: builder.mutation<
      GymImage,
      {
        gymId: number,
        form: FormData,
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `${arg.gymId}/image`,
        body: arg.form,
      }),
    }),

    findGym: builder.query<Gym, { id: number }>({
      query: (arg) => ({
        method: 'GET',
        url: `${arg.id}`,
      }),
    }),
    findGymByUserId: builder.query<Gym, { userId: number }>({
      query: (arg) => ({
        method: 'GET',
        url: `user/${arg.userId}`,
      }),
    }),
    findAdminAllGyms: builder.mutation<
      { count: number; data: Gym[]; userCount: { [key: string]: number } },
      {
        page: number;
        take: number;
        searchType?: string;
        searchText?: string;
      }
    >({
      query: (arg) => ({
        method: 'GET',
        url: `admin?page=${arg.page}&take=${arg.take}&searchType=${arg.searchType}&searchText=${arg.searchText}`,
      }),
    }),


    // 개별 삭제
    removeGymByAdmin: builder.mutation<
      Gym,
      {
        adminId: number;
        id: number;
      }
    >({
      query: (arg) => ({
        method: 'DELETE',
        url: `admin?adminId=${arg.adminId}&id=${arg.id}`,
      }),
    }),


  }),
});

export const { useCreateGymInfoMutation, useUpdateGymByIdMutation, useFindDuplicateGymDataMutation, useFindAdminAllGymsMutation, useRemoveGymByAdminMutation, useFindGymQuery, useUpsertGymImageMutation, useFindGymByUserIdQuery } = gymsApi;

export type Gym = {
  id?: number
  createdAt?: Date | string
  ceoName: string
  companyName: string
  businessNumber: string
  postcode: string
  mainAddress: string
  subAddress: string
  phone: string
  cellPhone: string
  fax: string
  email: string
  isCertified?: boolean
  isDisable?: boolean
  userId?: number;
  User?: User;
  GymImage?: GymImage[]
  GymEquipments?: Equipment[]
  // FavoriteUsers?: FavoriteUser[]
  // GymAccessHistory?: GymAccessHistory[]
  // GymMembership?: GymMembership[]
  // GymPassHistory?: GymPassHistory[]
}

export const createGymData = async (
  userId: number,
  token: string,
  body: Gym,
) => {
  return await fetchCompat('POST', `gyms/user/${userId}`, token, body);
};

export const createGymImage = async (
  gymId: number,
  token: string,
  form: FormData,
) => {
  return await fetchCompat(
    'POST',
    `gyms/${gymId}/image`,
    token,
    form,
  );
};

export type GymUpdateInput = {
  createdAt?: string
  ceoName?: string
  companyName?: string
  businessNumber?: string
  postcode?: string
  mainAddress?: string
  subAddress?: string
  phone?: string
  cellPhone?: string
  fax?: string
  email?: string
  isCertified?: boolean
  isDisable?: boolean
};

export type GymImage = {gymId?:string} & ImageType;