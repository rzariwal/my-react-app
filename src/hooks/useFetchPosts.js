import { useState, useEffect } from 'react';

export default function useFetchPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/posts?userId=${userId}`)
        .then(response => response.json())
        .then(postsData => {
          setPosts(postsData);

          // Fetch photos for each post
          postsData.forEach(post => {
            fetch(`/api/photos/${post.id}`)
              .then(photoResponse => photoResponse.json())
              .then(photoData => {
                setPhotos(prevPhotos => ({
                  ...prevPhotos,
                  [post.id]: photoData.thumbnailUrl
                }));
              })
              .catch(error => {
                console.error('Error fetching photo:', error);
              });
          });
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [userId]);

  return { posts, photos, loading, error };
}