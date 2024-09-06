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
    useAdminGymListScreen,
} from './hooks/useAdminGymListScreen';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { User } from 'src/api/usersApi';
import { Gym } from 'src/api/gymsApi';

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

const AdminGymListScreen = () => {
    const hookMember = useAdminGymListScreen();
    return (
        <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdminHeader active={'헬스장관리'} activeItem={'헬스장관리'} />
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
                        헬스장관리
                    </div>
                    <FlexRow>
                        <StyledButton
                            onClick={hookMember.onClickRouteCreate}
                            css={{ background: fenxyBlue }}>
                            헬스장 추가
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
                                <option value="헬스장명">헬스장명</option>
                                <option value="관장명">관장명</option>
                                <option value="닉네임">닉네임</option>
                                <option value="아이디">아이디</option>
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
                        </FlexRow>
                        <Flex css={{ paddingTop: 20 }}>
                            <AdminTable
                                totalCount={hookMember.totalCount}
                                page={hookMember.page}
                                setPage={hookMember.setPage}
                                take={hookMember.take}
                                headers={[
                                    {
                                        name: '헬스장명',
                                        selector: 'companyName',
                                        minWidth:200,
                                        cell: ({ data }: { data: Gym }) => {
                                            return <>{data.companyName}</>;
                                        },
                                    },
                                    {
                                        name: '아이디',
                                        selector: 'loginId',
                                        cell: ({ data }: { data: any }) => {
                                            return <>{data.User.loginId}</>;
                                        },
                                    },
                                    {
                                        name: '닉네임',
                                        selector: 'nickname',
                                        cell: ({ data }: { data: any }) => {
                                            console.log(data);
                                            return (
                                                <div>
                                                    {data.User.nickname}
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        name: '관장명',
                                        selector: 'username',
                                        cell: ({ data }: { data: any }) => {
                                            return <>{data.ceoName}</>;
                                        },
                                    },
                                    {
                                        name: '지역',
                                        selector: 'mainAddress',
                                        minWidth: 250,
                                        cell: ({ data }: { data: Gym }) => {
                                            return <>{data.mainAddress}</>;
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

export default AdminGymListScreen;
