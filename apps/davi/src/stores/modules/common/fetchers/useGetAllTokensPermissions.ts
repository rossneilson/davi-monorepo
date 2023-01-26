import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { useContractRead, useContractReads, useNetwork } from 'wagmi';
import {
  ERC20_TRANSFER_SIGNATURE,
  ZERO_ADDRESS,
  ANY_FUNC_SIGNATURE,
} from 'utils';
import { useHookStoreProvider } from 'stores';
import { PermissionRegistry } from 'contracts/ts-files/PermissionRegistry';
import { useTokenList } from '../../../../hooks/Guilds/tokens/useTokenList';
import { TokenInfoWithType, TokenWithPermission } from 'types/types';
import { FetcherHooksInterface } from 'stores/types';
import { useListenToPermissionSet } from '../events';

type IUseGetAllTokensPermissions =
  FetcherHooksInterface['useGetAllTokensPermissions'];

export const useGetAllTokensPermissions: IUseGetAllTokensPermissions = (
  daoId: `0x${string}`,
  includeNativeToken: boolean = true
) => {
  const {
    hooks: {
      fetchers: { useGuildConfig },
    },
  } = useHookStoreProvider();

  const { chain } = useNetwork();
  const { data: guildConfig } = useGuildConfig(daoId);
  const { tokens } = useTokenList(chain?.id, includeNativeToken);

  // ERC20 tokens

  const erc20Tokens: TokenInfoWithType[] = useMemo(
    () => tokens.filter(token => token.type === 'ERC20'),
    [tokens]
  );

  const { data: erc20Permissions, refetch: refetchERC20TokenPermission } =
    useContractReads({
      contracts: erc20Tokens.map(token => ({
        address: guildConfig?.permissionRegistry,
        abi: PermissionRegistry.abi,
        functionName: 'getETHPermission',
        args: [daoId, token.address, ERC20_TRANSFER_SIGNATURE],
      })),
    });

  const erc20TokensWithPermissions: TokenWithPermission[] = useMemo(() => {
    if (!erc20Permissions) return null;
    return erc20Tokens?.map((token, index) => ({
      ...token,
      permission: {
        fromTime: erc20Permissions[index]?.fromTime as BigNumber,
        valueAllowed: erc20Permissions[index]?.valueAllowed as BigNumber,
      },
    }));
  }, [erc20Tokens, erc20Permissions]);

  // Native token

  const nativeToken: TokenInfoWithType = useMemo(
    () => tokens.find(token => token.type === 'NATIVE'),
    [tokens]
  );

  const { data: nativeTokenPermission, refetch: refetchNativeTokenPermission } =
    useContractRead({
      address: guildConfig?.permissionRegistry,
      abi: PermissionRegistry.abi,
      functionName: 'getETHPermission',
      args: [daoId, ZERO_ADDRESS, ANY_FUNC_SIGNATURE],
    });

  const nativeTokenWithPermission: TokenWithPermission = useMemo(() => {
    if (!nativeToken) return null;

    let newToken = {
      ...nativeToken,
      permission: {
        fromTime: nativeTokenPermission?.fromTime as BigNumber,
        valueAllowed: nativeTokenPermission?.valueAllowed as BigNumber,
      },
    };

    return newToken;
  }, [nativeToken, nativeTokenPermission]);

  useListenToPermissionSet(daoId, refetchERC20TokenPermission);
  useListenToPermissionSet(daoId, refetchNativeTokenPermission);

  return {
    data: includeNativeToken
      ? [nativeTokenWithPermission, ...erc20TokensWithPermissions]
      : erc20TokensWithPermissions,
  };
};
