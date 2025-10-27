/**
 * 交易结果解析工具
 * 用于解析 Sui 区块链交易执行结果中的加密数据
 */

import { bcs } from '@mysten/sui/bcs';

export interface TransactionEffects {
  status: {
    status: 'success' | 'failure';
    error?: string;
  };
  gasUsed?: {
    computationCost: string;
    storageCost: string;
    storageRebate: string;
  };
  timestampMs?: string;
  events?: Array<{
    type: string;
    parsedJson?: any;
    bcs?: string;
  }>;
  changedObjects?: Array<{
    objectId: string;
    inputState: any;
    outputState: any;
    owner: any;
  }>;
  created?: Array<{
    objectId: string;
    objectType: string;
    owner: any;
  }>;
  deleted?: Array<{
    objectId: string;
  }>;
  sharedObjects?: Array<{
    objectId: string;
    version: string;
    digest: string;
  }>;
}

export interface TransactionResult {
  digest?: string;
  effects?: TransactionEffects | string; // 支持对象或字符串格式
  transaction?: {
    data: {
      sender: string;
      gasConfig: {
        price: string;
        budget: string;
      };
      commands?: any[];
    };
  };
  errors?: Array<{
    error: string;
  }>;
  confirmedLocalExecution?: boolean;
}

/**
 * 解析交易结果的详细函数
 * @param result 交易执行结果
 * @param options 解析选项
 */
