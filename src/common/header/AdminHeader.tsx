import Image from 'next/image';
import { fenxyBlue } from 'src/util/constants/style';
import AdminAccept from '../adminAccept/AdminAccept';
import ConfirmModal from '../modal/ConfirmModal';
import { Flex, FlexCenter, FlexRow } from '../styledComponents';
// import AdminOrderAlarmList from './AdminOrderAlarmList';
import { navArray, useAdminHeader } from './hooks/useAdminHeader';

const AdminHeader = ({
  hidden = false,
  active,
  activeItem,
}: {
  hidden?: boolean;
  active?: string;
  activeItem?: any;
}) => {
  const hookMember = useAdminHeader();

  const Nav = ({
    parent,
    activeItem,
  }: {
    parent: string;
    activeItem?: string;
  }) => {
    return (
      <>
        <div
          css={{
            backgroundColor: '#37414A',
            fontSize: 14,
            lineHeight: '40px',
            padding:
              navArray.filter((e) => e.title === parent).length > 0
                ? '10px 0'
                : 0,
          }}>
          {navArray.map((item, index) => {
              if (item.title === parent)
                return (
                  <Flex
                    key={index.toString()}
                    onClick={() => {
                      hookMember.onClickSubMenu(item.name);
                    }}
                    css={{
                      color: item.name === activeItem ? '#fff' : '#999',
                      height: 40,
                      cursor: 'pointer',
                      paddingLeft: 20,
                    }}>
                    {item.name}
                  </Flex>
                );
            })}
        </div>
      </>
    );
  };

  return (
    <div css={{ display: hidden ? 'none' : 'block' }}>
      <AdminAccept />
      <ConfirmModal
        display={hookMember.confirmModal}
        content={'로그아웃 하시겠습니까?'}
        confirmBtn={hookMember.onClickLogout}
        closeBtn={hookMember.onClickCloseConfirmModal}
      />
      <FlexRow
        css={{
          backgroundColor: '#4A5864',
          height: 60,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 20,
        }}>
        {/* <AdminOrderAlarmList
          userType={hookMember.userType}
        /> */}
        {/* <Flex
          css={{ marginRight: 50, cursor: 'pointer' }}
          onClick={hookMember.onClickRouterMain}>
          <Image
            src="/image/newnewLogo.png"
            width="150"
            height="36"
            alt="욕수리로고"
          />
        </Flex> */}
        <Flex
          css={{
            position: 'relative',
            ':hover': {
              '>.accountSetting': {
                display: 'block',
              },
            },
          }}>
          <FlexRow
            css={{
              width: 165,
              height: 60,
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
            <Flex css={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
              {hookMember.adminName}님
            </Flex>
            <div
              css={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                transform: 'rotate(90deg)',
                position: 'relative',
              }}>
              <Image
                src={'/image/icon/arrow-right-white-no-tail.svg'}
                layout="fill"
                alt="계정관리 버튼"
              />
            </div>
          </FlexRow>
          <div
            className="accountSetting"
            css={{
              position: 'absolute',
              top: 60,
              backgroundColor: '#4A5864',
              color: 'white',
              fontSize: 14,
              display: 'none',
            }}>
            <div
              onClick={hookMember.onClickCloseConfirmModal}
              css={{
                width: 165,
                height: 44,
                lineHeight: '44px',
                paddingLeft: 10,
                cursor: 'pointer',
                ':active': {
                  backgroundColor: '#37414A',
                },
              }}>
              로그아웃
            </div>
            {hookMember.userType === 'ADMIN' ? (
              <>
                <div css={{ height: 1, backgroundColor: 'white' }} />
                <div
                  onClick={hookMember.onClickModify}
                  css={{
                    width: 165,
                    height: 44,
                    lineHeight: '44px',
                    paddingLeft: 10,
                    cursor: 'pointer',
                    ':active': {
                      backgroundColor: '#37414A',
                    },
                  }}>
                  정보수정
                </div>
              </>
            ) : undefined}
          </div>
        </Flex>
      </FlexRow>
      {/* NOTE 좌측 카테고리 고정 */}
      <div
        css={{
          position: 'absolute',
          backgroundColor: '#4A5864',
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
        }}>
        <FlexCenter
          onClick={hookMember.onClickAdminMain}
          css={{
            width: 240,
            height: 60,
            backgroundColor: '#37414A',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>
          관리자
        </FlexCenter>
        {/*  */}
        {[
              '헬스장관리',
              '기구관리',
              '유저관리',
          ].map((item, index) => {
          return (
            <div key={index.toString()}>
              <Flex
                onClick={() => {
                  hookMember.onClickMenu(item);
                }}
                css={{
                  marginTop: 10,
                  width: 240,
                  height: 50,
                  paddingLeft: 20,
                  justifyContent: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: active === item ? fenxyBlue : undefined,
                }}>
                {item}
              </Flex>
              {/* {active === item ? activeItem : undefined} */}
              {active === item ? (
                <Nav parent={item} activeItem={activeItem} />
              ) : undefined}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
