import { NextPage } from 'next';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';
import { useMainScreen } from './hooks/useMainScreen';

const MainScreen: NextPage = () => {
    const hookMember = useMainScreen();

    return (
        <Flex>
            <Flex css={{ minHeight: '100vh' }}>
                <Header
                    hasBorder
                    CenterComponent={
                        <div css={{ color: '#222', fontSize: 16, fontWeight: 500 }}>
                            메인화면
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
                />
                <FlexCenter
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
                    }}>
                    <span css={{}}>서비스 준비중입니다.</span>

                </FlexCenter>
                {/* <FlexCenter>
            {hookMember.debugText}
        </FlexCenter> */}
            </Flex>
            <MainFooter />
        </Flex>
    );
};
export default MainScreen;
