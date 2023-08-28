'use client';

import React, { useEffect, useState } from 'react';
import PromptCard from './PromptCard';
import { useSession } from 'next-auth/react';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  //Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i'); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    //debounce method
    setSearchTimeout(
      setTimeout(() => {
        const result = filterPrompts(searchText);
        setSearchedResults(result);
      }, 500)
    );
    return () => clearTimeout(searchTimeout);
  }, [searchText]);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setAllPosts(data);
    };
    fetchPosts();
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchedResult = filterPrompts(tagName);
    setSearchedResults(searchedResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          required
          className='search_input peer'
        />
      </form>
      <PromptCardList
        data={!!searchText ? searchedResults : allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
