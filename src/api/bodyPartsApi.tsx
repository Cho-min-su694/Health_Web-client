import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchCompatBaseQuery } from 'src/util/fetchCompatBaseQuery';

// NOTE Api 이름은 무조건 복수명으로 한다. (NestJS와 동일)
export const bodyPartsApi = createApi({
  // reducerPath 이름은 파일명과 동일하게 맞춘다.
  reducerPath: 'bodyPartsApi',
  // baseQuery 인자는 Nest의 컨트롤러 이름처럼 모든 요청 url의 첫마디를 결정한다.
  baseQuery: fetchCompatBaseQuery('body-parts'),
  // FIXME 태그 이름은 fetch반환된 데이터 interface명과 같게 하기
  tagTypes: [''],
  endpoints: (builder) => ({
    // NOTE endpoint 함수의 이름은 find, create, update, remove 로 무조건 시작한다
    createBodyPart: builder.mutation<
      unknown,
      {
        body: BodyPart;
      }
    >({
      query: (arg) => ({
        method: 'POST',
        url: ``,
        body: arg.body,
      }),
    }),
    updateBodyPart: builder.mutation<
      unknown,
      {
        id: number;
        body: BodyPartUpdateInput;
      }
    >({
      query: (arg) => ({
        method: 'PATCH',
        url: `${arg.id}`,
        body: arg.body,
      }),
    }),
    findBodyPart: builder.query<BodyPart, { id: number }>({
      query: (arg) => ({
        method: 'GET',
        url: `${arg.id}`,
      }),
    }),
    findAllBodyParts: builder.query<BodyPart[], void>({
      query: () => ({
        method: 'GET',
        url: '',
      }),
    }),
    removeBodyPart: builder.mutation<BodyPart, { id: number }>({
      query: (arg) => ({
        method: 'DELETE',
        url: `${arg.id}`,
      }),
    }),
  }),
});

export const { useCreateBodyPartMutation, useFindAllBodyPartsQuery, useFindBodyPartQuery, useUpdateBodyPartMutation, useRemoveBodyPartMutation } = bodyPartsApi;

export interface BodyPart {
  id?: number;
  createdAt?: Date | string;

  name: string;
  code: string;
  category:string;
}

export interface BodyPartUpdateInput {
  createdAt?: string;
  name?: string;
  code?: string;
  category?:string;
}
