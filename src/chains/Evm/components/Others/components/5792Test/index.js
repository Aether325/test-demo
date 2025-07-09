import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';

import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

function TestFort5792() {
  const { account, provider } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);

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

  // 场景1: 多笔资产转账
  const sendAssetTransfers = async () => {
    const spender = '0x31c2f6fcff4f8759b3bd5bf0e1084a055615c768';
    const transactions = [
      {
        to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          '0000000000000000000000000000000000000000000000000000000000000000'
        }`, // revoke
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
        to: '0x65b382653f7c31bc0af67f188122035461ec9c76',
        data: '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000686e1f1b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001000000000000000000000000008458fe918ceeb35f7bb5757885cf3a94a7c372ca000000000000000000000000000000000000000000000000000000000000f1ca000000000000000000000000000000000000000000000000000000000000e63400000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002ba0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000064dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000', // 0.01 ETH
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
    const spender = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
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
    const spender = '0x40aa958dd87fc8305b97f2ba922cddca374bcd7f';
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
        to: '0xa0fcee3d143adc3317c8f78cd3548eec99550f85',
        value: '0x5af3107a4000',
      },
      {
        // 黑地址
        to: '0xc6ea74c921828da764a5a225d198e37320ae0033',
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
      {
        to: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        data: `0x095ea7b3${
          spender.replace('0x', '').padStart(64, '0')
        }${
          'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        }`, // approve MAX
      },
      {
        to: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364', // USDC
        data: '0x88316456000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000000000000000000000000000000000000000000064fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff50000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000007a12000000000000000000000000000000000000000000000000000000000000cfd7d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008458fe918ceeb35f7bb5757885cf3a94a7c372ca00000000000000000000000000000000000000000000000000000000686dedbf',
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

  return (
    <Card title="5792 Test Cases">
      <Space size={16} align="start" style={{ display: 'flex', width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            style={{ width: '100' }}
            block
            loading={loading}
            onClick={sendAssetTransfers}
          >
            approve + swap
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
        </Space>
      </Space>
    </Card>
  );
}

export default TestFort5792;
