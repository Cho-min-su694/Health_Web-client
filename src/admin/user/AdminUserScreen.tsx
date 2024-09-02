import AdminHeader from 'src/common/header/AdminHeader';
import {
    BorderRoundedContent,
    ContentHeader,
    InputStyle,
    StyledButton,
} from 'src/common/styledAdmin';
import { Flex, FlexRow, FlexRowCenter } from 'src/common/styledComponents';
import AdminTable from 'src/common/table/AdminTable';
import { fenxyBlue } from 'src/util/constants/style';
import {
    SearchUserTypeArray,
    useAdminUserScreen,
} from './hooks/useAdminUserScreen';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { User } from 'src/api/usersApi';

const btnCheckBoxStyle = {
    width: 120,
    marginLeft: -1,
    lineHeight: '36px',
    border: '1px solid #eee',
    display: 'inline-flex',
    justifyContent: 'center',
    color: '#999',
    cursor: 'pointer',
    '&.active': {
        background: fenxyBlue,
        borderColor: fenxyBlue,
        color: 'white',
    },
};

const AdminUserScreen = () => {
    const hookMember = useAdminUserScreen();
    return (
        <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdminHeader active={'회원관리'} activeItem={'회원관리'} />
            <div css={{ marginLeft: 240, padding: 20, minWidth: 1100 }}>
                <FlexRow
                    css={{
                        paddingBottom: 20,
                        alignItems: 'center',
                        borderBottom: '2px solid #4A5864',
                    }}>
                    <div
                        css={{
                            fontSize: 18,
                            color: '#333',
                            fontWeight: 'bold',
                            flexGrow: 1,
                            lineHeight: '32px',
                        }}>
                        회원관리
                    </div>
                    <FlexRow>
                        <StyledButton
                            onClick={hookMember.onClickRouteCreate}
                            css={{ background: fenxyBlue }}>
                            유저 추가
                        </StyledButton>
                        {/* <StyledButton
              onClick={() => hookMember.onClickDeleteChecked()}
              css={{ backgroundColor: '#4A5864' }}>
              선택삭제
            </StyledButton> */}
                    </FlexRow>
                </FlexRow>

                <BorderRoundedContent>
                    <ContentHeader>검색</ContentHeader>
                    <Flex css={{ padding: 30 }}>
                        <FlexRow
                            css={{
                                minHeight: 60,
                                alignItems: 'center',
                                borderBottom: '1px solid #eee',
                            }}>
                            <div
                                css={{
                                    width: 150,
                                    paddingLeft: 30,
                                }}>
                                검색어
                            </div>
                            <select
                                css={{
                                    width: 160,
                                    marginRight: 10,
                                    height: '36px',
                                    border: '1px solid #eee',
                                    color: '#999',
                                }}
                                onChange={(e) => {
                                    hookMember.onChangeSearchType(e.target.value);
                                }}>
                                {/* <option value="없음">없음</option> */}
                                <option value="닉네임">닉네임</option>
                                <option value="아이디">아이디</option>
                                <option value="이름">이름</option>
                            </select>
                            <InputStyle
                                type="text"
                                placeholder="검색어를 입력해주세요."
                                css={{
                                    width: 320,
                                    height: 36,
                                    fontSize: 14,
                                    border: '1px solid #eee',
                                }}
                                value={hookMember.searchText}
                                onChange={(e) => hookMember.onChangeSearchText(e.target.value)}
                            />
                            <StyledButton
                                onClick={hookMember.onClickSearch}
                                css={{ border: 0, background: fenxyBlue, color: 'white' }}>
                                검색
                            </StyledButton>
                        </FlexRow>
                        <FlexRow
                            css={{
                                minHeight: 60,
                                alignItems: 'center',
                                borderBottom: '1px solid #eee',
                            }}>
                            <div
                                css={{
                                    minWidth: 150,
                                    paddingLeft: 30,
                                }}>
                                유형
                            </div>
                            {SearchUserTypeArray.map((el, i) => (
                                <div
                                    css={btnCheckBoxStyle}
                                    onClick={() => hookMember.onClickUserType(el)}
                                    key={i.toString()}
                                    className={hookMember.userType === el ? 'active' : ''}>
                                    {el === 'MANAGER'
                                        ? '매니저'
                                        : el === 'ADMIN'
                                            ? '관리자'
                                            : el === 'GENERAL'
                                                ? '일반회원'
                                                : el === '전체'
                                                    ? '전체'
                                                    : undefined}
                                </div>
                            ))}
                        </FlexRow>
                    </Flex>
                </BorderRoundedContent>

                <BorderRoundedContent>
                    <Flex css={{ padding: 30 }}>
                        <FlexRow
                            css={{
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                height: 32,
                            }}>
                            {/* <FlexRow
                css={{
                  flexGrow: 1,
                  fontSize: 14,
                  '>div': {
                    marginRight: 10,
                    color: '#999',
                    cursor: 'pointer',
                  },
                  '>div:hover, >div.active': {
                    color: '#222',
                  },
                }}>
                <div
                  className={`${hookMember.tableTitle === 'user' && 'active'}`}
                  onClick={() => {
                    hookMember.onClickChangeTable('user');
                  }}>
                  전체회원 {hookMember.user.length}
                </div>
                <div
                  className={`${
                    hookMember.tableTitle === 'general' && 'active'
                  }`}
                  onClick={() => {
                    hookMember.onClickChangeTable('general');
                  }}>
                  일반회원 {hookMember.general.length}
                </div>
                <div
                  className={`${
                    hookMember.tableTitle === 'business' && 'active'
                  }`}
                  onClick={() => {
                    hookMember.onClickChangeTable('business');
                  }}>
                  사업자회원 {hookMember.business.length}
                </div>
              </FlexRow> */}
                        </FlexRow>
                        <Flex css={{ paddingTop: 20 }}>
                            <AdminTable
                                totalCount={hookMember.totalCount}
                                page={hookMember.page}
                                setPage={hookMember.setPage}
                                take={hookMember.take}
                                categories={[
                                    { title: '운영 회원' },
                                    {
                                        name: '관리자',
                                        value: hookMember.userTypeCount?.['ADMIN'] || 0,
                                    },
                                    {
                                        name: '매니저',
                                        value: hookMember.userTypeCount?.['MANAGER'] || 0,
                                    },
                                    { title: '/' },
                                    {
                                        name: '일반회원',
                                        value: hookMember.userTypeCount?.['GENERAL'] || 0,
                                    },
                                ]}
                                headers={[
                                    // {
                                    //   // name: '선택',
                                    //   name: (
                                    //     <Flex>
                                    //       <label
                                    //         htmlFor={`product_all`}
                                    //         onClick={hookMember.onClickCheckAll}>
                                    //         <Image
                                    //           src={`/image/admin/icon/check-square-${
                                    //             hookMember.deleteUserArray.length ===
                                    //             hookMember.table.length
                                    //               ? 'fill'
                                    //               : 'empty'
                                    //           }.png`}
                                    //           width="20"
                                    //           height="20"
                                    //           alt="checkbox"
                                    //         />
                                    //       </label>
                                    //       <input
                                    //         type="checkbox"
                                    //         id="product_all"
                                    //         css={{ display: 'none' }}
                                    //       />
                                    //     </Flex>
                                    //   ),
                                    //   maxWidth: 100,
                                    //   cell: (e: any) => {
                                    //     return (
                                    //       <Flex>
                                    //         <label
                                    //           htmlFor={`product_${e.data.id}`}
                                    //           onClick={() => hookMember.onClickCheckItem(e.data)}>
                                    //           <Image
                                    //             src={`/image/admin/icon/check-square-${
                                    //               hookMember.deleteUserArray.includes(e.data)
                                    //                 ? 'fill'
                                    //                 : 'empty'
                                    //             }.png`}
                                    //             width="20"
                                    //             height="20"
                                    //             alt="checkbox"
                                    //           />
                                    //         </label>
                                    //         <input
                                    //           type="checkbox"
                                    //           id={`product_${e.data.id}`}
                                    //           css={{ display: 'none' }}
                                    //         />
                                    //       </Flex>
                                    //     );
                                    //   },
                                    // },
                                    {
                                        name: '아이디',
                                        selector: 'loginId',
                                        cell: ({ data }: { data: any }) => {
                                            return <>{data.loginId}</>;
                                        },
                                    },
                                    {
                                        name: '닉네임',
                                        selector: 'nickname',
                                        cell: ({ data }: { data: User }) => {
                                            console.log(data);
                                            return (
                                                <div>
                                                    {data.nickname}
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        name: '이름',
                                        selector: 'username',
                                        cell: ({ data }: { data: any }) => {
                                            return <>{data.username}</>;
                                        },
                                    },
                                    {
                                        name: '구분',
                                        selector: 'userType',
                                        cell: ({ data }: { data: any }) => {
                                            let type = '-';
                                            if (data.userType === 'ADMIN') {
                                                type = '관리자';
                                            } else if (data.userType === 'GENERAL') {
                                                type = '일반회원';
                                            } else if (data.userType === 'MANAGER') {
                                                type = '매니저';
                                            }
                                            return <>{type}</>;
                                        },
                                    },
                                    {
                                        name: '가입일',
                                        selector: 'createdAt',
                                        minWidth: 200,
                                        cell: ({ data }: { data: any }) => {
                                            return <GetSeoulTime time={data.createdAt} long />;
                                        },
                                    },
                                    {
                                        name: '관리',
                                        selector: 'management',
                                        cell: ({ data }: { data: any }) => {
                                            return (
                                                <FlexRow
                                                    css={{
                                                        alignItems: 'center',
                                                        // justifyContent: 'center',
                                                    }}>
                                                    <StyledButton
                                                        css={{
                                                            height: 28,
                                                            padding: '0 6px',
                                                            lineHeight: '26px',
                                                            minHeight: 'auto',
                                                            color: '#999',
                                                            border: '1px solid #999',
                                                            margin: 0,
                                                        }}
                                                        onClick={() =>
                                                            hookMember.onClickRouterDetail(data.id)
                                                        }>
                                                        상세보기
                                                    </StyledButton>
                                                </FlexRow>
                                            );
                                        },
                                    },
                                ]}
                                datas={hookMember.table}
                            />
                        </Flex>
                    </Flex>
                </BorderRoundedContent>
            </div>
        </div>
    );
};

export default AdminUserScreen;
