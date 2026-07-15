import {
  Button, Radio, Form,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EvmContext from '../../context';
import okxWalletCoreAbi from './okxWalletCoreAbi';
import CallList from './components/CallList';

const infos = {
  bnb: {
    chainId: 56,
    contractAddress: '0xC6c5b35Da1230c5e984eD369484570b9F64e66Be',
  },
  sepolia: {
    chainId: 11155111,
    contractAddress: '0xa9526ba55F7cABa1A6eB1cb4d555F29022ebFeed',
  },
  ETH: {
    chainId: 1,
    contractAddress: '0x36d3cbd83961868398d056efbf50f5ce15528c0d',
  },
};

function Eip7702() {
  const [form] = Form.useForm();
  const selectedNetwork = Form.useWatch('selectedNetwork', form);

  const { account, provider, chainId } = useContext(EvmContext);
  const [hstContract, setHstContract] = useState({});
  const switchChain = async (network) => {
    const { chainId: newChainId } = infos[network];
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${newChainId.toString(16)}` }] });
  };

  const onFinish = async (values) => {
    await switchChain(values.selectedNetwork);
    const { callList } = values;
    hstContract.executeFromSelf((callList || []).map(({ address, value, data }) => ({
      target: address,
      value: value ? `0x${(+value).toString(16)}` : 0,
      data,
    })), {
      from: account,
    });
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const keys = Object.keys(infos);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (infos[key].chainId === chainId) {
        form.setFieldValue('selectedNetwork', key);
        break;
      }
    }
  }, [chainId]);

  useEffect(() => {
    if (!account || !provider) {
      return;
    }

    const newHstContract = new ethers.Contract(
      account,
      okxWalletCoreAbi,
      new ethers.providers.Web3Provider(provider, 'any').getSigner(),
    );

    setHstContract(newHstContract);
  }, [account, provider]);

  useEffect(() => {
    (async () => {
      if (!selectedNetwork) {
        return;
      }
      await switchChain(selectedNetwork);
    })();
  }, [selectedNetwork]);

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item label="Supported Networks" name="selectedNetwork">
        <Radio.Group>
          <Radio.Button value="bnb">BNB</Radio.Button>
          <Radio.Button value="sepolia">Sepolia</Radio.Button>
          <Radio.Button value="ETH">ETH</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <CallList />

      <Form.Item style={{
        marginTop: 16,
      }}
      >
        <Button htmlType="submit" type="primary" disabled={!selectedNetwork}>Submit</Button>
      </Form.Item>
    </Form>
  );
}

export default Eip7702;
