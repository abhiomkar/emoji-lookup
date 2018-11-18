import Layout from '../components/layout';
import firebase from 'firebase/app';
import 'firebase/database';
import React from 'react';
import './index.scss';

/** Home component */
class Home extends React.Component {
  searchTimer_ = 0;
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
    let emojiData = [];
    await db.ref('/global/emojiData').once('value').then((snapshot) => {
      emojiData = snapshot.val();
    });
    return {
      emojiData,
    };
  }

  handleSearchInputChange(event) {
    const searchKeyword = event.target.value;
    let searchDelay = 350;

    if (searchKeyword === '') {
      searchDelay = 50;
    }

    clearTimeout(this.searchTimer_);
    this.searchTimer_ = setTimeout(() => {
      this.setState({searchKeyword});
    }, searchDelay);
  }

  renderEmojiGroup(data) {
    const groupName = data[0];
    const groupId = `emoji-group-${groupName.replace(/[\s\&]+/g, '-')}`;
    const emojiList = data[1];

    return (
      <div className='home-emoji-group' key={groupId}>
        <label className='home-emoji-group-label' id={groupId}>{groupName}</label>
        <ul role='listbox' className='home-emoji-list' aria-labelledby={groupId}>
          {this.renderEmojiList(emojiList)}
        </ul>
      </div>
    );
  }

  renderEmojiList(data) {
    return data.map((emoji) => this.renderEmoji(emoji));
  }

  renderEmoji(data) {
    const [unicode, shortName] = data;
    const encodedUnicode = unicode.split(' ').map(d => `&#x${d};`).join('');
    const itemKey = 'item-' + unicode.replace(/\s/g, '-');
    const matchesSearchKeyword = shortName.toLowerCase().indexOf(this.state.searchKeyword.toLowerCase()) >= 0;

    if (this.state.searchKeyword !== '' && !matchesSearchKeyword) {
      return;
    }

    return (
      <li role="option"
          aria-label={shortName}
          className='home-emoji-list-item'
          key={itemKey}
          dangerouslySetInnerHTML={{__html: encodedUnicode}}></li>
    );
  }

  render() {
    let emojiList;

    if (this.state.searchKeyword === '') {
      emojiList = this.props.emojiData.map((emojiGroup) => this.renderEmojiGroup(emojiGroup));
    } else {
      emojiList = (<ul role='listbox' className='home-emoji-list' aria-label='Emoji search results'>
          {this.props.emojiData.map((emojiGroup) => this.renderEmojiList(emojiGroup[1]))}
          </ul>);
    }

    return (
    <Layout>
      <div className='home-container'>
        <input className='home-search-input' type='text' onChange={(e) => this.handleSearchInputChange(e)} />
        {emojiList}
      </div>
    </Layout>
    );
  }
}

export default Home;
