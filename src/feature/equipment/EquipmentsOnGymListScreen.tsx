import { ContentFlex, Flex, FlexCenter, FlexRow } from "src/common/styledComponents";
import { EquipmentCollection, useEquipmentsOnGymListScreen } from "./hooks/useEquipmentsOnGymListScreen";
import Image from 'next/image';
import { Equipment, GymEuquipmentsOnGyms } from "src/api/equipmentsApi";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { forwardRef, useImperativeHandle } from "react";

const EquipmentsOnGymListScreen = forwardRef(({
    gymId,
    takeCount,
    showPageCount,
    buttonList,
}: {
    gymId: number;
    takeCount: number;
    showPageCount: number;
    buttonList: {
        buttonAction: (data: EquipmentCollection) => void;
        buttonName: string;
        buttonCss?: any
    }[];
}, ref) => {

    const hookMember = useEquipmentsOnGymListScreen({
        gymId,
        takeCount,
    });

    useImperativeHandle(ref, () => ({
        refetchData() {
            hookMember.refetchData();
        }
    }));

    const maxPageCount = Math.min(showPageCount, Math.ceil(hookMember.totalCount / hookMember.take))

    return <ContentFlex>
        <FlexRow
            css={{
                marginTop: 10,
                border: '1px solid #ddd',
                borderBottom: '1px',
                padding: '5px 10px',
                fontSize: 12
            }}>
            <FlexRow
                css={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <FlexCenter
                    css={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: '20px',
                        width: 80,
                    }}>
                    이름
                </FlexCenter>
            </FlexRow>
            <FlexRow
                css={{ flexGrow: 1 }}
            >
                <div
                    css={{
                        width: 1,
                        height: '100%',
                        backgroundColor: '#ddd',
                        margin: '0px 6px',
                    }}
                />
                <FlexRow
                    css={{
                        fontSize: 12,
                        color: '#666',
                        lineHeight: '20px',
                        alignItems: 'center',
                        flexGrow: 1,
                        gap: 10
                    }}>
                    <div css={{ width: 100, minWidth: 100 }}>브랜드</div>
                    <div css={{ flexGrow: 1 }} >운동부위</div>
                    <div css={{ width: 50, minWidth: 50 }}>수량</div>
                </FlexRow>
                <div
                    css={{
                        width: 1,
                        height: '100%',
                        backgroundColor: '#ddd',
                        margin: '0px 6px',
                    }}
                />
            </FlexRow>

            <FlexRow
                css={{ width: 50, minWidth: 50 }}
            >
                상세보기
            </FlexRow>
        </FlexRow>
        {hookMember.equipmentsCollection.slice(hookMember.page * takeCount, (hookMember.page + 1) * takeCount).map((item, index) => {
            return (
                <FlexRow
                    key={index.toString()}
                    css={{
                        marginTop: 10,
                        border: '1px solid #ddd',
                        borderBottom: '1px',
                        padding: '5px 10px',
                        fontSize: 12
                    }}>
                    <FlexRow
                        css={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <FlexCenter
                            css={{
                                color: "black",
                                fontSize: 14,
                                fontWeight: 'bold',
                                lineHeight: '20px',
                                width: 80,
                            }}>
                            {item.equipment.name}
                        </FlexCenter>
                    </FlexRow>
                    <FlexRow
                        css={{ flexGrow: 1 }}
                    >
                        <div
                            css={{
                                width: 1,
                                height: '100%',
                                backgroundColor: '#ddd',
                                margin: '0px 6px',
                            }}
                        />
                        <FlexRow
                            css={{
                                fontSize: 12,
                                color: '#666',
                                lineHeight: '20px',
                                alignItems: 'center',
                                flexGrow: 1,
                                gap: 5
                            }}>
                            <div css={{ width: 100, minWidth: 100 }}>{item.equipment.brandName}</div>
                            <div
                                css={{
                                    flexGrow: 1
                                }}
                            >{item.equipment.bodyParts?.map(part => part.name).join(",")}</div>
                            <div css={{ width: 50, minWidth: 50 }}>{item.idList.length}</div>
                        </FlexRow>
                        <div
                            css={{
                                width: 1,
                                height: '100%',
                                backgroundColor: '#ddd',
                                margin: '0px 6px',
                            }}
                        />
                    </FlexRow>
                    <Flex
                        css={{ justifyContent: 'center', gap: 3, width: 50, minWidth: 50 }}
                    >
                        {
                            buttonList.map(({ buttonAction, buttonName, buttonCss }, idx) => <FlexRow
                                key={idx.toString()}
                                onClick={() => {
                                    buttonAction(item);
                                }}
                                css={{
                                    fontSize: 11,
                                    color: '#999',
                                    width: 50,
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '1px solid #999',
                                    borderRadius: 5,
                                    padding: 3,
                                    ...buttonCss,
                                }}>
                                <div>{buttonName}</div>
                            </FlexRow>)
                        }
                    </Flex>

                </FlexRow>
            );
        })}
        {/* 페이징 */}
        <Flex>
            <FlexRow
                css={{
                    marginTop: 30,
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    '>div': {
                        fontSize: 12,
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        color: '#999',
                        cursor: 'pointer',
                    },
                    '>.btnPageNum:hover, >.btnPageNum.active': {
                        background: 'blue',
                        color: '#fff',
                    },
                }}>
                <FlexCenter onClick={() => {
                    if (hookMember.page <= 0) return;
                    hookMember.setPage(hookMember.page - 1);
                }}>
                    <Image
                        src={'/image/admin/table/arrow-left.svg'}
                        width={16}
                        height={16}
                        alt="이전 버튼"
                    />
                </FlexCenter>
                {/*  */}
                {/* {console.log(datas.length % basicItemCount)} */}
                {Array.from({ length: maxPageCount }, (v, i) => i + 1).map((page) => (
                    <FlexCenter
                        onClick={() => {
                            hookMember.setPage(page - 1);
                        }}
                        className={'btnPageNum ' + (page - 1 === hookMember.page && 'active')}
                        key={page - 1}>
                        {page}
                    </FlexCenter>
                ))}
                <FlexCenter onClick={() => {
                    if (hookMember.page >= maxPageCount - 1) return;
                    hookMember.setPage(maxPageCount - 1);
                }}>
                    <Image
                        src={'/image/admin/table/arrow-right.svg'}
                        width={16}
                        height={16}
                        alt="다음 버튼"
                    />
                </FlexCenter>
            </FlexRow>
        </Flex>
    </ContentFlex>
});

EquipmentsOnGymListScreen.displayName = "EquipmentsOnGymListScreen";

export default EquipmentsOnGymListScreen;