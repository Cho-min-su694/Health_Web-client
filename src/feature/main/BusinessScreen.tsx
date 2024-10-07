import { NextPage } from 'next';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';
import { useBusinessScreen } from './hooks/useBusinessScreen';
import { StyledLargeButton } from 'src/common/styledAdmin';
import GymSubHeader from 'src/common/header/GymSubHeader';

const BusinessScreen: NextPage = () => {
    const hookMember = useBusinessScreen();

    return (
        <Flex>
            <Flex css={{ minHeight: '100vh' }}>
                <Header
                    hasBorder
                    CenterComponent={
                        <div css={{ color: '#222', fontSize: 16, fontWeight: 500 }}>
                            헬스장 관리
                        </div>
                    }
                    LeftComponent={
                        <Flex>
                            {hookMember.user ? (
                                <FlexRow
                                    css={{
                                        fontSize: 12,
                                        color: 'black',
                                        fontWeight: 600,
                                    }}>
                                    <Flex
                                        style={{ fontSize: 14 }}
                                        onClick={hookMember.onClickLogout}>
                                        <div
                                            css={{
                                                cursor: 'pointer',
                                                color: 'gray',
                                                marginRight: 8,
                                                lineHeight: '18px',
                                            }}>
                                            로그아웃
                                        </div>
                                    </Flex>
                                    {hookMember.user?.nickname}님
                                </FlexRow>
                            ) : (
                                <Flex
                                    style={{ fontSize: 14 }}
                                    onClick={hookMember.onClickSignin}>
                                    <div
                                        css={{
                                            cursor: 'pointer',
                                            color: 'gray',
                                            marginLeft: 8,
                                            lineHeight: '18px',
                                        }}>
                                        로그인
                                    </div>
                                </Flex>
                            )}
                        </Flex>
                    }
                    userType='BUSINESS'
                />
                <Flex
                    css={{
                        maxWidth: 640,
                        margin: '0 auto',
                        textAlign: 'left',
                        fontSize: 40,
                        color: '#333',
                        fontWeight: 400,
                        paddingTop: 20,
                        paddingRight: 20,
                        paddingLeft: 20,
                        width:'100%'
                    }}>
                    {hookMember ? <GymSubHeader /> : <></>}
                    <FlexCenter
                        onClick={() => {
                            //
                            hookMember.onClickRegisterEquipmentsOnGyms();
                        }}
                        css={{
                            backgroundColor: 'blue',
                            padding: 11,
                            marginTop: 16,
                            cursor: 'pointer',
                            borderRadius: 8,
                            width: '100%'
                        }}>
                        <div css={{ color: 'white', fontSize: 18, lineHeight: '28px' }}>
                            헬스장 기구 등록
                        </div>
                    </FlexCenter>

                </Flex>
                {/* <FlexCenter>
            {hookMember.debugText}
        </FlexCenter> */}
            </Flex>
            <MainFooter />
        </Flex>
    );
};
export default BusinessScreen;
