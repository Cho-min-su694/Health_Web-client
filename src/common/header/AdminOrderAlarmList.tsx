import { lowBlack, mediumBlack, veryLowBlack, fenxyBlue } from "src/util/constants/style";
import { Flex, FlexCenter, FlexRow } from "../styledComponents";
import { useAdminOrderAlarmList } from "./hooks/useAdminOrderAlarmList";
import Image from 'next/image';
import * as accountSlice from 'src/data/accountSlice'

const AdminOrderAlarmList = ({
    userType
}:{
    userType: accountSlice.UserType | undefined;
}
) => {
    const hookMember = useAdminOrderAlarmList(userType);

    return (userType === 'ADMIN')? <>
        <div
            onClick={hookMember.setOnClickOpenList}
            css={{
                marginRight:24,
                color:'white',
                position:'relative',
                cursor:'pointer'
            }}
        >
            알람보기
            {hookMember.orderAlaramCount>0 && <FlexCenter
                css={{
                    position:'absolute',
                    top:-6,
                    right:-12,
                    width:16,
                    height:16,
                    borderRadius:8,
                    backgroundColor:'red',
                    fontSize: 5
                }}
            >
                {
                    hookMember.orderAlaramCount
                }
            </FlexCenter>}
        </div>
        <FlexRow
            css={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                display: hookMember.displayList ? 'flex':'none',
                justifyContent:'right',
            }}
            >
            <Flex
                css={{ backgroundColor: 'rgba(0,0,0,0.3)', flexGrow: 1 }}
                onClick={hookMember.setOnClickCloseList}
            />
            <Flex
                css={{
                width: 'calc(100% - 50px)',
                maxWidth: 270,
                backgroundColor: 'white',
                height: '100%',
                position:'relative'
                }}>
                <FlexRow
                    css={{
                        justifyContent:'right'
                    }}
                >
                    <Image
                        src="/image/icon/cancel-black.svg"
                        width="24"
                        height="24"
                        alt="메뉴 닫기"

                        onClick={hookMember.setOnClickCloseList}

                        css={{
                            cursor:'pointer'
                        }}
                    />
                </FlexRow>
                <Flex css={{width:'100%', paddingTop: 10, paddingBottom: 100, overflowY: 'auto' }}>
                    {
                        hookMember.orderAlarmList.map((item,index)=>{


                            return (<div
                                key={index}
                                css={{
                                    padding:'10px 20px',
                                    backgroundColor:item.isViewed?veryLowBlack : 'white'
                                }}
                            >
                                <Flex>
                                    <div>
                                    {
                                        item.content?.split('\n')
                                        .map((item, index) => {
                                          return <div key={index}>{item}</div>;
                                        }) || '새로운 알람이 있습니다.'
                                    }
                                    </div>
                                    <FlexRow
                                        css={{
                                            padding:10,
                                            gap:10
                                        }}
                                    >
                                        <FlexCenter
                                            css={{
                                                flex:1,
                                                borderRadius:20,
                                                color:'white',
                                                backgroundColor:item.isViewed? lowBlack: 'red',
                                                padding:5,
                                                cursor:'pointer'
                                            }}
                                            onClick={()=>hookMember.setOnClickViewed(item)}
                                        >
                                            확인
                                        </FlexCenter>

                                        <FlexCenter
                                            css={{
                                                flex:1,
                                                borderRadius:20,
                                                color:'white',
                                                backgroundColor:item.isViewed? lowBlack: fenxyBlue,
                                                padding:5,
                                                cursor:'pointer'
                                            }}
                                            onClick={()=>hookMember.setOnClickGoURL(item)}
                                        >
                                            이동하기
                                        </FlexCenter>
                                    </FlexRow>
                                </Flex>
                            </div>);
                        })
                    }
                    {/* (<div
                                css={{
                                    padding:'10px 20px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <Flex>
                                    <div>
                                    {
                                        `새로운 알람이 있습니다.
                                        확인
                                        확인
                                        확인`
                                    }
                                    </div>
                                    <FlexRow
                                        css={{
                                            padding:10,
                                            gap:10
                                        }}
                                    >
                                        <FlexCenter
                                            css={{
                                                flex:1,
                                                borderRadius:20,
                                                color:'white',
                                                backgroundColor:'red',
                                                padding:5,
                                                cursor:'pointer'
                                            }}

                                        >
                                            확인
                                        </FlexCenter>

                                        <FlexCenter
                                            css={{
                                                flex:1,
                                                borderRadius:20,
                                                color:'white',
                                                backgroundColor:yoksuriBlue,
                                                padding:5,
                                                cursor:'pointer'
                                            }}
                                        >
                                            이동하기
                                        </FlexCenter>
                                    </FlexRow>
                                </Flex>
                            </div>) */}
                </Flex>
            </Flex>
        </FlexRow>
    </> : <></>;
}

export default AdminOrderAlarmList;