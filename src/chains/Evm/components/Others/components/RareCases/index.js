import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';

import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

const USDC_ETH = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDT_ETH = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const USDC_Base = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
const Black_EOA = '0x58818bfcd98135bf9eb6e5f341a8bec128533d56';
const USDT_Base = '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2';
const WTH_Base = '0x4200000000000000000000000000000000000006';
const white_EOA = '0xc2a0bf0408908b814b8df30fd482a8e075c3bba8';

function RareCases() {
  const { account, provider } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);

  const invokeEigenLayer = async () => {
    try {
      setLoading(true);
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x5283D291DBCF85356A21bA090E6db59121208b44',
          value: '0x0',
          data: '0xf123991e00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000095b247ccce49df14e87a8f20f12fcd23877873c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000fe4f44bee93503346a3ac9ee5a26b130a5796d60000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000f',
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const ApproveEOA = async () => {
    try {
      setLoading(true);
      const tokenAddress = USDC_ETH; // USDT合约地址
      const spenderAddress = white_EOA;
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const ApproveSelf = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // USDC合约地址
      const spenderAddress = account;
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const ApproveBlackEOA = async () => {
    try {
      setLoading(true);
      const tokenAddress = USDC_ETH; // USDC合约地址
      const spenderAddress = Black_EOA;
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const revokeGasmint = async () => {
    try {
      setLoading(true);
      // BNB链上的USDT合约地址
      const tokenAddress = '0x939A53F89D177EB8E7Bfe2ee756D9148D437B1D2';
      // 这里需要确认spender在BNB链上的地址是否正确
      const spenderAddress = '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca';
      const amount = '0000000000000000000000000000000000000000000000000000000000000000'; // 最大授权量
      // 1. 切换到BNB链，链ID为0x38（十进制56）
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
      const methodSignature = '0x095ea7b3'; // approve方法签名
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易，gas参数可根据BNB链实际情况调整
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120', // 可根据实际情况调整
          gasPrice: '0x77359400', // 可根据实际情况调整
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const revokeFromBlack = async () => {
    try {
      setLoading(true);
      // BNB链上的USDT合约地址
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      // 这里需要确认spender在BNB链上的地址是否正确
      const spenderAddress = '0xd8d3e49ac9458b9a75f03345ea3bc9c5507eb5a0';
      const amount = '0000000000000000000000000000000000000000000000000000000000000000'; // 最大授权量
      // 1. 切换到BNB链，链ID为0x38（十进制56）
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3'; // approve方法签名
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易，gas参数可根据BNB链实际情况调整
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120', // 可根据实际情况调整
          gasPrice: '0x77359400', // 可根据实际情况调整
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const ApproveIllegalToken = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9'; // illegal合约地址
      const spenderAddress = '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const revokeIllegalToken = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9'; // illegal合约地址
      const spenderAddress = '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca';
      const amount = '0000000000000000000000000000000000000000000000000000000000000000'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const transferIllegalToken = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9'; // illegal合约地址
      const toAddress = '0xc2a0bf0408908b814b8df30fd482a8e075c3bba8';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0xa9059cbb';
      const paddedSpender = toAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const ApproveHoneypot = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x26Ed2e951365a755b1e763e0ABeed0b0dF85445E'; // illegal合约地址
      const spenderAddress = '0xF6801D319497789f934ec7F83E142a9536312B08';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const RevokeHoneypot = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x26Ed2e951365a755b1e763e0ABeed0b0dF85445E'; // illegal合约地址
      const spenderAddress = '0xF6801D319497789f934ec7F83E142a9536312B08';
      const amount = '0000000000000000000000000000000000000000000000000000000000000000'; // 最大授权量
      // 1. 确保连接的是以太坊主网
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const dataBytes = methodSignature + paddedSpender + paddedAmount;
      // 3. 发送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data: dataBytes,
          gas: '0x7a120',
          gasPrice: '0x77359400',
        }],
      });
      console.log('Transaction Hash:', txHash);
      toastSuccess();
    } catch (error) {
      console.error('Approval Error:', error);
      toastFail(error.message || 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  const ApproveUSDT = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0x411be70a215df02311d62f9a8cd201b38ae4effd';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const ApproveOKX = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9';
      const OKX_addr = '0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const ApproveUSDTBase = async () => {
    try {
      setLoading(true);
      const tokenAddress = USDT_Base;
      const spenderAddress = Black_EOA;
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      // 尝试切换到Base主网
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] });
      } catch (switchError) {
        // 捕获4902错误，添加Base主网
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2085', // Base主网十六进制chainid
              chainName: 'Base Mainnet',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'], // Base主网RPC
              blockExplorerUrls: ['https://basescan.org'], // 区块浏览器
            }],
          });
          // 添加后再次尝试切换（可选，部分钱包添加后会自动切换，这里做兜底）
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2085' }] });
        } else {
          // 非4902错误，抛出原错误
          throw switchError;
        }
      }

      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const ApproveMulticall = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      const methodSignature = '0x095ea7b3';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const alertMulticall = async () => {
    try {
      setLoading(true);

      // 目标 NFT 合约地址（需替换为你自己的 ERC-721 合约）
      const tokenAddress = '0xYourNFTContractAddressHere'; // 替换为实际 NFT 合约

      // Uniswap V2 Router (Arbitrum) - 被授权操作你的 NFT
      const spenderAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

      // 切换到 Arbitrum One
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // Arbitrum One
      });

      // ERC-721 setApprovalForAll(address operator, bool approved)
      const methodSignature = '0xa22cb465';
      const paddedSpender = spenderAddress.slice(2).padStart(64, '0');
      const approved = '0000000000000000000000000000000000000000000000000000000000000001'; // true
      const data = methodSignature + paddedSpender + approved;

      // 发送授权交易
      await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: tokenAddress,
            data,
            gas: '0x186a0', // ~100,000 gas，足够
          },
        ],
      });

      toastSuccess('NFT 授权成功！');
    } catch (error) {
      console.error('授权失败:', error);
      if (error.code === 4001) {
        toastFail('用户取消了授权');
      } else if (error.code === -32603) {
        toastFail('网络错误，请检查链ID');
      } else {
        toastFail('授权失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const increaseAllowance = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0xe0444a5efb95e40471e34e6669e5e50f8e0bed33';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        toastFail('请安装 MetaMask 并刷新页面');
        return;
      }

      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });

      const methodSignature = '0x39509351';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: tokenAddress,
          data,
        }],
      });

      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const sendEthWithCalldata = async () => {
    try {
      setLoading(true);
      const toAddress = '0xbd70132eb401f10c8213289d91d888b12cec4d53';
      const amountInEth = '0.000001';
      const customCalldata = '0xb80c2f090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000003d28f00000000000000000000000000000000000000000000000000000000684c05a10000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000031f1ad10547b8deb43a36e5491c06a93812023a000000000000000000000000000000000000000000000000000000000000000100000000000000000000000098f29f527c8e0ecc67a3c2d5567833bee01f2a12000000000000000000000000000000000000000000000000000000000000000180000000000000000000271098f29f527c8e0ecc67a3c2d5567833bee01f2a1200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000000';

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });

      const amountInWei = BigInt(Math.floor(Number(amountInEth) * 1e18)).toString(16);
      const value = `0x${amountInWei.padStart(64, '0')}`;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: toAddress,
          value,
          data: customCalldata,
        }],
      });

      toastSuccess();
    } catch (error) {
      console.error(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const DecreaseAllowance = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const spenderAddress = '0x8458fe918ceeb35f7bb5757885cf3a94a7c372ca';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });

      const methodSignature = '0xa457c2d7';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, '0');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const walletConnectIncreaseAllowance = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce';
      const spenderAddress = '0000e59aabab4d0e1e1b9631adebe90937070000';
      const amount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });

      const methodSignature = '0x39509351';
      const paddedSpender = spenderAddress.replace('0x', '').padStart(64, '0');
      const paddedAmount = amount.padStart(64, 'f');
      const data = methodSignature + paddedSpender + paddedAmount;

      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

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
          data: tx.data || '0x',
          value: tx.value || '0x0',
        })),
      };

      // 4. 发送批量交易
      const result = await window.ethereum.request({
        method: 'wallet_sendCalls',
        params: [params],
      });

      console.log('批量交易ID:', result.id);
      return result;
    } catch (error) {
      console.error('批量交易失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =============== 场景实现 ===============

  return (
    <Card title="Rare cases">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          onClick={invokeEigenLayer}
        >
          invoke eigenLayer
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveEOA}
        >
          Approve EOA
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveSelf}
        >
          ApproveSelf
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveBlackEOA}
        >
          Approve Black EOA
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveUSDTBase}
        >
          Approve Black EOA Base
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveOKX}
        >
          Approve OKX
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveIllegalToken}
        >
          Approve Illegal Token
        </Button>
        <Button
          block
          loading={loading}
          onClick={revokeIllegalToken}
        >
          Revoke Illegal Token
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveHoneypot}
        >
          Approve Honeypot
        </Button>
        <Button
          block
          loading={loading}
          onClick={RevokeHoneypot}
        >
          Revoke Honeypot
        </Button>
        <Button
          block
          loading={loading}
          onClick={revokeFromBlack}
        >
          revoke From Black EOA
        </Button>
        <Button
          block
          loading={loading}
          onClick={revokeGasmint}
        >
          Revoke Gasmint
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveMulticall}
        >
          Approve multicall
        </Button>
        <Button
          block
          loading={loading}
          onClick={alertMulticall}
        >
          alert multicall
        </Button>
        <Button
          block
          loading={loading}
          onClick={sendEthWithCalldata}
        >
          TransferWithData
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveUSDT}
        >
          Approve USDT to Black
        </Button>
        <Button
          block
          loading={loading}
          onClick={increaseAllowance}
        >
          IncreaseAllowance
        </Button>
        <Button
          block
          loading={loading}
          onClick={walletConnectIncreaseAllowance}
        >
          walletConnectIncreaseAllowance
        </Button>
      </Space>
    </Card>
  );
}

export default RareCases;
