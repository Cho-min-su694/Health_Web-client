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
    useAdminEquipmentListScreen,
} from './hooks/useAdminEquipmentListScreen';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { User } from 'src/api/usersApi';
import { Gym } from 'src/api/gymsApi';
import { Equipment } from 'src/api/equipmentsApi';

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

const AdminEquipmentListScreen = () => {
    const hookMember = useAdminEquipmentListScreen();
    return (
        <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdminHeader active={'기구관리'} activeItem={'기구 관리'} />
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
                        기구 관리
                    </div>
                    <FlexRow>
                        <StyledButton
                            onClick={hookMember.onClickRouteCreate}
                            css={{ background: fenxyBlue }}>
                            기구 등록
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
                                <option value="이름">이름</option>
                                <option value="코드">코드</option>
                                <option value="브랜드">브랜드</option>
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
                                        name: '이름',
                                        selector: 'name',
                                        minWidth:200,
                                        cell: ({ data }: { data: Equipment }) => {
                                            return <>{data.name}</>;
                                        },
                                    },
                                    {
                                        name: '코드',
                                        selector: 'code',
                                        cell: ({ data }: { data: Equipment }) => {
                                            return <>{data.code}</>;
                                        },
                                    },
                                    {
                                        name: '브랜드',
                                        selector: 'brandName',
                                        cell: ({ data }: { data: Equipment }) => {
                                            console.log(data);
                                            return (
                                                <div>
                                                    {data.brandName}
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        name: '운동부위',
                                        selector: 'bodyPart',
                                        minWidth: 300,
                                        cell: ({ data }: { data: Equipment }) => {
                                            console.log(data);
                                            return (
                                                <div>
                                                    {data.bodyParts?.map(part=>part.name).join(",")}
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        name: '생성일',
                                        selector: 'createdAt',
                                        minWidth: 180,
                                        cell: ({ data }: { data: Equipment }) => {
                                            return data.createdAt? <GetSeoulTime time={data.createdAt} long /> : <></>;
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
                                                    <StyledButton
                                                        css={{
                                                            height: 28,
                                                            padding: '0 6px',
                                                            lineHeight: '26px',
                                                            minHeight: 'auto',
                                                            color: 'red',
                                                            border: '1px solid red',
                                                            margin: 0,
                                                            marginLeft:10
                                                        }}
                                                        onClick={() =>
                                                            hookMember.onClickDelete(data.id)
                                                        }>
                                                        삭제
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

export default AdminEquipmentListScreen;
