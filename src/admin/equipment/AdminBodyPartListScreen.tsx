import AdminHeader from 'src/common/header/AdminHeader';
import ConfirmModal from 'src/common/modal/ConfirmModal';
import { BorderRoundedContent, StyledButton } from 'src/common/styledAdmin';
import { Flex, FlexRow } from 'src/common/styledComponents';
import AdminTable from 'src/common/table/AdminTable';
import { useAdminBodyPartListScreen } from './hooks/useAdminBodyPartListScreen';
import AdminModifyModal from 'src/common/admin/AdminModifyModal';
import { BodyPart } from 'src/api/bodyPartsApi';

const AdminBodyPartListScreen = () => {
  const hookMember = useAdminBodyPartListScreen();

  const headerMap = new Map<string, string>([
    ['name', '이름'],
    ['code', '코드'],
    ['category', '분류'],
  ]);

  return (
    <div css={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <ConfirmModal
        display={hookMember.confirmModalDisplayState}
        content={hookMember.confirmModalContent}
        closeBtn={hookMember.confirmModalCloseBtn}
        confirmBtn={hookMember.confirmModalConfirmBtn}
      />
      <AdminModifyModal
        title="운동부위"
        isModify={hookMember.isModifyAction}
        originalData={hookMember.modifyData}
        headerMap={headerMap}
        display={hookMember.detailDisplayState}
        onCloseDisplay={hookMember.onClickDetailModal}
        setModifyData={hookMember.onChangeModifyData}
      />
      <AdminHeader active={'운동부위'} activeItem={'운동부위 관리'} />
      <div css={{ marginLeft: 240, padding: 20, minWidth: 1100 }}>
        <Flex>
          <div>
            <FlexRow
              css={{
                paddingBottom: 20,
                alignItems: 'center',
                borderBottom: '2px solid #4A5864',
              }}>
              <Flex
                css={{
                  fontSize: 18,
                  color: '#333',
                  fontWeight: 'bold',
                  flexGrow: 1,
                }}>
                운동부위 관리
              </Flex>
              <StyledButton
                css={{ background: 'blue' }}
                onClick={hookMember.onClickCreate}>
                작성
              </StyledButton>
            </FlexRow>
            <BorderRoundedContent>
              <Flex css={{ padding: 30, textAlign: 'center' }}>
                <AdminTable
                  page={5}
                  setPage={() => {
                    //
                  }}
                  headers={[
                    { name: '이름', selector: 'name' },
                    { name: '코드', selector: 'code' },
                    { name: '카테고리', selector: 'category' },
                    {
                      name: '관리',
                      selector: 'management',
                      cell: ({ data }: { data: BodyPart }) => {
                        return (
                          <>
                            <FlexRow
                              css={{
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <StyledButton
                                css={{
                                  height: 28,
                                  padding: '0 6px',
                                  lineHeight: '26px',
                                  minHeight: 'auto',
                                  color: '#999',
                                  border: '1px solid #999',
                                }}
                                onClick={() =>
                                  hookMember.onClickUpdateDetail(data)
                                }>
                                수정
                              </StyledButton>
                              <StyledButton
                                css={{
                                  height: 28,
                                  padding: '0 6px',
                                  lineHeight: '26px',
                                  minHeight: 'auto',
                                  color: '#999',
                                  border: '1px solid #999',
                                }}
                                onClick={() =>
                                  hookMember.onClickDelete(Number(data?.id))
                                }>
                                삭제
                              </StyledButton>
                            </FlexRow>
                          </>
                        );
                      },
                    },
                  ]}
                  datas={hookMember.bodyParts}
                />
              </Flex>
            </BorderRoundedContent>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default AdminBodyPartListScreen;
