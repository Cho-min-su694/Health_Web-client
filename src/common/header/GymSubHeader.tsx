import { useTypedSelector } from "src/store";
import { Flex, FlexCenter, FlexRow } from "../styledComponents";
import { Gym, useFindGymByUserIdQuery } from "src/api/gymsApi";

const GymSubHeader = ({
    gymData
}:{
    gymData?:Gym
}) => {

    const user = useTypedSelector((state) => state.account.user);

    const { data: data, refetch: dataataRefetch } = useFindGymByUserIdQuery({
        userId: Number(user?.id),
    }, { skip: !(user && user.id != undefined) || gymData !== undefined });

    const getData = () => {
        return gymData ?? data;
    }

    return (
        <FlexRow
            css={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 18,
                padding: 10,
                gap: 10,
            }}
        >
            <FlexRow css={{ gap: 20, flexGrow: 1 }}>
                <FlexCenter css={{ flex: 1 }}>
                    <Flex>헬스장 이름</Flex>
                    <Flex css={{ width: '100%', borderBottom: '1px solid #999' }} />
                    <Flex css={{ color: '#999' }}>{getData()?.companyName}</Flex>
                </FlexCenter>
            </FlexRow>
            <FlexRow css={{ gap: 20, flexGrow: 1 }}>
                <FlexCenter css={{ flex: 1 }}>
                    <Flex>헬스장 관장 이름</Flex>
                    <Flex css={{ width: '100%', borderBottom: '1px solid #999' }} />
                    <Flex css={{ color: '#999' }}>{getData()?.ceoName}</Flex>
                </FlexCenter>
            </FlexRow>
        </FlexRow>)
}

export default GymSubHeader;