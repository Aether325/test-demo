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
      </Space>
    </Card>
  );
}

function ApproveUSDT() {
  const { account, provider } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);

  const approveUSDT = async () => {
    try {
      setLoading(true);
      
      // --- 配置参数 ---
      const tokenAddress = "0xdAC17f958D2ee523a2206206994597C13D831ec7"; // USDT合约
      const spenderAddress = "0xe0444a5efb95e40471e34e6669e5e50f8e0bed33"; // 授权目标
      const amount = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"; // 无限授权

      // --- 切换到ETH主网 ---
      await provider.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ chainId: '0x1' }] 
      });

      // --- 构造calldata ---
      const methodSignature = "0x095ea7b3"; // approve函数签名
      const paddedSpender = spenderAddress.replace("0x", "").padStart(64, "0");
      const paddedAmount = amount.padStart(64, "0");
      const data = methodSignature + paddedSpender + paddedAmount;

      // --- 发送交易 ---
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
      console.error(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="USDT授权">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          onClick={approveUSDT}
        >
          授权USDT无限额度
        </Button>
      </Space>
    </Card>
  );
}

export { RareCases, ApproveUSDT};
