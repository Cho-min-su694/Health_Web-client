import AdminConfirmModal from 'src/common/modal/AdminConfirmModal';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import { Bar, InputStyle, TheadSmall } from '../styledAdmin';
import { Dispatch, SetStateAction } from 'react';
import { useAdminModifyModal } from './hooks/useAdminModifyModal';

const AdminModifyModal = ({
    title,
    isModify,
    originalData,
    headerMap,
    setModifyData,
    display,
    onCloseDisplay,
}: {
    title: string;
    isModify: boolean;
    originalData: Map<string, any>;
    headerMap: Map<string, string>;
    setModifyData: (data: Map<string, any>)=>void;
    display: 'flex' | 'none';
    onCloseDisplay: () => void;
}) => {
    const hookMember = useAdminModifyModal({
        originalData,
        setModifyData
    });

    return (
        <FlexCenter
            css={{
                display: display,
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                zIndex: 20,
            }}>
            <AdminConfirmModal
                display={'flex'}
                title={title + (isModify ? ' 수정하기' : ' 생성하기')}
                content={
                    <Flex>
                        <Flex css={{ gap: 10, flexGrow: 1 }}>
                            {
                                
                                Array.from(headerMap.entries()).map((keyValue, index) => {
                                    const [key, headerName] = keyValue;

                                    const value = hookMember.data.get(key);

                                    let typeObject:{type?:string} = {}

                                    switch(typeof value) {
                                        case 'number': typeObject = {type:'number'}; break;
                                        case 'string': typeObject = {type:'text'}; break;
                                    }

                                    return <Flex
                                        key={index}
                                    >
                                        <TheadSmall
                                            css={{
                                                fontSize: 14,
                                            }}>
                                            {headerName}
                                        </TheadSmall>
                                        <InputStyle
                                            {...typeObject}
                                            css={{
                                                border: '1px solid #dddddd',
                                                borderRadius: 8,
                                                padding: 8,
                                                fontSize: 14,
                                            }}
                                            placeholder={`${headerName}를 입력해주세요.`}
                                            value={value}
                                            onChange={(e) => hookMember.onChangeData(key, e.target.value)}
                                        />
                                        {
                                            index != hookMember.data.size? <Bar css={{ marginTop: 10 }}/> : undefined
                                        }
                                    </Flex>;
                                })
                            }
                        </Flex>
                    </Flex>
                }
                closeBtn={onCloseDisplay}
                confirmBtn={hookMember.confirmOriginalData}
            />
        </FlexCenter>
    );
};

export default AdminModifyModal;
