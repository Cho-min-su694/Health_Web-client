import { CheckBoxStyleButton, ContentFlex, Flex, FlexCenter, FlexRow } from "src/common/styledComponents";
import { EquipmentCollection, useEquipmentsOnGymListScreen } from "./hooks/useEquipmentsOnGymListScreen";
import Image from 'next/image';
import { Equipment, GymEuquipmentsOnGyms } from "src/api/equipmentsApi";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { forwardRef, useImperativeHandle } from "react";

interface IHeader {
    width?: number;
    flexGrow?: number;
    name: string;
    Cell?: (props: { data: EquipmentCollection }) => EmotionJSX.Element;
    selector: string
}

const EquipmentsOnGymListScreen = forwardRef(({
    gymId,
    takeCount,
    showPageCount,
    headers
}: {
    gymId: number;
    takeCount: number;
    showPageCount: number;
    headers: (IHeader | null)[];
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
        <FlexRow>
            {hookMember.bodyPartCategoryList.map((el, i) => (
                <CheckBoxStyleButton
                    css={{
                        fontSize:14,
                        lineHeight:'auto',
                        flexGrow:1
                    }}
                    onClick={() => hookMember.onChangeBodyPartCategory(el)}
                    key={i.toString()}
                    className={hookMember.bodyPartCategory === el ? 'active' : ''}>
                    {el}
                </CheckBoxStyleButton>
            ))}
        </FlexRow>
        <FlexRow
            css={{
                marginTop: 10,
                border: '1px solid #ddd',
                borderBottom: '1px',
                padding: '5px 10px',
                fontSize: 12,
                color: '#666',
                lineHeight: '20px',
                alignItems: 'center',
                width: '100%',
                gap: 10
            }}>
            {
                headers.filter(v=>v!=null).map((item, idx) => {
                    let addCss: any = {};
                    if (item.width) {
                        addCss = {
                            width: item.width, minWidth: item.width
                        }
                    }
                    if (item.flexGrow) {
                        addCss.flexGrow = item.flexGrow;
                    }
                    return <div
                        key={idx.toString()}
                        css={{ width: 50, minWidth: 50, ...addCss }}
                    >
                        {item.name}
                    </div>
                })
            }
        </FlexRow>
        {hookMember.dataList.map((item, index) => {
            return (
                <FlexRow
                    key={index.toString()}
                    css={{
                        marginTop: 10,
                        border: '1px solid #ddd',
                        borderBottom: '1px',
                        padding: '5px 10px',
                        fontSize: 12,
                        color: '#666',
                        lineHeight: '20px',
                        alignItems: 'center',
                        width: '100%',
                        gap: 10
                    }}>
                    {
                        headers.filter(v=>v!=null).map((inItem, idx) => {
                            let addCss: any = {};
                            if (inItem.width) {
                                addCss = {
                                    width: inItem.width, minWidth: inItem.width
                                }
                            }
                            if (inItem.flexGrow) {
                                addCss.flexGrow = inItem.flexGrow;
                            }
                            return <div
                                key={idx.toString()}
                                css={{ width: 50, minWidth: 50, ...addCss }}
                            >
                                {inItem.Cell ? (
                                    <inItem.Cell data={item} />
                                ) : (
                                    (item?.equipment as any)[inItem.selector]
                                )}
                            </div>
                        })
                    }
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