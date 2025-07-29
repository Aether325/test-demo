import {
  Button, Card, Space, Input,
} from 'antd-mobile';
import React, { useContext, useState } from 'react';

import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

function TestFort5792() {
  const { account, provider } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState('');
  const [result, setResult] = useState(null);
  const [chainIds, setChainIds] = useState('');
  /**
   * 发送批量交易（EIP-5792 标准）
   * @param {Array} transactions 交易数组
   * @param {boolean} atomicRequired 是否原子化执行
   */
  const sendBatchTransactions = async (transactions, atomicRequired = true) => {
    try {
      setLoading(true);

      // 1. 检查钱包支持性
      if (!window.ethereum?.request) {
        throw new Error('请安装兼容EIP-5792的钱包');
      }

      // 2. 获取当前账户
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const from = accounts[0];

      // 3. 构造5792请求参数
      const params = {
        version: '2.0.0',
        chainId: '0x1', // 示例主网，实际应从钱包获取
        from,
        atomicRequired,
        calls: transactions.map((tx) => ({
          to: tx.to,
          data: tx.data,
          value: tx.value,
        })),
      };

      // 4. 发送批量交易
      const response_params = await window.ethereum.request({
        method: 'wallet_sendCalls',
        params: [params],
      });

      console.log('批量交易ID:', response_params.id);
      return response_params;
    } catch (error) {
      console.error('批量交易失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 简化版查询函数（移除参数检查）
  const getTransactionStatus = async (id) => {
    setLoading(true);
    try {
      const response = await window.ethereum.request({
        method: 'wallet_getCallsStatus',
        params: [id],
      });
      console.log('Transaction response:', response); // 直接打印原始响应
      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await getTransactionStatus(txId);
      setResult(data);
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  const getCapabilities = async (chainIdsArray) => {
    setLoading(true);
    try {
      const response = await window.ethereum.request({
        method: 'wallet_getCapabilities',
        params: [chainIdsArray],
      });
      console.log('Transaction response:', response); // 直接打印原始响应
      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCap = async () => {
    try {
      // 正确写法：先分割再对每个元素trim
      const idsArray = chainIds.split(',')
        .map((id) => id.trim());
      console.log('idsArray:', idsArray);
      const data = await getCapabilities(idsArray);
      setResult(data);
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  // =============== 场景实现 ===============

  // 场景1: 多笔资产转账
  const swapinUniswapWithoutTo = async () => {
    const spender = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const transactions = [
      {
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000687a11aa00000000000000000000000000000000000000000000000000000000000000020a100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000068a1979a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066a9893cc07d91d95644aedd05d03f95e1dba8af00000000000000000000000000000000000000000000000000000000687a11a200000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041d24970401b1aee27558a0d31b2e656e0bb0aa1aafa8aff4689b789cfb3d8445c681b896f34e951bf10befed3aec98e1bdd49ed430059f2272c0eb78550b671741c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003070b0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000e734300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000003f825e6706e99ea34b6da0fcab2df1882e597c800000000000000000000000000000000000000000000000000000000000000000c', // 0.01 ETH
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
      },
    ];
    return sendBatchTransactions(transactions);
  };

  const swapinUniswapWithoutDataOrValue = async () => {
    const spender = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const transactions = [
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000687a11aa00000000000000000000000000000000000000000000000000000000000000020a100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000068a1979a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066a9893cc07d91d95644aedd05d03f95e1dba8af00000000000000000000000000000000000000000000000000000000687a11a200000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041d24970401b1aee27558a0d31b2e656e0bb0aa1aafa8aff4689b789cfb3d8445c681b896f34e951bf10befed3aec98e1bdd49ed430059f2272c0eb78550b671741c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003070b0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000e734300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000003f825e6706e99ea34b6da0fcab2df1882e597c800000000000000000000000000000000000000000000000000000000000000000c', // 0.01 ETH
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
      },
    ];
    return sendBatchTransactions(transactions);
  };

  // 场景1: 多笔资产转账
  const swapinUniswap = async () => {
    const spender = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const transactions = [
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000687a11aa00000000000000000000000000000000000000000000000000000000000000020a100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000068a1979a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066a9893cc07d91d95644aedd05d03f95e1dba8af00000000000000000000000000000000000000000000000000000000687a11a200000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041d24970401b1aee27558a0d31b2e656e0bb0aa1aafa8aff4689b789cfb3d8445c681b896f34e951bf10befed3aec98e1bdd49ed430059f2272c0eb78550b671741c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003070b0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000e734300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec700000000000000000000000003f825e6706e99ea34b6da0fcab2df1882e597c800000000000000000000000000000000000000000000000000000000000000000c', // 0.01 ETH
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
      },
    ];
    return sendBatchTransactions(transactions);
  };

  const swapinPancake = async () => {
    const spender = '0x31c2f6fcff4f8759b3bd5bf0e1084a055615c768';
    const transactions = [
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000068748edb000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001000000000000000000000000008458fe918ceeb35f7bb5757885cf3a94a7c372ca00000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000e865900000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002ba0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000064dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000', // 0.01 ETH
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
      },
    ];
    return sendBatchTransactions(transactions);
  };

  // 场景2: 多笔授权操作
  const batchApprove = async () => {
    // pancakeswap: 0x31c2f6fcff4f8759b3bd5bf0e1084a055615c768
    // EOA: 0xa0fcee3d143adc3317c8f78cd3548eec99550f85
    const spender = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
    const transactions = [
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000001'
        }`, // approve 1
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
    ];
    return sendBatchTransactions(transactions);
  };

  // 场景2: 多笔授权操作
  const batchRevoke = async () => {
    // pancakeswap: 0x31c2f6fcff4f8759b3bd5bf0e1084a055615c768
    // EOA: 0xa0fcee3d143adc3317c8f78cd3548eec99550f85
    const spender = '0x04dba1194ee10112fe6c3207c0687def0e78bacf';
    const transactions = [
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // approve 1
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // approve MAX
      },
    ];
    try {
      const response_params = await sendBatchTransactions(transactions);
      console.log('批量交易ID:', response_params.id);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  // 场景4: 高风险交易拦截
  const interceptionTest = async () => {
    const transactions = [
      {
        to: '0x020f62d3be82603d6de1626afdaf5107d2563a98',
        value: '0x5af3107a4000',
      },
      {
        to: '0x2e5bb2f8cf9cac358b355a8cff3d831248cc1b05', // 高风险地址
        value: '0x5af3107a4000',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const alertTest = async () => {
    const spender = '0x01eef7795af557088f2ff4f96011c6e6c6fb7c55';
    const transactions = [
      {
        to: '0x020f62d3be82603d6de1626afdaf5107d2563a98',
        value: '0x5af3107a4000',
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const multiAlert = async () => {
    const spender = '0x01eef7795af557088f2ff4f96011c6e6c6fb7c55';
    const transactions = [
      {
        to: '0x5283d291dbcf85356a21ba090e6db59121208b44',
        data: '0xf123991e00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000095b247ccce49df14e87a8f20f12fcd23877873c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000fe4f44bee93503346a3ac9ee5a26b130a5796d60000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000f',
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const alertWithInterception = async () => {
    const transactions = [
      {
        // 黑地址
        to: '0x2e5bb2f8cf9cac358b355a8cff3d831248cc1b05',
        value: '0x5af3107a4000',
      },
      {
        // 合约
        to: '0xd1d2Eb1B1e90B638588728b4130137D262C87cae',
        value: '0x5af3107a4000',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const multiInterception = async () => {
    const transactions = [
      {
        // 黑地址
        to: '0x2e5bb2f8cf9cac358b355a8cff3d831248cc1b05',
        value: '0x5af3107a4000',
      },
      {
        // 黑地址
        to: '0xd8d3e49ac9458b9a75f03345ea3bc9c5507eb5a0',
        value: '0x5af3107a4000',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  // 场景6: 超过数量限制
  const sendOverLimit = async () => {
    const transactions = Array(13).fill({
      to: '0x020f62d3be82603d6de1626afdaf5107d2563a98',
      value: '0x5af3107a4000',
    });
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('交易数量超限被拒绝', err);
    }
  };

  const multiSend = async () => {
    const transactions = [
      {
        // 黑地址
        to: '0x62763e8d330db5a9cb643b97d0c3b64804f2f096',
        value: '0x5af3107a4000',
      },
      {
        // 黑地址
        to: '0x04dba1194ee10112fe6c3207c0687def0e78bacf',
        value: '0x5af3107a4000',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const sendAlert = async () => {
    const transactions = [
      {
        // 黑地址
        to: '0x62763e8d330db5a9cb643b97d0c3b64804f2f096',
        value: '0x5af3107a4000',
      },
      {
        // 黑地址
        to: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
        value: '0x5af3107a4000',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const addLiquidity = async () => {
    const spender = '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364';
    const transactions = [
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      /*
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      */
      {
        to: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364', // USDC
        data: '0x88316456000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000000000000000000000000000000000000000000064fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000603620000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003f825e6706e99ea34b6da0fcab2df1882e597c8000000000000000000000000000000000000000000000000000000006878a107',
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const RevokeLiquidity = async () => {
    const spender = '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364';
    const transactions = [
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // approve 1
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // approve MAX
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const multiSendwithApprove = async () => {
    const spender = '0x01eef7795af557088f2ff4f96011c6e6c6fb7c55';
    const transactions = [
      {
        // 黑地址
        to: '0xa0fcee3d143adc3317c8f78cd3548eec99550f85',
        value: '0x5af3107a4000',
      },
      {
        // 黑地址
        to: '0xc6ea74c921828da764a5a225d198e37320ae0033',
        value: '0x5af3107a4000',
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // approve 1
      },
    ];
    try {
      await sendBatchTransactions(transactions);
    } catch (err) {
      console.log('拦截到高风险交易', err);
    }
  };

  const [eth_signLoading, setEth_signLoading] = useState(false);
  const eth_sign = async () => {
    try {
      setEth_signLoading(true);
      // const msg = 'hello world';
      // const hashMsg = '0x' +
      // keccak256(`\x19Ethereum Signed Message:\n${msg.length}${msg}`).toString('hex');
      const hashMsg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ret = await provider.request({
        method: 'eth_sign',
        params: [account, hashMsg],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setEth_signLoading(false);
    }
  };

  return (
    <Card title="5792 Test Cases">
      <Space size={16} align="start" style={{ display: 'flex', width: '50%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            style={{ width: '100' }}
            block
            loading={loading}
            onClick={swapinUniswap}
          >
            swapinUniswap
          </Button>
          <Button
            style={{ width: '100' }}
            block
            loading={loading}
            onClick={swapinPancake}
          >
            swapinPancake
          </Button>

          <Button
            block
            loading={loading}
            onClick={batchApprove}
          >
            batchApprove
          </Button>
          <Button
            block
            loading={loading}
            onClick={batchRevoke}
          >
            batchRevoke
          </Button>
          <Button
            block
            loading={loading}
            onClick={multiSend}
          >
            multiSend
          </Button>
          <Button
            block
            loading={loading}
            onClick={multiSendwithApprove}
          >
            multiSendwithApprove
          </Button>
          <Button
            block
            loading={loading}
            onClick={addLiquidity}
          >
            addLiquidity
          </Button>
          <Button
            block
            loading={loading}
            onClick={RevokeLiquidity}
          >
            RevokeLiquidity
          </Button>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }} gutter={12}>
          <Button
            block
            loading={loading}
            onClick={alertTest}
          >
            alertTest
          </Button>
          <Button
            block
            loading={loading}
            onClick={multiAlert}
          >
            multiAlert
          </Button>
          <Button
            block
            loading={loading}
            onClick={interceptionTest}
          >
            interceptionTest
          </Button>
          <Button
            block
            loading={loading}
            onClick={multiInterception}
          >
            multiInterception
          </Button>
          <Button
            block
            loading={loading}
            onClick={alertWithInterception}
          >
            alertWithInterception
          </Button>
          <Button
            block
            loading={loading}
            onClick={sendOverLimit}
          >
            sendOverLimit
          </Button>
          <Button
            block
            loading={loading}
            onClick={sendAlert}
          >
            sendAlert
          </Button>
          <Button
            block
            loading={loading}
            onClick={swapinUniswapWithoutDataOrValue}
          >
            swapinUniswapWithoutDataOrValue
          </Button>
          <Button
            block
            loading={loading}
            onClick={swapinUniswapWithoutTo}
          >
            swapinUniswapWithoutTo
          </Button>
        </Space>
      </Space>
      <Card title="查询" style={{ borderRadius: '8px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            value={txId}
            onChange={setTxId}
            placeholder="输入交易ID"
            clearable
            style={{ flex: 1 }}
          />
          <Button color="primary" onClick={handleSubmit} loading={loading}>查询Bundle</Button>
          {result && (
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              maxHeight: '300px',
              overflow: 'auto',
            }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            value={chainIds}
            onChange={setChainIds}
            placeholder="输入链ID"
            clearable
          />
          <Button color="primary" onClick={handleSubmitCap} loading={loading}>查询支持情况</Button>
          {result && (
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              maxHeight: '300px',
              overflow: 'auto',
            }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </Space>
      </Card>
    </Card>
  );
}

export default TestFort5792;
