import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface LikeRecord {
  creativeId: string;
  userId: string;
  points: number;
  timestamp: number;
}

interface CreativeExpectation {
  creativeId: string;
  totalExpectation: number;
  likeCount: number;
  lastUpdated: number;
}

export const useCreativeLikes = () => {
  const currentAccount = useCurrentAccount();
  const [userLikes, setUserLikes] = useState<LikeRecord[]>([]);
  const [creativeExpectations, setCreativeExpectations] = useState<Map<string, CreativeExpectation>>(new Map());

  useEffect(() => {
    if (currentAccount?.address) {
      loadLikesData(currentAccount.address);
    }
    loadExpectationsData();
  }, [currentAccount?.address]);

  const loadLikesData = (address: string) => {
    const likesKey = `user_likes_${address}`;
    const savedLikes = localStorage.getItem(likesKey);
    
    if (savedLikes) {
      setUserLikes(JSON.parse(savedLikes));
    }
  };

  const loadExpectationsData = () => {
    const expectationsKey = 'creative_expectations';
    const savedExpectations = localStorage.getItem(expectationsKey);
    
    if (savedExpectations) {
      const expectationsArray = JSON.parse(savedExpectations);
      const expectationsMap = new Map();
      expectationsArray.forEach((exp: CreativeExpectation) => {
        expectationsMap.set(exp.creativeId, exp);
      });
      setCreativeExpectations(expectationsMap);
    }
  };

  const saveExpectationsData = (expectations: Map<string, CreativeExpectation>) => {
    const expectationsKey = 'creative_expectations';
    const expectationsArray = Array.from(expectations.values());
    localStorage.setItem(expectationsKey, JSON.stringify(expectationsArray));
  };

  const likeCreative = (creativeId: string, points: number): boolean => {
    if (!currentAccount?.address) return false;

    // 检查是否已经点赞过
    const existingLike = userLikes.find(like => like.creativeId === creativeId);
    if (existingLike) {
      return false; // 已经点赞过
    }

    // 创建点赞记录
    const likeRecord: LikeRecord = {
      creativeId,
      userId: currentAccount.address,
      points,
      timestamp: Date.now()
    };

    const newUserLikes = [...userLikes, likeRecord];
    setUserLikes(newUserLikes);

    // 更新创意期待值
    const currentExpectation = creativeExpectations.get(creativeId) || {
      creativeId,
      totalExpectation: 0,
      likeCount: 0,
      lastUpdated: Date.now()
    };

    const updatedExpectation: CreativeExpectation = {
      ...currentExpectation,
      totalExpectation: currentExpectation.totalExpectation + points,
      likeCount: currentExpectation.likeCount + 1,
      lastUpdated: Date.now()
    };

    const newExpectations = new Map(creativeExpectations);
    newExpectations.set(creativeId, updatedExpectation);
    setCreativeExpectations(newExpectations);

    // 保存到本地存储
    const likesKey = `user_likes_${currentAccount.address}`;
    localStorage.setItem(likesKey, JSON.stringify(newUserLikes));
    saveExpectationsData(newExpectations);

    return true;
  };

  const getCreativeExpectation = (creativeId: string): CreativeExpectation => {
    return creativeExpectations.get(creativeId) || {
      creativeId,
      totalExpectation: 0,
      likeCount: 0,
      lastUpdated: 0
    };
  };

  const hasUserLiked = (creativeId: string): boolean => {
    if (!currentAccount?.address) return false;
    return userLikes.some(like => like.creativeId === creativeId);
  };

  const getUserLikePoints = (creativeId: string): number => {
    if (!currentAccount?.address) return 0;
    const like = userLikes.find(like => like.creativeId === creativeId);
    return like?.points || 0;
  };

  return {
    likeCreative,
    getCreativeExpectation,
    hasUserLiked,
    getUserLikePoints,
    userLikes,
    creativeExpectations: Array.from(creativeExpectations.values())
  };
};