export function parseTransactionResult(
  result: TransactionResult,
  options: {
    logToConsole?: boolean;
    filterEventTypes?: string[];
    highlightObjectIds?: string[];
  } = {}
): {
  success: boolean;
  summary: string;
  details: any;
  events: any[];
  objectChanges: any;
  gasInfo: any;
  errors: string[];
} {
  const { logToConsole = true, filterEventTypes = [], highlightObjectIds = [] } = options;
  
  const summary = {
    success: false,
    summary: '',
    details: {} as any,
    events: [] as any[],
    objectChanges: {} as any,
    gasInfo: {} as any,
    errors: [] as string[]
  };

  if (logToConsole) {
    console.log('=== 交易结果详细解析 ===');
  }

  try {
    // 1. 基本信息
    if (result.digest) {
      summary.details.transactionDigest = result.digest;
      if (logToConsole) console.log('交易摘要:', result.digest);
    }

    // 2. 解析 effects
    if (result.effects) {
      let effects: TransactionEffects;
      
      // 处理 effects 可能是字符串的情况
      if (typeof result.effects === 'string') {
        // effects 是 BCS 编码字符串，无法直接解析
        if (logToConsole) {
          console.log('Effects 是 BCS 编码字符串，无法直接解析');
          console.log('BCS Effects 原始数据:', result.effects);
        }
        
        // 尝试从交易结果的其他字段推断状态
        summary.success = !result.errors || result.errors.length === 0;
        
        if (logToConsole) {
          console.log('从错误状态推断交易成功:', summary.success);
          console.log('尝试从交易结果的其他字段获取信息...');
        }
        
        // 跳过 effects 解析，继续处理其他信息
        effects = {} as TransactionEffects;
      } else {
        effects = result.effects;
      }
      
      // 交易状态
      if (effects.status) {
        summary.success = effects.status.status === 'success';
        summary.details.status = effects.status;
        
        if (logToConsole) {
          console.log('交易状态详情:', effects.status);
          if (effects.status.status === 'success') {
            console.log('✅ 交易执行成功');
          } else if (effects.status.error) {
            console.log('❌ 交易执行失败:', effects.status.error);
            summary.errors.push(effects.status.error);
          }
        }
      }
      
      // Gas 使用情况
      if (effects.gasUsed) {
        summary.gasInfo = {
          computationCost: effects.gasUsed.computationCost,
          storageCost: effects.gasUsed.storageCost,
          storageRebate: effects.gasUsed.storageRebate,
          totalCost: (
            parseInt(effects.gasUsed.computationCost || '0') + 
            parseInt(effects.gasUsed.storageCost || '0') - 
            parseInt(effects.gasUsed.storageRebate || '0')
          ).toString()
        };
        
        if (logToConsole) {
          console.log('Gas 使用情况:', effects.gasUsed);
          console.log('计算 Gas:', effects.gasUsed.computationCost);
          console.log('存储 Gas:', effects.gasUsed.storageCost);
          console.log('存储退款:', effects.gasUsed.storageRebate);
          console.log('总成本:', summary.gasInfo.totalCost);
        }
      }
      
      // 交易执行时间戳
      if (effects.timestampMs) {
        const timestamp = new Date(parseInt(effects.timestampMs));
        summary.details.executionTime = timestamp.toISOString();
        summary.details.executionTimeLocal = timestamp.toLocaleString();
        
        if (logToConsole) {
          console.log('执行时间戳:', timestamp.toLocaleString());
        }
      }
      
      // 事件日志
      if (effects.events && effects.events.length > 0) {
        summary.events = effects.events.map((event, index) => {
          const eventData = {
            index,
            type: event.type,
            parsedJson: event.parsedJson,
            bcs: event.bcs,
            isHighlighted: false
          };
          
          // 检查是否为高亮事件类型
          if (filterEventTypes.length > 0) {
            eventData.isHighlighted = filterEventTypes.some(type => 
              event.type?.includes(type)
            );
          }
          
          // 特别关注创意相关事件
          if (event.type && event.type.includes('Creative')) {
            eventData.isHighlighted = true;
            if (logToConsole) {
              console.log('🎨 创意相关事件:', event.parsedJson);
            }
          }
          
          return eventData;
        });
        
        if (logToConsole) {
          console.log('=== 事件日志 ===');
          effects.events.forEach((event: any, index: number) => {
            console.log(`事件 ${index + 1}:`, {
              type: event.type,
              parsedJson: event.parsedJson,
              bcs: event.bcs
            });
          });
        }
      }
      
      // 对象变更
      if (effects.changedObjects && effects.changedObjects.length > 0) {
        summary.objectChanges.changed = effects.changedObjects.map(obj => {
          const isHighlighted = highlightObjectIds.includes(obj.objectId);
          return {
            ...obj,
            isHighlighted
          };
        });
        
        if (logToConsole) {
          console.log('=== 对象变更 ===');
          effects.changedObjects.forEach((obj: any, index: number) => {
            const isHighlighted = highlightObjectIds.includes(obj.objectId);
            console.log(`对象变更 ${index + 1}${isHighlighted ? ' ⭐' : ''}:`, {
              objectId: obj.objectId,
              inputState: obj.inputState,
              outputState: obj.outputState,
              owner: obj.owner
            });
          });
        }
      }
      
      // 创建的对象
      if (effects.created && effects.created.length > 0) {
        summary.objectChanges.created = effects.created.map(obj => {
          const isHighlighted = highlightObjectIds.includes(obj.objectId);
          return {
            ...obj,
            isHighlighted
          };
        });
        
        if (logToConsole) {
          console.log('=== 新创建对象 ===');
          effects.created.forEach((obj: any, index: number) => {
            const isHighlighted = highlightObjectIds.includes(obj.objectId);
            console.log(`创建对象 ${index + 1}${isHighlighted ? ' ⭐' : ''}:`, {
              objectId: obj.objectId,
              objectType: obj.objectType,
              owner: obj.owner
            });
          });
        }
      }
      
      // 删除的对象
      if (effects.deleted && effects.deleted.length > 0) {
        summary.objectChanges.deleted = effects.deleted.map(obj => {
          const isHighlighted = highlightObjectIds.includes(obj.objectId);
          return {
            ...obj,
            isHighlighted
          };
        });
        
        if (logToConsole) {
          console.log('=== 删除对象 ===');
          effects.deleted.forEach((obj: any, index: number) => {
            const isHighlighted = highlightObjectIds.includes(obj.objectId);
            console.log(`删除对象 ${index + 1}${isHighlighted ? ' ⭐' : ''}:`, {
              objectId: obj.objectId
            });
          });
        }
      }
      
      // 共享对象引用
      if (effects.sharedObjects && effects.sharedObjects.length > 0) {
        summary.objectChanges.shared = effects.sharedObjects.map(obj => {
          const isHighlighted = highlightObjectIds.includes(obj.objectId);
          return {
            ...obj,
            isHighlighted
          };
        });
        
        if (logToConsole) {
          console.log('=== 共享对象引用 ===');
          effects.sharedObjects.forEach((obj: any, index: number) => {
            const isHighlighted = highlightObjectIds.includes(obj.objectId);
            console.log(`共享对象 ${index + 1}${isHighlighted ? ' ⭐' : ''}:`, {
              objectId: obj.objectId,
              version: obj.version,
              digest: obj.digest
            });
          });
        }
      }
    }
    
    // 3. 解析交易详情（如果可用）
    if (result.transaction) {
      summary.details.transaction = {
        sender: result.transaction.data.sender,
        gasPrice: result.transaction.data.gasConfig.price,
        gasBudget: result.transaction.data.gasConfig.budget,
        commands: result.transaction.data.commands
      };
      
      if (logToConsole) {
        console.log('=== 交易详情 ===');
        console.log('交易发送者:', result.transaction.data.sender);
        console.log('Gas 价格:', result.transaction.data.gasConfig.price);
        console.log('Gas 预算:', result.transaction.data.gasConfig.budget);
        
        // 命令列表
        if (result.transaction.data.commands) {
          console.log('=== 执行命令 ===');
          result.transaction.data.commands.forEach((cmd: any, index: number) => {
            console.log(`命令 ${index + 1}:`, cmd);
          });
        }
      }
    }
    
    // 4. 解析错误信息（如果有）
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((error: any, index: number) => {
        const errorMsg = error.error || JSON.stringify(error);
        summary.errors.push(errorMsg);
        
        if (logToConsole) {
          console.log(`错误 ${index + 1}:`, error);
        }
      });
    }
    
    // 5. 检查确认状态
    if (result.confirmedLocalExecution) {
      summary.details.confirmedLocalExecution = true;
      if (logToConsole) {
        console.log('✅ 本地执行已确认');
      }
    }
    
    // 6. 生成摘要
    const eventCount = summary.events.length;
    const changedCount = summary.objectChanges.changed?.length || 0;
    const createdCount = summary.objectChanges.created?.length || 0;
    const deletedCount = summary.objectChanges.deleted?.length || 0;
    
    summary.summary = summary.success 
      ? `✅ 交易成功执行。事件: ${eventCount}, 对象变更: ${changedCount}, 新创建: ${createdCount}, 删除: ${deletedCount}`
      : `❌ 交易执行失败。错误: ${summary.errors.length}`;
    
  } catch (error) {
    const errorMsg = `解析交易结果时发生错误: ${error}`;
    summary.errors.push(errorMsg);
    summary.success = false;
    
    if (logToConsole) {
      console.error(errorMsg, error);
    }
  }
  
  if (logToConsole) {
    console.log('=== 解析完成 ===');
  }
  
  return summary;
}

