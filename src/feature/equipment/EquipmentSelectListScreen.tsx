import { Equipment } from "src/api/equipmentsApi"
import { ContentFlex, Flex, FlexRow } from "src/common/styledComponents"
import { useEquipmentSelectListScreen } from "./hooks/useEquipmentSelectListScreen";
import AdminTable from "src/common/table/AdminTable";
import { BorderRoundedContent, ContentHeader, InputStyle, StyledButton } from "src/common/styledAdmin";

const EquipmentSelectListScreen = ({
    setEquipment,
    takeCount
}: {
    setEquipment: (data: Equipment) => void;
    takeCount:number;
}) => {
    const hookMember = useEquipmentSelectListScreen({ setEquipment, take:takeCount });

    return <ContentFlex>
        <BorderRoundedContent>
            <Flex css={{ padding: '10px 30px' }}>
                <FlexRow
                    css={{
                        minHeight: 60,
                        alignItems: 'center',
                        borderBottom: '1px solid #eee',
                        fontSize:10
                    }}>
                    <div
                        css={{
                            width: 100,
                            paddingLeft: 30,
                        }}>
                        검색어
                    </div>
                    <select
                        css={{
                            width: 120,
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
                        <option value="코드">코드</option>
                        <option value="브랜드">브랜드</option>
                    </select>
                    <InputStyle
                        type="text"
                        placeholder="검색어를 입력해주세요."
                        css={{
                            flexGrow:1,
                            height: 36,
                            fontSize: 14,
                            border: '1px solid #eee',
                        }}
                        value={hookMember.searchText}
                        onChange={(e) => hookMember.onChangeSearchText(e.target.value)}
                    />
                    <StyledButton
                        onClick={hookMember.onClickSearch}
                        css={{ border: 0, background: 'gray', color: 'white' }}>
                        검색
                    </StyledButton>
                </FlexRow>
            </Flex>
        </BorderRoundedContent>
        <AdminTable
            totalCount={hookMember.totalCount}
            page={hookMember.page}
            setPage={hookMember.setPage}
            take={takeCount}
            headers={[
                {
                    name: '이름',
                    selector: 'name',
                    minWidth: 150,
                    cell: ({ data }: { data: Equipment }) => {
                        return <>{data.name}</>;
                    },
                },
                {
                    name: '코드',
                    selector: 'code',
                    cell: ({ data }: { data: Equipment }) => {
                        return <>{data.code}</>;
                    },
                },
                {
                    name: '브랜드',
                    selector: 'brandName',
                    cell: ({ data }: { data: Equipment }) => {
                        return (
                            <div>
                                {data.brandName}
                            </div>
                        );
                    },
                },
                {
                    name: '운동부위',
                    selector: 'bodyPart',
                    minWidth: 200,
                    cell: ({ data }: { data: Equipment }) => {
                        return (
                            <div
                                css={{ overflow: 'auto' }}
                            >
                                {data.bodyParts?.map(part => part.name).join(",")}
                            </div>
                        );
                    },
                },
                {
                    name: '선택',
                    selector: 'select',
                    cell: ({ data }: { data: Equipment }) => {
                        return (
                            <StyledButton
                                css={{
                                    height: 28,
                                    padding: '0 6px',
                                    lineHeight: '26px',
                                    minHeight: 'auto',
                                    color: 'red',
                                    border: '1px solid red',
                                    margin: 0,
                                    marginLeft: 10,
                                    textAlign:'center'
                                }}
                                onClick={() =>
                                    hookMember.onClickSelect(data)
                                }>
                                선택
                            </StyledButton>
                        );
                    },
                },
            ]}
            datas={hookMember.table}
        />
    </ContentFlex>
}

export default EquipmentSelectListScreen;