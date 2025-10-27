import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import Button from './Button';

// Custom hook for fetching data
const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => abortController.abort();
  }, [url]);

  return { data, isLoading, error };
};

const ApiDataFetcher = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useFetchData('https://jsonplaceholder.typicode.com/posts');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  }, [posts, searchTerm, currentPage]);

  const totalPages = Math.ceil(
    posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / postsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  let content;
  if (isLoading) {
    content = <p className="text-center text-gray-500 dark:text-gray-400">Loading data...</p>;
  } else if (error) {
    content = <p className="text-center text-red-500">Error fetching data: {error}</p>;
  } else if (filteredPosts.length === 0) {
    content = <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>;
  } else {
    content = (
      <ul className="space-y-4">
        {filteredPosts.map((post) => (
          <li key={post.id} className="p-4 border dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">{post.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{post.body}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">API Data (Posts)</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts by title..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="mb-6">{content}</div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="secondary">
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="secondary">
            Next
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ApiDataFetcher;