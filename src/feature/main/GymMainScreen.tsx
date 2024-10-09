import { NextPage } from 'next';
import { User } from 'src/api/usersApi';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import Image from 'next/image';
import useGymMainScreen from './hooks/useGymMainScreen';
import { fenxyBlue } from 'src/util/constants/style';
import EquipmentsOnGymListScreen from '../equipment/EquipmentsOnGymListScreen';
import { EquipmentCollection } from '../equipment/hooks/useEquipmentsOnGymListScreen';

const btnCss: any = {
    fontSize: 11,
    color: '#999',
    width: 60,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid #999',
    borderRadius: 5,
    padding: 3
}

const GymMainScreen = ({
    user
}: {
    user: User
}) => {
    const hookMember = useGymMainScreen({ user });

    const { Gym: gymData } = hookMember.gymMembership ?? {};

    const hours = String(Math.floor((hookMember.timer / (1000 * 60 * 60)) % 24)).padStart(
        2,
        '0',
    )
    const minutes = String(Math.floor((hookMember.timer / 1000 / 60) % 60)).padStart(
        2,
        '0',
    )
    const seconds = String(Math.floor((hookMember.timer / 1000) % 60)).padStart(2, '0')

    const equipMentHours = String(Math.floor((hookMember.equipmentTimer / (1000 * 60 * 60)) % 24)).padStart(
        2,
        '0',
    )
    const equipmentMinutes = String(Math.floor((hookMember.equipmentTimer / 1000 / 60) % 60)).padStart(
        2,
        '0',
    )
    const equipmentSeconds = String(Math.floor((hookMember.equipmentTimer / 1000) % 60)).padStart(2, '0')

    return (
            hookMember.gymMembership ?
                <Flex css={{ width: '100%' }}>
                    <Flex css={{ width: '100%', height: 240, color: '#999', position: 'relative', overflow: 'hidden', justifyContent: 'center' }}>
                        {hookMember.gymPreviewPhoto && (
                            <Image
                                src={hookMember.gymPreviewPhoto.replace(/\\/g, '/')}
                                width={0}
                                height={0}
                                alt="헬스장 브랜드"
                                sizes="100vw"
                                css={{
                                    height: 'auto',
                                    width: '100%',
                                    objectFit: 'cover',
                                }}
                            // style={{
                            //     height: '300px',
                            //     width: '100%'
                            // }}
                            />
                        )}
                        <FlexCenter
                            css={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                backgroundColor: '#0007',
                                color: 'white',
                                fontWeight: 'normal',
                            }}
                        >
                            {hookMember.daysLeft}일 남음
                            <div
                                css={{
                                    marginTop: 10,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}
                            >{gymData?.companyName}</div>
                        </FlexCenter>
                    </Flex>
                    <Flex
                        css={{
                            marginTop: 10,
                        }}
                    >
                        <FlexCenter
                            onClick={() => {
                                //
                                hookMember.gymAccessHistory ? hookMember.onClickExitGym() : hookMember.onClickAccessGym()
                            }}
                            css={{
                                backgroundColor: hookMember.gymAccessHistory ? '#D79350' : fenxyBlue,
                                padding: 11,
                                cursor: 'pointer',
                                borderRadius: 8,
                                width: '100%',
                            }}>
                            <div css={{ color: 'white', fontSize: 18 }}>
                                헬스장 {hookMember.gymAccessHistory ? '퇴장' : '입장'}
                            </div>
                            {hookMember.gymAccessHistory ? <div>
                                {hours} : {minutes} : {seconds}
                                <FlexCenter css={{ color: 'black', fontSize: 12 }}>( 이용 시간 )</FlexCenter>
                            </div> : <></>}

                        </FlexCenter>
                    </Flex>
                    <Flex
                        css={{
                            marginTop: 10,
                            marginBottom: 10
                        }}
                    >
                        <FlexCenter
                            onClick={() => {
                                //
                                hookMember.myEquipmentHistory ? hookMember.onClickEndEquipment() : null;
                            }}
                            css={{
                                backgroundColor: hookMember.myEquipmentHistory ? '#6D5F9E' : 'gray',
                                padding: 11,
                                cursor: hookMember.myEquipmentHistory ? 'pointer' : 'default',
                                borderRadius: 8,
                                width: '100%',
                                height: 100,
                                color: '#ddd',
                                fontSize: 12
                            }}>
                            {hookMember.myEquipmentHistory ? <FlexCenter >{hookMember.myEquipmentHistory.GymEuquipmentsOnGyms?.GymEquipment?.name}</FlexCenter> : undefined}
                            <FlexCenter css={{ color: hookMember.myEquipmentHistory ? 'white' : '#ccc', fontSize: 30, fontWeight: hookMember.myEquipmentHistory ? 'bold' : 'normal' }}>
                                {hookMember.myEquipmentHistory ? '사용 해제' : '기구 미사용 중'}
                            </FlexCenter>
                            {hookMember.myEquipmentHistory ? <FlexCenter css={{ color: '#ddd', fontSize: 12 }}>
                                {equipMentHours} : {equipmentMinutes} : {equipmentSeconds} (이용 중)
                            </FlexCenter> : <></>}

                        </FlexCenter>
                    </Flex>
                    {hookMember.gymMembership?.gymId ? <EquipmentsOnGymListScreen
                        gymId={hookMember.gymMembership.gymId}
                        takeCount={5}
                        showPageCount={10}
                        headers={[
                            {
                                name: '이름',
                                selector: 'name',
                                width: 80,
                                Cell: ({ data }) => {
                                    return <div>{data.equipment.name} ({data.equipment.brandName})</div>
                                }
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
                                name: '현황',
                                selector: 'count',
                                width: 54,
                                Cell: ({ data }) => {
                                    const useCount = data.equipment.id ? hookMember.equipmentHistoryMap?.get(data.equipment.id)?.filter((el => data.idList.includes(el)))?.length ?? 0 : 0;

                                    return <Flex css={{fontSize:10}}>
                                        <FlexRow><div css={{ color: 'green' }}>사용가능:&nbsp;</div><div>{data.idList.length-useCount}</div></FlexRow>
                                        <FlexRow><div>전체:&nbsp;</div><div>{data.idList.length}</div></FlexRow>
                                    </Flex>
                                }
                            },
                            hookMember.gymAccessHistory ? {
                                name: '상세보기',
                                selector: 'action',
                                width: 60,
                                Cell: ({ data }) => {
                                    let useIds:number[] = [];
                                    if(data.equipment.id) {
                                        useIds = hookMember.equipmentHistoryMap?.get(data.equipment.id)?.filter((el => data.idList.includes(el)))?? [];
                                    }

                                    const inUsed = hookMember.myEquipmentHistory && data.idList.includes(hookMember.myEquipmentHistory.gymEuquipmentsOnGymsId);
                                    const color = inUsed? 'red' : useIds.length>=data.idList.length ? 'gray' : 'green'
                                    const text = inUsed? '사용해제' : useIds.length>=data.idList.length ? '사용불가' : '사용하기'

                                    return <Flex
                                        css={{
                                            justifyContent: 'center',
                                            gap: 3,
                                        }}

                                    >
                                        <div
                                            onClick={() => {
                                                if (inUsed) {
                                                    hookMember.onClickEndEquipment();
                                                } else if (useIds.length>=data.idList.length) {
                                                    return;
                                                } else if (data.idList.length > 0) {
                                                    hookMember.onClickUseEquipment(data.idList.find(v=>!useIds.includes(v)));
                                                }
                                            }}
                                            css={{
                                                ...btnCss,
                                                cursor:!inUsed && useIds.length>=data.idList.length? 'default':'pointer',
                                                color: color, borderColor: color
                                            }}
                                        >
                                            {text}
                                        </div>
                                    </Flex>
                                }
                            } : null
                        ]}
                        ref={hookMember.refetchEquipmentsRef}

                    /> : <>---</>}

                </Flex>
                : 
                <FlexCenter>
                    헬스장 가입이 필요합니다.
                </FlexCenter>
    )
}

export default GymMainScreen;