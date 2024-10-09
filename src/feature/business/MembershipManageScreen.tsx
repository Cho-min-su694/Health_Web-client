import { NextPage } from 'next';
import Header from 'src/common/header/Header';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import { useMembershipManageScreen } from './hooks/useMembershipManageScreen';
import Image from 'next/image'
import { BorderRoundedContent, ContentHeader, InputStyle, StyledButton } from 'src/common/styledAdmin';
import GymSubHeader from 'src/common/header/GymSubHeader';
import AdminHeader from 'src/common/header/AdminHeader';
import AdminTable from 'src/common/table/AdminTable';
import { GymMembership } from 'src/api/gymMembershipsApi';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { MainFooter } from 'src/common/footer/MainFooter';
import UserSelectListScreen from '../user/UserSelectListScreen';
import { fenxyBlue } from 'src/util/constants/style';

const btnCheckBoxStyle = {
    width: 100,
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

const MembershipManageScreen: NextPage = () => {
    const hookMember = useMembershipManageScreen();

    return (
        <Flex>
            <Flex css={{ minHeight: '100vh' }}>
                <Header
                    hasBorder={false}
                    gray={true}
                    CenterComponent={
                        <div
                            css={{
                                fontSize: 16,
                                color: '#333',
                                fontWeight: 500,
                            }}>
                            헬스장 기구 관리
                        </div>
                    }
                    LeftComponent={
                        <div
                            onClick={() => {
                                window.history.back();
                            }}
                            css={{
                                transform: 'rotate(-180deg)',
                                height: 24,
                                width: 24,
                                position: 'relative',
                                cursor: 'pointer',
                            }}>
                            <Image
                                src="/image/icon/arrow-right-black-tail.svg"
                                layout="fill"
                                alt="arrow"
                            />
                        </div>
                    }
                    userType='BUSINESS'

                />
                <FlexCenter
                    css={{
                        maxWidth: 640,
                        margin: '0 auto',
                        marginBottom: 20,
                        textAlign: 'left',
                        fontSize: 40,
                        color: '#333',
                        fontWeight: 400,
                        paddingTop: 20,
                        paddingRight: 20,
                        paddingLeft: 20,
                        width: '100%'
                    }}>
                    {hookMember.gymData ? <GymSubHeader gymData={hookMember.gymData} /> : <></>}
                    <FlexRow
                        css={{ width: '100%', justifyContent: 'end', marginTop: 20 }}
                    >
                        <StyledButton
                            onClick={() => hookMember.onClickAcitveModal(true)}
                            css={{ background: 'gray' }}>
                            헬스장 멤버쉽 추가
                        </StyledButton>
                    </FlexRow>
                    <BorderRoundedContent
                        css={{
                            fontSize: 14,
                            width: '100%'
                        }}
                    >
                        <Flex css={{ padding: 10 }}>
                            <FlexRow
                                css={{
                                    alignItems: 'center',
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
                                        width: 100,
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
                                </select>
                                <InputStyle
                                    type="text"
                                    placeholder="검색어를 입력해주세요."
                                    css={{
                                        flexGrow: 1,
                                        height: 36,
                                        fontSize: 14,
                                        border: '1px solid #eee',
                                    }}
                                    value={hookMember.searchText}
                                    onChange={(e) => hookMember.onChangeSearchText(e.target.value)}
                                />
                                <StyledButton
                                    onClick={hookMember.onClickSearch}
                                    css={{ border: 0, background: 'blue', color: 'white' }}>
                                    검색
                                </StyledButton>
                            </FlexRow>
                        </Flex>
                    </BorderRoundedContent>
                    <Flex
                        css={{width:'100%', fontSize:14, marginTop:20}}
                    >
                        {hookMember.gymData?.id ? <AdminTable

                            datas={hookMember.gymMembershipData}
                            tableCss={(item)=>({fontSize:10})}
                            headerCss={{fontSize:10}}
                            categories={[
                                {
                                    name:'총 멤버',
                                    value: hookMember.totalMemberCount
                                },
                                {
                                    name:'활성 멤버',
                                    value: hookMember.activeMemberCount
                                }
                            ]}
                            headers={[
                                {
                                    name: '이름',
                                    selector: 'name',
                                    
                                    cell: ({ data }: { data: GymMembership }) => {
                                        return <>{data.User?.username}</>
                                    }
                                },
                                {
                                    name: '시작일',
                                    selector: 'startDay',
                                    max: 100,
                                    cell: ({ data }: { data: GymMembership }) => {
                                        return <GetSeoulTime time={data.startDay} long />
                                    }
                                },
                                {
                                    name: '만료일',
                                    selector: 'endDay',
                                    minWidth: 100,
                                    cell: ({ data }: { data: GymMembership }) => {
                                        return <GetSeoulTime time={data.endDay} long />
                                    }
                                },
                                {
                                    name: '취소 이유',
                                    selector: 'cancel',
                                    minWidth: 100,
                                    cell: ({ data }: { data: GymMembership }) => {
                                        return <>{data.GymMembershipCancellation?.reason}</>
                                    }
                                },
                                {
                                    name: '관리',
                                    selector: 'management',
                                    cell: ({ data }: { data: GymMembership }) => {
                                        return (
                                            data.gymMembershipCancellationId == null && new Date(data.endDay) > (new Date())? 
                                            <FlexRow
                                                css={{
                                                    alignItems: 'center',
                                                    // justifyContent: 'center',
                                                }}>
                                                <StyledButton
                                                    css={{
                                                        height: 28,
                                                        fontSize:10,
                                                        padding: '0 6px',
                                                        lineHeight: '26px',
                                                        minHeight: 'auto',
                                                        color: 'red',
                                                        border: '1px solid red',
                                                        margin: 0,
                                                        marginLeft: 10
                                                    }}
                                                    onClick={() =>
                                                        hookMember.onClickDelete(data.id ?? -1)
                                                    }>
                                                    만료하기
                                                </StyledButton>
                                            </FlexRow> : <></>
                                        );
                                    },
                                },
                            ]}
                            page={hookMember.page}
                            take={10}
                            setPage={hookMember.setPage}
                            totalCount={hookMember.totalCount}

                        /> : <></>}
                    </Flex>

                </FlexCenter>
            </Flex>
            <MainFooter />
            <FlexCenter
                css={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: 100,
                    display: hookMember.modalDisplay,
                }}>
                <FlexCenter css={{ backgroundColor: 'white', borderRadius: 8, maxWidth:640 }}>
                    <FlexRow
                        css={{
                            justifyContent: 'end',
                            width: '100%',
                            padding: '0px 40px',
                            paddingTop: 20
                        }}
                    >
                        <div
                            css={{
                                width: 40,
                                height: 40,
                                position: 'relative'
                            }}
                        >
                            <Image
                                onClick={() => hookMember.onClickAcitveModal(false)}
                                src="/image/icon/cancel-black.svg"
                                layout="fill"
                                alt="close"
                                css={{ cursor: 'pointer' }}
                            />
                        </div>

                    </FlexRow>
                    <Flex css={{ padding: 40, paddingTop: 0, fontSize: 14, color: '#222' }}>
                        <FlexRow
                            css={{
                                minHeight: 60,
                                
                                alignItems: 'center',
                                borderBottom: '1px solid #eee',
                            }}>
                            <div
                                css={{
                                    minWidth: 80,

                                }}>
                                날짜 유형
                            </div>
                            {["DAY", "MONTH", "YEAR"].map((el, i) => (
                                <div
                                    css={btnCheckBoxStyle}
                                    onClick={() => hookMember.onChangeExtendType(el)}
                                    key={i.toString()}
                                    className={hookMember.extendType === el ? 'active' : ''}>
                                    {el === 'DAY'
                                        ? '일'
                                        : el === 'MONTH'
                                            ? '월'
                                            : el === 'YEAR'
                                                ? '연'
                                                : undefined}
                                </div>
                            ))}
                            <InputStyle
                                type="number"
                                placeholder="추가 날짜 입력"
                                css={{
                                    marginLeft:20,
                                    flexGrow: 1,
                                    height: 36,
                                    fontSize: 14,
                                    border: '1px solid #eee',
                                }}
                                value={hookMember.extendAmount}
                                onChange={(e) => hookMember.onChangeExtendAmount(+(e.target.value))}
                            />
                        </FlexRow>
                        <UserSelectListScreen
                            onClickSelect={hookMember.onClickSelect}
                        />
                    </Flex>
                </FlexCenter>
            </FlexCenter>
        </Flex>
    )

}

export default MembershipManageScreen;