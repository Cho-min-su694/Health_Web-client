import { createApi } from '@reduxjs/toolkit/query/react';
import { ImageType } from 'src/common/commonType';
import { fetchCompatBaseQuery } from 'src/util/fetchCompatBaseQuery';
import { BodyPart } from './bodyPartsApi';
import { Gym } from './gymsApi';
import fetchCompat from 'src/util/fetchCompat';

// NOTE Api 이름은 무조건 복수명으로 한다. (NestJS와 동일)
export const equipmentsApi = createApi({
  // reducerPath 이름은 파일명과 동일하게 맞춘다.
  reducerPath: 'equipmentsApi',
  // baseQuery 인자는 Nest의 컨트롤러 이름처럼 모든 요청 url의 첫마디를 결정한다.
  baseQuery: fetchCompatBaseQuery('equipments'),
  // FIXME 태그 이름은 fetch반환된 데이터 interface명과 같게 하기
  tagTypes: [''],
  endpoints: (builder) => ({
    // NOTE endpoint 함수의 이름은 find, create, update, remove 로 무조건 시작한다
    createEquipment: builder.mutation<
      unknown,
      {
        userId: number;
        body: EquipmentCreateInput;
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `create/${arg.userId}`,
        body: arg.body,
      }),
    }),
    updateEquipment: builder.mutation<
      unknown,
      {
        id: number;
        body: EquipmentUpdateInput;
      }
    >({
      query: (arg) => ({
        method: 'PATCH',
        url: `${arg.id}`,
        body: arg.body,
      }),
    }),
    upsertEquipmentImage: builder.mutation<
      EquipmentImage,
      {
        gymEquipmentId: number,
        form: FormData,
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: `${arg.gymEquipmentId}/image`,
        body: arg.form,
      }),
    }),

    findDuplicateEquipmentData: builder.mutation<
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

    findEquipment: builder.query<Equipment, { id: number }>({
      query: (arg) => ({
        method: 'GET',
        url: `${arg.id}`,
      }),
    }),
    findAllEquipments: builder.query<Equipment[], void>({
      query: () => ({
        method: 'GET',
        url: '',
      }),
    }),
    findAdminAllEquipments: builder.mutation<
      { count: number; data: Equipment[] },
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
    removeEquipment: builder.mutation<Equipment, { id: number }>({
      query: (arg) => ({
        method: 'DELETE',
        url: `${arg.id}`,
      }),
    }),

    // 개별 삭제
    removeEquipmentByAdmin: builder.mutation<
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

export const { useCreateEquipmentMutation, useFindAdminAllEquipmentsMutation, useFindDuplicateEquipmentDataMutation, useFindAllEquipmentsQuery, useFindEquipmentQuery, useRemoveEquipmentMutation, useUpdateEquipmentMutation, useRemoveEquipmentByAdminMutation, useUpsertEquipmentImageMutation, useLazyFindEquipmentQuery } = equipmentsApi; 

export const createEquipmentData = async (
  userId: number,
  token: string,
  body: EquipmentUpdateInput,
) => {
  return await fetchCompat('POST', `equipments/create/${userId}`, token, body);
};

export type Equipment = {
  id?: number;
  createdAt?: Date | string;

  name: string;
  code: string;
  isDisable: boolean;

  brandName:string;

  bodyParts?: BodyPart[]

  Gyms?: Gym[]
  GymEquipmentImage?: EquipmentImage[]
}

export type EquipmentCreateInput = {
  name: string;
  code: string;
  isDisable?: boolean;
  brandName:string;


  bodyPartIds: number[];
}

export type EquipmentUpdateInput = {
  createdAt?: string;
  name?: string;
  code?: string;
  isDisable?: boolean;
  brandName?:string;


  bodyPartIds?: number[];
}

export type BodyPartsOnGymEquipments = {
  Equipment: Equipment;
  gymEquipmentId: number;
  BodyPart: BodyPart;
  bodyPartId: number
  assignedAt: Date;
}


export type EquipmentImage = { gymEquimentId?: string } & ImageType;