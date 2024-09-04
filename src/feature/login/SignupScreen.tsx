import { NextPage } from 'next';
import Image from 'next/image';
import { MainFooter } from 'src/common/footer/MainFooter';
import Header from 'src/common/header/Header';
import { ContentFlex, Flex, FlexCenter, FlexRow, FooterLayout } from 'src/common/styledComponents';
import { useSignupScreen } from './hooks/useSignupScreen';
import Link from 'next/link';
import { lowBlack } from 'src/util/constants/style';
import BasicModal from 'src/common/modal/BasicModal';
import { useSearchParams } from 'next/navigation';
import BusinessInfoWrite from './BusinessInfoWrite';

const underTextCss = { marginLeft: 12, fontSize: 12, color: '#999', marginTop: 4, }

const SignupScreen: NextPage = () => {
  const hookMember = useSignupScreen();

  const params = useSearchParams();

  if (hookMember.loading) {
    return (
      <Flex css={{ flex: 1, backgroundColor: 'white' }}>
        <Flex
          css={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex>
      <Flex css={{ minHeight: '100vh' }}>

        <BasicModal
          display={hookMember.generalUserDataErrorDisplayState}
          content={hookMember.errorMessage}
          confirmBtn={() => {
            hookMember.onClickGeneralUserDataErrorModal();
          }}
        />
        <div>
          <Header
            hasBorder
            LeftComponent={
              <div
                onClick={hookMember.onClickHistoryBack}
                css={{
                  transform: 'rotate(-180deg)',
                  height: 24,
                  width: 24,
                  position: 'relative',
                  cursor: 'pointer',
                }}>
                <Image
                  src="/image/icon/arrow-right-black-tail.svg"
                  layout="fill"
                  alt="arrow"
                />
              </div>
            }
            CenterComponent={<span>회원가입</span>}
          />
        </div>
        <ContentFlex
          css={{
            padding: 20,
            alignContent: 'center',
          }}>



          {/*  */}
          {(
            <>
              <FlexRow>
                <input
                  type="text"
                  placeholder="아이디"
                  css={{
                    padding: 10,
                    paddingLeft: 12,
                    fontSize: 16,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    color: '#222',
                    '::placeholder': { color: '#888' },
                    // flexGrow: 1,
                    width: '100%',
                  }}
                  maxLength={12}
                  minLength={4}
                  required
                  title="5 to 10"
                  value={hookMember.generalUserData.userId}
                  onChange={(e) => {
                    let text = e.target.value;
                    // text = text.replace(/[^a-zA-Z0-9-_]/g, '');
                    hookMember.onChangeGeneralUserData('userId', text);
                    hookMember.onChangeGeneralUserId();
                  }}
                />
                <FlexCenter
                  onClick={hookMember.onClickDiplucateUserId}
                  css={{
                    backgroundColor: '#666',
                    borderRadius: 4,
                    height: 40,
                    width: 100,
                    marginLeft: 10,
                    color: 'white',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}>
                  중복확인
                </FlexCenter>
              </FlexRow>
              {hookMember.generalUserData.userId !== '' ?
                hookMember.duplicateId ?
                  (
                    <div
                      css={{
                        ...underTextCss,
                        color: '#C12B2B',
                      }}>
                      중복 확인을 해주세요.
                    </div>
                  ) :
                  <div
                    css={{
                      ...underTextCss,
                      color: 'blue',
                    }}>
                    사용할 수 있는 아이디입니다.
                  </div> :
                <div css={{ ...underTextCss }}>
                  8~12자 영문, 숫자로 입력해주세요.
                </div>}


              <input
                type="password"
                placeholder="비밀번호"
                css={{
                  marginTop: 16,
                  padding: 10,
                  paddingLeft: 12,
                  fontSize: 16,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  color: '#222',
                  '::placeholder': { color: '#888' },
                  flexGrow: 1,
                  flexShrink: 1,
                  ':focus': {
                    '~ #pwText': {
                      display: 'block',
                    },
                  },
                }}
                value={hookMember.generalUserData.password}
                maxLength={16}
                minLength={8}
                onChange={(e) => {
                  hookMember.onChangeGeneralUserData(
                    'password',
                    e.target.value,
                  );
                }}
              />
              <div
                id="pwText"
                css={{
                  ...underTextCss,
                }}>
                영문 대소문자, 숫자, 특수문자(!@#~^*&)중 3가지 이상을 <br />혼합하여 8~16자로 입력해주세요.
              </div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                css={{
                  padding: 10,
                  paddingLeft: 12,
                  fontSize: 14,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  color: '#333',
                  '::placeholder': { color: '#999' },
                  marginTop: 16,
                }}
                maxLength={16}
                value={hookMember.generalUserData.repassword}
                onChange={(e) => {
                  hookMember.onChangeGeneralUserData(
                    'repassword',
                    e.target.value,
                  );
                }}
              />
              {hookMember.checkPassword ===
                undefined ? undefined : hookMember.checkPassword ? (
                  <div css={{ ...underTextCss, color: 'blue' }}>
                    비밀번호가 일치합니다.
                  </div>
                ) : (
                <div
                  css={{ ...underTextCss, color: '#C12B2B' }}>
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </>
          )}

          <input
            type="text"
            placeholder="이름"
            css={{
              padding: 10,
              paddingLeft: 12,
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 4,
              color: '#333',
              '::placeholder': { color: '#999' },
              marginTop: 16,
            }}
            value={hookMember.generalUserData.username}
            maxLength={20}
            minLength={2}
            onChange={(e) => {
              hookMember.onChangeGeneralUserData('username', e.target.value);
            }}
          />
          <div css={underTextCss}>
            실명을 입력해주세요.
          </div>

          <FlexRow css={{ marginTop: 16 }}>
            <input
              type="text"
              placeholder="닉네임"
              css={{
                padding: 10,
                paddingLeft: 12,
                fontSize: 14,
                border: '1px solid #ddd',
                borderRadius: 4,
                color: '#333',
                '::placeholder': { color: '#999' },
                flexGrow: 1,
              }}
              value={hookMember.generalUserData.nickname}
              maxLength={8}
              minLength={2}
              onChange={(e) => {
                let text = e.target.value;
                // text = text.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ-_ ]/g, '');
                hookMember.onChangeGeneralUserData('nickname', text);
                hookMember.onChangeGeneralNickname();
              }}
            />
            <FlexCenter
              onClick={hookMember.onClickDiplucateNickname}
              css={{
                backgroundColor: '#666',
                borderRadius: 4,
                height: 40,
                width: 100,
                marginLeft: 10,
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
              }}>
              중복확인
            </FlexCenter>
          </FlexRow>

          {hookMember.generalUserData.nickname !== '' ?
            hookMember.duplicateNickname ?
              (
                <div
                  css={{
                    ...underTextCss,
                    color: '#C12B2B',
                  }}>
                  중복 확인을 해주세요.
                </div>
              ) :
              <div
                css={{
                  ...underTextCss,
                  color: 'blue',
                }}>
                사용할 수 있는 닉네임입니다.
              </div> :
            <div css={{ ...underTextCss }}>
              2~8자, 한글, 영문, 숫자로 입력해주세요.
            </div>}
          <FlexRow css={{ marginTop: 16 }}>
            <input
              type="tel"
              inputMode='tel'
              placeholder="휴대폰 번호"
              css={{
                flex: 1,
                padding: 10,
                paddingLeft: 12,
                fontSize: 14,
                border: '1px solid #ddd',
                borderRadius: 4,
                color: '#333',
                '::placeholder': { color: '#999' },
              }}
              maxLength={13}
              value={hookMember.generalUserData.phone}
              onChange={(e) => {
                let text = e.target.value;
                text = text
                  .replace(/[^0-9]/g, '')
                  .replace(
                    /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
                    '$1-$2-$3',
                  )
                  .replace('--', '-');
                hookMember.onChangeGeneralUserData('phone', text);
              }}
            />
            <FlexCenter
              onClick={hookMember.onClickDiplucatePhoneNumber}
              css={{
                backgroundColor: '#666',
                borderRadius: 4,
                height: 40,
                width: 100,
                marginLeft: 10,
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
              }}>
              중복확인
            </FlexCenter>
          </FlexRow>
          {hookMember.generalUserData.phone !== '' ?
            hookMember.duplicatePhonenumber ?
              (
                <div
                  css={{
                    ...underTextCss,
                    color: '#C12B2B',
                  }}>
                  중복 확인을 해주세요.
                </div>
              ) :
              <div
                css={{
                  ...underTextCss,
                  color: 'blue',
                }}>
                사용할 수 있는 전화번호입니다.
              </div> :
            <div css={{ ...underTextCss }}>
              휴대폰 번호를 입력해주세요.
            </div>}
          { !hookMember.isBusiness ?
            <FlexCenter
            onClick={() => {
              //
              hookMember.onClickSignup();
            }}
            css={{
              backgroundColor: 'orange',
              padding: 11,
              marginTop: 16,
              cursor: 'pointer',
              borderRadius: 8,
            }}>
            <div css={{ color: 'white', fontSize: 18, lineHeight: '28px' }}>
              회원가입
            </div>
          </FlexCenter> : undefined}
        </ContentFlex>
        {hookMember.isBusiness ?
          <BusinessInfoWrite checkSignUpInform={hookMember.checkSignUpInform} generalUserData={hookMember.generalUserData} />
          : undefined
        }
      </Flex>
      <MainFooter />
    </Flex>
  );
};
export default SignupScreen;
