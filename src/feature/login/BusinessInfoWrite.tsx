import Link from 'next/link';
import DaumPostcode from 'react-daum-postcode';
import Header from 'src/common/header/Header';
import BasicModal from 'src/common/modal/BasicModal';
import ConfirmModal from 'src/common/modal/ConfirmModal';
import {
  ContentFlex,
  Flex,
  FlexCenter,
  FlexRow,
  FooterLayout,
} from 'src/common/styledComponents';
import { useBusinessInfoWrite } from './hooks/useBusinessInfoWrite';
import { lowBlack } from 'src/util/constants/style';
import { GeneralUserData } from './hooks/useSignupScreen';
import Image from 'next/image'

const BusinessInfoWrite = ({
  checkSignUpInform,
  generalUserData
}: {
  checkSignUpInform: () => boolean;
  generalUserData: GeneralUserData;
}) => {
  const hookMember = useBusinessInfoWrite({
    checkSignUpInform,
    generalUserData
  });

  return (
    <div>
      <ConfirmModal
        display={hookMember.confirmModalDisplayState}
        content={hookMember.confirmModalContent}
        closeBtn={hookMember.onClickCloseConfirmModal}
        confirmBtn={hookMember.confirmModalConfirmBtn}
      />
      <BasicModal
        display={hookMember.basicModalDisplayState}
        content={hookMember.basicModalContent}
        confirmBtn={hookMember.basicModalConfirmBtn}
      />
      {/* 다음 우편번호 검색 모달 */}
      <Flex
        css={{
          display: hookMember.postcodeDisplayState,
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
          padding: 10,
          backgroundColor: 'rgba(0,0,0,0.3)',
          flex: 1,
        }}>
        <Header
          CenterComponent={
            <div css={{ fontSize: 14, color: '#333', fontWeight: 500 }}>
              우편번호 찾기
            </div>
          }
          RightComponent={
            <div
              css={{
                cursor: 'pointer',
                width: 24,
                height: 24,
                backgroundImage: 'url(/image/icon/cancel-black.svg)',
              }}
              onClick={hookMember.onClickPostCode}></div>
          }
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
      </Flex>
      <ContentFlex>

        <Flex
          css={{
            padding: 20,
            ' > div:nth-of-type(1)': { marginTop: 0 },
            ' > div': { marginTop: 16 },
          }}>

          <FlexCenter
            css={{
              padding: 10,
              fontSize: 20,
              border: '1px solid #ddd',
              color: '#222',
              marginBottom: 20
            }}
          >
            헬스장 등록
            <div
              css={{
                transform: 'rotate(90deg)',
                height: 24,
                width: 24,
                position: 'relative',
              }}>
              <Image
                src="/image/icon/arrow-right-black-tail.svg"
                alt="arrow"
                layout="fill"
              />
            </div>
          </FlexCenter>

          <FlexRow css={{ alignItems: 'center' }}>
            <div
              css={{
                flexGrow: 1,
                flexShrink: 1,
              }}>
              <input
                type="text"
                placeholder="회사명"
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
                value={hookMember.companyName}
                maxLength={40}
                minLength={2}
                onChange={(e) => {
                  hookMember.onChangeCompanyName(e.target.value);
                  hookMember.onChangeDuplicateCompanyName();
                }}
              />
            </div>
            <FlexCenter
              onClick={hookMember.onClickDuplicateCompanyName}
              css={{
                backgroundColor: '#666',
                borderRadius: 4,
                height: 40,
                minWidth: 72,
                marginLeft: 10,
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                paddingLeft: 12,
                paddingRight: 12,
              }}>
              중복확인
            </FlexCenter>
          </FlexRow>
          {hookMember.duplicateCompanyName ? (
            <div
              css={{
                marginLeft: 12,
                fontSize: 12,
                color: '#C12B2B',
                marginTop: '4px !important',
              }}>
              중복 확인를 해주세요.
            </div>
          ) : undefined}
          <FlexRow css={{ alignItems: 'center' }}>
            <input
              type="text"
              placeholder="대표자명"
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
              value={hookMember.ceoName}
              maxLength={20}
              minLength={2}
              onChange={(e) => {
                hookMember.onChangeCeoName(e.target.value);
              }}
            />
          </FlexRow>
          <Flex>
            <FlexRow>
              <input
                type="text"
                placeholder="사업자번호"
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
                value={hookMember.businessNumber}
                maxLength={10}
                minLength={10}
                onChange={(e) => {
                  let text = e.target.value;
                  text = text.replace(/[^0-9]/g, '');
                  hookMember.onChangeBusinessNumber(text);
                }}
              />
            </FlexRow>
            <div
              css={{
                marginLeft: 12,
                fontSize: 12,
                color: '#999',
                marginTop: 4,
              }}>
              숫자만 입력해 주세요.
            </div>
            <Flex css={{ marginTop: 10 }}>
              <FlexRow>
                <input
                  type="file"
                  id="businessNumberPhoto"
                  css={{ display: 'none' }}
                  onChange={hookMember.onChangeGymPhoto}
                />
                <label htmlFor="businessNumberPhoto" css={{ flex: 1 }}>
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
          <FlexRow>
            <input
              type="tel"
              inputMode='tel'
              placeholder="대표전화 (일반전화)"
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
              value={hookMember.companyPhone}
              maxLength={11}
              minLength={10}
              onChange={(e) => {
                let text = e.target.value;
                text = text.replace(/[^0-9]/g, '');
                hookMember.onChangeCompanyPhone(text);
              }}
            />
          </FlexRow>
          <FlexRow>
            <input
              type="tel"
              inputMode='tel'
              placeholder="긴급전화 (휴대전화)"
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
              value={hookMember.companyCellPhone}
              maxLength={11}
              minLength={10}
              onChange={(e) => {
                let text = e.target.value;
                text = text.replace(/[^0-9]/g, '');
                hookMember.onChangeCompanyCellPhone(text);
              }}
            />
          </FlexRow>
          <FlexRow>
            <input
              type="text"
              placeholder="팩스"
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
              value={hookMember.companyFax}
              maxLength={11}
              minLength={10}
              onChange={(e) => {
                let text = e.target.value;
                text = text.replace(/[^0-9]/g, '');
                hookMember.onChangeCompanyFax(text);
              }}
            />
          </FlexRow>
          <FlexRow>
            <input
              type="text"
              placeholder="이메일"
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
              value={hookMember.companyEmail}
              maxLength={40}
              onChange={(e) => {
                hookMember.onChangeCompanyEmail(e.target.value);
              }}
            />
          </FlexRow>
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
          </FlexCenter>
        </Flex>
        <div css={{ height: 112 }} />
      </ContentFlex>

    </div>
  );
};

export default BusinessInfoWrite;
