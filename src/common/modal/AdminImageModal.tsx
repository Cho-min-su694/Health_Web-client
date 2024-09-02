import React from 'react';
import Image from 'next/image';
import { Flex, FlexCenter, FlexRow } from 'src/common/styledComponents';
import { fenxyBlue } from 'src/util/constants/style';

interface AdminImageModalProps {
  display: 'flex' | 'none';
  content?: any;
  closeBtn?: () => void;
}

const Modal = (props: AdminImageModalProps) => {
  return (
    <FlexCenter
      css={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 100,
        display: props.display,
      }}>
      <FlexCenter
        css={{
          width: 500,
          borderRadius: 8,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}>
        <FlexRow
          css={{
            width: '100%',
            padding: '0 20px',
            height: 60,
            background: fenxyBlue,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div
            css={{
              color: '#fff',
              fontSize: 18,
            }}>
            미리보기
          </div>
          <FlexCenter
            css={{
              cursor: 'pointer',
            }}
            onClick={() => {
              props?.closeBtn
                ? props.closeBtn()
                : alert(
                    '확인 버튼에 작성된 함수가 없습니다. 코드를 확인해주세요.',
                  );
            }}>
            <Image
              src={'/image/admin/icon/x-circle-white.svg'}
              width={24}
              height={24}
              alt="닫기 버튼"
            />
          </FlexCenter>
        </FlexRow>
        <Flex css={{ padding: 30 }}>
          {props.content ? (
            <div
              css={{
                width: 440,
                height: 400,
                background: `url(${props.content}) center no-repeat`,
                backgroundSize: '100%',
                border: '1px solid #eee',
              }}></div>
          ) : (
            <FlexCenter css={{ height: 300 }}>내용이 없습니다.</FlexCenter>
          )}
        </Flex>
      </FlexCenter>
    </FlexCenter>
  );
};

export default Modal;
