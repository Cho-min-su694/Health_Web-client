import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import useGymIntroScreen from './hooks/useGymIntroScreen';
import Image from 'next/image'
import EquipmentsOnGymListScreen from '../equipment/EquipmentsOnGymListScreen';
import { fenxyBlue } from 'src/util/constants/style';

const GymIntroScreen = ({
    gymId
}: {
    gymId: number
}) => {

    const hookMember = useGymIntroScreen({ gymId });

    return <Flex css={{ width: '100%' }}>
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
                <div
                    css={{
                        marginTop: 10,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}
                >{hookMember.gymData?.companyName}</div>
            </FlexCenter>
        </Flex>
        <Flex
            css={{
                margin: '10px 0px',
            }}
        >
            <FlexCenter
                onClick={() => {
                    hookMember.onClickSignin();
                }}
                css={{
                    backgroundColor: fenxyBlue,
                    padding: 11,
                    cursor: 'pointer',
                    borderRadius: 8,
                    width: '100%',
                }}>
                로그인 후 이용 가능합니다.

            </FlexCenter>
        </Flex>

        {hookMember.gymData?.id ? <EquipmentsOnGymListScreen
            gymId={hookMember.gymData.id}
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

                        return <Flex css={{ fontSize: 10 }}>
                            <FlexRow><div css={{ color: 'green' }}>사용가능:&nbsp;</div><div>{data.idList.length - useCount}</div></FlexRow>
                            <FlexRow><div>전체:&nbsp;</div><div>{data.idList.length}</div></FlexRow>
                        </Flex>
                    }
                },
            ]}
            ref={hookMember.refetchEquipmentsRef}

        /> : <>---</>}

    </Flex>
}

export default GymIntroScreen;