import Head from 'next/head';
import Header from './header';

const gaAnalyticsTrackCode = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-xxx-x');`;

const Layout = (props) => (
  <div className='main-container'>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <script async src='https://www.googletagmanager.com/gtag/js?id=UA-xxxx-x'></script>
      <script dangerouslySetInnerHTML={{ __html: gaAnalyticsTrackCode}} />
    </Head>
    <Header />
    <div className='body-content'>
      {props.children}
    </div>
  </div>
);

import './layout.scss';
export default Layout;
