import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';

import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

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
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0xa0fcee3d143adc3317c8f78cd3548eec99550f85';
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

  const ApproveUSDT = async () => {
    try {
      setLoading(true);
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7';
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
      const tokenAddress = '0xdAC17f958D2ee523a2206206994597C13D831ec7';
      const spenderAddress = '0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7';
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
          onClick={sendEthWithCalldata}
        >
          TransferWithData
        </Button>
        <Button
          block
          loading={loading}
          onClick={ApproveUSDT}
        >
          Approve USDT
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
          onClick={DecreaseAllowance}
        >
          DecreaseAllowance
        </Button>
      </Space>
    </Card>
  );
}

export default RareCases;
