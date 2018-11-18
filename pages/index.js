import Layout from '../components/layout';
import firebase from 'firebase/app';
import 'firebase/database';
import React from 'react';
import './index.scss';

/** Home component */
class Home extends React.Component {
  state = {
    searchKeyword: '',
  };

  static async getInitialProps() {
    const config = {
      databaseURL: 'https://emoji-lookup.firebaseio.com',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    const db = firebase.database();
    let emojiList = [];
    await db.ref('/').once('value').then((snapshot) => {
      emojiList = snapshot.val().global.emojiList;
    });
    return {
      emojiList,
    };
  }

  handleSearchInputChange(event) {
    this.setState({searchKeyword: event.target.value});
  }

  renderEmoji(data) {
    const [unicode, shortName] = data;
    const encodedUnicode = unicode.split(' ')[0].replace('U+', '&#x') + ';';

    if (this.state.searchKeyword !== '' && !shortName.match(this.state.searchKeyword)) {
      return;
    }

    return (
      <li key={unicode}
          role="option"
          aria-label={shortName}
          className='home-emoji-list-item'
          dangerouslySetInnerHTML={{__html: encodedUnicode}}></li>
    );
  }

  render() {
    return (
    <Layout>
      <div className='home-container'>
        <input type='text' onChange={(e) => this.handleSearchInputChange(e)} />
        <ul role='listbox' className='home-emoji-list'>
          {this.props.emojiList.map((emoji) => this.renderEmoji(emoji))}
        </ul>
      </div>
    </Layout>
    );
  }
}

export default Home;
