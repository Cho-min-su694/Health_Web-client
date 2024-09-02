import { NextPage } from 'next';
import Image from 'next/image';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import { useLoginScreen } from './hooks/useLoginScreen';
import Header from 'src/common/header/Header';
import { MainFooter } from 'src/common/footer/MainFooter';

const LoginScreen: NextPage = () => {
  const hookMember = useLoginScreen();

  return (
    <Flex>
      <Flex css={{ minHeight: '100vh' }}>
        <Header
          hasBorder
          CenterComponent={
            <div css={{ color: '#222', fontSize: 16, fontWeight: 500 }}>
              로그인
            </div>
          }
        />
        <div>
          <FlexCenter
            css={{
              maxWidth: 640,
              margin: '0 auto',
              textAlign: 'left',
              fontSize: 40,
              color: '#333',
              fontWeight: 400,
              paddingTop: 20,
              paddingRight: 20,
              paddingLeft: 20,
            }}>
            <span css={{}}>WELCOME TO METAVERSE</span>

            <Flex
              css={{
                textAlign: 'left',
                fontSize: 17,
                color: '#666',
                fontWeight: 400,
                paddingTop: 20,
                paddingBottom: 40,
              }}>
              <span>환영합니다. 로그인하여 접속하세요.</span>
            </Flex>
          </FlexCenter>
          {/*  */}
          <Flex
            css={{
              maxWidth: 640,
              margin: '0 auto',
              paddingRight: 20,
              paddingLeft: 20,
            }}>
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
              value={hookMember.loginData.loginId}
              maxLength={12}
              minLength={4}
              onChange={(e) => {
                let text = e.target.value;
                // text = text.replace(/[^a-zA-Z0-9-_]/g, '');
                hookMember.onChangeLoginData('loginId', text);
              }}
            />
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
              value={hookMember.loginData.loginPw}
              maxLength={16}
              onChange={(e) => {
                hookMember.onChangeLoginData('loginPw', e.target.value);
              }}
              onKeyPress={
                e=>{
                  if(e.key === "Enter") hookMember.onClickLogin();
                }
              }
            />
            <FlexCenter
              onClick={() => {
                //
                hookMember.onClickLogin();
              }}
              css={{
                backgroundColor: 'blue',
                padding: 11,
                marginTop: 16,
                cursor: 'pointer',
                borderRadius: 8,
              }}>
              <div css={{ color: 'white', fontSize: 18, lineHeight: '28px' }}>
                로그인
              </div>
            </FlexCenter>
            <FlexCenter
              css={{
                marginTop: 50,
                marginBottom: 50,
              }}>
            </FlexCenter>
          </Flex>
        </div>
        {/* <FlexCenter>
            {hookMember.debugText}
        </FlexCenter> */}
      </Flex>
      <MainFooter />
    </Flex>
  );
};
export default LoginScreen;
