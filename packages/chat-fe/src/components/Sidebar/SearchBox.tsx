import React, { use, useEffect, useState, useRef, useCallback } from 'react';
import { Input, List, Card } from 'antd';
import axios from 'axios';
import { config } from '../../config';
import { User } from '@chatx/types';
import { useHomeStore } from '../../store/homeStore';

const SearchBox = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [friends, setFriends] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setActiveDialog } = useHomeStore();

  useEffect(() => {
    const loadFriends = async () => {
      const res = await axios.get(`${config.API_URL}/friends`);
      setFriends(res.data.friends);
    };
    loadFriends();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchResults([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (timeoutIdRef.current === null) {
      timeoutIdRef.current = setTimeout(() => {
        setSearchResults(friends.filter(friend => friend.username.includes(e.target.value)));
      }, 300);
      return;
    }

    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setSearchResults(friends.filter(friend => friend.username.includes(e.target.value)));
    }, 300);
  };

  return (
    <div style={{ display: 'flex', width: '100%', padding: '15px', flexDirection: 'column' }}>
      <Input
        style={{ width: '100%' }}
        type='text'
        placeholder='搜索'
        variant='filled'
        onChange={handleInputChange}
      ></Input>
      {inputValue.length > 0 && (
        <List
          style={{ position: 'relative', zIndex: 1000, width: '100%' }}
          dataSource={searchResults}
          locale={{ emptyText: '无搜索结果' }}
          renderItem={item => (
            <List.Item key={item.userId} style={{ padding: 0 }} onClick={() => setActiveDialog(item.username)}>
              <Card hoverable style={{ margin: '5px 0', width: '100%' }}>
                {item.username}
              </Card>
            </List.Item>
          )}
        ></List>
      )}
    </div>
  );
};

export default SearchBox;
