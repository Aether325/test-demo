import { Space } from 'antd';
import { useEffect } from 'react';

import useConnect from './hooks/useConnect';
import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';
import DontHaveWallet from '../../components/DontHaveWallet';
import BlackAddress from '../../components/BlackAddress';
import Others from './components/Others';
import { grayTronAddress, tronStrongBlackEoaAddress } from './const';
import { patchTronSign } from '../../utils/calldataStore';

function Tron() {
  const { account, handleConnect } = useConnect();
  useEffect(() => { patchTronSign(); }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
      <SignTransaction account={account} />
      <Others account={account} />

      <BlackAddress type={BlackAddress.typeMap.eoa} address={grayTronAddress} />
      <BlackAddress type={BlackAddress.typeMap.strongEoa} address={tronStrongBlackEoaAddress} />
    </Space>
  );
}

const key = 'Tron';
export default {
  key,
  children: window.tronLink ? <Tron /> : <DontHaveWallet chain={key} />,
};
