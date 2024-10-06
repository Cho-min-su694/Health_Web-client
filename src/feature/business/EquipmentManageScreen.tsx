import { NextPage } from 'next';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';
import Image from 'next/image';
import { useEquipmentManageScreen } from './hooks/useEquipmentManagerScreen';
import EquipmentsOnGymListScreen from '../equipment/EquipmentsOnGymListScreen';
import { StyledButton } from 'src/common/styledAdmin';
import EquipmentSelectListScreen from '../equipment/EquipmentSelectListScreen';

const MainScreen: NextPage = () => {
    const hookMember = useEquipmentManageScreen();

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
                        width: '100%'
                    }}>
                    <FlexRow
                        css={{ width: '100%', justifyContent: 'end' }}
                    >
                        <StyledButton
                            onClick={() => hookMember.onClickAcitveModal(true)}
                            css={{ background: 'gray' }}>
                            헬스장 기구 추가
                        </StyledButton>
                    </FlexRow>
                    {hookMember.gymData?.id ? <EquipmentsOnGymListScreen
                        gymId={hookMember.gymData.id}
                        takeCount={10}
                        showPageCount={10}
                        buttonList={[
                            {
                                buttonAction: (data)=>{return hookMember.onSelectEquipment(data.equipment)},
                                buttonCss: { color: 'green', borderColor: 'green' },
                                buttonName: '1개 추가'
                            },
                            {
                                buttonAction: hookMember.onClickDelete,
                                buttonCss: { color: 'red', borderColor: 'red' },
                                buttonName: '1개 삭제'
                            }
                        ]}
                        bindRefetchData={hookMember.bindRefetchData}

                    /> : <>---</>}

                </FlexCenter>
                {/* <FlexCenter>
            {hookMember.debugText}
        </FlexCenter> */}
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
                <FlexCenter css={{ backgroundColor: 'white', borderRadius: 8 }}>
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
                    <Flex css={{ padding: 40, paddingTop: 0, fontSize: 16, color: '#222' }}>
                        <EquipmentSelectListScreen
                            takeCount={5}
                            setEquipment={hookMember.onSelectEquipment}
                        />
                    </Flex>
                </FlexCenter>
            </FlexCenter>
        </Flex>
    );
};
export default MainScreen;
