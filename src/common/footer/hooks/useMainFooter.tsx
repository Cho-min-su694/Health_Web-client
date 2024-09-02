import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export type reactiveFont = {pc:number, mobile:number};
export function setReactiveFont(pc:number, mobile:number):reactiveFont {return {pc, mobile}}

interface HookMember {
  marginTop: number;
  loading: boolean;
  disEle: any;
  blockState: 'block' | 'none';


  fontSizeByWidth: any; //앱 크기에 따라 반응형 줄바꿈

  getFontSize: ({pc, mobile}:reactiveFont) => number;
}

export function useMainFooter(): HookMember {
  const router = useRouter();
  const [marginTop, setMarginTop] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [blockState, setBlockState] = useState<'block' | 'none'>('none');

  const disEle = useRef<HTMLDivElement>();

  const [fontSizeByWidth, setFontSizeByWidth] = useState<any>({});

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const handelResize = () => {
    // // const footerHeight = (disEle.current?.clientHeight);
    // const windowHeight = window.innerHeight;
    // setLoading(true);
    // const bodyHeight = document.body.scrollHeight;
    // // console.log(bodyHeight)

    // const marginTop = windowHeight > bodyHeight ? windowHeight - bodyHeight : 0;

    // // console.log(`${marginTop}/${windowHeight}`)

    // setMarginTop(marginTop);

    let width = document.body.clientWidth;
    if(width) {
      if(width>480) {
        setFontSizeByWidth({
        });
        setIsMobile(false);
      }
      else {
        setFontSizeByWidth({
          fontSize: 10,
          // flexDirection: 'column',
          // gap: 5,
        });
        setIsMobile(true);
      }
    }
  };

  useEffect(() => {
    // window.dispatchEvent(new Event('resize'));

    // console.log('start');
    setTimeout(handelResize, 100);
    window.addEventListener('resize', handelResize);
    return () => {
      window.removeEventListener('resize', handelResize);
    };
  }, []);

  useEffect(() => {
    handelResize();
  }, [disEle]);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  const setFontSize = ({pc, mobile}:reactiveFont):number => (isMobile) ? mobile : pc;

  return {
    marginTop,
    loading,
    disEle,
    blockState,
    fontSizeByWidth: fontSizeByWidth,

    getFontSize: setFontSize,
  };
}