/**
 * 简化版交易结果解析，只返回关键信息
 */
export function parseTransactionResultSimple(result: TransactionResult): {
  success: boolean;
  error?: string;
  gasUsed?: string;
  eventCount: number;
  objectChangesCount: number;
} {
  const summary = parseTransactionResult(result, { logToConsole: false });
  
  return {
    success: summary.success,
    error: summary.errors[0],
    gasUsed: summary.gasInfo.totalCost,
    eventCount: summary.events.length,
    objectChangesCount: Object.values(summary.objectChanges).reduce(
      (total: number, changes) => total + (Array.isArray(changes) ? changes.length : 0), 0
    )
  };
}

/**
 * 使用 BCS 解析 effects 字符串
 */
function parseEffectsWithBCS(effectsString: string, logToConsole: boolean = true): TransactionEffects | null {
  try {
    // 将十六进制字符串转换为 Uint8Array
    const hexString = effectsString.startsWith('0x') ? effectsString.slice(2) : effectsString;
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    if (logToConsole) {
      console.log('BCS 解析 - 原始十六进制:', effectsString);
      console.log('BCS 解析 - 字节数组长度:', bytes.length);
    }
    
    // 尝试使用 Sui 的 BCS 解析 TransactionEffects
    // 注意：这里需要根据 Sui 的实际 BCS 结构来解析
    // 由于 TransactionEffects 的结构比较复杂，我们先尝试基本的解析
    
    // 创建一个简单的解析器来尝试解析基本结构
    let offset = 0;
    
    // 解析状态（第一个字节通常是状态）
    if (bytes.length > 0) {
      const status = bytes[offset];
      offset += 1;
      
      const effects: TransactionEffects = {
        status: {
          status: status === 0 ? 'success' : 'failure'
        }
      };
      
      if (logToConsole) {
        console.log('BCS 解析 - 状态:', effects.status.status);
      }
      
      // 尝试解析更多字段（这里需要根据实际的 BCS 结构来调整）
      // 由于完整的 TransactionEffects 结构很复杂，我们先返回基本信息
      
      return effects;
    }
    
    return null;
  } catch (error) {
    if (logToConsole) {
      console.error('BCS 解析失败:', error);
    }
    return null;
  }
}

