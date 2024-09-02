import { AppProps } from 'next/app'
import 'styles/global.css';
import { useStore } from 'src/store';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import router from 'next/router';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState);

    useEffect(() => {

    }, []);

    return (
        <ReduxProvider store={store}>
            <Head>
                <script
                />
                
            </Head>
            <Component {...pageProps} />
        </ReduxProvider>
    );
}

export default App