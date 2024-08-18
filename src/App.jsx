import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import viteLogo from './assets/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState({});
  const [userId, setUserId] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    if (userId) {
      axios.get(`https://jsonplaceholder.typicode.com/posts`, {
        params: { userId }
      })
        .then(response => {
          const postsData = response.data;
          setPosts(postsData);

          // Fetch photos for each post
          postsData.forEach(post => {
            axios.get(`https://jsonplaceholder.typicode.com/photos/${post.id}`)
              .then(photoResponse => {
                setPhotos(prevPhotos => ({
                  ...prevPhotos,
                  [post.id]: photoResponse.data.thumbnailUrl
                }));
              })
              .catch(error => {
                console.error('Error fetching photo:', error);
              });
          });
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [userId]);

  // Calculate the posts to display on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Router>
      <div className="App">
        <header className="header">
          <nav>
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-tab" onClick={() => setSelectedPost(null)}>Home</Link>
              </li>
              <li>
                <Link to="/about" className="nav-tab">About</Link>
              </li>
              <li>
                <Link to="/contact" className="nav-tab">Contact</Link>
              </li>
              <li>
                <button onClick={() => setSelectedPost('search')} className="nav-tab">Search</button>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={
            selectedPost === null ? (
              <div>
                <div>
                  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                  </a>
                  <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                  </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                  <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                  </button>
                  <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                  </p>
                </div>
                <p className="read-the-docs">
                  Click on the Vite and React logos to learn more
                </p>
              </div>
            ) : selectedPost === 'search' ? (
              <div className="search">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter userId"
                />
                <div className="posts">
                  {currentPosts.map(post => (
                    <div key={post.id} className="post-card" onClick={() => setSelectedPost(post)}>
                      <h3>{post.title}</h3>
                      <p>{post.body}</p>
                      {photos[post.id] && <img src={photos[post.id]} alt="Thumbnail" />}
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="post-details">
                <h2>Post Details</h2>
                <table>
                  <tbody>
                    <tr>
                      <td>ID</td>
                      <td>{selectedPost.id}</td>
                    </tr>
                    <tr>
                      <td>Title</td>
                      <td>{selectedPost.title}</td>
                    </tr>
                    <tr>
                      <td>Body</td>
                      <td>{selectedPost.body}</td>
                    </tr>
                    <tr>
                      <td>User ID</td>
                      <td>{selectedPost.userId}</td>
                    </tr>
                    <tr>
                      <td>Thumbnail</td>
                      <td>{photos[selectedPost.id] && <img src={photos[selectedPost.id]} alt="Thumbnail" />}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;