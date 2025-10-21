import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface PointsRecord {
  id: string;
  platform: 'bucket' | 'cetus' | 'navi';
  amount: number;
  points: number;
  timestamp: number;
  txHash?: string;
}

export const usePoints = () => {
  const currentAccount = useCurrentAccount();
  const [points, setPoints] = useState(0);
  const [records, setRecords] = useState<PointsRecord[]>([]);

  useEffect(() => {
    if (currentAccount?.address) {
      loadPointsData(currentAccount.address);
    }
  }, [currentAccount?.address]);

  const loadPointsData = (address: string) => {
    const storageKey = `points_${address}`;
    const recordsKey = `points_records_${address}`;
    
    const savedPoints = localStorage.getItem(storageKey);
    const savedRecords = localStorage.getItem(recordsKey);
    
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }
    
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  };

  const addPoints = (platform: 'bucket' | 'cetus' | 'navi', amount: number, txHash?: string) => {
    if (!currentAccount?.address) return;

    // 计算积分：每存入1 SUI获得100 CYKJ积分
    const earnedPoints = Math.floor(amount * 100);
    
    const newRecord: PointsRecord = {
      id: Date.now().toString(),
      platform,
      amount,
      points: earnedPoints,
      timestamp: Date.now(),
      txHash
    };

    const newPoints = points + earnedPoints;
    const newRecords = [newRecord, ...records];

    setPoints(newPoints);
    setRecords(newRecords);

    // 保存到本地存储
    const storageKey = `points_${currentAccount.address}`;
    const recordsKey = `points_records_${currentAccount.address}`;
    
    localStorage.setItem(storageKey, newPoints.toString());
    localStorage.setItem(recordsKey, JSON.stringify(newRecords));
  };

  return {
    points,
    records,
    addPoints
  };
};