/**
 * 获取 effects 对象（处理 BCS 格式或对象格式）
 */
function getEffectsObject(result: any): TransactionEffects | null {
  if (!result.effects) return null;
  
  try {
    // 如果 effects 已经是对象，直接返回
    if (typeof result.effects === 'object') {
      return result.effects;
    }
    
    // 如果 effects 是字符串（BCS 编码），尝试使用 BCS 解析
    if (typeof result.effects === 'string') {
      console.log('尝试使用 BCS 解析 effects 字符串...');
      const parsedEffects = parseEffectsWithBCS(result.effects);
      
      if (parsedEffects) {
        console.log('✅ BCS 解析成功');
        return parsedEffects;
      } else {
        console.log('❌ BCS 解析失败，将使用其他字段推断状态');
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('处理 effects 失败:', error);
    return null;
  }
}

/**
 * 检查特定对象是否在交易中被修改
 */
export function isObjectChanged(result: TransactionResult, objectId: string): boolean {
  const effects = getEffectsObject(result);
  if (!effects) return false;
  
  const checkInArray = (array: any[] | undefined) => 
    array?.some(obj => obj.objectId === objectId) || false;
  
  return checkInArray(effects.changedObjects) ||
         checkInArray(effects.created) ||
         checkInArray(effects.deleted) ||
         checkInArray(effects.sharedObjects);
}

/**
 * 获取对象变更详情
 */
export function getObjectChanges(result: TransactionResult, objectId: string): any {
  const effects = getEffectsObject(result);
  if (!effects) return null;
  
  const findInArray = (array: any[] | undefined) => 
    array?.find(obj => obj.objectId === objectId);
  
  return findInArray(effects.changedObjects) ||
         findInArray(effects.created) ||
         findInArray(effects.deleted) ||
         findInArray(effects.sharedObjects) ||
         null;
}

/**
 * 检查交易结果中是否包含特定类型的事件
 */
export function hasEventType(result: TransactionResult, eventType: string): boolean {
  const effects = getEffectsObject(result);
  if (!effects || !effects.events) return false;
  
  return effects.events.some(event => 
    event.type && event.type.includes(eventType)
  );
}

/**
 * 获取交易结果中特定类型的事件
 */
export function getEventsByType(result: TransactionResult, eventType: string): any[] {
  const effects = getEffectsObject(result);
  if (!effects || !effects.events) return [];
  
  return effects.events.filter(event => 
    event.type && event.type.includes(eventType)
  );
}
