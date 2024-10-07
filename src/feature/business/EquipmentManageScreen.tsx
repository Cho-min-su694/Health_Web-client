import { NextPage } from 'next';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';
import Image from 'next/image';
import { useEquipmentManageScreen } from './hooks/useEquipmentManagerScreen';
import EquipmentsOnGymListScreen from '../equipment/EquipmentsOnGymListScreen';
import { StyledButton } from 'src/common/styledAdmin';
import EquipmentSelectListScreen from '../equipment/EquipmentSelectListScreen';
import GymSubHeader from 'src/common/header/GymSubHeader';

const btnCss: any = {
    fontSize: 11,
    color: '#999',
    width: 50,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid #999',
    borderRadius: 5,
    padding: 3
}

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
                            헬스장 기구 추가
                        </StyledButton>
                    </FlexRow>
                    {hookMember.gymData?.id ? <EquipmentsOnGymListScreen
                        gymId={hookMember.gymData.id}
                        takeCount={10}
                        showPageCount={10}
                        headers={[
                            {
                                name: '이름',
                                selector: 'name',
                                width: 80
                            },
                            {
                                name: '브랜드',
                                selector: 'brandName',
                                width: 100
                            },
                            {
                                name: '운동부위',
                                selector: 'bodyParts',
                                flexGrow: 1,
                                Cell: ({ data }) => {
                                    return <div>{data.equipment.bodyParts?.map(part => part.name).join(", ")}</div>
                                }
                            },
                            {
                                name: '수량',
                                selector: 'count',
                                width: 50,
                                Cell: ({ data }) => {
                                    return <div>{data.idList.length}</div>
                                }
                            },
                            {
                                name: '상세보기',
                                selector: 'action',
                                width: 80,
                                Cell: ({ data }) => {
                                    return <Flex
                                        css={{
                                            justifyContent: 'center',
                                            gap: 3,
                                        }}

                                    >
                                        <div
                                            onClick={() => {
                                                hookMember.onSelectEquipment(data.equipment)
                                            }}
                                            css={{
                                                ...btnCss,
                                                color: 'green', borderColor: 'green'
                                            }}
                                        >
                                            1개 추가
                                        </div>
                                        <div
                                            onClick={() => {
                                                hookMember.onClickDelete(data)
                                            }}
                                            css={{
                                                ...btnCss,
                                                color: 'red', borderColor: 'red'
                                            }}
                                        >
                                            1개 삭제
                                        </div>
                                    </Flex>
                                }
                            }
                        ]}
                        ref={hookMember.refetchRef}

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
