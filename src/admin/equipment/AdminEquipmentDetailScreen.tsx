import React from 'react';
import AdminHeader from 'src/common/header/AdminHeader';
import BasicModal from 'src/common/modal/BasicModal';
import {
    BorderRoundedContent,
    CheckBoxStyle,
    ContentHeader,
    InputStyle,
    StyledButton,
    StyledLargeButton,
    TheadSmall,
} from 'src/common/styledAdmin';
import { ContentFlex, Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import AdminTable from 'src/common/table/AdminTable';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { mediumBlack, fenxyBlue } from 'src/util/constants/style';
import DaumPostcode from 'react-daum-postcode';
import Image from 'next/image';
import { useAdminEquipmentDetailScreen } from './hooks/useAdminEquipmentDetailScreen';

const AdminEquipmentDetailScreen = () => {
    const hookMember = useAdminEquipmentDetailScreen();
    const btnCheckBoxStyle = {
        width: 160,
        marginLeft: -1,
        lineHeight: '36px',
        border: '1px solid #eee',
        display: 'inline-flex',
        justifyContent: 'center',
        color: '#999',
        // cursor: 'pointer',
        '&.active': {
            background: fenxyBlue,
            borderColor: fenxyBlue,
            color: 'white',
        },
        cursor: 'pointer'
    };
    return (
        <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdminHeader active={'기구관리'} activeItem={'기구 관리'} />
            <div css={{ marginLeft: 240, padding: 20, minWidth: 1100 }}>
                <FlexRow
                    css={{
                        paddingBottom: 20,
                        alignItems: 'center',
                        borderBottom: '2px solid #4A5864',
                    }}>
                    <div
                        css={{
                            fontSize: 18,
                            color: '#333',
                            fontWeight: 'bold',
                            flexGrow: 1,
                            lineHeight: '32px',
                        }}>
                        기구 관리
                    </div>
                    <FlexRow>
                        {/* {hookMember.user?.userType === 'BUSINESS' ? (
              <>
                <StyledButton css={{ background: yoksuriBlue }}>
                  승인
                </StyledButton>
                <StyledButton css={{ background: yoksuriBlue }}>
                  반려
                </StyledButton>
              </>
            ) : undefined} */}

                        <StyledButton
                            onClick={hookMember.onClickUpdate}
                            css={{ background: fenxyBlue }}>
                            수정
                        </StyledButton>
                        <StyledButton
                            css={{ backgroundColor: '#4A5864' }}
                            onClick={hookMember.onClickRouterList}>
                            목록
                        </StyledButton>
                    </FlexRow>
                </FlexRow>

                <BorderRoundedContent css={{ padding: 30 }}>
                    <Flex css={{ gap: 20 }}>
                        <FlexRow css={{ gap: 20 }}>
                            <Flex css={{ flex: 1 }}>
                                <TheadSmall>기구 번호</TheadSmall>
                                <Flex css={{ color: '#999' }}>{hookMember.data?.id}</Flex>
                            </Flex>
                            <Flex css={{ flex: 1 }}>
                                <TheadSmall>생성일</TheadSmall>
                                <Flex css={{ color: '#999' }}>
                                    {hookMember.data?.createdAt && (
                                        <GetSeoulTime time={hookMember.data.createdAt} long />
                                    )}
                                </Flex>
                            </Flex>
                        </FlexRow>
                    </Flex>
                </BorderRoundedContent>

                <BorderRoundedContent css={{ padding: 30 }}>
                    <Flex css={{ gap: 20, flexFlow: 'wrap' }}>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                이름<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    value={hookMember.name}
                                    onChange={(e) => hookMember.onChangeName(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                브랜드<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    value={hookMember.brandName}
                                    onChange={(e) => hookMember.onChangeBrandName(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                코드<span>*</span>
                            </TheadSmall>
                            <FlexRow css={{ color: '#999', lineHeight: '28px' }}>
                                <InputStyle
                                    type="text"
                                    css={{ flexGrow: 1 }}
                                    value={hookMember.code}
                                    onChange={(e) => hookMember.onChangeCode(e.target.value)}
                                />
                                <FlexCenter
                                    onClick={() => hookMember.onClickDuplicateCode()}

                                    css={{
                                        textAlign: 'center',
                                        border: `1px solid ${hookMember.isSameCode() ? '#ddd' : '#999'}`,
                                        color: hookMember.isSameCode() ? '#ddd' : '#999',
                                        borderRadius: 15,
                                        padding: '0 10px',
                                        fontSize: 12,
                                        fontWeight: 400,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    중복검사
                                </FlexCenter>
                            </FlexRow>
                            {!hookMember.isSameCode() && hookMember.duplicateCode && (
                                <div
                                    className="notBottomBorder"
                                    css={{ paddingTop: 8, marginBottom: 0, color: fenxyBlue }}>
                                    *중복검사를 해주세요.
                                </div>
                            )}
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>운동부위</TheadSmall>
                            <FlexRow css={{ color: '#999' }}>
                                <StyledLargeButton
                                    css={{ width: 'auto', maxWidth: 400, lineHeight: '28px', maxHeight: 'auto', textAlign: 'left' }}
                                    onClick={hookMember.onClickSelectBox}
                                >
                                    {hookMember.selectedValue.length == 0 ? "운동부위를 선택하세요" : hookMember.selectedValue}
                                </StyledLargeButton>
                            </FlexRow>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>활성화 여부</TheadSmall>
                            <FlexRow css={{ color: '#999' }}>
                                <div
                                    css={{ ...btnCheckBoxStyle }}
                                    onClick={() => hookMember.onToggleIsDisable()}
                                    className={
                                        hookMember.isDisable ? '' : 'active'
                                    }
                                // NOTE className="active"
                                >
                                    활성화
                                </div>
                            </FlexRow>
                        </Flex>
                        <Flex css={{ width: 'calc(100%)' }}>
                            <TheadSmall>헬스장 이미지</TheadSmall>
                            <Flex css={{ marginTop: 10 }}>
                                <FlexRow>
                                    <input
                                        type="file"
                                        id="gymPhoto"
                                        css={{ display: 'none' }}
                                        onChange={hookMember.onChangeEquipmentPhoto}
                                    />
                                    <label htmlFor="gymPhoto" css={{ flex: 1 }}>
                                        <FlexCenter
                                            css={{
                                                height: 40,
                                                flex: 1,
                                                borderRadius: 10,
                                                cursor: 'pointer',
                                                backgroundColor: '#666',
                                            }}>
                                            <FlexRow css={{ alignItems: 'center' }}>
                                                <div //사업자
                                                    css={{
                                                        width: 30,
                                                        height: 27,
                                                        backgroundImage: `url(/image/signup/camera_icon.png)`,
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        backgroundRepeat: 'no-repeat',
                                                        marginRight: 5,
                                                    }}
                                                />
                                                <div
                                                    css={{
                                                        marginLeft: 6,
                                                        fontSize: 17,
                                                        color: 'white',
                                                    }}>
                                                    기구 사진 첨부하기
                                                </div>
                                            </FlexRow>
                                        </FlexCenter>
                                    </label>
                                </FlexRow>
                                <FlexRow css={{ marginTop: 10 }}>
                                    <div
                                        css={{
                                            width: 115,
                                            height: 115,
                                            backgroundColor: '#f5f5f5',
                                        }}>
                                        {hookMember.equipmentPreviewPhoto && (
                                            <div
                                                css={{
                                                    backgroundImage: `url(${hookMember.equipmentPreviewPhoto})`,
                                                    width: 115,
                                                    height: 115,
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                }}
                                            />
                                        )}
                                    </div>
                                </FlexRow>
                            </Flex>
                        </Flex>

                    </Flex>
                </BorderRoundedContent>

            </div>
            <BasicModal
                display={hookMember.modalDisplayState}
                content={hookMember.modalContent}
                confirmBtn={hookMember.onClickCompleted}
            />
            <BasicModal
                display={hookMember.selectModalDisplayState}
                content={hookMember.bodyPartList?.filter(el => el.id != undefined).map((el, i) => (
                    <div
                        css={{ ...btnCheckBoxStyle, minWidth: 50 }}
                        key={el.id}
                        onClick={() => hookMember.onSetSelectedKeys(el.id as number)}
                        className={
                            hookMember.selectedKeys.has(el.id as number) ? 'active' : ''
                        }
                    // NOTE className="active"
                    >
                        {el.name + " (" + el.category + ")"}
                    </div>
                )) ?? <></>}
                confirmBtn={hookMember.onClickSelectCompleted}
            />
        </div>
    );
};

export default AdminEquipmentDetailScreen;
