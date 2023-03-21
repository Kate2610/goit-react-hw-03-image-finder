import React, { Component } from 'react';

import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';
import IconButton from './components/IconButton';
import { ReactComponent as CloseIcon } from './images/close.svg';

import fetchImages from './api/api-services';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentPage: 1,
      searchQuery: '',
      isLoading: false,
      showModal: false,
      largeImage: '',
      error: null,
    };
  }

  componentDidMount() {
    const { searchQuery } = this.state;
    if (searchQuery) {
      this.getImages();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery } = this.state;
    if (prevState.searchQuery !== searchQuery) {
      this.getImages();
    }
  }

  onChangeQuery = query => {
    this.setState({
      images: [],
      currentPage: 1,
      searchQuery: query,
      isLoading: false,
      showModal: false,
      largeImage: '',
      error: null,
    });
  };

  getImages = async () => {
    const { currentPage, searchQuery } = this.state;
    this.setState({ isLoading: true });

    try {
      const { hits } = await fetchImages(searchQuery, currentPage);

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        currentPage: prevState.currentPage + 1,
      }));

      if (currentPage !== 1) {
        this.scrollOnLoadButton();
      }
    } catch (error) {
      console.log('Smth wrong with App fetch', error);
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleGalleryItem = fullImageUrl => {
    this.setState({ largeImage: fullImageUrl, showModal: true });
  };

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  scrollOnLoadButton = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  needToShowLoadMore = () => {
    const { images } = this.state;
    return images.length > 0 && images.length >= 12;
  };

  render() {
    const { images, isLoading, showModal, largeImage, error } = this.state;

    return (
      <>
        <Searchbar onSearch={this.onChangeQuery} />
        <ImageGallery images={images} onImageClick={this.handleGalleryItem} />

        {this.needToShowLoadMore() && <Button onClick={this.getImages} />}

        {showModal && (
          <Modal onClose={this.toggleModal}>
            <div className="Close-box">
              <IconButton onClick={this.toggleModal} aria-label="Close modal">
                <CloseIcon width="20px" height="20px" fill="#7e7b7b" />
              </IconButton>
            </div>
            <img src={largeImage} alt="" className="Modal-image" />
          </Modal>
        )}

        {isLoading && <Loader />}

        {error}
      </>
    );
  }
}

export default App;