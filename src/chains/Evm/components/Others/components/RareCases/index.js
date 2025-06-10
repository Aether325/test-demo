import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

function RareCases() {
  const { account, provider } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);

  // 函数1：调用EigenLayer
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

<<<<<<< Updated upstream
  // 函数2：USDT授权（安全改进版）
  const approveUSDT = async () => {
    try {
      setLoading(true);
      

      // 配置参数
      const tokenAddress = "0xdAC17f958D2ee523a2206206994597C13D831ec7"; // USDT合约
      const spenderAddress = "0xe0444a5efb95e40471e34e6669e5e50f8e0bed33"; // 授权目标
      const amount = "1000000000000000000"; // 改为1 USDT（有限授权）

      // 切换到ETH主网
      await provider.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ chainId: '0x1' }] 
      });

      // 构造calldata
      const methodSignature = "0x095ea7b3"; // approve函数签名
      const paddedSpender = spenderAddress.replace("0x", "").padStart(64, "0");
      const paddedAmount = amount.padStart(64, "0");
      const data = methodSignature + paddedSpender + paddedAmount;

      // 发送交易
=======
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

>>>>>>> Stashed changes
      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
<<<<<<< Updated upstream
          gas: "0x7A120", // 设置合理gas限制
=======
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
>>>>>>> Stashed changes
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

  // 函数3：USDT授权（安全改进版）
  const increaseAllowance = async () => {
    try {
      setLoading(true);

      // 配置参数
      const tokenAddress = "0xdAC17f958D2ee523a2206206994597C13D831ec7"; // USDT合约
      const spenderAddress = "0xe0444a5efb95e40471e34e6669e5e50f8e0bed33"; // 授权目标
      const amount = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"; // 改为1 USDT（有限授权）

      // 切换到ETH主网
      await provider.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ chainId: '0x1' }] 
      });

      // 构造calldata
      const methodSignature = "0x39509351"; // increaseAllowance 方法签名
      const paddedSpender = spenderAddress.replace("0x", "").padStart(64, "0"); // 去掉 0x 并填充
      const paddedAmount = amount.padStart(64, "0"); // 确保 64 字
      const data = methodSignature + paddedSpender + paddedAmount;

      // 发送交易
      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: tokenAddress,
          data,
          gas: "0x7A120", // 设置合理gas限制
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
    <Card title="Rare cases">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button block loading={loading} onClick={invokeEigenLayer}>
          invoke eigenLayer
        </Button>
<<<<<<< Updated upstream
        <Button block loading={loading} onClick={approveUSDT}>
=======
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
>>>>>>> Stashed changes
          Approve USDT
        </Button>
        <Button block loading={loading} onClick={increaseAllowance}>
          increaseAllowance
        </Button>
      </Space>
    </Card>
  );
}

<<<<<<< Updated upstream
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
=======
export default RareCases;
>>>>>>> Stashed changes
