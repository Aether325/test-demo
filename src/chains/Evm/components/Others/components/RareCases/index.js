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
          onClick={ApproveUSDT}
        >
          Approve USDT
        </Button>
      </Space>
    </Card>
  );
}
export default RareCases;
