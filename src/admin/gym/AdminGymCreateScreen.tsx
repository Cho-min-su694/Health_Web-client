import React from 'react';
import AdminHeader from 'src/common/header/AdminHeader';
import BasicModal from 'src/common/modal/BasicModal';
import {
    BorderRoundedContent,
    ContentHeader,
    InputStyle,
    StyledButton,
    TheadSmall,
} from 'src/common/styledAdmin';
import { ContentFlex, Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import AdminTable from 'src/common/table/AdminTable';
import GetSeoulTime from 'src/common/time/GetSeoulTime';
import { mediumBlack, fenxyBlue } from 'src/util/constants/style';
import { useAdminGymCreateScreen } from './hooks/useAdminGymCreateScreen';
import DaumPostcode from 'react-daum-postcode';
import Image from 'next/image';

const AdminGymCreateScreen = () => {
    const hookMember = useAdminGymCreateScreen();
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
            <AdminHeader active={'헬스장관리'} activeItem={'헬스장관리'} />
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
                        회원관리
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
                            onClick={hookMember.onClickUpdateGym}
                            css={{ background: fenxyBlue }}>
                            수정
                        </StyledButton>
                        <StyledButton
                            css={{ backgroundColor: '#4A5864' }}
                            onClick={hookMember.onClickRouterGym}>
                            목록
                        </StyledButton>
                    </FlexRow>
                </FlexRow>

                <BorderRoundedContent css={{ padding: 30 }}>
                    <Flex css={{ gap: 20, flexFlow: 'wrap' }}>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                헬스장명<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    value={hookMember.companyName}
                                    onChange={(e) => hookMember.onChangeCompanyName(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                관장명<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    value={hookMember.ceoName}
                                    onChange={(e) => hookMember.onChangeCeoName(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                사업자번호<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="number"
                                    value={hookMember.businessNumber}
                                    onChange={(e) => hookMember.onChangeBusinessNumber(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>헬스장 전화번호</TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="number"
                                    value={hookMember.companyPhone}
                                    onChange={(e) => hookMember.onChangeCompanyPhone(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>주소</TheadSmall>
                            <FlexRow>
                                <div css={{ flexGrow: 1, flexShrink: 1 }}>
                                    <FlexRow>
                                        <div css={{ flexGrow: 1, flexShrink: 1 }}>
                                            <input
                                                type="text"
                                                placeholder="사업장주소"
                                                disabled
                                                css={{
                                                    padding: 10,
                                                    paddingLeft: 12,
                                                    fontSize: 16,
                                                    border: '1px solid #ddd',
                                                    borderRadius: 4,
                                                    color: '#222',
                                                    '::placeholder': { color: '#888' },
                                                    width: '100%',
                                                }}
                                                value={hookMember.postCode}
                                            />
                                        </div>
                                        <FlexCenter
                                            onClick={hookMember.onClickPostCode}
                                            css={{
                                                backgroundColor: '#666',
                                                borderRadius: 4,
                                                height: 40,
                                                minWidth: 72,
                                                marginLeft: 10,
                                                color: 'white',
                                                fontSize: 12,
                                                cursor: 'pointer',
                                            }}>
                                            주소 검색
                                        </FlexCenter>
                                    </FlexRow>
                                    <div
                                        css={{
                                            marginLeft: 12,
                                            fontSize: 12,
                                            color: '#999',
                                            marginTop: 4,
                                        }}>
                                        우편번호
                                    </div>
                                    <Flex
                                        css={{
                                            marginTop: 10,
                                        }}>
                                        <input
                                            type="text"
                                            placeholder="주소"
                                            disabled
                                            css={{
                                                padding: 10,
                                                paddingLeft: 12,
                                                fontSize: 16,
                                                border: '1px solid #ddd',
                                                borderRadius: 4,
                                                color: '#222',
                                                '::placeholder': { color: '#888' },
                                                flexGrow: 1,
                                                flexShrink: 1,
                                            }}
                                            value={hookMember.mainAddress}
                                        />
                                    </Flex>
                                    <Flex
                                        css={{
                                            marginTop: 10,
                                        }}>
                                        <input
                                            type="text"
                                            placeholder="상세주소"
                                            css={{
                                                padding: 10,
                                                paddingLeft: 12,
                                                fontSize: 16,
                                                border: '1px solid #ddd',
                                                borderRadius: 4,
                                                color: '#222',
                                                '::placeholder': { color: '#888' },
                                                flexGrow: 1,
                                                flexShrink: 1,
                                            }}
                                            value={hookMember.subAddress}
                                            maxLength={40}
                                            onChange={(e) => {
                                                hookMember.onChangeSubAddress(e.target.value);
                                            }}
                                        />
                                    </Flex>
                                </div>
                            </FlexRow>
                        </Flex>

                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>헬스장 긴급번호</TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="number"
                                    value={hookMember.companyCellPhone}
                                    onChange={(e) => hookMember.onChangeCompanyCellPhone(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>팩스 번호</TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="number"
                                    value={hookMember.companyCellPhone}
                                    onChange={(e) => hookMember.onChangeCompanyCellPhone(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>이메일</TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    value={hookMember.companyEmail}
                                    onChange={(e) => hookMember.onChangeCompanyEmail(e.target.value)}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(100%)' }}>
                            <TheadSmall>헬스장 이미지</TheadSmall>
                            <Flex css={{ marginTop: 10 }}>
                                <FlexRow>
                                    <input
                                        type="file"
                                        id="gymPhoto"
                                        css={{ display: 'none' }}
                                        onChange={hookMember.onChangeGymPhoto}
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
                                                    헬스장 로고 사진 첨부하기
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
                                        {hookMember.gymPreviewPhoto && (
                                            <div
                                                css={{
                                                    backgroundImage: `url(${hookMember.gymPreviewPhoto})`,
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
            <ContentFlex css={{ minHeight: '100vh' }}>
                <DaumPostcode
                    style={{ width: '100%', height: '100%' }}
                    onComplete={async (data) => {
                        hookMember.onCompletePostCode(data);
                    }}
                    autoClose={false}
                />
            </ContentFlex>
        </div>
    );
};

export default AdminGymCreateScreen;
