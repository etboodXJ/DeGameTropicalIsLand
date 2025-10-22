import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface PointsRecord {
  id: string;
  platform: 'bucket' | 'cetus' | 'navi' | 'spend';
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

  const spendPoints = (amount: number, purpose: string): boolean => {
    if (!currentAccount?.address || points < amount) {
      return false;
    }

    const newPoints = points - amount;
    setPoints(newPoints);

    // 记录消费记录
    const spendRecord: PointsRecord = {
      id: Date.now().toString(),
      platform: 'spend' as any,
      amount: -amount,
      points: -amount,
      timestamp: Date.now(),
      txHash: purpose
    };

    const newRecords = [spendRecord, ...records];
    setRecords(newRecords);

    // 保存到本地存储
    const storageKey = `points_${currentAccount.address}`;
    const recordsKey = `points_records_${currentAccount.address}`;
    
    localStorage.setItem(storageKey, newPoints.toString());
    localStorage.setItem(recordsKey, JSON.stringify(newRecords));

    return true;
  };

  return {
    points,
    records,
    addPoints,
    spendPoints
  };
};