import { NextPage } from 'next';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';
import { useMyPageScreen } from './hooks/useMyPageScreen';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { BorderRoundedContent } from 'src/common/styledAdmin';

const MyPageScreen: NextPage = () => {
    const hookMember = useMyPageScreen();

    console.log(hookMember.calanderEvents.length);

    return (
        <Flex>
            <Flex css={{ minHeight: '100vh' }}>
                <Header
                    hasBorder
                    CenterComponent={
                        <div css={{ color: '#222', fontSize: 16, fontWeight: 500 }}>
                            마이 페이지
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
                            ) : <></>}
                        </Flex>
                    }

                    RightComponent={
                        <Flex>
                            <Flex
                                style={{ fontSize: 14 }}
                                onClick={hookMember.onClickBack}>
                                <div
                                    css={{
                                        cursor: 'pointer',
                                        color: 'gray',
                                        marginRight: 8,
                                        lineHeight: '18px',
                                    }}>
                                    뒤로
                                </div>
                            </Flex>
                        </Flex>
                    }
                />
                <FlexCenter
                    css={{
                        maxWidth: 640,
                        margin: '0 auto',
                        textAlign: 'left',
                        fontSize: 12,
                        color: '#333',
                        fontWeight: 400,
                        paddingTop: 20,
                        paddingRight: 20,
                        paddingLeft: 20,
                        width: '100%'
                    }}>
                    {
                        hookMember.calanderEvents.length > 0 ? <FullCalendar

                            initialView="dayGridMonth"
                            plugins={[dayGridPlugin, interactionPlugin]}
                            events={hookMember.calanderEvents}
                            dateClick={hookMember.onClickDate}
                            selectable

                        /> : <></>

                    }
                    <BorderRoundedContent
                        css={{
                            width:'100%',
                            minHeight:30
                        }}
                    >
                        {hookMember.calendarContent.map((e,i)=>
                            <Flex
                            key={i.toString()}>
                                {e}
                            </Flex>
                        )}
                    </BorderRoundedContent>

                </FlexCenter>
            </Flex>
            <MainFooter />
        </Flex>
    );
};
export default MyPageScreen;