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
  const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const USDT_ETH = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  const UNI_ETH = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
  const USDG_ETH = '0xe343167631d89b6ffc58b88d6b7fb0228795491d';
  const POL_ETH = '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6';
  const VSN_ARB = '0x6fBBbD8bFB1cd3986B1D05e7861a0f62F87DB74b';
  const RAIN_ARB = '0x25118290e6A5f4139381D072181157035864099d';
  const GMX_ARB = '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a';
  const PEAR_ARB = '0x3212dc0F8c834e4DE893532d27CC9B6001684DB0';
  const GRAIL_ARB = '0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8';
  const LION_ARB = '0x527e8D368298deA5a53be257e5300F4DBafb7a97';
  const BOOP_ARB = '0x13A7DeDb7169a17bE92B0E3C7C2315B46f4772B3';
  const ADog_ARB = '0x155f0DD04424939368972f4e1838687d6a831151';
  const Bonsai_ARB = '0x79EaD7a012D97eD8DeEcE279f9bC39e264d7Eef9';
  const Xai_ARB = '0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66';
  const Black_EOA = '0xe02cd454e510cb8f9657f6e7ea7b00f83ec00352';
  const WETH_ETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const USDC_Base = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
  const USDT_Base = '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2';
  const WTH_Base = '0x4200000000000000000000000000000000000006';
  const BASE_chain = '0x2105';
  const ARB_Chain = '0xa4b1';
  const ETH_chain = '0x1';

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
        chainId: ETH_chain, // 示例主网，实际应从钱包获取
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
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000688879b7000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003070b0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000e762100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000008458fe918ceeb35f7bb5757885cf3a94a7c372ca00000000000000000000000000000000000000000000000000000000000000000c', // 0.01 ETH
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
      },
      {
        to: '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca', // 高风险地址
        value: '0x5af3107a4000',
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

  // 场景1: 多笔资产转账
  const referral5792 = async () => {
    const transactions = [
      {
        to: '0x020f62d3be82603d6de1626afdaf5107d2563a98',
        value: '0x5af3107a4000',
      },
      {
        to: '0xdcb7028e5eaa1d7bb82b7152cb0e7adc12e7457c',
        data: '0x9871efa4000000000037d1276f34ad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000534594e5ff3dcdf00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001b0000000000000003b6d0340d360131b77ead72f1f23fb185b4896fe01dc8cb50000000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F9843ca20afc2bbb0000002625a0aac50C985c8d3FbC38c05569962464F97bF91936', // 0.01 ETH
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
    const spender1 = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
    const spender2 = '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca';
    const transactions = [
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender1.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000001'
        }`, // approve 1
      },
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender2.replace('0x', '').padStart(64, '0')
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

  function buildApproveData(spender, amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
    return `0x095ea7b3${
      spender.replace('0x', '').padStart(64, '0')
    }${amount}`;
  }

  /**
   * 构建ERC20撤销授权交易数据（授权金额为0）
   * @param {string} spender 被授权合约地址
   * @returns {string} 交易data
   */
  function buildRevokeData(spender) {
    return buildApproveData(spender, '0000000000000000000000000000000000000000000000000000000000000000');
  }

  /**
   * 授权USDC给1个合约
   */
  const approve1Contract = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f'; // 第一个被授权合约
    const transactions = [
      {
        to: USDC_ETH,
        data: buildApproveData(spender1),
      },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('授权1个合约成功:');
    } catch (err) {
      console.log('授权1个合约失败:', err);
    }
  };

  /**
   * 撤销USDC对1个合约的授权
   */
  const revoke1Contract = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f'; // 对应撤销的合约
    const transactions = [
      {
        to: USDC_ETH,
        data: buildRevokeData(spender1),
      },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('撤销1个合约授权成功:');
    } catch (err) {
      console.log('撤销1个合约授权失败:', err);
    }
  };

  /**
   * 授权USDC给2个合约
   */
  const approve2Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f'; // 第一个被授权合约
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd'; // 第二个被授权合约
    const transactions = [
      { to: USDT_Base, data: buildApproveData(Black_EOA) },
      { to: USDC_Base, data: buildApproveData(Black_EOA) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('授权2个合约成功:', result);
    } catch (err) {
      console.log('授权2个合约失败:', err);
    }
  };

  /**
   * 撤销USDC对2个合约的授权
   */
  const revoke2Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f'; // 对应撤销的合约1
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd'; // 对应撤销的合约2
    const transactions = [
      { to: USDC_ETH, data: buildRevokeData(spender1) },
      { to: USDC_ETH, data: buildRevokeData(spender2) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('撤销2个合约授权成功:', result);
    } catch (err) {
      console.log('撤销2个合约授权失败:', err);
    }
  };

  /**
   * 授权USDC给3个合约
   */
  const approve3Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const transactions = [
      { to: USDC_ETH, data: buildApproveData(spender1) },
      { to: USDC_ETH, data: buildApproveData(spender2) },
      { to: USDC_ETH, data: buildApproveData(spender3) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('授权3个合约成功:', result);
    } catch (err) {
      console.log('授权3个合约失败:', err);
    }
  };

  /**
   * 撤销USDC对3个合约的授权
   */
  const revoke3Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const transactions = [
      { to: USDC_ETH, data: buildRevokeData(spender1) },
      { to: USDC_ETH, data: buildRevokeData(spender2) },
      { to: USDC_ETH, data: buildRevokeData(spender3) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('撤销3个合约授权成功:');
    } catch (err) {
      console.log('撤销3个合约授权失败:', err);
    }
  };

  /**
   * 授权USDC给4个合约
   */
  const approve4Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const spender4 = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const transactions = [
      { to: USDC_ETH, data: buildApproveData(spender1) },
      { to: USDC_ETH, data: buildApproveData(spender2) },
      { to: USDC_ETH, data: buildApproveData(spender3) },
      { to: USDC_ETH, data: buildApproveData(spender4) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('授权4个合约成功:');
    } catch (err) {
      console.log('授权4个合约失败:', err);
    }
  };

  /**
   * 撤销USDC对4个合约的授权
   */
  const revoke4Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const spender4 = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const transactions = [
      { to: USDC_ETH, data: buildRevokeData(spender1) },
      { to: USDC_ETH, data: buildRevokeData(spender2) },
      { to: USDC_ETH, data: buildRevokeData(spender3) },
      { to: USDC_ETH, data: buildRevokeData(spender4) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('撤销4个合约授权成功:');
    } catch (err) {
      console.log('撤销4个合约授权失败:', err);
    }
  };

  /**
   * 授权USDC给5个合约
   */
  const approve10Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const spender4 = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const spender5 = '0x87a26566dbb3bf206634c1792a96ff4989e3f56e';
    const spender6 = '0xf4647dc57a3ce888dc90de21e43cbb5811b0d025';
    const current = spender6;
    const transactions = [
      { to: RAIN_ARB, data: buildApproveData(current) },
      { to: GMX_ARB, data: buildApproveData(current) },
      { to: PEAR_ARB, data: buildApproveData(current) },
      { to: LION_ARB, data: buildApproveData(current) },
      { to: GRAIL_ARB, data: buildApproveData(current) },
      { to: BOOP_ARB, data: buildApproveData(current) },
      { to: ADog_ARB, data: buildApproveData(current) },
      { to: Bonsai_ARB, data: buildApproveData(current) },
      { to: Xai_ARB, data: buildApproveData(current) },
      { to: VSN_ARB, data: buildApproveData(current) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('授权5个合约成功:');
    } catch (err) {
      console.log('授权5个合约失败:', err);
    }
  };

  /**
   * 撤销USDC对5个合约的授权
   */
  const revoke5Contracts = async () => {
    const spender1 = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
    const spender2 = '0xfcef2fe72413b65d3f393d278a714cad87512bcd';
    const spender3 = '0xee030ec6f4307411607e55acd08e628ae6655b86';
    const spender4 = '0x000000000022d473030f116ddee9f6b43ac78ba3';
    const spender5 = '0x87a26566dbb3bf206634c1792a96ff4989e3f56e';
    const transactions = [
      { to: USDC_ETH, data: buildRevokeData(Black_EOA) },
      { to: USDT_ETH, data: buildRevokeData(Black_EOA) },
      { to: USDG_ETH, data: buildRevokeData(Black_EOA) },
      { to: UNI_ETH, data: buildRevokeData(Black_EOA) },
      { to: POL_ETH, data: buildRevokeData(Black_EOA) },
    ];
    try {
      await sendBatchTransactions(transactions);
      console.log('撤销5个合约授权成功:');
    } catch (err) {
      console.log('撤销5个合约授权失败:', err);
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
          <Button
            block
            loading={loading}
            onClick={referral5792}
          >
            referral5792
          </Button>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }} gutter={12}>
          <Button
            block
            loading={loading}
            onClick={approve1Contract}
          >
            approve1Contract
          </Button>
          <Button
            block
            loading={loading}
            onClick={approve2Contracts}
          >
            approve2Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={approve3Contracts}
          >
            approve3Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={approve4Contracts}
          >
            approve4Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={approve10Contracts}
          >
            approve10Contracts
          </Button>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }} gutter={12}>
          <Button
            block
            loading={loading}
            onClick={revoke1Contract}
          >
            revoke1Contract
          </Button>
          <Button
            block
            loading={loading}
            onClick={revoke2Contracts}
          >
            revoke2Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={revoke3Contracts}
          >
            revoke3Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={revoke4Contracts}
          >
            revoke4Contracts
          </Button>
          <Button
            block
            loading={loading}
            onClick={revoke5Contracts}
          >
            revoke5Contracts
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
