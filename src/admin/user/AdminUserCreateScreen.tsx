import React from 'react';
import AdminHeader from 'src/common/header/AdminHeader';
import BasicModal from 'src/common/modal/BasicModal';
import {
    BorderRoundedContent,
    InputStyle,
    StyledButton,
    TheadSmall,
} from 'src/common/styledAdmin';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import { fenxyBlue } from 'src/util/constants/style';
import { useAdminUserCreateScreen } from './hooks/useAdminUserCreateScreen';

const AdminUserCreateScreen = () => {
    const hookMember = useAdminUserCreateScreen();
    const btnCheckBoxStyle = {
        width: 160,
        marginLeft: -1,
        lineHeight: '36px',
        border: '1px solid #eee',
        display: 'inline-flex',
        justifyContent: 'center',
        color: '#999',
        cursor: 'pointer',
        '&.active': {
            background: fenxyBlue,
            borderColor: fenxyBlue,
            color: 'white',
        },
    };
    return (
        <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <AdminHeader active={'회원관리'} activeItem={'회원관리'} />
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
                        직원 추가
                    </div>
                    <FlexRow>
                        <StyledButton
                            css={{ background: fenxyBlue }}
                            onClick={hookMember.onClickCreateUser}>
                            저장
                        </StyledButton>
                        <StyledButton
                            css={{ backgroundColor: '#4A5864' }}
                            onClick={hookMember.onClickRouterUser}>
                            목록
                        </StyledButton>
                    </FlexRow>
                </FlexRow>

                <BorderRoundedContent css={{ padding: 30 }}>
                    <Flex css={{ gap: 20, flexFlow: 'wrap' }}>
                        <Flex css={{ flex: 1, flexBasis: '100%' }}>
                            <TheadSmall>
                                회원분류<span>*</span>
                            </TheadSmall>
                            <FlexRow className="notBottomBorder">
                                <div
                                    css={btnCheckBoxStyle}
                                    className={`${hookMember.userType === 'GENERAL' && 'active'
                                        }`}
                                    onClick={(e) => {
                                        hookMember.onChangeUserType('GENERAL')
                                    }}>
                                    일반 회원
                                </div>
                                <div
                                    css={btnCheckBoxStyle}
                                    className={`${hookMember.userType === 'MANAGER' && 'active'
                                        }`}
                                    onClick={(e) => {
                                        hookMember.onChangeUserType('MANAGER')
                                    }}>
                                    매니저
                                </div>
                            </FlexRow>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                아이디<span>*</span>
                            </TheadSmall>
                            <FlexRow css={{ color: '#999', lineHeight: '28px' }}>
                                <InputStyle
                                    type="text"
                                    css={{ flexGrow: 1 }}
                                    placeholder="아이디"
                                    value={hookMember.loginId}
                                    onChange={(e) => {
                                        hookMember.onChangeLoginId(e.target.value);
                                    }}
                                />
                                <FlexCenter
                                    onClick={() => hookMember.onClickDiplucateUserId()}
                                    css={{
                                        textAlign: 'center',
                                        border: '1px solid #999',
                                        color: '#999',
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
                            {hookMember.duplicateId && (
                                <div
                                    className="notBottomBorder"
                                    css={{ paddingTop: 8, marginBottom: 0, color: fenxyBlue }}>
                                    *중복검사를 해주세요.
                                </div>
                            )}
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                비밀번호<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="password"
                                    placeholder="비밀번호"
                                    value={hookMember.password}
                                    onChange={(e) => {
                                        hookMember.onChangePw(e.target.value);
                                    }}
                                />
                            </Flex>
                        </Flex>
                        {/* {hookMember.userType === 'GENERAL' && (
              <> */}
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                이름<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="text"
                                    placeholder="이름"
                                    value={hookMember.name}
                                    onChange={(e) => {
                                        hookMember.onChangeName(e.target.value)
                                        // hookMember.onChangeUserData('username', e.target.value);
                                    }}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                비밀번호 확인<span>*</span>
                            </TheadSmall>
                            <Flex css={{ color: '#999' }}>
                                <InputStyle
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={hookMember.repassword}
                                    onChange={(e) => {
                                        hookMember.onChangeRePw(e.target.value);
                                    }}
                                />
                            </Flex>
                        </Flex>
                        <Flex css={{ width: 'calc(50% - 15px)' }}>
                            <TheadSmall>
                                별명<span>*</span>
                            </TheadSmall>
                            <FlexRow css={{ color: '#999', lineHeight: '28px' }}>
                                <InputStyle
                                    css={{
                                        flexGrow: 1,
                                    }}
                                    type="text"
                                    placeholder="별명"
                                    onChange={(e) => {
                                        hookMember.onChangeNickname(e.target.value)
                                        // hookMember.onChangeUserData('nickname', e.target.value);
                                    }}
                                />
                                <FlexCenter
                                    onClick={() => hookMember.onClickDiplucateNickname()}
                                    css={{
                                        textAlign: 'center',
                                        border: '1px solid #999',
                                        color: '#999',
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
                            {hookMember.duplicateNickname && (
                                <div
                                    className="notBottomBorder"
                                    css={{
                                        paddingTop: 8,
                                        marginBottom: 0,
                                        color: fenxyBlue,
                                    }}>
                                    *중복검사를 해주세요.
                                </div>
                            )}
                        </Flex>
                        {/* </>
            )} */}
                    </Flex>
                </BorderRoundedContent>
            </div>
            <BasicModal
                display={hookMember.modalDisplayState}
                content={hookMember.modalContent}
                confirmBtn={hookMember.onClickCompleted}
            />
        </div>
    );
};

export default AdminUserCreateScreen;
